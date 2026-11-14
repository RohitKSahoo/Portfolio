import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap,
  Terminal,
  Minus,
  Square,
  X,
  Github,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import Folder from '../effects/Folder';
import { MagicBentoCard } from '../effects/MagicBento';
import { PROJECTS } from './data';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 42,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 240,
      damping: 24,
      mass: 0.85
    },
  },
};

export const RegistryPage = () => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [clickOrigin, setClickOrigin] = React.useState<{ x: number; y: number } | null>(null);
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [isMaximized, setIsMaximized] = React.useState(false);
  const [showMockupModal, setShowMockupModal] = React.useState(false);
  const activeProject = PROJECTS.find(p => p.id === selectedId) || PROJECTS[0];
  const gridRef = React.useRef<HTMLDivElement>(null);

  const handleCardClick = (projectId: string, e?: any) => {
    const target = e?.currentTarget || e?.target;
    if (target && typeof target.getBoundingClientRect === 'function') {
      const rect = target.getBoundingClientRect();
      const screenCenterX = window.innerWidth / 2;
      const screenCenterY = window.innerHeight / 2;
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      setClickOrigin({
        x: Math.round(cardCenterX - screenCenterX),
        y: Math.round(cardCenterY - screenCenterY),
      });
    } else {
      setClickOrigin(null);
    }
    setActiveImageIndex(0);
    setShowMockupModal(false);
    setSelectedId(projectId);
  };

  // Handle keyboard events (Escape to close, Left/Right for mockups)
  React.useEffect(() => {
    if (!selectedId && !showMockupModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showMockupModal) {
          setShowMockupModal(false);
        } else {
          setSelectedId(null);
        }
      }
      if (showMockupModal && activeProject.images.length > 1) {
        if (e.key === 'ArrowLeft') {
          setActiveImageIndex(prev => (prev - 1 + activeProject.images.length) % activeProject.images.length);
        } else if (e.key === 'ArrowRight') {
          setActiveImageIndex(prev => (prev + 1) % activeProject.images.length);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, showMockupModal, activeProject.images.length]);

  // Lock body scroll when window modal is active
  React.useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      setIsMaximized(false);
      setShowMockupModal(false);
    }
  }, [selectedId]);

  // Reset image carousel index and modal when selected project changes
  React.useEffect(() => {
    setActiveImageIndex(0);
    setShowMockupModal(false);
  }, [selectedId]);

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
       <img 
         src={project.images[0]} 
         loading="lazy"
         decoding="async"
         className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-opacity duration-300" 
         alt="Preview" 
       />
       <div className="absolute inset-0 bg-black/40" />
       <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-red-500 text-white text-[0.5rem] font-bold font-satoshi uppercase rounded">LIVE</div>
    </div>,
    <div key="3" className="w-full h-full flex flex-col items-center justify-center p-2 bg-[#0c0c0c] border border-red-500/20">
       <Terminal size={14} className="text-red-500 mb-1" />
       <span className="text-[0.5rem] font-bold font-satoshi text-white/40 tracking-wider">EXECUTABLE</span>
    </div>
  ];

  return (
    <div className="relative font-inter pointer-events-auto">
      {/* PROJECTS GRID */}
      <div className="flex flex-col gap-4 pb-8 pt-0 bento-section">
        <div className="flex flex-col gap-4 pt-0 relative">
          <div className="w-full h-px bg-white/5 relative mt-2">
            <div className="absolute -top-1 -right-1 w-2 h-2 border border-white/10" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 border border-white/10" />
          </div>
        </div>
        
        {/* MOBILE APP DRAWER GRID (< 768px) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-3.5 pt-2 pb-28 md:hidden relative"
        >
          {PROJECTS.map((project, idx) => (
            <motion.button
              key={project.id}
              variants={cardVariants}
              onClick={(e) => handleCardClick(project.id, e)}
              className="group relative flex flex-col items-center justify-between p-3.5 rounded-2xl bg-[#0c0d10]/85 border border-white/10 hover:border-red-500/40 active:scale-[0.95] transition-colors duration-200 overflow-hidden text-center cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.5)] focus:outline-none min-h-[164px]"
            >
              {/* Header: Index & Status */}
              <div className="w-full flex items-center justify-between text-[10px] font-mono text-white/40 mb-1">
                <span className="tracking-wider">0{idx + 1}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    project.status === 'STABLE' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                  }`} />
                  <span className="text-[9px] uppercase tracking-wider text-white/50">
                    {project.status === 'STABLE' ? 'LIVE' : 'DEV'}
                  </span>
                </div>
              </div>

              {/* Centered Folder Icon */}
              <div className="py-2 flex items-center justify-center shrink-0">
                <Folder color="#EF4444" size={0.72} items={getFolderItems(project)} />
              </div>

              {/* Title & Category */}
              <div className="w-full mt-1 flex flex-col items-center">
                <h3 className="font-satoshi font-bold text-sm text-white group-hover:text-red-400 transition-colors tracking-tight truncate max-w-full">
                  {project.name}
                </h3>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider mt-0.5 truncate max-w-full">
                  {project.category || project.stack[0]}
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* DESKTOP BENTO GRID (>= 768px) */}
        <motion.div 
          ref={gridRef} 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="hidden md:grid md:grid-cols-2 gap-x-6 gap-y-6 pt-4 relative"
        >
          {PROJECTS.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              className="h-full"
            >
              <MagicBentoCard 
                particleCount={0}
                glowColor="239, 68, 68"
                enableTilt={false}
                enableMagnetism={false}
                clickEffect={false}
                className="flex flex-col gap-3 group cursor-pointer relative p-5 bg-[#0d0d0d] border border-white/5 transition-colors duration-300 rounded-xl hover:border-white/10 h-full"
                onClick={(e) => handleCardClick(project.id, e)}
              >
                <div className="absolute top-5 right-5 flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    project.status === 'STABLE' ? 'bg-emerald-400' : 'bg-amber-400'
                  }`} />
                  <span className="text-[0.6rem] font-satoshi font-medium text-white/40 tracking-wider">[{project.status}]</span>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-6 group-hover:translate-y-[-2px] transition-transform duration-300">
                   <div className="relative shrink-0">
                      <Folder color="#EF4444" size={0.9} items={getFolderItems(project)} />
                   </div>

                   <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
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
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* PROJECT DETAILS MODAL */}
      <AnimatePresence>
        {selectedId && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-2 sm:p-4 lg:p-6 select-none font-sans">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Window Frame: Springs out like an expanding folder */}
            <motion.div
              initial={clickOrigin ? {
                opacity: 0,
                x: clickOrigin.x,
                y: clickOrigin.y,
                scale: 0.15,
              } : {
                opacity: 0,
                scale: 0.88,
                y: 25,
              }}
              animate={{
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
              }}
              exit={clickOrigin ? {
                opacity: 0,
                x: clickOrigin.x,
                y: clickOrigin.y,
                scale: 0.15,
                transition: { duration: 0.22, ease: [0.32, 0, 0.67, 0] }
              } : {
                opacity: 0,
                scale: 0.88,
                y: 20,
                transition: { duration: 0.2, ease: 'easeOut' }
              }}
              transition={{
                duration: 0.36,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`relative z-10 w-full bg-[#08080a] border border-white/10 shadow-[0_25px_90px_rgba(0,0,0,0.95),0_0_1px_rgba(255,255,255,0.2)] flex flex-col overflow-hidden will-change-transform transform-gpu ${
                isMaximized 
                  ? 'h-[98vh] max-w-[98vw] rounded-none' 
                  : 'max-h-[94dvh] sm:max-h-[92vh] h-[90dvh] sm:h-[88vh] w-[96vw] sm:w-[95vw] max-w-[1440px] rounded-2xl'
              }`}
            >
              {/* Top Bar */}
              <div className="h-12 sm:h-14 bg-[#08080a] border-b border-white/[0.08] flex items-center justify-between px-4 sm:px-8 shrink-0">
                {/* Left: Dot grid & Module tag */}
                <div className="flex items-center gap-3 text-white/50">
                  <div className="grid grid-cols-3 gap-[3px] w-3.5 h-3.5 shrink-0">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="w-[2.5px] h-[2.5px] bg-white/40 rounded-[0.5px]" />
                    ))}
                  </div>
                  <span className="text-xs font-mono tracking-wider text-white/40 uppercase">
                    SYS_PROJECT // {activeProject.id}
                  </span>
                </div>

                {/* Right: Window Controls */}
                <div className="flex items-center gap-2 sm:gap-4 text-white/50 shrink-0">
                  <button
                    onClick={() => setSelectedId(null)}
                    aria-label="Minimize"
                    className="hidden sm:inline-flex hover:text-white transition-colors cursor-pointer p-1"
                  >
                    <Minus size={15} />
                  </button>
                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    aria-label="Maximize"
                    className="hidden sm:inline-flex hover:text-white transition-colors cursor-pointer p-1"
                  >
                    <Square size={13} />
                  </button>
                  <button
                    onClick={() => setSelectedId(null)}
                    aria-label="Close"
                    className="hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer text-white/70"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Inner Content that slides up */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col flex-1 overflow-hidden"
              >
                {/* Breadcrumb Header Bar */}
                <div className="px-4 sm:px-10 pt-4 sm:pt-5 pb-3 flex items-center justify-between text-xs font-mono tracking-wider shrink-0">
                  <div className="flex items-center gap-2.5 text-white/60">
                    <span className="text-white/40">PROJECTS</span>
                    <span className="text-white/20">/</span>
                    <span className="text-white/90 font-medium">{activeProject.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-white/70">
                    <span>{activeProject.status || 'IN PROGRESS'}</span>
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                  </div>
                </div>
                <div className="mx-4 sm:mx-10 border-b border-white/[0.08]" />

                {/* Two-Column Body with smooth slide-up on project switch */}
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] p-4 sm:p-10 lg:p-12 gap-6 sm:gap-8 lg:gap-14 overflow-y-auto custom-scrollbar flex-1 items-start"
                >
                  {/* Left Column */}
                  <div className="flex flex-col h-full lg:min-h-[500px]">
                    {/* Category Header */}
                    <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-white/70 uppercase mb-3">
                      <span className="w-[3px] h-3.5 bg-red-500 inline-block" />
                      <span>{activeProject.category || 'SYSTEMS'}</span>
                    </div>

                    {/* Dot-matrix Title */}
                    <h1 className="font-doto text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white uppercase mb-4 sm:mb-6 leading-tight">
                      {activeProject.name}
                      <span className="text-red-500 font-doto">.</span>
                    </h1>

                    {/* Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2.5 mb-5 sm:mb-7">
                      {activeProject.stack.map(tech => (
                        <span
                          key={tech}
                          className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/20 bg-[#121316] text-[10px] sm:text-[11px] font-mono tracking-wider text-white/80 uppercase"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Main Description */}
                    <p className="text-sm sm:text-base text-white/60 leading-relaxed font-sans mb-6 sm:mb-8 max-w-xl">
                      {activeProject.primaryDescription}
                    </p>

                    {/* Core Capabilities */}
                    <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-white/70 uppercase mb-4">
                      <span className="w-[3px] h-3.5 bg-red-500 inline-block" />
                      <span>CORE CAPABILITIES</span>
                    </div>

                    {/* Core Capabilities List */}
                    <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-10">
                      {(activeProject.details || []).map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-white/80 font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Action CTAs: GitHub & View Mockups */}
                    <div className="flex flex-wrap items-center gap-3 mb-6 lg:mb-0 lg:mt-auto">
                      {activeProject.github && (
                        <a
                          href={activeProject.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-xl border border-white/15 bg-[#0d0e12] hover:bg-[#14151a] hover:border-red-500/50 text-white/90 hover:text-white transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(239,68,68,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <Github size={18} className="text-white/80 group-hover:text-red-400 group-hover:scale-110 transition-all" />
                          <span className="text-xs font-mono tracking-wider uppercase font-semibold">VIEW ON GITHUB</span>
                          <ExternalLink size={13} className="text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </a>
                      )}

                      {activeProject.images && activeProject.images.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowMockupModal(true)}
                          className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-xl border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/70 text-white transition-all duration-300 group cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:shadow-[0_0_25px_rgba(239,68,68,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <Eye size={18} className="text-red-400 group-hover:scale-110 transition-all" />
                          <span className="text-xs font-mono tracking-wider uppercase font-semibold">VIEW MOCKUPS</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                            {activeProject.images.length}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Column (Mockups with Asset Images - desktop side-by-side view) */}
                  <div className="hidden lg:flex lg:border-l lg:border-white/10 lg:pl-12 justify-center items-center w-full min-h-[540px] pb-6 lg:pb-0">
                    {activeProject.id === 'P_03' || activeProject.id === 'P_05' ? (
                      /* Laptop / Desktop Display Mockup */
                      <div className="relative rounded-2xl border-[2px] border-white/20 bg-[#0a0a0c] shadow-[0_20px_60px_rgba(0,0,0,0.9)] w-full max-w-[560px] aspect-[16/10] flex flex-col overflow-hidden group">
                        {/* Top Window Bar */}
                        <div className="h-7 bg-[#141518] border-b border-white/10 flex items-center justify-between px-3 shrink-0">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                            <span className="text-[10px] font-mono text-white/40 ml-2 truncate">{activeProject.name.toLowerCase()}</span>
                          </div>
                          {activeProject.images.length > 1 && (
                            <span className="text-[9px] font-mono text-white/40">
                              {activeImageIndex + 1} / {activeProject.images.length}
                            </span>
                          )}
                        </div>

                        {/* Display Image */}
                        <div className="relative w-full flex-1 bg-black overflow-hidden flex items-center justify-center">
                          <img
                            src={activeProject.images[activeImageIndex]}
                            alt={activeProject.name}
                            className="w-full h-full object-contain select-none"
                          />

                          {/* Carousel Navigation Arrows */}
                          {activeProject.images.length > 1 && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveImageIndex(prev => (prev - 1 + activeProject.images.length) % activeProject.images.length);
                                }}
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
                              >
                                <ChevronLeft size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveImageIndex(prev => (prev + 1) % activeProject.images.length);
                                }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
                              >
                                <ChevronRight size={16} />
                              </button>

                              {/* Dot Indicators */}
                              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 z-20">
                                {activeProject.images.map((_, i) => (
                                  <button
                                    key={i}
                                    onClick={(e) => { e.stopPropagation(); setActiveImageIndex(i); }}
                                    className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                                      activeImageIndex === i ? 'bg-red-500 w-3' : 'bg-white/40 hover:bg-white/70'
                                    }`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Mobile Phone Mockup */
                      <div className="relative rounded-[22px] border-[2px] border-white/20 bg-[#0a0a0c] p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] w-[245px] sm:w-[270px] aspect-[9/19.5] max-h-[550px] flex flex-col justify-between overflow-hidden group">
                        {/* Camera Punch Hole */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-black border border-white/15 z-20 shadow-inner" />

                        {/* Phone Screen Image from Asset Folder */}
                        <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-black flex items-center justify-center">
                          <img
                            src={activeProject.images[activeImageIndex]}
                            alt={activeProject.name}
                            className="w-full h-full object-cover select-none"
                          />

                          {/* Carousel Navigation Arrows */}
                          {activeProject.images.length > 1 && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveImageIndex(prev => (prev - 1 + activeProject.images.length) % activeProject.images.length);
                                }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
                              >
                                <ChevronLeft size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveImageIndex(prev => (prev + 1) % activeProject.images.length);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
                              >
                                <ChevronRight size={16} />
                              </button>

                              {/* Dot Indicators */}
                              <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 z-20">
                                {activeProject.images.map((_, i) => (
                                  <button
                                    key={i}
                                    onClick={(e) => { e.stopPropagation(); setActiveImageIndex(i); }}
                                    className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                                      activeImageIndex === i ? 'bg-red-500 w-3' : 'bg-white/40 hover:bg-white/70'
                                    }`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN MOCKUP LIGHTBOX MODAL */}
      <AnimatePresence>
        {showMockupModal && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-3 sm:p-6 select-none font-sans">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowMockupModal(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-4xl max-h-[92dvh] sm:max-h-[88vh] bg-[#0c0d10] border border-white/15 rounded-2xl flex flex-col overflow-hidden shadow-[0_25px_90px_rgba(0,0,0,0.95)]"
            >
              {/* Modal Top Bar */}
              <div className="h-12 sm:h-14 bg-[#101115] border-b border-white/10 flex items-center justify-between px-4 sm:px-6 shrink-0">
                <div className="flex items-center gap-2.5 text-xs font-mono text-white/70">
                  <span className="text-red-400 font-semibold">{activeProject.name}</span>
                  <span className="text-white/30">/</span>
                  <span className="text-white/50">MOCKUPS</span>
                  <span className="text-[10px] text-white/40 ml-1">
                    ({activeImageIndex + 1} of {activeProject.images.length})
                  </span>
                </div>

                <button
                  onClick={() => setShowMockupModal(false)}
                  className="hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer text-white/70"
                  aria-label="Close mockups"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body / Image Viewer */}
              <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 bg-black/50 overflow-hidden">
                {activeProject.id === 'P_03' || activeProject.id === 'P_05' ? (
                  /* Laptop / Desktop Display Mockup */
                  <div className="relative rounded-2xl border-[2px] border-white/20 bg-[#0a0a0c] shadow-[0_20px_60px_rgba(0,0,0,0.9)] w-full max-w-[680px] aspect-[16/10] flex flex-col overflow-hidden">
                    <div className="h-7 bg-[#141518] border-b border-white/10 flex items-center justify-between px-3 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                        <span className="text-[10px] font-mono text-white/40 ml-2 truncate">{activeProject.name.toLowerCase()}</span>
                      </div>
                      <span className="text-[9px] font-mono text-white/40">
                        {activeImageIndex + 1} / {activeProject.images.length}
                      </span>
                    </div>
                    <div className="relative w-full flex-1 bg-black overflow-hidden flex items-center justify-center">
                      <img
                        src={activeProject.images[activeImageIndex]}
                        alt={activeProject.name}
                        className="w-full h-full object-contain select-none"
                      />
                    </div>
                  </div>
                ) : (
                  /* Mobile Phone Mockup */
                  <div className="relative rounded-[26px] border-[2px] border-white/20 bg-[#0a0a0c] p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] w-[240px] sm:w-[280px] aspect-[9/19.5] max-h-[68dvh] flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-black border border-white/15 z-20 shadow-inner" />
                    <div className="relative w-full h-full rounded-[18px] overflow-hidden bg-black flex items-center justify-center">
                      <img
                        src={activeProject.images[activeImageIndex]}
                        alt={activeProject.name}
                        className="w-full h-full object-cover select-none"
                      />
                    </div>
                  </div>
                )}

                {/* Left & Right Navigation Arrows */}
                {activeProject.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(prev => (prev - 1 + activeProject.images.length) % activeProject.images.length);
                      }}
                      className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/75 hover:bg-black/95 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-all z-30 cursor-pointer shadow-lg active:scale-95"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(prev => (prev + 1) % activeProject.images.length);
                      }}
                      className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/75 hover:bg-black/95 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-all z-30 cursor-pointer shadow-lg active:scale-95"
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Bottom Dot Thumbnails */}
              {activeProject.images.length > 1 && (
                <div className="h-11 bg-[#101115] border-t border-white/10 flex items-center justify-center gap-2 px-4 shrink-0">
                  {activeProject.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`transition-all rounded-full cursor-pointer ${
                        activeImageIndex === i ? 'bg-red-500 w-5 h-2' : 'bg-white/30 hover:bg-white/60 w-2 h-2'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegistryPage;
