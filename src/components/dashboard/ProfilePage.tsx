import React from 'react';
import { motion } from 'framer-motion';
import { Zap, FileText } from 'lucide-react';
import { DitherVeil } from '../effects/DitherVeil';
import { TechText } from '../effects/TechText';
import { CVViewerModal } from '../CVViewerModal';
import GlassSurface from '../effects/GlassSurface';

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

  const handleViewCV = () => {
    setIsCVModalOpen(true);
  };

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);

    const img = new Image();
    img.src = '/avatar.png';
    if (img.complete) {
      setIsAvatarLoaded(true);
    } else {
      img.onload = () => setIsAvatarLoaded(true);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    if (isAvatarLoaded) {
      // Trigger dynamic background ripple and fluid surge synchronized with avatar slide-up
      const timer = setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('liquid-ether-surge', {
            detail: { origin: 'bottom-center', intensity: 1.6 }
          })
        );
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAvatarLoaded]);

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-inter">
      <div className="relative min-h-[calc(100dvh-180px)] lg:min-h-[calc(100vh-180px)] border-none bg-transparent overflow-visible flex flex-col justify-between p-0">
        {/* CENTER AVATAR FIGURE - ANCHORED TO BOTTOM OF SCREEN */}
        <div className="fixed inset-x-0 bottom-0 flex justify-center items-end z-0 pointer-events-none">
           <motion.div 
             initial={{ opacity: 0, y: '85%' }}
             animate={isExiting ? { opacity: 0, y: '95%' } : isAvatarLoaded ? { opacity: 1, y: '0%' } : { opacity: 0, y: '85%' }}
             transition={
               isExiting
                 ? { duration: 1.1, ease: [0.16, 1, 0.3, 1] }
                 : { duration: 1.25, ease: [0.16, 1, 0.3, 1], delay: 0.08 }
             }
             onAnimationComplete={() => {
               if (isExiting) {
                 onExitComplete?.();
               }
             }}
             className="relative w-full max-w-6xl xl:max-w-[1700px] h-[65vh] sm:h-[75vh] lg:h-[85vh] pointer-events-auto flex items-end justify-center z-10"
           >
              <motion.div
                animate={isMobile ? { y: [0, -8, 0] } : {}}
                transition={isMobile ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : {}}
                className="relative w-full h-full flex items-end justify-center bg-transparent scale-110 sm:scale-120 lg:scale-135 origin-bottom"
              >
                <DitherVeil 
                  src="/avatar.png"
                  fit="contain"
                  align="bottom"
                  intro={false}
                  colorEntrance={true}
                  colorEntranceDuration={1500}
                  triggerEntrance={isAvatarLoaded ? 1 : 0}
                  onLoad={() => setIsAvatarLoaded(true)}
                  pattern="atkinson"
                  pixelSize={2}
                  levels={5}
                  inkColor="#000000"
                  paperColor="#f4f1ea"
                  revealRadius={140}
                  softness={0.8}
                  linger={4}
                  wander={false}
                  clickBurst={true}
                  rimColor="#000000"
                  rim={0}
                  transparentBg={true}
                  className="w-full h-full cursor-crosshair bg-transparent"
                />
              </motion.div>
           </motion.div>
        </div>

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
                  height={46}
                  borderRadius={8}
                  distortionScale={-100}
                  displace={0.3}
                  backgroundOpacity={0.16}
                  saturation={1.3}
                  redOffset={20}
                  greenOffset={5}
                  blueOffset={10}
                  className="w-56 sm:w-auto border border-red-500/40 group-hover:border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.25)] group-hover:shadow-[0_0_28px_rgba(239,68,68,0.45)] transition-all"
                >
                  <div className="flex items-center justify-between gap-4 px-4 sm:px-6 w-full text-white font-bold font-satoshi text-xs uppercase tracking-wider">
                    <span className="group-hover:text-red-400 transition-colors">Explore Projects</span>
                    <Zap size={14} className="text-red-500 group-hover:scale-110 transition-transform" fill="currentColor" />
                  </div>
                </GlassSurface>
              </button>
              
              <button 
                onClick={handleViewCV}
                className="group relative block w-56 sm:w-auto focus:outline-none cursor-pointer rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <GlassSurface
                  width="100%"
                  height={46}
                  borderRadius={8}
                  distortionScale={-60}
                  displace={0.2}
                  backgroundOpacity={0.08}
                  saturation={1.0}
                  redOffset={5}
                  greenOffset={5}
                  blueOffset={15}
                  className="w-56 sm:w-auto border border-white/10 group-hover:border-white/25 shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-all"
                >
                  <div className="flex items-center justify-between gap-4 px-4 sm:px-6 w-full text-white/80 group-hover:text-white font-bold font-satoshi text-xs uppercase tracking-wider transition-colors">
                    <span>Explore CV</span>
                    <FileText size={14} className="group-hover:text-red-500 transition-colors" />
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
