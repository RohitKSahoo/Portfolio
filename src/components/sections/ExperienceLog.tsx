import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { animateSectionHeader } from '../../animations/scrollAnimations';

const ExperienceEntry = ({ id, role, org, duration, achievements, index }: { id: string, role: string, org: string, duration: string, achievements: string[], index: number }) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        delay: index * 0.1,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 90%',
          once: true
        }
      }
    );
  }, { scope: ref });

  return (
    <div 
      ref={ref}
      className="flex gap-4 md:gap-10 position-relative pb-12 border-l border-[#222] pl-6 md:pl-10 relative group opacity-0"
    >
      <div className="absolute top-0 -left-[5px] w-2.5 h-2.5 bg-theme shadow-[0_0_10px_var(--theme-color)]" />
      <div className="text-[0.6rem] md:text-[0.65rem] text-theme w-16 md:w-20 shrink-0 font-mono">[ {id} ]</div>
      <div className="flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline gap-2 mb-2">
          <h3 className="text-2xl md:text-3xl text-white font-heading">{role}</h3>
          <span className="text-[0.65rem] md:text-sm text-grey font-mono">{duration} / ARCHIVE_ACTIVE</span>
        </div>
        <div className="text-[0.75rem] md:text-sm text-theme uppercase font-bold mb-6 tracking-widest font-heading">{org} // DATA_NODE</div>
        <ul className="list-none space-y-3 max-w-3xl">
          {achievements.map((item, i) => (
            <li key={i} className="text-grey text-xs md:text-sm leading-relaxed relative pl-4 before:content-['-'] before:absolute before:left-0 before:text-theme before:font-bold">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const ExperienceLog = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    animateSectionHeader(headerRef.current);
  }, { scope: containerRef });

  return (
    <section id="experience" ref={containerRef} className="flex flex-col gap-10 px-4 md:px-0 mt-20 scroll-mt-24">
      <h2 
        ref={headerRef}
        className="glitch text-4xl md:text-6xl text-white mb-4 leading-none opacity-0" 
        data-text="EXPERIENCE_LOG"
      >
        EXPERIENCE_LOG
      </h2>
      
      <div className="flex flex-col">
        <ExperienceEntry 
          id="ENTRY_01"
          role="BACKEND_DEVELOPER"
          org="XYZ SYSTEMS"
          duration="2024-PRESENT"
          achievements={[
            "BUILT ARCHITECTURE FOR HIGH-CONCURRENCY NODE INFRASTRUCTURE HANDLING 100K+ RPS.",
            "IMPROVED API DATA STREAM THROUGHPUT BY 45% USING CUSTOM GOLANG MIDDLEWARE.",
            "OPTIMIZED POSTGRESQL QUERY EXECUTION TRACE IN CLOUD ENVIRONMENTS."
          ]}
          index={0}
        />
        <ExperienceEntry 
          id="ENTRY_02"
          role="AI_ENGINEER_INTERN"
          org="NEBULA_AI"
          duration="2023-2024"
          achievements={[
            "CALIBRATED MODEL PARAMETERS FOR REAL-TIME IMAGE RECOGNITION CLUSTERS.",
            "MAPPED DISTRIBUTED NEURAL DATASTREAMS ACROSS MULTI-NODE ENVIRONMENTS.",
            "INTEGRATED LLM AGENTS FOR AUTOMATED SYSTEM HEALING AND ERROR RECOVERY."
          ]}
          index={1}
        />
      </div>
    </section>
  );
};
