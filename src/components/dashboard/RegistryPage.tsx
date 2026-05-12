import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Terminal, Zap, ArrowLeft, ArrowRight, Shield, AlertTriangle } from 'lucide-react';
import Folder from '../effects/Folder';
import { MagicBentoCard } from '../effects/MagicBento';
import TextType from '../effects/TextType';
import { PROJECTS } from './data';

const phoneVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction > 0 ? -300 : 300,
    opacity: 0
  })
};

const laptopVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 500 : -500,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction > 0 ? -500 : 500,
    opacity: 0
  })
};

const fullscreenVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0
  })
};

export const RegistryPage = () => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const activeProject = PROJECTS.find(p => p.id === selectedId) || PROJECTS[0];
  const gridRef = React.useRef<HTMLDivElement>(null);
  const detailRef = React.useRef<HTMLDivElement>(null);
  const [[page, direction], setPage] = React.useState([0, 0]);
  const [isPaused, setIsPaused] = React.useState(false);
  const [fullscreenImageIndex, setFullscreenImageIndex] = React.useState<number | null>(null);
  const [[fullscreenPage, fullscreenDirection], setFullscreenPage] = React.useState([0, 0]);
  const [isBooting, setIsBooting] = React.useState(false);
  const [bootProgress, setBootProgress] = React.useState(0);

  React.useEffect(() => {
    const container = document.querySelector('.custom-scrollbar');
    if (container) {
      const prevScrollBehavior = (container as HTMLElement).style.scrollBehavior;
      (container as HTMLElement).style.scrollBehavior = 'auto';
      container.scrollTop = 0;
      
      const timer = setTimeout(() => {
        (container as HTMLElement).style.scrollBehavior = prevScrollBehavior;
        if (selectedId && detailRef.current) {
          detailRef.current.scrollIntoView({ behavior: 'auto' });
        }
      }, 50);
      
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
      if (selectedId && detailRef.current) {
        detailRef.current.scrollIntoView({ behavior: 'auto' });
      }
    }
  }, [selectedId]);

  const imageIndex = React.useMemo(() => {
    if (!activeProject.images || activeProject.images.length === 0) return 0;
    return (page % activeProject.images.length + activeProject.images.length) % activeProject.images.length;
  }, [page, activeProject.images]);

  React.useEffect(() => {
    setPage([0, 0]);
    setIsPaused(false);
    setIsBooting(true);
    setBootProgress(0);
    
    const interval = setInterval(() => {
      setBootProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 15); // 15ms * 100 steps = 1500ms
    
    const timer = setTimeout(() => setIsBooting(false), 2000); // 2 seconds boot
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [selectedId]);

  const paginate = React.useCallback((newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  React.useEffect(() => {
    if (!activeProject.images || activeProject.images.length <= 1 || isPaused) return;
    
    const timer = setInterval(() => {
      paginate(1);
    }, 3000);
    
    return () => clearInterval(timer);
  }, [activeProject.images, paginate, isPaused]);

  // Keyboard navigation for fullscreen image view
  React.useEffect(() => {
    if (fullscreenImageIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setFullscreenPage((prev) => [prev[0] - 1, -1]);
      } else if (e.key === 'ArrowRight') {
        setFullscreenPage((prev) => [prev[0] + 1, 1]);
      } else if (e.key === 'Escape') {
        setFullscreenImageIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenImageIndex]);

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
                onClick={() => { setSelectedId(project.id); }}
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
          key={selectedId}
          ref={detailRef}
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
            <div className="flex-[1.2] flex flex-col gap-6">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold font-satoshi tracking-tight text-white mb-3 break-words">
                  {activeProject.name}
                </h2>
                <div className="w-10 h-0.5 bg-red-500 mb-4" />
                
                {/* Stack Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {activeProject.stack.map(tech => (
                    <span key={tech} className="text-[0.65rem] font-satoshi font-medium text-red-500 border border-red-500/20 bg-red-500/5 px-2 py-0.5 rounded uppercase tracking-wider">
                      {tech}
                    </span>
                  ))}
                </div>

                <p className="text-base text-white/60 max-w-lg leading-relaxed font-inter">
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
            </div>

            {/* Right Column (Waveform) */}
            <div className="flex-1 min-h-0 relative flex justify-center">
              {activeProject.images && activeProject.images.length > 0 ? (
                ['PAUSIFY', 'SOSAFE', 'SIFER'].some(name => activeProject.name.toUpperCase().includes(name)) ? (
                  // Android Phone Frame
                  <div className="relative border-[8px] border-[#1a1a1a] bg-[#0d0d0d] rounded-[1.5rem] h-[670px] w-[300px] shadow-2xl overflow-hidden transform lg:translate-x-20 translate-x-0">
                    {/* Punch-hole Camera */}
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#0a0a0a] rounded-full z-10 flex items-center justify-center border border-[#222]">
                      <div className="w-1.5 h-1.5 bg-[#151515] rounded-full"></div>
                    </div>
                    
                    {/* Screen Content */}
                    <div 
                      className="w-full h-full overflow-hidden flex items-center justify-center bg-black relative"
                      onMouseEnter={() => setIsPaused(true)}
                      onMouseLeave={() => setIsPaused(false)}
                    >
                      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                        <motion.img 
                          key={page}
                          src={activeProject.images[imageIndex]} 
                          custom={direction}
                          variants={phoneVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          onDragEnd={(_, info) => {
                            if (info.offset.x < -50) {
                              paginate(1);
                            } else if (info.offset.x > 50) {
                              paginate(-1);
                            }
                          }}
                          onClick={() => {
                            setFullscreenImageIndex(imageIndex);
                            setFullscreenPage([imageIndex, 0]);
                          }}
                          className="absolute w-full h-full object-cover cursor-pointer cursor-target" 
                          alt="Preview" 
                        />
                      </AnimatePresence>

                      {/* Booting Animation Overlay */}
                      <AnimatePresence>
                        {isBooting && (
                          <motion.div 
                            className="absolute inset-0 bg-black flex flex-col items-center justify-center font-satoshi text-white z-20"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            {/* Android Icon */}
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-[#3DDC84] mb-4">
                              {/* Head */}
                              <path d="M12 2C8.7 2 6 4.7 6 8H18C18 5.7 15.3 2 12 2Z" />
                              {/* Body */}
                              <rect x="6" y="9.5" width="12" height="10" rx="1.5" />
                              {/* Arms */}
                              <rect x="2.5" y="9.5" width="2.5" height="7.5" rx="1.25" />
                              <rect x="19" y="9.5" width="2.5" height="7.5" rx="1.25" />
                              {/* Legs */}
                              <rect x="8.5" y="19.5" width="2.5" height="3.5" rx="1.25" />
                              <rect x="13" y="19.5" width="2.5" height="3.5" rx="1.25" />
                              {/* Antennas */}
                              <line x1="7.5" y1="0.5" x2="9.5" y2="2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              <line x1="16.5" y1="0.5" x2="14.5" y2="2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              {/* Eyes */}
                              <circle cx="10" cy="5.5" r="0.75" fill="#0d0d0d" />
                              <circle cx="14" cy="5.5" r="0.75" fill="#0d0d0d" />
                            </svg>
                            <div className="flex flex-col gap-1 items-start w-48">
                              <div className="flex justify-between w-full text-[0.6rem] font-bold tracking-wider">
                                <span>SYSTEM_BOOTING</span>
                                <span>{bootProgress}%</span>
                              </div>
                              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-white"
                                  style={{ width: `${bootProgress}%` }}
                                />
                              </div>
                              <span className="text-[0.5rem] text-white/30 truncate w-full">made by rohitksahoo</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>


                  </div>
                ) : (
                  // Laptop Frame
                  <div className="flex flex-col items-center justify-center h-full w-full max-w-[660px]">
                    {/* Laptop Screen */}
                    <div 
                      className="relative border-[8px] border-[#1a1a1a] bg-[#0d0d0d] rounded-t-lg w-[90vw] max-w-[360px] h-[56vw] max-h-[225px] lg:max-w-none lg:max-h-none lg:w-[600px] lg:h-[380px] overflow-hidden shadow-2xl"
                      onMouseEnter={() => setIsPaused(true)}
                      onMouseLeave={() => setIsPaused(false)}
                    >
                      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                        <motion.img 
                          key={page}
                          src={activeProject.images[imageIndex]} 
                          custom={direction}
                          variants={laptopVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          onDragEnd={(_, info) => {
                            if (info.offset.x < -50) {
                              paginate(1);
                            } else if (info.offset.x > 50) {
                              paginate(-1);
                            }
                          }}
                          onClick={() => {
                            setFullscreenImageIndex(imageIndex);
                            setFullscreenPage([imageIndex, 0]);
                          }}
                          className="absolute w-full h-full object-contain cursor-pointer cursor-target scale-95" 
                          alt="Preview" 
                        />
                      </AnimatePresence>

                      {/* Booting Animation Overlay */}
                      <AnimatePresence>
                        {isBooting && (
                          <motion.div 
                            className="absolute inset-0 bg-black flex flex-col items-center justify-center font-satoshi text-white z-20"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            {/* Windows Icon */}
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-[#0078D7] mb-4">
                              <rect x="2" y="2" width="9.5" height="9.5" />
                              <rect x="12.5" y="2" width="9.5" height="9.5" />
                              <rect x="2" y="12.5" width="9.5" height="9.5" />
                              <rect x="12.5" y="12.5" width="9.5" height="9.5" />
                            </svg>
                            <div className="flex flex-col gap-1 items-start w-48">
                              <div className="flex justify-between w-full text-[0.6rem] font-bold tracking-wider">
                                <span>SYSTEM_BOOTING</span>
                                <span>{bootProgress}%</span>
                              </div>
                              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-white"
                                  style={{ width: `${bootProgress}%` }}
                                />
                              </div>
                              <span className="text-[0.5rem] text-white/30 truncate w-full">made by rohitksahoo</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {/* Laptop Base */}
                    <div className="relative h-[14px] w-[98vw] max-w-[390px] lg:max-w-none lg:w-[660px] bg-[#333] rounded-b-lg border-t border-white/10 shadow-xl">
                      {/* Notch to open */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-[#1a1a1a] rounded-b-md"></div>
                    </div>
                  </div>
                )
              ) : (
                <div className="w-full h-full min-h-[350px] lg:max-h-[600px] bg-[#0d0d0d] border border-white/5 rounded-2xl overflow-hidden flex flex-col p-6">
                  <div className="flex-1 flex items-center justify-center relative overflow-hidden max-h-[500px]">
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
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm font-bold font-satoshi text-white">
                        LIVE_UPLINK
                      </span>
                    </div>
                    <span className="text-[0.6rem] font-satoshi font-medium text-white/30 uppercase tracking-wider">
                      Real-Time Voice Detection
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fullscreen Image View */}
          {fullscreenImageIndex !== null && (
            <div 
              className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center"
              onClick={() => setFullscreenImageIndex(null)}
            >
              {/* Navigation buttons (Moved to sides) */}
              {activeProject.images.length > 1 && (
                <>
                  <button 
                    className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 p-4 rounded-full text-white border border-white/10 hover:border-white/30 transition-all cursor-target z-[310]"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFullscreenPage([fullscreenPage - 1, -1]);
                    }}
                  >
                    <ArrowLeft size={28} />
                  </button>
                  <button 
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 p-4 rounded-full text-white border border-white/10 hover:border-white/30 transition-all cursor-target z-[310]"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFullscreenPage([fullscreenPage + 1, 1]);
                    }}
                  >
                    <ArrowRight size={28} />
                  </button>
                </>
              )}

              <div className="relative w-full h-full flex items-center justify-center p-4">
                <div 
                  className="relative max-w-[75vw] max-h-[85vh] flex items-center justify-center overflow-hidden"
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image or controls
                >
                  <AnimatePresence mode="popLayout" initial={false} custom={fullscreenDirection}>
                    <motion.img 
                      key={fullscreenPage}
                      src={activeProject.images[(fullscreenPage % activeProject.images.length + activeProject.images.length) % activeProject.images.length]} 
                      custom={fullscreenDirection}
                      variants={fullscreenVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -50) {
                          setFullscreenPage([fullscreenPage + 1, 1]);
                        } else if (info.offset.x > 50) {
                          setFullscreenPage([fullscreenPage - 1, -1]);
                        }
                      }}
                      className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10 cursor-grab active:cursor-grabbing"
                      alt="Fullscreen Preview"
                    />
                  </AnimatePresence>
                  
                  {/* Image Counter */}
                  {activeProject.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 px-4 py-1.5 rounded-full text-xs font-satoshi font-medium text-white/70 border border-white/10 z-[310]">
                      {(fullscreenPage % activeProject.images.length + activeProject.images.length) % activeProject.images.length + 1} / {activeProject.images.length}
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <button 
                className="absolute top-8 right-8 bg-black/60 hover:bg-black/80 p-3 rounded-full text-white border border-white/10 hover:border-white/30 transition-all cursor-target z-[310]"
                onClick={(e) => {
                  e.stopPropagation();
                  setFullscreenImageIndex(null);
                }}
              >
                <span className="text-sm font-bold px-1">✕</span>
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegistryPage;
