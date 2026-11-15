import React, { memo, useState, useEffect } from 'react';
import FibreArc from '@/components/originkit/ui/hero-68/fibre-arc';
import PulseLines from '@/components/originkit/ui/hero-68/pulse-lines';

interface HeroBackgroundProps {
  className?: string;
}

export const HeroBackground: React.FC<HeroBackgroundProps> = memo(({ className = '' }) => {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 768;
  });

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    setIsDesktop(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-0 pointer-events-none overflow-hidden select-none ${className}`}
      style={{
        '--line': 'rgba(255, 255, 255, 0.08)',
        '--wrap': '1254px',
        '--gut': '30px',
      } as React.CSSProperties}
    >
      {/* WebGL Chromatic Twisted Ribbon Arc (Desktop Only - Disabled on Mobile for Maximum Performance) */}
      {isDesktop ? (
        <FibreArc 
          background="#08070E" 
          ink="#FFFFFF" 
          glow={70} 
          style={{ position: 'absolute', inset: 0 }} 
        />
      ) : (
        /* Dynamic Living Ambient Gradient for Mobile (Hardware Composited via CSS Keyframes) */
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[#08070E]">
          {/* Chromatic Arc Ribbon Sweep: Neon Violet & Magenta (Fibre Arc style) */}
          <div 
            className="absolute top-[6%] -left-[18%] w-[136vw] h-[48vh] rounded-[100%] pointer-events-none blur-[45px] transform-gpu will-change-transform"
            style={{
              background: 'linear-gradient(135deg, rgba(45, 0, 247, 0.55) 0%, rgba(161, 0, 242, 0.68) 40%, rgba(242, 0, 137, 0.60) 75%, transparent 100%)',
              animation: 'ambient-arc-sweep 14s ease-in-out infinite alternate',
              mixBlendMode: 'screen'
            }}
          />

          {/* Drifting Chromatic Orb 1: Electric Violet */}
          <div 
            className="absolute -top-[12%] -left-[12%] w-[125vw] h-[65vh] rounded-full pointer-events-none blur-[55px] transform-gpu will-change-transform"
            style={{
              background: 'radial-gradient(circle, rgba(161, 0, 242, 0.52) 0%, rgba(106, 0, 244, 0.30) 35%, rgba(106, 0, 244, 0.08) 60%, transparent 80%)',
              animation: 'ambient-float-1 15s ease-in-out infinite alternate'
            }}
          />

          {/* Drifting Chromatic Orb 2: Hot Magenta / Pink */}
          <div 
            className="absolute top-[20%] -right-[12%] w-[115vw] h-[60vh] rounded-full pointer-events-none blur-[60px] transform-gpu will-change-transform"
            style={{
              background: 'radial-gradient(circle, rgba(242, 0, 137, 0.48) 0%, rgba(219, 0, 182, 0.25) 40%, rgba(242, 0, 137, 0.06) 65%, transparent 80%)',
              animation: 'ambient-float-2 18s ease-in-out infinite alternate'
            }}
          />

          {/* Breathing Base Glow: Deep Indigo / Electric Blue */}
          <div 
            className="absolute top-[10%] left-[6%] w-[100vw] h-[48vh] rounded-full pointer-events-none blur-[70px] transform-gpu will-change-transform"
            style={{
              background: 'radial-gradient(circle, rgba(45, 0, 247, 0.38) 0%, rgba(106, 0, 244, 0.18) 45%, transparent 70%)',
              animation: 'ambient-pulse-slow 11s ease-in-out infinite alternate'
            }}
          />
        </div>
      )}

      {/* Grid Alignment Matrix with Animated Laser Pulses (Desktop Only - Disabled on Mobile for Maximum Performance) */}
      {isDesktop && (
        <div 
          className="hidden md:block absolute inset-0 pointer-events-none" 
          aria-hidden="true"
        >
          <div 
            className="h-full mx-auto grid grid-cols-3"
            style={{
              width: 'min(var(--wrap), 100% - 48px)',
              gap: 'var(--gut)',
            }}
          >
            {[99, 66, 33].map((speed) => (
              <div key={speed} className="relative h-full">
                <PulseLines
                  gap={100000}
                  lineWidth={2}
                  pulseWidth={6}
                  duration={5}
                  speed={speed}
                  backgroundColor="transparent"
                  lineColor="rgba(255, 255, 255, 0.08)"
                  colors={{ paletteCount: 2, color1: '#6A00F4', color2: '#F20089' }}
                />
              </div>
            ))}
          </div>

          {/* Horizontal Reference Guideline */}
          <span 
            className="absolute left-0 right-0 border-t border-[rgba(255,255,255,0.08)] pointer-events-none" 
            style={{ top: '29.1%' }} 
          />
        </div>
      )}

      {/* Ambient Depth Vignette for Optimal Content Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
    </div>
  );
});

export default HeroBackground;
