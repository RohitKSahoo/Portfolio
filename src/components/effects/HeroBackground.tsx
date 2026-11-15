import React, { memo } from 'react';
import FibreArc from '@/components/originkit/ui/hero-68/fibre-arc';
import PulseLines from '@/components/originkit/ui/hero-68/pulse-lines';

interface HeroBackgroundProps {
  className?: string;
}

export const HeroBackground: React.FC<HeroBackgroundProps> = memo(({ className = '' }) => {
  return (
    <div 
      className={`fixed inset-0 z-0 pointer-events-none overflow-hidden select-none ${className}`}
      style={{
        '--line': 'rgba(255, 255, 255, 0.08)',
        '--wrap': '1254px',
        '--gut': '30px',
      } as React.CSSProperties}
    >
      {/* WebGL Chromatic Twisted Ribbon Arc */}
      <FibreArc 
        background="#08070E" 
        ink="#FFFFFF" 
        glow={70} 
        style={{ position: 'absolute', inset: 0 }} 
      />

      {/* Grid Alignment Matrix with Animated Laser Pulses */}
      <div 
        className="absolute inset-0 pointer-events-none" 
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

      {/* Ambient Depth Vignette for Optimal Content Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
    </div>
  );
});

export default HeroBackground;
