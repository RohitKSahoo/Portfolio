import os
import cv2
import numpy as np
from PIL import Image

def clean_chroma_key(img_bgr):
    img = img_bgr.astype(np.float32)
    b, g, r = img[:, :, 0], img[:, :, 1], img[:, :, 2]
    
    max_rb = np.maximum(r, b)
    green_diff = g - max_rb
    
    t_min = 10.0
    t_max = 35.0
    
    alpha = 1.0 - np.clip((green_diff - t_min) / (t_max - t_min), 0.0, 1.0)
    despilled_g = np.minimum(g, max_rb + 3.0)
    
    out_b = b
    out_g = np.where(green_diff > 0, despilled_g, g)
    out_r = r
    out_a = alpha * 255.0
    
    rgba = np.dstack([out_r, out_g, out_b, out_a]).astype(np.uint8)
    return rgba

def extract_all():
    os.makedirs('public/avatar-frames', exist_ok=True)
    
    sheets = [
        ('up', 'public/assets/Head_Directions_2.jpg', [
            'dir_up-far-left', 'dir_up-mid-left', 'dir_up-left', 'dir_up',
            'dir_up-right', 'dir_up-mid-right', 'dir_up-far-right'
        ]),
        ('center', 'public/assets/Head_directions_1.jpg', [
            'dir_far-left', 'dir_mid-left', 'dir_left', 'dir_center',
            'dir_right', 'dir_mid-right', 'dir_far-right'
        ]),
        ('down', 'public/assets/Head_directions_3.jpg', [
            'dir_down-far-left', 'dir_down-mid-left', 'dir_down-left', 'dir_down',
            'dir_down-right', 'dir_down-mid-right', 'dir_down-far-right'
        ])
    ]
    
    # Increase canvas to 660x720 so shoulders have ample margin and zero clipping
    TILE_W = 660
    TILE_H = 720
    
    for pitch, sheet_path, names in sheets:
        print(f"\nProcessing {pitch} from {sheet_path}...")
        img = cv2.imread(sheet_path)
        h, w = img.shape[:2]
        
        # Blank out bottom-right watermark star if any
        img[-150:, -150:] = [4, 255, 4]
        
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        lower_green = np.array([35, 80, 80])
        upper_green = np.array([85, 255, 255])
        green_mask = cv2.inRange(hsv, lower_green, upper_green)
        figure_mask = cv2.bitwise_not(green_mask)
        figure_mask[-150:, -150:] = 0
        
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 15))
        closed = cv2.morphologyEx(figure_mask, cv2.MORPH_CLOSE, kernel)
        
        num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(closed)
        comps = []
        for i in range(1, num_labels):
            area = stats[i, cv2.CC_STAT_AREA]
            if area > 35000:
                comps.append({
                    'label': i,
                    'cx': centroids[i][0],
                    'cy': centroids[i][1],
                    'x': stats[i, cv2.CC_STAT_LEFT],
                    'y': stats[i, cv2.CC_STAT_TOP],
                    'w': stats[i, cv2.CC_STAT_WIDTH],
                    'h': stats[i, cv2.CC_STAT_HEIGHT]
                })
                
        top_row = sorted([c for c in comps if c['cy'] < h / 2], key=lambda c: c['cx'])
        bot_row = sorted([c for c in comps if c['cy'] >= h / 2], key=lambda c: c['cx'])
        
        all_ordered = top_row + bot_row
        assert len(all_ordered) == 7, f"Expected 7 components, got {len(all_ordered)}"
        
        for idx, (comp, name) in enumerate(zip(all_ordered, names)):
            label_id = comp['label']
            # Use bounding box center to avoid centroid head bias
            box_cx = comp['x'] + (comp['w'] // 2)
            bottom_y = comp['y'] + comp['h']
            
            x1 = box_cx - (TILE_W // 2)
            x2 = x1 + TILE_W
            y2 = bottom_y
            y1 = y2 - TILE_H
            
            src_x1 = max(0, x1)
            src_x2 = min(w, x2)
            src_y1 = max(0, y1)
            src_y2 = min(h, y2)
            
            tile = np.full((TILE_H, TILE_W, 3), [4, 255, 4], dtype=np.uint8)
            
            dst_x1 = src_x1 - x1
            dst_x2 = dst_x1 + (src_x2 - src_x1)
            dst_y1 = src_y1 - y1
            dst_y2 = dst_y1 + (src_y2 - src_y1)
            
            tile_patch = img[src_y1:src_y2, src_x1:src_x2].copy()
            labels_patch = labels[src_y1:src_y2, src_x1:src_x2]
            
            tile_patch[labels_patch != label_id] = [4, 255, 4]
            tile[dst_y1:dst_y2, dst_x1:dst_x2] = tile_patch
            
            rgba = clean_chroma_key(tile)
            
            out_path = f'public/avatar-frames/{name}.png'
            Image.fromarray(rgba).save(out_path, format='PNG')
            print(f"  [{idx+1}/7] Saved {out_path} ({TILE_W}x{TILE_H}) - Unclipped shoulders")

if __name__ == '__main__':
    extract_all()
    print("\nAll 21 frames successfully re-extracted with unclipped shoulders!")
