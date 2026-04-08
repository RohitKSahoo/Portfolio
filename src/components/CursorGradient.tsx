import React, { useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const CursorGradient: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Set initial position to center
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Calculate angle based on mouse position relative to center
  const angle = useTransform([mouseX, mouseY], ([x, y]) => {
    if (typeof window === 'undefined') return 0;
    const dx = (x as number) - window.innerWidth / 2;
    const dy = (y as number) - window.innerHeight / 2;
    return Math.atan2(dy, dx) * (180 / Math.PI) + 90;
  });

  const springAngle = useSpring(angle, { damping: 40, stiffness: 120 });
  const background = useMotionTemplate`linear-gradient(${springAngle}deg, var(--bg-black) 0%, var(--border-muted) 50%, var(--bg-black) 100%)`;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[-1]"
      style={{ background }}
    />
  );
};
