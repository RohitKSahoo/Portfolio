import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { animateSectionHeader } from '../../animations/scrollAnimations';

export const MissionDirective = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const [displayText, setDisplayText] = useState("");
  const fullText = "SYSTEMS ARCHITECT FOCUSED ON HIGH-CONCURRENCY BACKEND NODE INFRASTRUCTURE AND AI MODEL INTEGRATION. I ENGINEER ROBUST, SCALABLE SOLUTIONS THAT PRIORITIZE COMPUTATIONAL EFFICIENCY AND RAW DATA PROCESSING SPEED.";

  useGSAP(() => {
    animateSectionHeader(headerRef.current);
  }, { scope: containerRef });

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="mission"
      ref={containerRef}
      className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-[2px] bg-theme border-2 border-theme min-h-fit md:min-h-[600px] relative overflow-hidden scroll-mt-24 opacity-1 mb-12 md:mb-24"
    >
      <div className="profile-video-box bg-black/40 relative overflow-hidden h-[400px] md:h-auto border-r border-theme/20">
        <video autoPlay muted loop playsInline className="w-full h-full object-contain">
          <source src="/assets/video/character.mp4" type="video/mp4" />
        </video>
        <div className="absolute bottom-4 left-4 text-[0.5rem] md:text-[0.6rem] text-theme z-10 font-mono bg-black/50 px-2 py-1">
          IMAGE_REF: 0x8842 // SUBJECT: RKS
        </div>
      </div>
      
      <div className="mission-content bg-black p-8 md:p-14 flex flex-col justify-between gap-12">
        <div className="mission-header">
          <h2 ref={headerRef} className="text-3xl md:text-[4rem] mb-8 leading-none opacity-0">MISSION_DIRECTIVE</h2>
          <div className="mission-text-container p-6 md:p-8 border-l-4 border-white bg-white/5 min-h-[140px]">
             <div className="text-base md:text-lg text-grey leading-relaxed max-w-[700px] font-mono">
              {displayText}
              <span className="inline-block w-[12px] h-[1.2em] bg-theme ml-1 align-middle animate-[caret-blink_1s_steps(2,start)_infinite]">_</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="border border-theme p-6 md:p-8 bg-white/[0.01] hover:bg-theme/5 transition-colors">
            <h3 className="text-xl md:text-2xl mb-4 font-heading tracking-widest">CODE_LOGIC</h3>
            <p className="text-[0.7rem] md:text-sm text-grey uppercase tracking-widest font-mono leading-loose">
              PYTHON / GO / NODE.JS<br />
              KUBERNETES / DOCKER<br />
              POSTGRESQL / REDIS
            </p>
          </div>
          <div className="border border-theme p-6 md:p-8 bg-white/[0.01] hover:bg-theme/5 transition-colors">
            <h3 className="text-xl md:text-2xl mb-4 font-heading tracking-widest">NEURAL_NET</h3>
            <p className="text-[0.7rem] md:text-sm text-grey uppercase tracking-widest font-mono leading-loose">
              PYTORCH / TENSORFLOW<br />
              LLM_ORCHESTRATION<br />
              VECTOR_DATABASES
            </p>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes caret-blink {
          to { visibility: hidden; }
        }
      `}} />
    </section>
  );
};
