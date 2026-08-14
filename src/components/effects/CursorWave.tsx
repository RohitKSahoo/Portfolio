'use client';

import React, { useRef, useEffect } from 'react';
import './CursorWave.css';

const DEFAULT_MONO_COLORS = [
  '#fe0000ff', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#ffffffff', '#ff0000ff'
];

// Clean, balanced characters with solid visual symmetry
const DEFAULT_CHARS = [
  '{', '}', '[', ']', '<', '>', '/', '@', '#', '%', '&', '*', '^', '$', '0', '1', 'x', 'y', 'z'
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
  influenceRadiusVmin = 22,
  attackTime = 0.35,
  releaseTime = 0.55,
  idleScale = 0.75,
  minPeakScale = 1.1,
  maxPeakScale = 1.45,
  burstSpeed = 1200,
  burstThickness = 180,
  backgroundColor = 'transparent',
  chars = DEFAULT_CHARS,
  colors = DEFAULT_MONO_COLORS,
  dpr = 1.5,
  opacity = 0.55,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellsRef = useRef<GridCell[]>([]);
  const pointerRef = useRef({ x: -10000, y: -10000 });
  const ripplesRef = useRef<Ripple[]>([]);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const dprRef = useRef(1);
  const glyphCacheRef = useRef<Map<string, HTMLCanvasElement>>(new Map());
  const glyphSizeRef = useRef(64);
  const hasMaskedElementsRef = useRef(false);

  // Periodically scan for elements marked with the data-cursor-wave-mask attribute
  const scanMaskedElements = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const elements = document.querySelectorAll('[data-cursor-wave-mask]');
    if (elements.length === 0) {
      if (hasMaskedElementsRef.current) {
        cellsRef.current.forEach((cell) => {
          cell.isMasked = false;
        });
        hasMaskedElementsRef.current = false;
      }
      return;
    }
    hasMaskedElementsRef.current = true;

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
    const cells = cellsRef.current;
    for (let c = 0; c < cells.length; c++) {
      const cell = cells[c];
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
    }
  };

  useEffect(() => {
    scanMaskedElements();
    const interval = setInterval(scanMaskedElements, 500);

    let scrollRaf: number | null = null;
    const handleScroll = () => {
      if (scrollRaf === null) {
        scrollRaf = requestAnimationFrame(() => {
          scanMaskedElements();
          scrollRaf = null;
        });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearInterval(interval);
      if (scrollRaf !== null) cancelAnimationFrame(scrollRaf);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Initialize grid layout, pre-render crisp glyph atlas, & handle resize events
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const buildGrid = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      dimensionsRef.current = { width: w, height: h };

      const actualDpr = Math.min(window.devicePixelRatio || 1, dpr);
      dprRef.current = actualDpr;

      canvas.width = Math.round(w * actualDpr);
      canvas.height = Math.round(h * actualDpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      // Build pre-rendered glyph cache atlas with high-definition font rendering
      const glyphMap = new Map<string, HTMLCanvasElement>();
      const glyphBoxSize = Math.ceil(cellSize * 1.3);
      const fontSize = Math.round(cellSize * 0.42);

      chars.forEach((char) => {
        colors.forEach((color) => {
          const offscreen = document.createElement('canvas');
          offscreen.width = Math.round(glyphBoxSize * actualDpr);
          offscreen.height = Math.round(glyphBoxSize * actualDpr);
          const offCtx = offscreen.getContext('2d');
          if (offCtx) {
            offCtx.scale(actualDpr, actualDpr);
            // Use bold weight for consistent stroke width across all punctuation marks
            offCtx.font = `700 ${fontSize}px 'JetBrains Mono', monospace`;
            offCtx.textAlign = 'center';
            offCtx.textBaseline = 'middle';
            offCtx.fillStyle = color;
            offCtx.fillText(char, glyphBoxSize / 2, glyphBoxSize / 2);
          }
          glyphMap.set(`${char}_${color}`, offscreen);
        });
      });
      glyphCacheRef.current = glyphMap;
      glyphSizeRef.current = glyphBoxSize;

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
          const cellPhase = (randomVal - 0.5) * 0.4;

          cells.push({
            cx,
            cy,
            char: cellChar,
            color: cellColor,
            currentScale: idleScale,
            currentRotation: 0, // Clean upright orientation at idle
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

      const { width: w, height: h } = dimensionsRef.current;
      if (w === 0 || h === 0) {
        animationFrameId = requestAnimationFrame(tick);
        return;
      }

      const dpr = dprRef.current;
      const canvasW = canvas.width;
      const canvasH = canvas.height;

      // Clear full canvas buffer in physical pixels
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvasW, canvasH);
      if (backgroundColor && backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvasW, canvasH);
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
      const glyphMap = glyphCacheRef.current;
      const glyphBoxSize = glyphSizeRef.current;
      const halfGlyphBox = glyphBoxSize / 2;
      const hasRipples = ripples.length > 0;

      // Frame-level ease factors
      const easeFactorAttack = 1 - Math.pow(0.05, cappedDt / Math.max(attackTime, 0.05));
      const easeFactorRelease = 1 - Math.pow(0.05, cappedDt / Math.max(releaseTime, 0.05));

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const dx = cell.cx - mx;
        const dy = cell.cy - my;
        const distSq = dx * dx + dy * dy;

        let targetScale = idleScale;
        let targetRotation = 0; // Return to upright when not influenced

        if (distSq < influenceRadiusSq) {
          const dist = Math.sqrt(distSq);
          const ratio = 1 - dist / influenceRadius;
          targetScale = idleScale + (cell.peakScale - idleScale) * ratio * ratio;
          targetRotation = Math.atan2(dy, dx) + cell.randomPhase;
        }

        let rippleScaling = 0;
        let rippleRotation = 0;
        
        if (hasRipples) {
          for (let r = 0; r < ripples.length; r++) {
            const ripple = ripples[r];
            const rDist = Math.hypot(cell.cx - ripple.x, cell.cy - ripple.y);
            const diff = Math.abs(rDist - ripple.radius);

            if (diff < halfThickness) {
              const intensity = 1 - diff / halfThickness;
              rippleScaling += intensity * 0.9;
              rippleRotation += intensity * Math.PI * 1.2;
            }
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

        const easeFactor = targetScale > cell.currentScale ? easeFactorAttack : easeFactorRelease;
        cell.currentScale += (targetScale - cell.currentScale) * easeFactor;
        cell.currentRotation += (targetRotation - cell.currentRotation) * easeFactor;

        if (cell.currentScale > 0.01) {
          const glyph = glyphMap.get(`${cell.char}_${cell.color}`);
          if (glyph) {
            const s = cell.currentScale * dpr;
            const cos = Math.cos(cell.currentRotation) * s;
            const sin = Math.sin(cell.currentRotation) * s;

            // Direct hardware 2D matrix transformation
            ctx.setTransform(cos, sin, -sin, cos, cell.cx * dpr, cell.cy * dpr);

            // Dynamic opacity: subtle ambient idle with bright hover focus
            const activeRatio = (cell.currentScale - idleScale) / (cell.peakScale - idleScale);
            const cellOpacity = opacity * (0.12 + 0.88 * Math.max(0, Math.min(1, activeRatio)));
            
            ctx.globalAlpha = cellOpacity;
            ctx.drawImage(glyph, -halfGlyphBox, -halfGlyphBox, glyphBoxSize, glyphBoxSize);
          }
        }
      }

      // Reset matrix transform
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    const handleMouseMove = (e: MouseEvent) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      pointerRef.current.x = -10000;
      pointerRef.current.y = -10000;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        pointerRef.current.x = e.touches[0].clientX;
        pointerRef.current.y = e.touches[0].clientY;
      }
    };

    const handleClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;
      const { width: w, height: h } = dimensionsRef.current;

      ripplesRef.current.push({
        x: clickX,
        y: clickY,
        radius: 0,
        maxRadius: Math.max(w || window.innerWidth, h || window.innerHeight) * 1.5,
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
