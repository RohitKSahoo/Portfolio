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
import Folder, { type FolderEntry } from '../effects/Folder';
import { MagicBentoCard } from '../effects/MagicBento';
import { FastTypingText } from '../effects/FastTypingText';
import { PROJECTS } from './data';

export const RegistryPage = () => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [clickOrigin, setClickOrigin] = React.useState<{ x: number; y: number } | null>(null);
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [isMaximized, setIsMaximized] = React.useState(false);
  const [showMockupModal, setShowMockupModal] = React.useState(false);
  const activeProject = PROJECTS.find(p => p.id === selectedId) || PROJECTS[0];
  const gridRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

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

  const [isMobile, setIsMobile] = React.useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lock body scroll when window modal is active
  React.useEffect(() => {
    if (isMobile && selectedId) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      setIsMaximized(false);
      setShowMockupModal(false);
    }
  }, [selectedId, isMobile]);

  // Reset image carousel index and modal when selected project changes
  React.useEffect(() => {
    setActiveImageIndex(0);
    setShowMockupModal(false);
  }, [selectedId]);

  // Auto-slide project images when expanded
  React.useEffect(() => {
    if (!selectedId) return;
    const currentProject = PROJECTS.find(p => p.id === selectedId);
    if (!currentProject || !currentProject.images || currentProject.images.length <= 1) return;

    const timer = setInterval(() => {
      setActiveImageIndex(prev => (prev + 1) % currentProject.images.length);
    }, 3200);

    return () => clearInterval(timer);
  }, [selectedId]);

  // Smooth scroll expanded project card into focus on desktop with equal top/bottom gaps
  React.useEffect(() => {
    if (selectedId && !isMobile) {
      const scrollToFocus = () => {
        const cardEl = cardRefs.current[selectedId];
        if (!cardEl) return;
        const headerEl = document.querySelector('header');
        const headerBottom = headerEl ? headerEl.getBoundingClientRect().bottom : 100;
        const topBound = Math.max(headerBottom, 100);
        const bottomBound = window.innerHeight;
        const availableSpace = bottomBound - topBound;
        
        const cardRect = cardEl.getBoundingClientRect();
        const cardHeight = Math.max(cardRect.height, cardEl.scrollHeight);
        
        const idealGap = (availableSpace - cardHeight) / 2;
        const topGap = Math.max(28, idealGap);
        
        const targetCardTop = topBound + topGap;
        const currentScrollY = window.scrollY || window.pageYOffset;
        const targetScrollY = Math.max(0, currentScrollY + cardRect.top - targetCardTop);

        window.scrollTo({
          top: targetScrollY,
          behavior: 'smooth'
        });
      };

      const timer1 = setTimeout(scrollToFocus, 70);
      const timer2 = setTimeout(scrollToFocus, 400);
      const timer3 = setTimeout(scrollToFocus, 720);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [selectedId, isMobile]);

  const folderItemsMap = React.useMemo(() => {
    const map = new Map<string, FolderEntry[]>();
    for (const project of PROJECTS) {
      map.set(project.id, [
        {
          title: project.details[0] || `${project.name} Architecture`,
          description: project.category || 'SYSTEMS'
        },
        {
          title: project.details[1] || `${project.name} Specs`,
          description: project.stack.slice(0, 3).join(' • ')
        },
        ...(project.images && project.images[0]
          ? [
              {
                image: project.images[0],
                title: `${project.name} Preview`
              }
            ]
          : [
              {
                title: `${project.name} Executable`,
                description: `Status: ${project.status}`
              }
            ])
      ]);
    }
    return map;
  }, []);

  const projectRows = React.useMemo(() => {
    const rows: (typeof PROJECTS[0])[][] = [];
    for (let i = 0; i < PROJECTS.length; i += 3) {
      rows.push(PROJECTS.slice(i, i + 3));
    }
    return rows;
  }, []);

  const renderProjectCard = (
    project: typeof PROJECTS[0],
    isExpanded: boolean,
    isSiblingExpanded: boolean,
    origin: string = 'origin-left'
  ) => {
    return (
      <div
        key={project.id}
        ref={(el) => { cardRefs.current[project.id] = el; }}
        className={`w-full min-w-0 transition-opacity duration-500 ${origin} ${
          isExpanded
            ? 'opacity-100 z-20 h-auto overflow-visible'
            : isSiblingExpanded
              ? '!opacity-0 pointer-events-none overflow-hidden'
              : 'opacity-100 h-auto overflow-visible'
        }`}
      >
        <MagicBentoCard 
          particleCount={0}
          glowColor="239, 68, 68"
          enableTilt={false}
          enableMagnetism={false}
          clickEffect={false}
          className={`w-full flex flex-col gap-2.5 group relative rounded-2xl border transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isExpanded
              ? 'p-6 sm:p-8 pt-5 sm:pt-6 bg-[#0c0d14]/85 backdrop-blur-2xl border-red-500/50 shadow-[0_20px_70px_rgba(0,0,0,0.85),0_0_35px_rgba(239,68,68,0.18),inset_0_1px_0_rgba(255,255,255,0.1)] h-auto'
              : isSiblingExpanded
                ? '!p-0 !m-0 !border-0 opacity-0 overflow-hidden pointer-events-none'
                : 'p-4 sm:p-5 bg-[#0e1017]/45 hover:bg-[#121520]/60 backdrop-blur-xl border-white/10 hover:border-red-500/40 shadow-[0_10px_35px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] cursor-pointer h-auto min-h-[148px]'
          }`}
          onClick={() => {
            if (!isExpanded) {
              setSelectedId(project.id);
              setActiveImageIndex(0);
            }
          }}
        >
          {/* Header: Status & Controls */}
          <div className={`w-full flex items-center ${isExpanded ? 'justify-end -mt-1 sm:-mt-1.5 sm:-mr-2' : 'justify-between'}`}>
            {!isExpanded && (
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  project.status === 'STABLE' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                }`} />
                <span className="text-[0.65rem] font-mono font-medium text-white/50 tracking-wider">
                  [{project.status}]
                </span>
              </div>
            )}

            {isExpanded && (
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    project.status === 'STABLE' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                  }`} />
                  <span className="text-[0.65rem] font-mono font-medium text-white/60 tracking-wider">
                    [{project.status}]
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/60 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                >
                  <Minus size={13} />
                  <span>Collapse</span>
                </button>
              </div>
            )}
          </div>

          {/* Main Content Layout: When expanded, Left Column has Header + Dossier, Right Column has Mockup aligned at the top level */}
          <div className={`w-full ${isExpanded ? 'grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 items-start' : 'flex flex-col gap-3'}`}>
            {/* Left Column: Persistent Header + (Compact Preview or Expanded Dossier) */}
            <div className="flex flex-col w-full">
              {/* Persistent Header: Folder + Title + Stack (Never unmounts!) */}
              <div className={`flex flex-col lg:flex-row items-center ${isExpanded ? 'lg:items-center gap-5 pt-1 pl-2' : 'gap-4 sm:gap-5'} transition-all duration-300`}>
                <div className="relative shrink-0 pl-1 pt-1">
                  <Folder
                    mode="flap"
                    variant="glass"
                    color="#EF4444"
                    size={isExpanded ? 0.48 : 0.43}
                    label={project.name}
                    items={folderItemsMap.get(project.id)}
                    theme="dark"
                    open={isExpanded}
                    intro={true}
                    introDelay={PROJECTS.findIndex(p => p.id === project.id) * 0.08}
                    onItemClick={(item, index) => console.log(item, index)}
                  />
                </div>

                <div className={`flex flex-col items-center lg:items-start text-center lg:text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isExpanded ? 'lg:ml-8' : ''
                }`}>
                  <h3 className={`font-bold font-satoshi tracking-tight transition-colors ${
                    isExpanded ? 'text-2xl lg:text-3xl text-red-500' : 'text-base lg:text-xl text-white group-hover:text-red-500'
                  }`}>
                    {project.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mt-1.5 justify-center lg:justify-start">
                    {project.stack.slice(0, isExpanded ? 6 : 3).map(tech => (
                      <span key={tech} className="text-[0.62rem] font-satoshi font-medium text-white/50 border border-white/10 px-2 py-0.5 rounded uppercase tracking-wider bg-white/[0.02]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Expanded Dossier */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="expanded-dossier"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ 
                      height: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.35, ease: 'easeOut' }
                    }}
                    className="overflow-hidden w-full pt-5 flex flex-col gap-5"
                  >
                    {/* Category & Description */}
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-white/60 uppercase mb-2">
                        <span className="w-1 h-3 bg-red-500 inline-block" />
                        <span>{project.category || 'SYSTEMS'}</span>
                      </div>
                      <p className="text-sm sm:text-base text-white/85 leading-relaxed font-sans">
                        <FastTypingText text={project.primaryDescription} delay={140} speed={8} charsPerTick={2} />
                      </p>
                    </div>

                    {/* Architecture Overview */}
                    <div className="p-3.5 rounded-xl bg-black/50 border border-white/5">
                      <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider block mb-1">
                        Architecture Blueprint
                      </span>
                      <p className="text-xs sm:text-sm text-white/60 font-inter leading-relaxed">
                        <FastTypingText text={project.architecture} delay={280} speed={8} charsPerTick={2} />
                      </p>
                    </div>

                    {/* Core Capabilities */}
                    {project.details && project.details.length > 0 && (
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block mb-2">
                          Core Capabilities
                        </span>
                        <ul className="space-y-1.5">
                          {project.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-white/70">
                              <span className="text-red-500 font-mono text-sm leading-none mt-0.5">›</span>
                              <FastTypingText text={detail} delay={380 + idx * 70} speed={6} charsPerTick={3} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action Row */}
                    {project.github && (
                      <div className="pt-2">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/15 border border-white/20 hover:border-red-500/50 rounded-xl text-xs font-mono font-bold text-white transition-all shadow-sm active:scale-95"
                        >
                          <Github size={14} className="text-white/80" />
                          <span>View Source</span>
                          <ExternalLink size={12} className="text-white/40" />
                        </a>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Mockup (aligned on the same level as the project name heading) */}
            <AnimatePresence initial={false}>
              {isExpanded && project.images && project.images.length > 0 && (
                <motion.div
                  key="expanded-mockup"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ 
                    height: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.35, ease: 'easeOut' }
                  }}
                  className="overflow-hidden w-full"
                >
                  {(() => {
                    const isDesktopMockup = project.id === 'P_03' || project.id === 'P_05';

                    return isDesktopMockup ? (
                      /* Studio Monitor Display Mockup */
                      <div className="flex flex-col items-center lg:items-end lg:pr-4 justify-center w-full select-none pt-1">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMockupModal(true);
                          }}
                          className="relative rounded-2xl border-[3px] border-[#2c2d33] bg-[#0c0d10] p-2 sm:p-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.2)] w-full max-w-[490px] aspect-[16/10] flex flex-col overflow-hidden group/monitor cursor-pointer"
                        >
                          {/* Webcam Sensor Dot */}
                          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-black border border-white/20 z-20" />

                          {/* Screen Glass with Auto-Slide Carousel */}
                          <div className="relative w-full h-full rounded-lg overflow-hidden bg-black flex items-center justify-center">
                            <AnimatePresence initial={false}>
                              <motion.img
                                key={activeImageIndex}
                                src={project.images[activeImageIndex] || project.images[0]}
                                alt={project.name}
                                initial={{ x: '100%' }}
                                animate={{ x: '0%' }}
                                exit={{ x: '-100%' }}
                                transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
                                className="absolute inset-0 w-full h-full object-contain select-none"
                              />
                            </AnimatePresence>
                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent z-10" />
                            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur border border-white/15 text-[9px] font-mono text-white/80 flex items-center gap-1 opacity-0 group-hover/monitor:opacity-100 transition-opacity z-20">
                              <Eye size={10} />
                              <span>View Image</span>
                            </div>
                          </div>
                        </div>

                        {/* Monitor Stand */}
                        <div className="w-10 h-7 bg-gradient-to-b from-[#2a2c33] to-[#141518] border-x border-white/10 -mt-0.5" />
                        <div className="w-36 h-2 rounded-t-md bg-gradient-to-r from-[#1c1d22] via-[#353842] to-[#1c1d22] border-t border-x border-white/20 shadow-2xl" />
                      </div>
                    ) : (
                      /* Flagship Mobile Device Mockup */
                      <div className="flex flex-col items-center lg:items-end lg:pr-11 justify-center w-full select-none pt-1">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMockupModal(true);
                          }}
                          className="relative rounded-[24px] border-[1.5px] border-[#383a44] bg-[#0b0c10] p-1 sm:p-1.5 shadow-[0_25px_65px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.2)] w-[235px] sm:w-[260px] lg:w-[275px] aspect-[9/19.5] flex flex-col justify-between overflow-hidden group/mobile cursor-pointer"
                        >
                          {/* Minimal Punch-Hole Camera */}
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-black z-30 flex items-center justify-center border border-white/15 shadow-inner">
                            <div className="w-1 h-1 rounded-full bg-[#161c2c]" />
                          </div>

                          {/* Screen Image with smooth auto-slide carousel */}
                          <div className="relative w-full h-full rounded-[18px] overflow-hidden bg-black flex items-center justify-center">
                            <AnimatePresence initial={false}>
                              <motion.img
                                key={activeImageIndex}
                                src={project.images[activeImageIndex] || project.images[0]}
                                alt={project.name}
                                initial={{ x: '100%' }}
                                animate={{ x: '0%' }}
                                exit={{ x: '-100%' }}
                                transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
                                className="absolute inset-0 w-full h-full object-cover select-none"
                              />
                            </AnimatePresence>

                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent z-10" />
                            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur border border-white/15 text-[9px] font-mono text-white/80 flex items-center gap-1 opacity-0 group-hover/mobile:opacity-100 transition-opacity z-20">
                              <Eye size={10} />
                              <span>View Image</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </MagicBentoCard>
      </div>
    );
  };

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
        
        {/* RESPONSIVE PROJECTS GRID */}
        {isMobile ? (
          <motion.div 
            key="mobile-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-3.5 pt-2 pb-28 relative"
          >
            {PROJECTS.map((project, idx) => (
              <button
                key={project.id}
                onClick={(e) => handleCardClick(project.id, e)}
                className="group relative flex flex-col items-center justify-between p-3.5 rounded-2xl bg-[#0e1017]/55 backdrop-blur-xl border border-white/10 hover:border-red-500/40 active:scale-[0.95] transition-all duration-200 overflow-hidden text-center cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)] focus:outline-none min-h-[178px]"
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
                  <Folder
                    mode="flap"
                    variant="glass"
                    color="#EF4444"
                    size={0.41}
                    label={project.name}
                    items={folderItemsMap.get(project.id)}
                    theme="dark"
                    intro={true}
                    introDelay={idx * 0.08}
                    onItemClick={(item, index) => console.log(item, index)}
                  />
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
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="desktop-grid"
            ref={gridRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6 pt-4 relative w-full"
          >
            {projectRows.map((row, rowIndex) => {
              const expandedIndex = row.findIndex(p => !isMobile && selectedId === p.id);
              const hasExpandedInRow = expandedIndex !== -1;

              const gridTemplateColumns = hasExpandedInRow
                ? [0, 1, 2].map(i => i === expandedIndex ? '100%' : '0%').join(' ')
                : 'calc((100% - 36px) / 3) calc((100% - 36px) / 3) calc((100% - 36px) / 3)';

              const gridGap = hasExpandedInRow ? '0px' : '18px';

              return (
                <div
                  key={`row-${rowIndex}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns,
                    gap: gridGap,
                    transition: 'grid-template-columns 700ms cubic-bezier(0.16, 1, 0.3, 1), gap 700ms cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  className="w-full items-start relative"
                >
                  {row.map((project, cardIndex) => {
                    const isExpanded = !isMobile && selectedId === project.id;
                    const isSiblingExpanded = hasExpandedInRow && !isExpanded;
                    const origin = cardIndex === 0 ? 'origin-left' : cardIndex === 1 ? 'origin-center' : 'origin-right';
                    return renderProjectCard(project, isExpanded, isSiblingExpanded, origin);
                  })}
                </div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* PROJECT DETAILS MODAL (Mobile Fallback) */}
      <AnimatePresence>
        {isMobile && selectedId && (
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
                    PROJECT {activeProject.id}
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
                      <FastTypingText text={activeProject.primaryDescription} delay={140} speed={8} charsPerTick={2} />
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
                          <FastTypingText text={detail} delay={300 + idx * 70} speed={6} charsPerTick={3} />
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

      {/* FULLSCREEN MOCKUP LIGHTBOX (Clean Image Only) */}
      <AnimatePresence>
        {showMockupModal && (
          <div 
            onClick={() => setShowMockupModal(false)}
            className="fixed inset-0 z-[400] flex items-center justify-center p-4 sm:p-10 select-none font-sans bg-black/92 backdrop-blur-md cursor-zoom-out"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMockupModal(false);
              }}
              className="fixed top-5 right-5 sm:top-8 sm:right-8 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all backdrop-blur-md border border-white/15 cursor-pointer shadow-lg active:scale-95"
              aria-label="Close"
            >
              <X size={22} />
            </button>

            {/* Counter */}
            {activeProject.images.length > 1 && (
              <div className="fixed top-5 sm:top-8 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1 rounded-full bg-black/60 border border-white/15 text-xs font-mono text-white/70 backdrop-blur-md shadow-lg pointer-events-none">
                {activeImageIndex + 1} / {activeProject.images.length}
              </div>
            )}

            {/* Pure image without any window container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-full max-h-[88vh] flex items-center justify-center cursor-default z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeProject.images[activeImageIndex]}
                alt={activeProject.name}
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-[0_30px_100px_rgba(0,0,0,0.95)] select-none border border-white/10"
              />
            </motion.div>

            {/* Navigation Arrows in the Lightbox */}
            {activeProject.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(prev => (prev - 1 + activeProject.images.length) % activeProject.images.length);
                  }}
                  className="fixed left-4 sm:left-10 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-black/95 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all z-50 cursor-pointer shadow-2xl active:scale-95"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(prev => (prev + 1) % activeProject.images.length);
                  }}
                  className="fixed right-4 sm:right-10 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-black/95 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all z-50 cursor-pointer shadow-2xl active:scale-95"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegistryPage;
