import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { animateHero } from '../../animations/heroAnimations';
import { useScramble } from '../../hooks/useScramble';

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { displayText } = useScramble("ROHIT KUMAR SAHOO", 1500);

  useGSAP(() => {
    animateHero(containerRef.current);
  }, { scope: containerRef });

  return (
    <header ref={containerRef} className="flex flex-col md:flex-row justify-between items-start border-b-2 border-theme pb-6 px-4 md:px-0 relative mb-0 gap-6 md:gap-0">
      <div className="name-block w-full lg:w-auto">
        <div className="system-id text-[0.6rem] md:text-[0.65rem] text-grey mb-2 opacity-0 font-mono">
          [ SYSTEM_ID: ARCHITECT_01 ]
        </div>
        <h1 
          className="hero-name glitch text-3xl sm:text-5xl md:text-6xl lg:text-[5.5rem] leading-none font-heading uppercase opacity-0 whitespace-nowrap flex items-baseline gap-2" 
          data-text="ROHIT KUMAR SAHOO"
        >
          {displayText}
          <span className="inline-block w-4 h-4 md:w-6 md:h-6 bg-theme shadow-[0_0_15px_rgba(255,0,0,0.5)] flex-shrink-0" />
        </h1>
      </div>
      
      <div className="status-block flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
        <div className="status-badge bg-theme px-4 py-2 md:px-6 md:py-3 font-heading text-xl md:text-2xl font-normal uppercase w-full md:w-auto text-center md:text-right opacity-0 transition-colors">
          STATUS: OPEN_TO_OPPORTUNITIES
        </div>
        
        <div className="coords text-[0.65rem] md:text-xs text-grey text-left md:text-right tracking-tight opacity-70">
          LOC: 28.5957° N, 76.9629° E (DELHI_NCR)<br />
          V_ARCH: BACKEND_AI_ENGINEER
        </div>
      </div>
    </header>
  );
};
