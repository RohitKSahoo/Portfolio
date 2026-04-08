import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { animateSectionHeader, animateOnScroll } from '../../animations/scrollAnimations';

const CapabilityBlock = ({ title, items, index }: { title: string, items: string[], index: number }) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    animateOnScroll(ref.current, index);
  }, { scope: ref });

  return (
    <div 
      ref={ref}
      className="capability-block border border-theme p-6 md:p-8 bg-white/[0.01] relative overflow-hidden group opacity-0"
    >
      <div className="font-heading text-theme text-lg md:text-xl mb-6 pb-2 border-b border-[#222] tracking-widest uppercase">[ {title} ]</div>
      <ul className="list-none space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-grey text-xs md:text-sm flex items-center gap-3 uppercase font-mono">
            <span className="text-theme text-[0.6rem]">►</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const CoreCapabilities = () => {
  const headerRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    animateSectionHeader(headerRef.current);
  });

  return (
    <section id="capabilities" className="flex flex-col gap-8 px-4 md:px-0 scroll-mt-24">
      <h2 
        ref={headerRef}
        className="glitch text-4xl md:text-6xl text-white mb-4 leading-none opacity-0" 
        data-text="CORE_CAPABILITIES"
      >
        CORE_CAPABILITIES
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <CapabilityBlock 
          title="BACKEND" 
          index={0}
          items={["Node.js", "Python", "Go", "PostgreSQL", "Redis"]} 
        />
        <CapabilityBlock 
          title="AI_INTELLIGENCE" 
          index={1}
          items={["PyTorch", "TensorFlow", "Vector DBs", "LLM Pipelines"]} 
        />
        <CapabilityBlock 
          title="INFRASTRUCTURE" 
          index={2}
          items={["Docker", "Kubernetes", "Cloud Native", "System Scaling"]} 
        />
      </div>
    </section>
  );
};
