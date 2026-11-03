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

def extract_v2():
    os.makedirs('public/avatar-frames', exist_ok=True)
    
    img = cv2.imread('public/assets/Head_Directions_2.jpg')
    img[-140:, -140:] = [4, 255, 4]
    
    g = img[:,:,1].astype(int)
    r = img[:,:,2].astype(int)
    b = img[:,:,0].astype(int)
    is_char = (g - np.maximum(r, b) < 15).astype(np.uint8)
    
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(is_char)
    
    comps = []
    for i in range(1, num_labels):
        if stats[i, cv2.CC_STAT_AREA] > 30000:
            comps.append({
                'label': i,
                'cx': centroids[i][0],
                'cy': centroids[i][1],
                'x': stats[i, cv2.CC_STAT_LEFT],
                'y': stats[i, cv2.CC_STAT_TOP],
                'w': stats[i, cv2.CC_STAT_WIDTH],
                'h': stats[i, cv2.CC_STAT_HEIGHT]
            })
            
    print(f"Total components found: {len(comps)}")
    comps.sort(key=lambda c: c['cy'])
    row0 = sorted(comps[0:5], key=lambda c: c['cx'])
    row1 = sorted(comps[5:10], key=lambda c: c['cx'])
    row2 = sorted(comps[10:15], key=lambda c: c['cx'])
    sorted_rows = [row0, row1, row2]
    
    # Correct column mapping:
    # Col 0 faces viewer's right -> up-far-right / far-right / down-far-right
    # Col 4 faces viewer's left  -> up-far-left / far-left / down-far-left
    grid_names = [
        ['up-far-right', 'up-right', 'up', 'up-left', 'up-far-left'],
        ['far-right', 'right', 'center', 'left', 'far-left'],
        ['down-far-right', 'down-right', 'down', 'down-left', 'down-far-left']
    ]
    
    TILE_W = 540
    TILE_H = 512
    
    for r_idx in range(3):
        for c_idx in range(5):
            comp = sorted_rows[r_idx][c_idx]
            label_id = comp['label']
            name = f"dir_{grid_names[r_idx][c_idx]}"
            
            cx = int(round(comp['cx']))
            bottom_y = comp['y'] + comp['h']
            
            x1 = cx - (TILE_W // 2)
            x2 = x1 + TILE_W
            y2 = bottom_y
            y1 = y2 - TILE_H
            
            src_x1 = max(0, x1)
            src_x2 = min(img.shape[1], x2)
            src_y1 = max(0, y1)
            src_y2 = min(img.shape[0], y2)
            
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
            print(f"Saved: {out_path} ({TILE_W}x{TILE_H})")

if __name__ == '__main__':
    extract_v2()
