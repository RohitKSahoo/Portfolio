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
  'mid-right',
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
  if (col === 1) return 'right';
  if (col === 2) return 'mid-right';
  return 'far-right';
}

export const ProfilePage = ({ 
  onExploreProjects, 
  isDockVisible = false,
  isExiting = false,
  onExitComplete
}: { 
  onExploreProjects?: () => void,
  isDockVisible?: boolean,
  isExiting?: boolean,
  onExitComplete?: () => void
}) => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isCVModalOpen, setIsCVModalOpen] = React.useState(false);
  const [isAvatarLoaded, setIsAvatarLoaded] = React.useState(false);
  const [direction, setDirection] = React.useState<Direction>('center');

  const avatarFigureRef = React.useRef<HTMLDivElement>(null);

  const handleViewCV = () => {
    setIsCVModalOpen(true);
  };

  // Preload all 21 directional frames in memory for instantaneous 0ms switching
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);

    const directionsList: Direction[] = [
      'up-far-left', 'up-mid-left', 'up-left', 'up', 'up-right', 'up-mid-right', 'up-far-right',
      'far-left', 'mid-left', 'left', 'center', 'right', 'mid-right', 'far-right',
      'down-far-left', 'down-mid-left', 'down-left', 'down', 'down-right', 'down-mid-right', 'down-far-right'
    ];

    let primaryLoaded = false;
    const centerImg = new Image();
    centerImg.src = '/avatar-frames/dir_center.png?v=4';
    const markLoaded = () => {
      if (!primaryLoaded) {
        primaryLoaded = true;
        setIsAvatarLoaded(true);
      }
    };
    if (centerImg.complete) markLoaded();
    else centerImg.onload = markLoaded;

    // Background preload all remaining 20 frames
    directionsList.forEach(name => {
      if (name === 'center') return;
      const img = new Image();
      img.src = `/avatar-frames/dir_${name}.png?v=4`;
    });

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cursor tracking across the 3x5 directional grid
  React.useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
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
    if (isAvatarLoaded) {
      const timer = setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('liquid-ether-surge', {
            detail: { origin: 'top-left', intensity: 5 }
          })
        );
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAvatarLoaded]);

  React.useEffect(() => {
    if (isExiting) {
      window.dispatchEvent(
        new CustomEvent('liquid-ether-surge', {
          detail: { origin: 'bottom-center', intensity: 1 }
        })
      );
    }
  }, [isExiting]);

  const activeAvatarSrc = `/avatar-frames/dir_${direction}.png?v=4`;

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-500 font-inter">
      <div className="relative min-h-[calc(100dvh-180px)] lg:min-h-[calc(100vh-180px)] border-none bg-transparent overflow-visible flex flex-col justify-between p-0">
        {/* CENTER AVATAR FIGURE - ANCHORED FIRMLY TO BOTTOM OF SCREEN */}
        {typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-x-0 bottom-0 flex justify-center items-end z-[5] pointer-events-none" style={{ bottom: 0 }}>
             <motion.div 
               ref={avatarFigureRef}
               initial={{ opacity: 0, y: '85%' }}
               animate={
                 isExiting 
                   ? { opacity: 0, y: '85%' } 
                   : isAvatarLoaded 
                   ? { 
                       opacity: 1, 
                       y: '0%',
                     } 
                   : { opacity: 0, y: '85%' }
               }
               transition={
                 isExiting
                   ? { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
                   : { duration: 1.25, ease: [0.16, 1, 0.3, 1], delay: 0.08 }
               }
               onAnimationComplete={() => {
                 if (isExiting) {
                   onExitComplete?.();
                 }
               }}
               className="relative w-full max-w-7xl xl:max-w-[1920px] h-[74vh] sm:h-[84vh] lg:h-[92vh] pointer-events-auto flex items-end justify-center select-none origin-bottom"
               style={{ bottom: 0 }}
             >
                <motion.div
                  animate={{ y: 0 }}
                  className="relative w-full h-full flex items-end justify-center bg-transparent scale-100 origin-bottom"
                  style={{ bottom: 0 }}
                >
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
                </motion.div>
             </motion.div>
          </div>,
          document.body
        )}

        <motion.div 
          animate={{ opacity: isExiting ? 0 : 1, y: isExiting ? 20 : 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative z-10 flex flex-col min-h-[inherit] justify-between p-0 pointer-events-none"
        >
          <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-8 items-start w-full px-0 pt-6 sm:pt-8 lg:pt-6">
            <div className="flex flex-col gap-3 lg:gap-4 max-w-lg text-left pointer-events-auto">

              <h2 className="text-5xl lg:text-5xl font-bold font-satoshi text-white leading-tight tracking-tight">
                CS Undergrad & <br className="sm:hidden" /> Systems Builder <br /> Based in <span className="text-red-500">India.</span>
              </h2>
            </div>

            <div className="flex flex-col gap-6 lg:gap-8 lg:text-right lg:items-end pointer-events-auto">
              <p className="text-sm lg:text-base text-white/60 font-medium leading-relaxed max-w-[280px] lg:max-w-sm font-inter">
                Exploring real-time systems, backend architectures, and unconventional ideas.
              </p>
            <div className="flex flex-col gap-3 lg:self-end pointer-events-auto w-56 sm:w-auto">
              <button 
                onClick={onExploreProjects}
                className="group relative block w-56 sm:w-auto focus:outline-none cursor-pointer rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <GlassSurface
                  width="100%"
                  height={50}
                  borderRadius={10}
                  distortionScale={-100}
                  displace={0.3}
                  backgroundOpacity={0}
                  saturation={1.3}
                  redOffset={20}
                  greenOffset={5}
                  blueOffset={10}
                  className="w-56 sm:w-auto border border-red-500/40 group-hover:border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.25)] group-hover:shadow-[0_0_28px_rgba(239,68,68,0.45)] transition-all"
                >
                  <div className="flex items-center justify-between gap-4 px-5 sm:px-6 w-full text-white font-bold font-satoshi text-sm uppercase tracking-wider">
                    <span className="group-hover:text-red-400 transition-colors">Explore Projects</span>
                    <Zap size={16} className="text-red-500 group-hover:scale-110 transition-transform" fill="currentColor" />
                  </div>
                </GlassSurface>
              </button>
              
              <button 
                onClick={handleViewCV}
                className="group relative block w-56 sm:w-auto focus:outline-none cursor-pointer rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <GlassSurface
                  width="100%"
                  height={50}
                  borderRadius={10}
                  distortionScale={-100}
                  displace={0.2}
                  backgroundOpacity={0}
                  saturation={1.0}
                  redOffset={5}
                  greenOffset={5}
                  blueOffset={15}
                  className="w-56 sm:w-auto border border-white/10 group-hover:border-white/25 shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-all"
                >
                  <div className="flex items-center justify-between gap-4 px-5 sm:px-6 w-full text-white/80 group-hover:text-white font-bold font-satoshi text-sm uppercase tracking-wider transition-colors">
                    <span>Explore CV</span>
                    <FileText size={16} className="group-hover:text-red-500 transition-colors" />
                  </div>
                </GlassSurface>
              </button>
            </div>
            </div>
          </div>

          <motion.div 
            animate={{ 
              y: isMobile ? 20 : (isDockVisible ? -25 : 65),
              opacity: 1
            }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
            className="mt-auto w-full pt-4 sm:pt-6 pb-2 pointer-events-none"
          >
            <div className="w-full h-[90px] sm:h-[130px] lg:h-[160px] pointer-events-auto flex items-center justify-center">
              <TechText
                key={isMobile ? "mobile" : "desktop"}
                text={isMobile ? "ROHIT K. SAHOO" : "ROHIT KUMAR SAHOO"}
                fontFamily="Satoshi, sans-serif"
                fontWeight={800}
                fontSize={130}
                letterSpacing={-0.03}
                color="#ffffff"
                accentColor="#ef4444"
                reveal="letter"
                dashLength={4}
                dashGap={2}
                specks={15}
                intro="scramble"
                introDuration={2.2}
                clickKick={true}
                draggable={true}
                selection={true}
                labels={true}
                guides={false}
                sweep={true}
                speed={1}
                endDot={true}
                dotColor="#ef4444"
                dotSize={26}
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Windows 11 Document Viewer Window */}
      <CVViewerModal 
        isOpen={isCVModalOpen} 
        onClose={() => setIsCVModalOpen(false)} 
        pdfUrl="/rohitkumarsahoo_cv.pdf"
        downloadFilename="rohitkumarsahoo_cv.pdf"
      />
    </div>
  );
};

export default ProfilePage;
