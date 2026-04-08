import React, { useEffect, useRef, useState } from 'react';

export const AsciiBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [theme, setTheme] = useState('dark');
  const chars = "0101#$%&@*+=-/<>!?".split("");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(currentTheme);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const spacing = 18; // Increased quantity (smaller spacing)
    const fontSize = 10; // Smaller characters for higher density
    let columns = Math.ceil(width / spacing);
    let rows = Math.ceil(height / spacing);
    
    // Grid data with current positions for lerping
    let grid: { char: string, ox: number, oy: number, cx: number, cy: number }[] = [];
    
    const initGrid = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      columns = Math.ceil(width / spacing) + 1;
      rows = Math.ceil(height / spacing) + 1;
      
      grid = [];
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= columns; c++) {
          const x = c * spacing;
          const y = r * spacing;
          grid.push({
            char: chars[Math.floor(Math.random() * chars.length)],
            ox: x,
            oy: y,
            cx: x,
            cy: y
          });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', initGrid);
    initGrid();

    let frameCount = 0;
    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);
      
      const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-accent').trim();
      const tier3Color = getComputedStyle(document.documentElement).getPropertyValue('--tier-3').trim();
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';

      const radius = 120; // Reduced radius for tighter effect
      const strength = 35; // Responsive push strength

      ctx.font = `${fontSize}px JetBrains Mono`;
      
      grid.forEach(point => {
        const dx = point.ox - mouseRef.current.x;
        const dy = point.oy - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Target calculation
        let targetX = point.ox;
        let targetY = point.oy;
        let opacity = isLight ? 0.12 : 0.04;
        let color = tier3Color;

        if (distance < radius) {
          const force = (radius - distance) / radius;
          targetX = point.ox + (dx / distance) * force * strength;
          targetY = point.oy + (dy / distance) * force * strength;
          
          opacity = isLight ? (0.2 + force * 0.4) : (0.1 + force * 0.6);
          color = themeColor;

          // Faster randomization near cursor (every 4 frames)
          if (frameCount % 4 === 0) {
            point.char = chars[Math.floor(Math.random() * chars.length)];
          }
        } else {
            // Slower idle randomization
            if (Math.random() > 0.99995) {
                point.char = chars[Math.floor(Math.random() * chars.length)];
            }
        }

        // Smooth Lerping Logic
        point.cx += (targetX - point.cx) * 0.15;
        point.cy += (targetY - point.cy) * 0.15;

        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.fillText(point.char, point.cx, point.cy);
      });

      requestAnimationFrame(render);
    };

    const animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', initGrid);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0" 
      style={{ 
        mixBlendMode: theme === 'light' ? 'multiply' : 'screen',
      }}
    />
  );
};
