import os
import cv2
import numpy as np
from PIL import Image

def clean_chroma_key(img_bgr):
    """
    High-fidelity green-screen extraction with despill and soft edge antialiasing.
    """
    img = img_bgr.astype(np.float32)
    b, g, r = img[:, :, 0], img[:, :, 1], img[:, :, 2]
    
    max_rb = np.maximum(r, b)
    green_diff = g - max_rb
    
    t_min = 10.0
    t_max = 35.0
    
    # Calculate raw alpha (0 for green background, 1 for character)
    alpha = 1.0 - np.clip((green_diff - t_min) / (t_max - t_min), 0.0, 1.0)
    
    # Despill: clamp green channel on edges so no green fringe remains
    despilled_g = np.minimum(g, max_rb + 3.0)
    
    out_b = b
    out_g = np.where(green_diff > 0, despilled_g, g)
    out_r = r
    out_a = alpha * 255.0
    
    rgba = np.dstack([out_r, out_g, out_b, out_a]).astype(np.uint8)
    return rgba

def isolate_main_character(rgba_img):
    """
    Finds the largest connected component closest to the horizontal center of the cell,
    completely removing neighbor shoulder bleed and watermarks.
    """
    alpha = rgba_img[:, :, 3]
    binary = (alpha > 20).astype(np.uint8)
    
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(binary)
    if num_labels <= 1:
        return rgba_img
        
    w = rgba_img.shape[1]
    center_x = w / 2.0
    
    # Score each component by area / (1 + distance_to_center)
    best_label = -1
    best_score = -1
    
    for i in range(1, num_labels):
        area = stats[i, cv2.CC_STAT_AREA]
        cx = centroids[i][0]
        # Must be reasonably large (> 30000 pixels)
        dist = abs(cx - center_x)
        score = area / (1.0 + (dist / 100.0) ** 2)
        if score > best_score:
            best_score = score
            best_label = i
            
    # Zero out alpha for anything not belonging to the best component
    mask = (labels == best_label)
    
    cleaned = rgba_img.copy()
    cleaned[:, :, 3] = np.where(mask, cleaned[:, :, 3], 0)
    return cleaned

def process_sheets():
    os.makedirs('public/avatar-frames', exist_ok=True)
    
    dir_img = cv2.imread('public/assets/Head_Directions.jpg')
    exp_img = cv2.imread('public/assets/Face_Expressions.jpg')
    
    h, w = dir_img.shape[:2]
    cell_w = w // 3
    cell_h = h // 3
    
    directions = [
        ['up-left', 'up', 'up-right'],
        ['left', 'center', 'right'],
        ['down-left', 'down', 'down-right']
    ]
    
    expressions = [
        ['blink', 'smile', 'wink'],
        ['surprised', 'smug', 'laugh'],
        ['sleepy', 'side', 'grin']
    ]
    
    all_frames = {}
    
    # 1. Process Directions
    for r in range(3):
        for c in range(3):
            name = f"dir_{directions[r][c]}"
            x1, y1 = c * cell_w, r * cell_h
            x2, y2 = (c + 1) * cell_w, (r + 1) * cell_h
            cell = dir_img[y1:y2, x1:x2].copy()
            if r == 2 and c == 2:
                cell[-150:, -150:] = [4, 255, 4]
            rgba = clean_chroma_key(cell)
            cleaned = isolate_main_character(rgba)
            all_frames[name] = cleaned
            
    # 2. Process Expressions
    for r in range(3):
        for c in range(3):
            name = f"exp_{expressions[r][c]}"
            x1, y1 = c * cell_w, r * cell_h
            x2, y2 = (c + 1) * cell_w, (r + 1) * cell_h
            cell = exp_img[y1:y2, x1:x2].copy()
            if r == 2 and c == 2:
                cell[-150:, -150:] = [4, 255, 4]
            rgba = clean_chroma_key(cell)
            cleaned = isolate_main_character(rgba)
            all_frames[name] = cleaned
            
    # Find common bounding box across all frames so they share exact center and bottom anchor
    min_x, max_x = w, 0
    min_y, max_y = h, 0
    
    for name, frame in all_frames.items():
        alpha = frame[:, :, 3]
        ys, xs = np.where(alpha > 15)
        if len(xs) > 0:
            min_x = min(min_x, xs.min())
            max_x = max(max_x, xs.max())
            min_y = min(min_y, ys.min())
            max_y = max(max_y, ys.max())
            
    print(f"Global bounding box: x=[{min_x}, {max_x}], y=[{min_y}, {max_y}] (w={max_x - min_x}, h={max_y - min_y})")
    
    # Crop all frames with symmetrical horizontal padding to preserve perfect center alignment
    crop_w = max_x - min_x + 40
    crop_h = max_y - min_y + 20
    
    for name, frame in all_frames.items():
        cropped = frame[min_y:max_y+1, min_x-20:max_x+21]
        out_path = f'public/avatar-frames/{name}.png'
        Image.fromarray(cropped).save(out_path, format='PNG')
        print(f"Saved cleanly cropped: {out_path} ({cropped.shape[1]}x{cropped.shape[0]})")

if __name__ == '__main__':
    process_sheets()
