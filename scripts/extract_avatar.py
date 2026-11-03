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

def extract_and_align_all():
    os.makedirs('public/avatar-frames', exist_ok=True)
    
    # Grid coordinates:
    # 3 columns with x centroids around [855, 1376, 1900]
    # 3 rows with y boundaries:
    # Row 0: y in [0, 512]
    # Row 1: y in [512, 1024]
    # Row 2: y in [1024, 1536]
    
    directions_grid = [
        ['up-left', 'up', 'up-right'],
        ['left', 'center', 'right'],
        ['down-left', 'down', 'down-right']
    ]
    
    expressions_grid = [
        ['blink', 'smile', 'wink'],
        ['surprised', 'smug', 'laugh'],
        ['sleepy', 'side', 'grin']
    ]
    
    # Standard tile output size
    TILE_W = 540
    TILE_H = 512
    
    # We want each character centered horizontally at TILE_W // 2 = 270
    # and bottom-anchored at TILE_H - 1
    
    for filename, grid, prefix in [
        ('public/assets/Head_Directions.jpg', directions_grid, 'dir_'),
        ('public/assets/Face_Expressions.jpg', expressions_grid, 'exp_')
    ]:
        img = cv2.imread(filename)
        
        # Mask out any watermark in the bottom-right corner of the whole sheet
        img[-150:, -150:] = [4, 255, 4]
        
        # Find all 9 connected components
        g = img[:,:,1].astype(int)
        r = img[:,:,2].astype(int)
        b = img[:,:,0].astype(int)
        is_char = (g - np.maximum(r, b) < 15).astype(np.uint8)
        
        num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(is_char)
        
        # Group into 9 components
        comps = []
        for i in range(1, num_labels):
            if stats[i, cv2.CC_STAT_AREA] > 50000:
                comps.append({
                    'label': i,
                    'cx': centroids[i][0],
                    'cy': centroids[i][1],
                    'x': stats[i, cv2.CC_STAT_LEFT],
                    'y': stats[i, cv2.CC_STAT_TOP],
                    'w': stats[i, cv2.CC_STAT_WIDTH],
                    'h': stats[i, cv2.CC_STAT_HEIGHT]
                })
                
        # Sort into rows (by cy)
        comps.sort(key=lambda c: c['cy'])
        row0 = sorted(comps[0:3], key=lambda c: c['cx'])
        row1 = sorted(comps[3:6], key=lambda c: c['cx'])
        row2 = sorted(comps[6:9], key=lambda c: c['cx'])
        sorted_rows = [row0, row1, row2]
        
        for r_idx in range(3):
            for c_idx in range(3):
                comp = sorted_rows[r_idx][c_idx]
                label_id = comp['label']
                name = prefix + grid[r_idx][c_idx]
                
                # Get the region around this character with safety margins
                cx = int(round(comp['cx']))
                bottom_y = comp['y'] + comp['h']
                
                # Extract a bounding window from the full image
                # Width 540 centered around cx
                # Height 512 ending at bottom_y
                x1 = cx - (TILE_W // 2)
                x2 = x1 + TILE_W
                y2 = bottom_y
                y1 = y2 - TILE_H
                
                # Clamp boundaries safely
                src_x1 = max(0, x1)
                src_x2 = min(img.shape[1], x2)
                src_y1 = max(0, y1)
                src_y2 = min(img.shape[0], y2)
                
                tile = np.full((TILE_H, TILE_W, 3), [4, 255, 4], dtype=np.uint8)
                
                dst_x1 = src_x1 - x1
                dst_x2 = dst_x1 + (src_x2 - src_x1)
                dst_y1 = src_y1 - y1
                dst_y2 = dst_y1 + (src_y2 - src_y1)
                
                # Copy from full image
                tile_patch = img[src_y1:src_y2, src_x1:src_x2].copy()
                labels_patch = labels[src_y1:src_y2, src_x1:src_x2]
                
                # Keep ONLY the pixels belonging to this specific component
                # Any neighbor pixels become pure green
                tile_patch[labels_patch != label_id] = [4, 255, 4]
                tile[dst_y1:dst_y2, dst_x1:dst_x2] = tile_patch
                
                # Chroma key
                rgba = clean_chroma_key(tile)
                
                out_path = f'public/avatar-frames/{name}.png'
                Image.fromarray(rgba).save(out_path, format='PNG')
                print(f"Extracted {out_path}: {TILE_W}x{TILE_H}, cx={cx}, bottom_y={bottom_y}")

if __name__ == '__main__':
    extract_and_align_all()
