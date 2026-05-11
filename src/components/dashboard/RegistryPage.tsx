import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Terminal, Zap, ArrowLeft, ArrowRight, Shield, AlertTriangle } from 'lucide-react';
import Folder from '../effects/Folder';
import { MagicBentoCard } from '../effects/MagicBento';
import TextType from '../effects/TextType';
import { PROJECTS } from './data';

export const RegistryPage = () => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [currentImgIdx, setCurrentImgIdx] = React.useState(0);
  const activeProject = PROJECTS.find(p => p.id === selectedId) || PROJECTS[0];
  const gridRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!activeProject.images || activeProject.images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImgIdx((prev) => (prev === activeProject.images.length - 1 ? 0 : prev + 1));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [activeProject.images, currentImgIdx]);

  const getFolderItems = (project: typeof PROJECTS[0]) => [
    <div key="1" className="w-full h-full flex flex-col items-center justify-center p-2 bg-[#0c0c0c] text-[var(--theme-accent)] overflow-hidden font-satoshi">
      <div className="w-full flex justify-between items-center opacity-40 mb-1">
        <span className="text-[0.5rem] font-medium tracking-wider">TRACE_0x{project.id.slice(-2)}</span>
        <Zap size={6} />
      </div>
      <div className="w-full h-px bg-[var(--theme-accent)]/20 mb-1" />
      <div className="flex flex-col gap-0.5 w-full opacity-60 text-[0.5rem]">
        <span>{">>"} PINIT_CORE...</span>
        <span>{">>"} SYSCALL_01_OK</span>
        <span>{">>"} UPLINK_READY</span>
      </div>
    </div>,
    <div key="2" className="w-full h-full flex items-center justify-center bg-black relative">
       <img src={project.images[0]} className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-500" alt="Preview" />
       <div className="absolute inset-0 bg-black/40" />
       <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-red-500 text-white text-[0.5rem] font-bold font-satoshi uppercase rounded">LIVE</div>
    </div>,
    <div key="3" className="w-full h-full flex flex-col items-center justify-center p-2 bg-[#0c0c0c] border border-red-500/20">
       <Terminal size={14} className="text-red-500 mb-1" />
       <span className="text-[0.5rem] font-bold font-satoshi text-white/40 tracking-wider">EXECUTABLE</span>
    </div>
  ];

  return (
    <AnimatePresence mode="wait">
      {!selectedId ? (
        <motion.div 
          key="grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex flex-col gap-4 pb-8 pt-0 bento-section font-inter"
        >
          <div className="flex flex-col gap-4 pt-0 relative">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
              <div className="flex flex-col gap-1 max-w-none">

                <h2 className="text-2xl lg:text-3xl font-bold font-satoshi text-white leading-tight relative group mt-1 tracking-tight">
                  <TextType 
                    text="Engineering systems that automate, optimize, and scale everyday workflows."
                    typingSpeed={40}
                    initialDelay={500}
                    loop={false}
                    cursorCharacter={<span className="inline-block w-1 h-[0.9em] bg-red-500 ml-1 align-baseline" />}
                    className="relative z-10 block transition-all duration-700 group-hover:text-red-500"
                  />
                </h2>
              </div>
            </div>
            <div className="w-full h-px bg-white/5 relative mt-2">
               <div className="absolute -top-1 -right-1 w-2 h-2 border border-white/10" />
               <div className="absolute -bottom-1 -left-1 w-2 h-2 border border-white/10" />
            </div>
          </div>
          
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 pt-4 relative">
            {PROJECTS.map((project, idx) => (
              <MagicBentoCard 
                key={project.id}
                particleCount={0}
                glowColor="239, 68, 68"
                enableTilt={false}
                enableMagnetism={false}
                clickEffect={false}
                className="flex flex-col gap-3 group cursor-pointer relative p-5 bg-[#0d0d0d] border border-white/5 transition-all duration-500 rounded-xl hover:border-white/10"
                onClick={() => { setSelectedId(project.id); setCurrentImgIdx(0); }}
              >
                <div className="absolute top-5 right-5 flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    project.status === 'STABLE' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-[0.6rem] font-satoshi font-medium text-white/30 tracking-wider">[{project.status}]</span>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-6 group-hover:translate-y-[-2px] transition-transform duration-500">
                   <div className="relative shrink-0">
                      <Folder color="#EF4444" size={0.9} items={getFolderItems(project)} />
                   </div>

                   <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                      <span className="text-[0.65rem] font-satoshi font-medium text-red-500 tracking-wider uppercase mb-0.5">
                        PRJ_MOD_0{project.id.slice(-1)}
                      </span>
                      <h3 className="text-xl font-bold font-satoshi text-white group-hover:text-red-500 transition-colors tracking-tight">
                        {project.name}
                      </h3>
                      <div className="flex flex-wrap gap-1.5 mt-2 justify-center lg:justify-start">
                        {project.stack.slice(0, 3).map(tech => (
                          <span key={tech} className="text-[0.6rem] font-satoshi font-medium text-white/40 border border-white/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                            {tech}
                          </span>
                        ))}
                      </div>
                   </div>
                </div>

                <div className="hidden lg:flex flex-col gap-2 mt-2 pt-4 border-t border-white/5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white/60 font-inter leading-relaxed line-clamp-2">
                      {project.architecture}
                    </p>
                </div>
              </MagicBentoCard>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="detail"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="flex flex-col gap-6 font-inter"
        >
          {/* Sub Header */}
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <button 
              onClick={() => setSelectedId(null)}
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-satoshi font-medium tracking-wider"
            >
              <ArrowLeft size={14} />
              <span>SYSTEM_BACK</span>
            </button>

            <a 
              href={activeProject.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#1a0a0a] text-red-500 border border-red-500/20 rounded-lg text-xs font-bold font-satoshi uppercase tracking-wider hover:bg-red-500/10 transition-all"
            >
              <Github size={14} />
              <span>VIEW SOURCE</span>
            </a>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row gap-8 lg:gap-10 min-h-0">
            {/* Left Column */}
            <div className="flex-[1.2] flex flex-col gap-6 py-2">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold font-satoshi tracking-tight text-white mb-3 break-words">
                  {activeProject.name}
                </h2>
                <div className="w-10 h-0.5 bg-red-500 mb-4" />
                <p className="text-sm text-white/60 max-w-lg leading-relaxed font-inter">
                  {activeProject.primaryDescription}
                </p>
              </div>

              {/* Metrics */}
              <div className="flex flex-row gap-2 sm:gap-4 w-full">
                {Object.entries(activeProject.metrics).map(([k, v]) => {
                  let Icon = Zap;
                  if (k === 'LATENCY' || k === 'SYNC_LATENCY' || k === 'UI_LATENCY') Icon = Zap;
                  if (k === 'RELIABILITY') Icon = Shield;
                  if (k === 'STABILITY' || k === 'FAILOVER') Icon = AlertTriangle;
                  
                  return (
                    <div key={k} className="p-3 sm:p-4 bg-[#0d0d0d] border border-white/5 rounded-xl flex flex-col sm:flex-row items-center gap-2 sm:gap-4 flex-1 min-w-0">
                      <div className="p-2 bg-red-500/10 text-red-500 rounded-lg shrink-0">
                        <Icon size={16} className="sm:w-4 sm:h-4" />
                      </div>
                      <div className="text-center sm:text-left min-w-0">
                        <span className="text-[0.6rem] sm:text-[0.65rem] font-satoshi font-medium text-white/30 uppercase block mb-0.5 tracking-wider truncate">{k}</span>
                        <span className="text-sm sm:text-sm font-bold font-satoshi text-white truncate">{v}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Core Capabilities */}
              <div>
                <span className="text-[0.65rem] font-satoshi font-medium text-white/30 uppercase block mb-3 tracking-wider">Core Capabilities</span>
                <ul className="space-y-2 font-inter">
                  {activeProject.details.map((bullet, i) => (
                    <li key={i} className="text-sm text-white/60 flex items-start gap-3">
                      <div className="w-1.5 h-1.5 mt-1.5 bg-red-500 rounded-full shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stack Tags */}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {activeProject.stack.map(tech => (
                  <span key={tech} className="text-[0.65rem] font-satoshi font-medium text-red-500 border border-red-500/20 bg-red-500/5 px-2 py-0.5 rounded uppercase tracking-wider">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column (Waveform) */}
            <div className="flex-1 min-h-0 relative">
              <div className="w-full h-full min-h-[350px] lg:max-h-[600px] bg-[#0d0d0d] border border-white/5 rounded-2xl overflow-hidden flex flex-col p-6">
                <div className="flex-1 flex items-center justify-center relative overflow-hidden max-h-[500px]">
                  {activeProject.images && activeProject.images.length > 0 ? (
                    <div className="relative w-full h-full group flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={currentImgIdx}
                          src={activeProject.images[currentImgIdx]}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                          className="max-w-full max-h-full object-contain"
                          alt={`Screenshot ${currentImgIdx + 1}`}
                        />
                      </AnimatePresence>
                      
                      {activeProject.images.length > 1 && (
                        <>
                          <button
                            onClick={() => setCurrentImgIdx((prev) => (prev === 0 ? activeProject.images.length - 1 : prev - 1))}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 border border-white/10 rounded-full text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ArrowLeft size={14} />
                          </button>
                          <button
                            onClick={() => setCurrentImgIdx((prev) => (prev === activeProject.images.length - 1 ? 0 : prev + 1))}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 border border-white/10 rounded-full text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ArrowRight size={14} />
                          </button>
                          
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {activeProject.images.map((_, idx) => (
                              <div
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full ${idx === currentImgIdx ? 'bg-red-500' : 'bg-white/20'}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <svg width="100%" height="100%" viewBox="0 0 400 200" className="opacity-70">
                      <defs>
                        <radialGradient id="waveformGlow" cx="50%" cy="50%" r="30%">
                          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <circle cx="200" cy="100" r="100" fill="url(#waveformGlow)" />
                      <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                      <path d="M 10 100 Q 30 50 50 100 T 90 100 T 130 100 T 170 100 T 210 100 T 250 100 T 290 100 T 330 100 T 370 100" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
                      <path d="M 10 100 Q 20 150 40 100 T 80 100 T 120 100 T 160 100 T 200 100 T 240 100 T 280 100 T 320 100 T 360 100" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
                      <path d="M 50 100 L 60 80 L 70 120 L 80 70 L 90 130 L 100 60 L 110 140 L 120 50 L 130 150 L 140 70 L 150 130 L 160 60 L 170 140 L 180 40 L 190 160 L 200 30 L 210 170 L 220 50 L 230 150 L 240 60 L 250 140 L 260 70 L 270 130 L 280 80 L 290 120 L 300 90 L 310 110 L 320 100" stroke="white" strokeWidth="1.5" fill="none" opacity="0.8" />
                      <path d="M 50 100 L 60 120 L 70 80 L 80 130 L 90 70 L 100 140 L 110 60 L 120 150 L 130 50 L 140 130 L 150 70 L 160 140 L 170 60 L 180 160 L 190 40 L 200 170 L 210 30 L 220 150 L 230 50 L 240 140 L 250 60 L 260 130 L 270 70 L 280 120 L 290 80 L 300 110 L 310 90 L 320 100" stroke="white" strokeWidth="1" fill="none" opacity="0.5" />
                    </svg>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-bold font-satoshi text-white">
                      {activeProject.images && activeProject.images.length > 1 ? `GALLERY [${currentImgIdx + 1}/${activeProject.images.length}]` : 'LIVE_UPLINK'}
                    </span>
                  </div>
                  <span className="text-[0.6rem] font-satoshi font-medium text-white/30 uppercase tracking-wider">
                    {activeProject.images && activeProject.images.length > 1 ? 'Project Screenshots' : 'Real-Time Voice Detection'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegistryPage;
