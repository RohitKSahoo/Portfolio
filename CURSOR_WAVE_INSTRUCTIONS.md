# Character Cursor Wave Background Component - Implementation Guide

This guide contains complete instructions and source code to implement a highly optimized, interactive, character-based canvas background effect in a React/TypeScript application.

---

## 1. Create the CSS Stylesheet

Create a file named `CursorWave.css` containing the layout properties for the canvas:

```css
.cursor-wave {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: relative;
}

.cursor-wave__wrap {
  width: 100%;
  height: 100%;
  position: relative;
}

.cursor-wave__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
```

---

## 2. Create the React Component

Create a file named `CursorWave.tsx`. This component uses HTML5 Canvas 2D and implements:
1. **Interactive Hover**: Characters within a proximity radius rotate and scale up towards the cursor.
2. **Click Burst Waves**: Clicking anywhere sends a propagating ring wave across the characters.
3. **Element Masking**: Automatically hides background elements under elements tagged with `data-cursor-wave-mask` (except during active click-waves, allowing the wave to override/pass through).
4. **Performance Tuning**: Cache-friendly properties configuration, direct coordinate tracking, and deferred distance checks to run at a smooth 60+ FPS.

```tsx
'use client';

import React, { useRef, useEffect } from 'react';
import './CursorWave.css';

const DEFAULT_MONO_COLORS = [
  '#ffffff', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563'
];

const DEFAULT_CHARS = [
  '{', '}', '[', ']', '(', ')', '<', '>', '/', '\\', '+', '-', 
  '=', ';', ':', '0', '1', 'x', 'y', 'z', '$', '#', '@', '&', '%', '*', '!', '?'
];

export interface CursorWaveProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  children?: React.ReactNode;
  cellSize?: number;
  influenceRadiusVmin?: number;
  attackTime?: number;
  releaseTime?: number;
  idleScale?: number;
  minPeakScale?: number;
  maxPeakScale?: number;
  burstSpeed?: number;
  burstThickness?: number;
  backgroundColor?: string;
  chars?: string[];
  colors?: string[];
  dpr?: number;
  opacity?: number;
}

interface GridCell {
  cx: number;
  cy: number;
  char: string;
  color: string;
  currentScale: number;
  currentRotation: number;
  peakScale: number;
  randomPhase: number;
  isMasked: boolean;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
}

const CursorWave: React.FC<CursorWaveProps> = ({
  width = '100%',
  height = '100%',
  className = '',
  children,
  cellSize = 50,
  influenceRadiusVmin = 25,
  attackTime = 0.4,
  releaseTime = 0.6,
  idleScale = 0.4,
  minPeakScale = 0.8,
  maxPeakScale = 1.3,
  burstSpeed = 1100,
  burstThickness = 200,
  backgroundColor = 'transparent',
  chars = DEFAULT_CHARS,
  colors = DEFAULT_MONO_COLORS,
  dpr = 1.5,
  opacity = 0.6,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellsRef = useRef<GridCell[]>([]);
  const pointerRef = useRef({ x: -1000, y: -1000 });
  const ripplesRef = useRef<Ripple[]>([]);

  // Periodically scan for elements marked with the data-cursor-wave-mask attribute
  const scanMaskedElements = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const elements = document.querySelectorAll('[data-cursor-wave-mask]');
    const canvasRect = canvas.getBoundingClientRect();

    const rects: DOMRect[] = [];
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      rects.push(
        new DOMRect(
          rect.left - canvasRect.left,
          rect.top - canvasRect.top,
          rect.width,
          rect.height
        )
      );
    });

    // Update cell mask states
    cellsRef.current.forEach((cell) => {
      let cellMasked = false;
      for (let i = 0; i < rects.length; i++) {
        const rect = rects[i];
        if (
          cell.cx >= rect.left &&
          cell.cx <= rect.right &&
          cell.cy >= rect.top &&
          cell.cy <= rect.bottom
        ) {
          cellMasked = true;
          break;
        }
      }
      cell.isMasked = cellMasked;
    });
  };

  useEffect(() => {
    scanMaskedElements();
    const interval = setInterval(scanMaskedElements, 300);
    window.addEventListener('scroll', scanMaskedElements, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', scanMaskedElements);
    };
  }, []);

  // Initialize grid layout & handle resize events
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const buildGrid = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, dpr);
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(devicePixelRatio, devicePixelRatio);
      }

      const cols = Math.floor(w / cellSize);
      const rows = Math.floor(h / cellSize);
      const actualCellW = w / cols;
      const actualCellH = h / rows;

      const cells: GridCell[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = c * actualCellW + actualCellW / 2;
          const cy = r * actualCellH + actualCellH / 2;

          const hash = Math.sin(cx * 12.9898 + cy * 78.233) * 43758.5453;
          const randomVal = hash - Math.floor(hash);

          const cellChar = chars[Math.floor(randomVal * chars.length)];
          const cellColor = colors[Math.floor(randomVal * colors.length)];
          const cellPeakScale = minPeakScale + randomVal * (maxPeakScale - minPeakScale);
          const cellPhase = randomVal * Math.PI * 2;

          cells.push({
            cx,
            cy,
            char: cellChar,
            color: cellColor,
            currentScale: idleScale,
            currentRotation: (randomVal - 0.5) * 0.5,
            peakScale: cellPeakScale,
            randomPhase: cellPhase,
            isMasked: false,
          });
        }
      }
      cellsRef.current = cells;
      scanMaskedElements();
    };

    buildGrid();

    const resizeObserver = new ResizeObserver(() => {
      buildGrid();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [cellSize, chars, colors, dpr, idleScale, minPeakScale, maxPeakScale]);

  // Animation draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let lastTime = performance.now();
    let animationFrameId: number;

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      const cappedDt = Math.min(dt, 0.1);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);
      if (backgroundColor && backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }

      const mx = pointerRef.current.x;
      const my = pointerRef.current.y;
      const minDimension = Math.min(w, h);
      const influenceRadius = minDimension * (influenceRadiusVmin / 100);
      const influenceRadiusSq = influenceRadius * influenceRadius;

      // Update ripple distances
      const ripples = ripplesRef.current;
      const maxPossibleRadius = Math.max(w, h) * 1.5;
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].radius += burstSpeed * cappedDt;
        if (ripples[i].radius > maxPossibleRadius) {
          ripples.splice(i, 1);
        }
      }

      const cells = cellsRef.current;
      const halfThickness = burstThickness / 2;

      // Optimize: set text properties once before loop
      const fontSize = cellSize * 0.55;
      ctx.font = `500 ${fontSize}px 'JetBrains Mono', 'Fira Code', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      cells.forEach((cell) => {
        const dx = cell.cx - mx;
        const dy = cell.cy - my;
        
        // Fast distance squared bounds check to bypass Math.sqrt when far
        const distSq = dx * dx + dy * dy;

        let targetScale = idleScale;
        let targetRotation = cell.currentRotation;

        if (distSq < influenceRadiusSq) {
          const dist = Math.sqrt(distSq);
          const ratio = 1 - dist / influenceRadius;
          targetScale = idleScale + (cell.peakScale - idleScale) * ratio * ratio;
          targetRotation = Math.atan2(dy, dx) + cell.randomPhase;
        } else {
          targetRotation += 0.05 * cappedDt;
        }

        let rippleScaling = 0;
        let rippleRotation = 0;
        
        for (let i = 0; i < ripples.length; i++) {
          const ripple = ripples[i];
          const rDist = Math.hypot(cell.cx - ripple.x, cell.cy - ripple.y);
          const diff = Math.abs(rDist - ripple.radius);

          if (diff < halfThickness) {
            const intensity = 1 - diff / halfThickness;
            rippleScaling += intensity * 1.0;
            rippleRotation += intensity * Math.PI * 1.5;
          }
        }

        if (cell.isMasked) {
          if (rippleScaling > 0) {
            targetScale = rippleScaling * cell.peakScale;
          } else {
            targetScale = 0;
          }
        } else {
          targetScale += rippleScaling;
        }

        targetRotation += rippleRotation;

        const timeConstant = targetScale > cell.currentScale ? attackTime : releaseTime;
        const easeFactor = 1 - Math.pow(0.05, cappedDt / Math.max(timeConstant, 0.05));
        cell.currentScale += (targetScale - cell.currentScale) * easeFactor;
        cell.currentRotation += (targetRotation - cell.currentRotation) * easeFactor;

        if (cell.currentScale > 0.01) {
          ctx.save();
          ctx.translate(cell.cx, cell.cy);
          ctx.rotate(cell.currentRotation);
          ctx.scale(cell.currentScale, cell.currentScale);

          // Map opacity to active scaling ratio
          const activeRatio = (cell.currentScale - idleScale) / (cell.peakScale - idleScale);
          const cellOpacity = opacity * (0.15 + 0.85 * Math.max(0, Math.min(1, activeRatio)));
          
          ctx.globalAlpha = cellOpacity;
          ctx.fillStyle = cell.color;
          ctx.fillText(cell.char, 0, 0);
          ctx.restore();
        }
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    const handleMouseMove = (e: MouseEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      pointerRef.current = { x: -1000, y: -1000 };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        pointerRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ripplesRef.current.push({
        x: clickX,
        y: clickY,
        radius: 0,
        maxRadius: Math.max(w, h) * 1.5,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('click', handleClick);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('click', handleClick);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [
    influenceRadiusVmin,
    idleScale,
    burstSpeed,
    burstThickness,
    attackTime,
    releaseTime,
    opacity,
    backgroundColor,
    cellSize,
  ]);

  return (
    <div ref={containerRef} className={`cursor-wave ${className}`}>
      <div className="cursor-wave__wrap">
        <canvas ref={canvasRef} className="cursor-wave__canvas" />
      </div>
      {children && <div className="relative z-10 w-full h-full">{children}</div>}
    </div>
  );
};

export default CursorWave;
```

---

## 3. How to Use the Component

### Render as Fixed Viewport Background
Import the component and mount it at the root of your application layouts (e.g. inside `App.tsx` or `layout.tsx`):

```tsx
import CursorWave from './components/effects/CursorWave';

function App() {
  return (
    <div className="relative min-h-screen text-white">
      {/* Background Interactive Layer */}
      <CursorWave className="fixed inset-0 -z-10" />

      {/* Foreground Content */}
      <main className="relative z-10">
        <h1>My Beautiful Portfolio</h1>
      </main>
    </div>
  );
}
```

### Mask Content Blocks
To hide background characters behind readable content boxes (like cards or text sections), add the `data-cursor-wave-mask` attribute to those element tags:

```tsx
<div data-cursor-wave-mask className="bg-black/50 p-6 rounded-lg">
  <p>This text card will mask out the background characters underneath it.</p>
</div>
```

---

## 4. Key Performance Guidelines for Other Agents
If modifying this component, adhere to these rules to avoid lags/stutters:
1. **Never call `getBoundingClientRect()` inside high-frequency listeners** (such as `mousemove` or `touchmove`). Rely on direct client viewport coords (`clientX`/`clientY`).
2. **Never call canvas context configuration methods (like `ctx.font = ...`) inside the cell loop**. Declare them once before looping.
3. **Use Squared Distances first** when verifying boundaries, deferring `Math.sqrt` and `Math.hypot` execution until verified close.
4. **Pre-compute element masks** dynamically inside a throttled timer or scroll event rather than scanning the DOM on every render frame.
