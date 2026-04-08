import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { animateSectionHeader, animateOnScroll } from '../../animations/scrollAnimations';
import { pageEnter, pageLeave } from '../../animations/pageTransitions';

const projects = [
  {
    id: 'P_01',
    title: 'ARCHIVE_OS',
    desc: 'VIRTUAL TERMINAL INTERFACE FOR LOW-LATENCY MONITORING.',
    tech: ['Node.js', 'React', 'GSAP'],
    status: 'ACTIVE',
    analysis: 'A custom operating system shell designed for real-time visualization of architectural blueprints. Leverages zero-latency data pipelines and high-intensity visualization logic to provide a unique system dashboard for mission-critical operations.'
  },
  {
    id: 'P_02',
    title: 'NEURAL_ROUTING',
    desc: 'AI-DRIVEN TRAFFIC LOAD BALANCER FOR MULTI-CLOUD.',
    tech: ['Python', 'TensorFlow', 'gRPC'],
    status: 'STABLE',
    analysis: 'Implemented a sophisticated neural-net that predicts traffic spikes and scales infrastructure with 99.9% accuracy. Capable of routing signals through optimized nodes in multi-cloud clusters to minimize latency and ensure high-availability system performance.'
  },
  {
    id: 'P_03',
    title: 'KERNEL_VOID',
    desc: 'DISTRIBUTED DATABASE ENGINE FOR VECTOR QUERIES.',
    tech: ['Go', 'PostgreSQL', 'Docker'],
    status: 'EXPERIMENTAL',
    analysis: 'A revolutionary database core focused on vector embeddings and sub-millisecond retrieval. Built with a focus on data integrity in extreme load environments, Kernel_Void acts as the backbone for high-performance AI system integration and large-scale data analysis.'
  }
];

const ProjectCard = ({ p, index, onSelect }: { p: any, index: number, onSelect: (p: any) => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    animateOnScroll(cardRef.current, index);
  }, { scope: cardRef });

  const onHover = () => {
    gsap.to(cardRef.current, { scale: 1.02, borderColor: 'var(--theme-color)', duration: 0.2, ease: 'power2.out' });
  };

  const onLeave = () => {
    gsap.to(cardRef.current, { scale: 1, borderColor: '#333', duration: 0.2, ease: 'power2.out' });
  };

  const onClick = () => {
    gsap.to(cardRef.current, { backgroundColor: 'var(--theme-color)', opacity: 0.8, duration: 0.05, yoyo: true, repeat: 1 });
    onSelect(p);
  };

  return (
    <div 
      ref={cardRef}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className="bg-dark/50 border border-[#333] p-6 md:p-8 cursor-pointer transition-all flex flex-col h-full relative opacity-0"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="text-[0.65rem] text-theme tracking-widest font-mono">[ {p.id} ]</div>
        <div className={`text-[0.55rem] px-2 py-0.5 bg-black border border-[#444] tracking-widest font-mono ${p.status === 'ACTIVE' ? 'text-green-400 border-green-900/50' : p.status === 'STABLE' ? 'text-blue-400 border-blue-900/50' : 'text-yellow-500 border-yellow-900/50'}`}>
          {p.status}
        </div>
      </div>
      <h3 className="text-2xl md:text-3xl mb-4 font-heading group-hover:text-theme transition-colors leading-none">{p.title}</h3>
      <p className="text-xs md:text-sm text-grey leading-relaxed flex-grow font-mono opacity-80">{p.desc}</p>
      
      <div className="mt-8 pt-6 border-t border-[#222]">
        <div className="text-[0.6rem] text-theme uppercase tracking-widest mb-4 font-mono">{p.tech.join(' / ')}</div>
        <button className="w-full bg-transparent border border-white text-white py-3 text-[0.7rem] uppercase tracking-widest font-mono font-bold hover:bg-theme hover:border-theme transition-colors">
          INITIALIZE_VIEW
        </button>
      </div>
    </div>
  );
};

export const ProjectBlueprints = () => {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    animateSectionHeader(headerRef.current);
  }, { scope: containerRef });

  useGSAP(() => {
    if (selectedProject && panelRef.current) {
      pageEnter(panelRef.current);
    }
  }, [selectedProject]);

  const handleClose = async () => {
    if (panelRef.current) {
      const tl = pageLeave(panelRef.current);
      await tl?.then(() => setSelectedProject(null));
    } else {
      setSelectedProject(null);
    }
  };

  return (
    <section id="blueprints" ref={containerRef} className="flex flex-col gap-10 px-4 md:px-0 mt-20 scroll-mt-24">
      <div className="flex justify-between items-baseline border-b border-[#222] pb-6">
        <h2 ref={headerRef} className="text-4xl md:text-6xl font-heading uppercase text-white opacity-0">PROJECT_BLUEPRINTS</h2>
        <span className="text-theme text-xl md:text-2xl font-bold font-mono">X03</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p, index) => (
          <ProjectCard key={p.id} p={p} index={index} onSelect={setSelectedProject} />
        ))}
      </div>

      {selectedProject && (
        <div className="fixed inset-0 bg-black/95 z-[10003] flex items-end md:items-center px-0 md:px-4">
          <div 
            ref={panelRef}
            className="w-full max-w-6xl mx-auto bg-black border-t-2 md:border-2 border-theme p-6 md:p-12 max-h-[95vh] overflow-y-auto relative opacity-0 shadow-2xl"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-[#222] pb-6">
              <h2 className="text-2xl md:text-5xl font-heading uppercase leading-none">PROJECT_ANALYSIS: {selectedProject.title}</h2>
              <button 
                className="bg-transparent border border-theme text-theme px-6 py-3 text-xs md:text-sm uppercase tracking-widest font-mono hover:bg-theme/10 transition-colors w-full md:w-auto"
                onClick={handleClose}
              >
                CLOSE_TERMINAL [X]
              </button>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <h4 className="text-theme text-[0.6rem] md:text-xs tracking-[0.2em] font-mono opacity-60 uppercase">- ARCHITECTURE_OVERVIEW -</h4>
                <p className="text-grey text-base md:text-lg leading-relaxed md:leading-loose max-w-4xl font-mono">{selectedProject.analysis}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#111]">
                <div className="space-y-1">
                  <label className="text-theme text-[0.6rem] block tracking-widest uppercase font-mono">NODE_ID</label>
                  <span className="text-xl md:text-2xl font-heading block">{selectedProject.id}</span>
                </div>
                <div className="space-y-1">
                  <label className="text-theme text-[0.6rem] block tracking-widest uppercase font-mono">TECH_STACK</label>
                  <span className="text-grey text-lg md:text-xl font-heading block uppercase">{selectedProject.tech.join(' , ')}</span>
                </div>
                <div className="space-y-1">
                  <label className="text-theme text-[0.6rem] block tracking-widest uppercase font-mono">GITHUB_SIGNAL</label>
                  <a href="https://github.com/RohitKSahoo" target="_blank" className="text-xl md:text-2xl font-heading text-theme hover:underline block uppercase">ACCESS_HUB</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
