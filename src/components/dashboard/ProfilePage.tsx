import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Zap, FileText } from 'lucide-react';
import { DitherVeil } from '../effects/DitherVeil';
import { TechText } from '../effects/TechText';
import { CVViewerModal } from '../CVViewerModal';
import GlassSurface from '../effects/GlassSurface';

const DIRECTIONS = [
  'up-far-left',
  'up-mid-left',
  'up-left',
  'up',
  'up-right',
  'up-mid-right',
  'up-far-right',
  'far-left',
  'mid-left',
  'left',
  'center',
  'right',
  'far-right',
  'down-far-left',
  'down-mid-left',
  'down-left',
  'down',
  'down-right',
  'down-mid-right',
  'down-far-right',
] as const;

type Direction = typeof DIRECTIONS[number];

function calculateDirection(dx: number, dy: number): Direction {
  // Center deadzone: look straight forward when cursor is nearby
  if (Math.hypot(dx, dy) < 60) {
    return 'center';
  }

  // Vertical row selection (-1 = up, 0 = mid, 1 = down)
  let row = 0;
  if (dy < -45) row = -1;
  else if (dy > 90) row = 1;

  // Horizontal column selection (-3 to +3)
  // Negative dx = cursor on viewer's left -> avatar looks viewer's left
  // Positive dx = cursor on viewer's right -> avatar looks viewer's right
  let col = 0;
  if (dx < -380) col = -3;
  else if (dx < -190) col = -2;
  else if (dx < -55) col = -1;
  else if (dx > 380) col = 3;
  else if (dx > 190) col = 2;
  else if (dx > 55) col = 1;

  if (row === -1) {
    if (col === -3) return 'up-far-left';
    if (col === -2) return 'up-mid-left';
    if (col === -1) return 'up-left';
    if (col === 0) return 'up';
    if (col === 1) return 'up-right';
    if (col === 2) return 'up-mid-right';
    return 'up-far-right';
  }
  if (row === 1) {
    if (col === -3) return 'down-far-left';
    if (col === -2) return 'down-mid-left';
    if (col === -1) return 'down-left';
    if (col === 0) return 'down';
    if (col === 1) return 'down-right';
    if (col === 2) return 'down-mid-right';
    return 'down-far-right';
  }

  // Middle horizontal row
  if (col === -3) return 'far-left';
  if (col === -2) return 'mid-left';
  if (col === -1) return 'left';
  if (col === 0) return 'center';
  if (col === 1 || col === 2) return 'right';
  return 'far-right';
}

export const ProfilePage = ({ 
  onExploreProjects, 
  isDockVisible = false,
  isExiting = false,
  onExitComplete,
  onViewCV
}: { 
  onExploreProjects?: () => void,
  isDockVisible?: boolean,
  isExiting?: boolean,
  onExitComplete?: () => void,
  onViewCV?: (rect?: DOMRect | null) => void
}) => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isCVModalOpen, setIsCVModalOpen] = React.useState(false);
  const [cvTriggerRect, setCvTriggerRect] = React.useState<DOMRect | null>(null);
  const [isAvatarLoaded, setIsAvatarLoaded] = React.useState(false);
  const [direction, setDirection] = React.useState<Direction>('center');

  const avatarFigureRef = React.useRef<HTMLDivElement>(null);

  const handleViewCV = (e?: React.MouseEvent<HTMLElement>) => {
    const rect = e && e.currentTarget ? e.currentTarget.getBoundingClientRect() : null;
    if (onViewCV) {
      onViewCV(rect);
    } else {
      setCvTriggerRect(rect);
      setIsCVModalOpen(true);
    }
  };

  // Preload directional frames (desktop only) vs single center frame (mobile)
  React.useEffect(() => {
    const handleResize = () => {
      const isNarrow = window.innerWidth < 1024;
      const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      setIsMobile(isNarrow || isTouch);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth >= 1024;

    let primaryLoaded = false;
    const centerImg = new Image();
    centerImg.src = '/avatar-frames/dir_center.png?v=5';
    const markLoaded = () => {
      if (!primaryLoaded) {
        primaryLoaded = true;
        setIsAvatarLoaded(true);
      }
    };
    if (centerImg.complete) markLoaded();
    else centerImg.onload = markLoaded;

    // Background preload all remaining frames ONLY on desktop with mouse
    if (isFinePointer) {
      const directionsList: Direction[] = [
        'up-far-left', 'up-mid-left', 'up-left', 'up', 'up-right', 'up-mid-right', 'up-far-right',
        'far-left', 'mid-left', 'left', 'center', 'right', 'far-right',
        'down-far-left', 'down-mid-left', 'down-left', 'down', 'down-right', 'down-mid-right', 'down-far-right'
      ];
      directionsList.forEach(name => {
        if (name === 'center') return;
        const img = new Image();
        img.src = `/avatar-frames/dir_${name}.png?v=5`;
      });
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cursor tracking across the 3x5 directional grid (desktop mouse only)
  React.useEffect(() => {
    if (isMobile || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setDirection('center');
      return;
    }

    let pointer: { x: number; y: number } | null = null;

    const aim = () => {
      const el = avatarFigureRef.current;
      if (!el || !pointer) return;

      const box = el.getBoundingClientRect();
      const headX = box.left + box.width / 2;
      const headY = box.top + box.height * 0.48;

      const dx = pointer.x - headX;
      const dy = pointer.y - headY;

      const targetDirection = calculateDirection(dx, dy);
      setDirection(prev => prev === targetDirection ? prev : targetDirection);
    };

    const onPointerMove = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      aim();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', aim, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', aim);
    };
  }, []);

  React.useEffect(() => {
    // Only dispatch heavy multi-stage fluid shockwave burst on desktop GPUs to eliminate mobile load lag
    if (isAvatarLoaded && !isMobile) {
      const timer = setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('liquid-ether-surge', {
            detail: { origin: 'top-left', intensity: 1.4 }
          })
        );
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAvatarLoaded, isMobile]);

  React.useEffect(() => {
    if (isExiting) {
      window.dispatchEvent(
        new CustomEvent('liquid-ether-surge', {
          detail: { origin: 'bottom-center', intensity: 1 }
        })
      );
    }
  }, [isExiting]);

  const activeAvatarSrc = `/avatar-frames/dir_${isMobile ? 'center' : direction}.png?v=5`;

  return (
    <div className="flex flex-col animate-in fade-in duration-500 font-inter w-full h-full flex-1">
      <div className="relative flex-1 min-h-[calc(100dvh-170px)] lg:min-h-[calc(100vh-180px)] border-none bg-transparent overflow-visible flex flex-col justify-between p-0">
        {/* CENTER AVATAR FIGURE - ANCHORED FIRMLY IN CENTER ON MOBILE, BOTTOM ON DESKTOP */}
        {typeof document !== 'undefined' && createPortal(
          <div 
            className={
              isMobile 
                ? "fixed inset-0 flex justify-center items-center z-[5] pointer-events-none" 
                : "fixed inset-x-0 bottom-0 flex justify-center items-end z-[5] pointer-events-none"
            } 
            style={isMobile ? undefined : { bottom: 0 }}
          >
             <motion.div 
               ref={avatarFigureRef}
               initial={{
                 opacity: 0,
                 y: isMobile ? 130 : '85%',
                 scale: isMobile ? 0.92 : 1
               }}
               animate={
                 isAvatarLoaded 
                   ? { 
                       opacity: 1, 
                       scale: 1,
                       y: 0,
                     } 
                   : { 
                       opacity: 0, 
                       scale: isMobile ? 0.92 : 1, 
                       y: isMobile ? 130 : '85%' 
                     }
               }
               exit={{
                 opacity: 0,
                 y: isMobile ? 130 : '85%',
                 scale: isMobile ? 0.94 : 1,
                 transition: { duration: 0.35, ease: [0.32, 0, 0.67, 0] }
               }}
               transition={{
                 duration: 1.1,
                 ease: [0.16, 1, 0.3, 1],
                 delay: 0.08
               }}
               onAnimationComplete={() => {
                 if (isExiting) {
                   onExitComplete?.();
                 }
               }}
               className={
                 isMobile
                   ? "relative w-full max-w-none h-[54vh] sm:h-[68vh] pointer-events-none flex items-center justify-center select-none overflow-visible"
                   : "relative w-full max-w-7xl xl:max-w-[1920px] h-[74vh] sm:h-[84vh] lg:h-[92vh] pointer-events-auto flex items-end justify-center select-none origin-bottom"
               }
               style={isMobile ? undefined : { bottom: 0 }}
             >
                <motion.div
                  animate={{ 
                    y: isMobile ? 12 : 0,
                    scale: isMobile ? 0.98 : 1
                  }}
                  transition={{ duration: 0.4 }}
                  className={
                    isMobile
                      ? "relative w-full h-full flex items-center justify-center bg-transparent origin-center"
                      : "relative w-full h-full flex items-end justify-center bg-transparent scale-100 origin-bottom"
                  }
                  style={
                    isMobile
                      ? {
                          maskImage: 'linear-gradient(to bottom, black 68%, rgba(0,0,0,0.85) 82%, rgba(0,0,0,0.2) 94%, transparent 100%)',
                          WebkitMaskImage: 'linear-gradient(to bottom, black 68%, rgba(0,0,0,0.85) 82%, rgba(0,0,0,0.2) 94%, transparent 100%)',
                        }
                      : { bottom: 0 }
                  }
                >
                  {isMobile ? (
                    <>
                      <img 
                        src={activeAvatarSrc}
                        alt="Rohit Kumar Sahoo Avatar"
                        className="w-full h-full object-contain pointer-events-none select-none"
                        onLoad={() => setIsAvatarLoaded(true)}
                      />
                      {/* Dense dark fog cushion over lower torso */}
                      <div 
                        className="absolute inset-x-0 bottom-0 h-44 pointer-events-none z-10" 
                        style={{
                          background: 'linear-gradient(to top, rgba(10,10,10,0.96) 0%, rgba(10,10,10,0.82) 42%, rgba(10,10,10,0.3) 76%, transparent 100%)'
                        }}
                      />
                    </>
                  ) : (
                    <DitherVeil 
                      src={activeAvatarSrc}
                      fit="contain"
                      align="bottom"
                      intro={false}
                      colorEntrance={true}
                      colorEntranceDuration={2500}
                      triggerEntrance={isAvatarLoaded ? 1 : 0}
                      pattern="atkinson"
                      pixelSize={2}
                      levels={5}
                      inkColor="#000000"
                      paperColor="#f4f1ea"
                      revealRadius={130}
                      softness={0.7}
                      linger={4}
                      wander={false}
                      clickBurst={false}
                      rimColor="#000000"
                      rim={0}
                      transparentBg={true}
                      className="w-full h-full bg-transparent"
                    />
                  )}
                </motion.div>
             </motion.div>
          </div>,
          document.body
        )}

        <motion.div 
          initial={{ opacity: 0, y: 45 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 55, transition: { duration: 0.22, ease: [0.32, 0, 0.67, 0] } }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative z-10 flex-1 flex flex-col min-h-[calc(100dvh-170px)] lg:min-h-[calc(100vh-180px)] justify-between p-0 pointer-events-none"
        >
          <div className="flex flex-col lg:flex-row justify-between gap-3.5 sm:gap-6 lg:gap-8 items-start w-full px-0 pt-1 sm:pt-4 lg:pt-3">
            <div className="flex flex-col gap-2 sm:gap-3 lg:gap-3.5 w-full lg:max-w-md xl:max-w-lg text-left pointer-events-auto">
              <h2 className="text-[clamp(1.95rem,7.5vw,3.1rem)] sm:text-5xl lg:text-[clamp(2.8rem,3.4vw,4.2rem)] xl:text-6xl font-extrabold font-satoshi text-white leading-[1.12] tracking-tight w-full">
                CS Undergrad & Systems Builder Based in <span className="text-red-500">India.</span>
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:gap-6 lg:gap-6 w-full lg:w-auto lg:text-right lg:items-end pointer-events-auto">
              <p className="hidden lg:block text-xs sm:text-sm lg:text-base text-white/70 font-medium leading-relaxed w-full max-w-none lg:max-w-xs xl:max-w-sm font-inter">
                Exploring real-time systems, backend architectures, and unconventional ideas.
              </p>
              
              {/* DESKTOP CTAS ONLY */}
              <div className="hidden lg:flex flex-col gap-2.5 sm:gap-3 lg:self-end pointer-events-auto w-52 sm:w-auto">
                <button 
                  onClick={onExploreProjects}
                  className="group relative block w-full sm:w-auto focus:outline-none cursor-pointer rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <GlassSurface
                    width="100%"
                    height={46}
                    borderRadius={10}
                    distortionScale={-100}
                    displace={0.3}
                    backgroundOpacity={0}
                    saturation={1.3}
                    redOffset={20}
                    greenOffset={5}
                    blueOffset={10}
                    className="w-full sm:w-auto border border-red-500/40 group-hover:border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.25)] group-hover:shadow-[0_0_28px_rgba(239,68,68,0.45)] transition-all"
                  >
                    <div className="flex items-center justify-between gap-3.5 px-6 w-full text-white font-bold font-satoshi text-xs sm:text-sm uppercase tracking-wider">
                      <span className="group-hover:text-red-400 transition-colors truncate">Explore Projects</span>
                      <Zap size={15} className="text-red-500 group-hover:scale-110 transition-transform shrink-0" fill="currentColor" />
                    </div>
                  </GlassSurface>
                </button>
                
                <button 
                  onClick={handleViewCV}
                  className="group relative block w-full sm:w-auto focus:outline-none cursor-pointer rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <GlassSurface
                    width="100%"
                    height={46}
                    borderRadius={10}
                    distortionScale={-100}
                    displace={0.2}
                    backgroundOpacity={0}
                    saturation={1.0}
                    redOffset={5}
                    greenOffset={5}
                    blueOffset={15}
                    className="w-full sm:w-auto border border-white/10 group-hover:border-white/25 shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-all"
                  >
                    <div className="flex items-center justify-between gap-3.5 px-6 w-full text-white/80 group-hover:text-white font-bold font-satoshi text-xs sm:text-sm uppercase tracking-wider transition-colors">
                      <span className="truncate">Explore CV</span>
                      <FileText size={15} className="group-hover:text-red-500 transition-colors shrink-0" />
                    </div>
                  </GlassSurface>
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM REGION: NAME OVER FOG */}
          <div className="mt-auto w-full flex flex-col items-center gap-0 sm:gap-1 pb-3 sm:pb-2 mb-2 sm:mb-0 pointer-events-none">
            {/* INTRODUCTORY HANDWRITTEN KICKER ABOVE NAME */}
            <motion.span 
              initial={{ opacity: 0, y: 25 }}
              animate={{ 
                y: isMobile ? 0 : (isDockVisible ? -25 : 65),
                opacity: 1
              }}
              exit={{ opacity: 0, y: 35, transition: { duration: 0.18 } }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
              className="font-amatic text-[23px] sm:text-3xl lg:text-4xl text-red-500 font-bold tracking-widest text-center pointer-events-auto select-none"
            >
              Designing real-time architectures — I'm
            </motion.span>

            {/* NAME BANNER */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                y: isMobile ? 0 : (isDockVisible ? -25 : 65),
                opacity: 1
              }}
              exit={{ opacity: 0, y: 45, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
              className="w-full pointer-events-auto"
            >
              <div className="w-full h-[68px] sm:h-[84px] lg:h-[160px] flex items-center justify-center">
                <TechText
                  key={isMobile ? "mobile" : "desktop"}
                  text={isMobile ? "ROHIT K. SAHOO" : "ROHIT KUMAR SAHOO"}
                  fontFamily="Satoshi, sans-serif"
                  fontWeight={800}
                  fontSize={isMobile ? 42 : 130}
                  letterSpacing={-0.03}
                  color="#ffffff"
                  accentColor="#ef4444"
                  reveal="letter"
                  dashLength={4}
                  dashGap={2}
                  lineStyle="dashed"
                  specks={isMobile ? 12 : 15}
                  intro="scramble"
                  introDuration={isMobile ? 1.8 : 2.2}
                  clickKick={true}
                  draggable={!isMobile}
                  selection={!isMobile}
                  labels={true}
                  guides={false}
                  sweep={true}
                  speed={1}
                  endDot={true}
                  dotColor="#ef4444"
                  dotSize={isMobile ? 14 : 26}
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Windows 11 Document Viewer Window */}
      <CVViewerModal 
        isOpen={isCVModalOpen} 
        onClose={() => setIsCVModalOpen(false)} 
        triggerRect={cvTriggerRect}
        pdfUrl="/rohitkumarsahoo_cv.pdf"
        downloadFilename="rohitkumarsahoo_cv.pdf"
      />
    </div>
  );
};

export default ProfilePage;
