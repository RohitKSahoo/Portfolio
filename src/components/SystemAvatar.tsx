import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';

export const SystemAvatar = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isFullView, setIsFullView] = useState(false);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);

  const lastMousePos = useRef({ x: 0, y: 0 });
  const velocity = useRef(0);

  // PARALLAX SPRING CONFIGS
  const eyeSpring = { damping: 15, stiffness: 200, mass: 0.3 };
  const headSpring = { damping: 20, stiffness: 150, mass: 0.6 };

  const mouseX = useSpring(0, headSpring);
  const mouseY = useSpring(0, headSpring);

  // Derived parallax values
  const eyeX = useTransform(mouseX, [-40, 40], [-15, 15]);
  const eyeY = useTransform(mouseY, [-40, 40], [-12, 12]);
  const torsoX = useTransform(mouseX, [-40, 40], [-5, 5]);
  const neckRotate = useTransform(mouseX, [-40, 40], [-5, 5]);

  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => {
      setIsFullView(true);
    }, 2000);
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setIsFullView(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = (e.clientX - centerX) / (window.innerWidth / 2);
      const dy = (e.clientY - centerY) / (window.innerHeight / 2);

      mouseX.set(dx * 40);
      mouseY.set(dy * 30);

      const currentV = Math.sqrt(Math.pow(e.clientX - lastMousePos.current.x, 2) + Math.pow(e.clientY - lastMousePos.current.y, 2));
      velocity.current = currentV;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      if (currentV > 150 && !isGlitching) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isGlitching]);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center transition-all duration-700 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* HUD Rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute w-[500px] h-[500px] border border-[var(--theme-accent)]/5 rounded-full"
      />

      <motion.svg
        viewBox="0 0 240 280"
        className="w-full h-full max-w-xl transition-all duration-1000 ease-in-out cursor-pointer"
        style={{ scale: isFullView ? 0.75 : 1, y: isFullView ? -20 : 0 }}
        animate={isGlitching ? { x: [-2, 2, -1, 3, 0], filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(0deg)'] } : {}}
      >
        {/* PARALLAX TORSO */}
        <motion.g style={{ x: torsoX }}>
          {/* Mechanical Torso Frame */}
          <path
            d="M70,200 L170,200 L190,280 L50,280 Z"
            fill="rgba(var(--bg-black-rgb), 0.4)"
            stroke="var(--tier-2)"
            strokeWidth="1"
          />

          <rect x="118" y="200" width="4" height="80" fill="var(--theme-accent)" opacity="0.2" />

          {/* Articulated Shoulders & Arms */}
          <g>
            {/* Left Arm Assembly (Standard) */}
            <circle cx="70" cy="205" r="4" fill="var(--bg-black)" stroke="var(--tier-3)" strokeWidth="1" />
            <path d="M70,205 L40,240 L55,265" fill="none" stroke="var(--tier-1)" strokeWidth="2" strokeLinecap="round" />
            <motion.circle cx="55" cy="265" r="2.5" fill="var(--theme-accent)" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.15, repeat: Infinity }} />

            {/* Right Arm Assembly (Standard or Waving) */}
            <circle cx="170" cy="205" r="4" fill="var(--bg-black)" stroke="var(--tier-3)" strokeWidth="1" />

            {isFullView ? (
              <motion.path
                d="M170,205 L210,180 L230,150"
                fill="none"
                stroke="var(--tier-1)"
                strokeWidth="2.5"
                strokeLinecap="round"
                animate={{ rotate: [0, -20, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                style={{ originX: "170px", originY: "205px" }}
              />
            ) : (
              <path d="M170,205 L200,240 L185,265" fill="none" stroke="var(--tier-1)" strokeWidth="2" strokeLinecap="round" />
            )}

            <motion.circle
              cx={isFullView ? 230 : 185}
              cy={isFullView ? 150 : 265}
              r="3"
              fill="var(--theme-accent)"
              animate={isFullView ? { x: [0, -3, 0], y: [0, -2, 0] } : { opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          </g>
        </motion.g>

        {/* DYNAMIC NECK / PISTONS */}
        <motion.g style={{ rotate: neckRotate, x: torsoX }}>
          <rect x="115" y="160" width="10" height="40" fill="var(--tier-3)" opacity="0.3" />
        </motion.g>

        {/* HEAD SEGMENT */}
        <motion.g style={{ x: mouseX, y: mouseY, rotate: neckRotate }} transform-origin="120 120">
          <circle cx="120" cy="120" r="70" fill="var(--bg-black)" stroke="var(--tier-1)" strokeWidth="2" />

          <motion.circle
            cx="120" cy="120" r="62" fill="none" stroke="var(--tier-3)" strokeWidth="0.5" strokeDasharray="10 20"
            animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />

          {/* OPTIC VISOR */}
          <motion.g style={{ x: eyeX, y: eyeY }}>
            <rect x="80" y="105" width="80" height="30" rx="15" fill="rgba(255,255,255,0.03)" stroke="var(--tier-3)" strokeWidth="1" />

            {/* Split Sensor Eyes (Change to "Happy" in Full View) */}
            <motion.g>
              {isFullView ? (
                <>
                  <path d="M92,115 Q100,108 108,115" fill="none" stroke="var(--theme-accent)" strokeWidth="3" strokeLinecap="round" />
                  <path d="M132,115 Q140,108 148,115" fill="none" stroke="var(--theme-accent)" strokeWidth="3" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <circle cx="100" cy="120" r="4" fill="var(--theme-accent)" />
                  <circle cx="140" cy="120" r="4" fill="var(--theme-accent)" />
                </>
              )}
            </motion.g>
          </motion.g>

          <path d="M120,50 L120,30 L135,15" fill="none" stroke="var(--tier-1)" strokeWidth="2" strokeLinecap="round" />
          <motion.circle cx="135" cy="15" r="3" fill="var(--theme-accent)" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} />
        </motion.g>

        {/* HOLOGRAPHIC H.I.D INTERFACE */}
        {!isFullView && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transform="translate(45, 245)">
            <path d="M0,0 L150,0 M10,10 L140,10 M20,20 L130,20" stroke="var(--theme-accent)" strokeWidth="0.5" opacity="0.3" />
            {[...Array(5)].map((_, i) => (
              <motion.circle key={i} cx={30 + i * 25} r="1" fill="var(--theme-accent)" animate={{ y: [0, -40], opacity: [0, 0.8, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }} />
            ))}
          </motion.g>
        )}
      </motion.svg>

      {/* REACTIVE HUD TELEMETRY */}
      <AnimatePresence>
        {!isFullView && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none font-mono text-[0.4rem] tracking-[0.2em] text-tier-3/40 uppercase"
          >
            <motion.div style={{ x: torsoX, y: torsoX }} className="absolute top-[10%] left-[5%]">Kernel_Hash: 0x88F2...</motion.div>
            <motion.div style={{ x: useTransform(mouseX, [-40, 40], [5, -5]) }} className="absolute bottom-[10%] right-[10%] text-right">Sync_Rate: 99.8%</motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isFullView && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-1/4 bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/30 px-3 py-1 rounded text-[0.6rem] font-mono text-[var(--theme-accent)] uppercase tracking-widest"
        >
          GREETING_PROTOCOL_ALPHA
        </motion.div>
      )}
    </div>
  );
};
