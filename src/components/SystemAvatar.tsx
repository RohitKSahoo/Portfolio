import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

export const SystemAvatar = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isBlinking, setIsBlinking] = useState(false);
  
  // High-Resolution Interaction Values
  const headX = useSpring(0, { damping: 30, stiffness: 80, mass: 1 });
  const headY = useSpring(0, { damping: 30, stiffness: 80, mass: 1 });
  const eyeX = useSpring(0, { damping: 15, stiffness: 120 });
  const eyeY = useSpring(0, { damping: 15, stiffness: 120 });
  const bodyX = useSpring(0, { damping: 40, stiffness: 60 });
  const hudRotate = useSpring(0, { damping: 40, stiffness: 40 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = (e.clientX - centerX) / (window.innerWidth / 2);
      const dy = (e.clientY - centerY) / (window.innerHeight / 2);

      headX.set(dx * 25);
      headY.set(dy * 20);
      eyeX.set(dx * 22);
      eyeY.set(dy * 15);
      bodyX.set(dx * 8);
      hudRotate.set(dx * 45);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const triggerBlink = () => {
    if (isBlinking) return;
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 120);
  };

  // Visual Transforms
  const headTiltX = useTransform(headY, [-20, 20], [8, -8]);
  const headTiltY = useTransform(headX, [-25, 25], [-8, 8]);

  return (
    <div 
      ref={containerRef}
      className={`relative flex items-center justify-center group ${className} cursor-pointer active:scale-95 transition-transform`}
      onClick={triggerBlink}
      style={{ perspective: '1500px' }}
    >
      {/* ATMOSPHERIC BACKGROUND BLOOM */}
      <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,184,0,0.02)_0%,transparent_70%)] blur-[80px]" />

      {/* ATMOSPHERIC BACKGROUND HUD */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 flex items-center justify-center">
         <motion.div style={{ rotate: hudRotate }} className="relative flex items-center justify-center">
            <svg width="600" height="600" viewBox="0 0 500 500" fill="none">
               <circle cx="250" cy="250" r="180" stroke="white" strokeWidth="0.5" strokeDasharray="2 12" />
               <circle cx="250" cy="250" r="230" stroke="#FFCC00" strokeWidth="0.5" opacity="0.3" />
            </svg>
         </motion.div>
      </div>

      {/* COMPOSITE MECHA ASSEMBLY */}
      <div className="relative w-[500px] h-[600px] flex flex-col items-center justify-center">
        
        {/* REINFORCED MECHA TORSO & CONNECTED ARMS */}
        <motion.div 
           style={{ x: bodyX, translateZ: '80px' }}
           className="absolute bottom-0 w-full h-[400px] z-20 pointer-events-none"
        >
           <svg width="100%" height="100%" viewBox="0 0 500 400" fill="none">
              {/* ARM HYDRAULICS (Connected to hands) */}
              <g opacity="0.4">
                 <path d="M120,200 L60,320 L100,380" stroke="#222" strokeWidth="15" strokeLinecap="round" />
                 <path d="M380,200 L440,320 L400,380" stroke="#222" strokeWidth="15" strokeLinecap="round" />
                 <path d="M120,200 L60,320 L100,380" stroke="#FFCC00" strokeWidth="1" opacity="0.3" />
                 <path d="M380,200 L440,320 L400,380" stroke="#FFCC00" strokeWidth="1" opacity="0.3" />
              </g>

              {/* HANDS (Integrated into Arm Layer) */}
              <g transform="translate(80, 360)">
                 <rect x="0" y="0" width="40" height="30" rx="4" fill="#0A0A0A" stroke="#333" />
                 <rect x="5" y="30" width="6" height="20" rx="2" fill="#111" />
                 <rect x="15" y="32" width="6" height="25" rx="2" fill="#111" />
                 <rect x="25" y="30" width="6" height="22" rx="2" fill="#111" />
              </g>
              <g transform="translate(380, 360)">
                 <rect x="0" y="0" width="40" height="30" rx="4" fill="#0A0A0A" stroke="#333" />
                 <rect x="5" y="30" width="6" height="20" rx="2" fill="#111" />
                 <rect x="15" y="32" width="6" height="25" rx="2" fill="#111" />
                 <rect x="25" y="30" width="6" height="22" rx="2" fill="#111" />
              </g>

              {/* Main Chest Plate */}
              <path 
                d="M140,150 C140,180 180,200 250,200 C320,200 360,180 360,150 L380,350 L120,350 Z" 
                fill="#0A0A0A" stroke="#1A1A1A" strokeWidth="2" 
              />
              {/* Energy Core */}
              <motion.g animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 4, repeat: Infinity }}>
                 <circle cx="250" cy="220" r="12" stroke="#FFCC00" strokeWidth="1" strokeDasharray="3 6" />
                 <circle cx="250" cy="220" r="4" fill="#FFCC00" />
              </motion.g>
           </svg>
        </motion.div>

        {/* THE SPHERICAL HEAD ASSEMBLY */}
        <motion.div 
          style={{ 
            x: headX, y: headY, 
            rotateX: headTiltX, rotateY: headTiltY,
            transformStyle: 'preserve-3d', translateZ: '150px'
          }}
          className="relative w-80 h-80 z-40 mb-32"
        >
           <div className="absolute inset-0 bg-[#0A0A0A] rounded-full shadow-[inset_0_2px_15px_rgba(255,255,255,0.15),0_50px_100px_rgba(0,0,0,0.8),0_0_20px_rgba(255,204,0,0.05)] border border-white/10 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-2 bg-white/10 blur-[2px]" />
           </div>

           <div className="absolute inset-10 rounded-full bg-[#111111] overflow-hidden border border-white/20 shadow-[inset_0_4px_25px_rgba(0,0,0,1)]">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 opacity-80" />
              
              {/* PRECISION OPTIC SENSORS */}
              <motion.div style={{ x: eyeX, y: eyeY }} className="absolute inset-0 flex items-center justify-center gap-16">
                 {[0, 1].map(i => (
                   <motion.div 
                     key={i}
                     initial={false}
                     animate={{ scaleY: isBlinking ? 0.05 : 1 }}
                     className="w-6 h-6 bg-[#FFCC00] rounded-full shadow-[0_0_30px_#FFCC00]"
                   >
                     <div className="w-2.5 h-2.5 bg-white rounded-full mt-1 ml-1 opacity-70 blur-[0.5px]" />
                   </motion.div>
                 ))}
              </motion.div>
           </div>
           
           {/* Antenna */}
           <div className="absolute -right-8 top-6 z-10">
              <div className="w-[2px] h-24 bg-white/20" />
              <motion.div 
                animate={{ backgroundColor: ['#FFCC00', '#FFEB3B', '#FFCC00'], boxShadow: '0 0 20px #FFCC00' }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-5 -left-2 w-5 h-5 rounded-full"
              />
           </div>
        </motion.div>

      </div>
    </div>
  );
};
