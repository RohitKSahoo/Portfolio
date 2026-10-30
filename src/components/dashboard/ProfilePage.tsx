import React from 'react';
import { motion } from 'framer-motion';
import { Zap, FileText } from 'lucide-react';
import { DitherVeil } from '../effects/DitherVeil';
import { TechText } from '../effects/TechText';
import { CVViewerModal } from '../CVViewerModal';

export const ProfilePage = ({ 
  onExploreProjects, 
  isDockVisible = false 
}: { 
  onExploreProjects?: () => void,
  isDockVisible?: boolean 
}) => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isCVModalOpen, setIsCVModalOpen] = React.useState(false);

  const handleViewCV = () => {
    setIsCVModalOpen(true);
  };

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-inter">
      <div className="relative min-h-[calc(100dvh-180px)] lg:min-h-[calc(100vh-180px)] border-none bg-transparent overflow-visible flex flex-col justify-between p-0">
        {/* CENTER AVATAR FIGURE - ANCHORED TO BOTTOM OF SCREEN */}
        <div className="fixed inset-x-0 bottom-0 flex justify-center items-end z-0 pointer-events-none">
           <motion.div 
             initial={{ opacity: 0, y: 90 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
             className="relative w-full max-w-6xl xl:max-w-[1700px] h-[65vh] sm:h-[75vh] lg:h-[85vh] pointer-events-auto flex items-end justify-center z-10"
           >
              <motion.div
                animate={isMobile ? { y: [0, -8, 0] } : {}}
                transition={isMobile ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : {}}
                className="w-full h-full flex items-end justify-center bg-transparent scale-110 sm:scale-120 lg:scale-135 origin-bottom"
              >
                <DitherVeil 
                  src="/avatar.png"
                  fit="contain"
                  align="bottom"
                  pattern="atkinson"
                  pixelSize={2}
                  levels={5}
                  inkColor="#000000"
                  paperColor="#f4f1ea"
                  revealRadius={120}
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

        <div className="relative z-10 flex flex-col min-h-[inherit] justify-between p-0 pointer-events-none">
          <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-8 items-start w-full px-0">
            <div className="flex flex-col gap-3 lg:gap-4 max-w-lg text-left pointer-events-auto">

              <h2 className="text-5xl lg:text-5xl font-bold font-satoshi text-white leading-tight tracking-tight">
                CS Student & <br className="sm:hidden" /> Systems Builder <br /> Based in <span className="text-red-500">India.</span>
              </h2>
            </div>

            <div className="flex flex-col gap-6 lg:gap-8 lg:text-right lg:items-end pointer-events-auto">
              <p className="text-sm lg:text-base text-white/60 font-medium leading-relaxed max-w-[280px] lg:max-w-sm font-inter">
                Exploring real-time systems, backend architectures, and unconventional ideas.
              </p>
            <div className="flex flex-col gap-3 lg:self-end pointer-events-auto">
              <button 
                onClick={onExploreProjects}
                className="group relative px-4 py-2.5 sm:px-6 sm:py-3 bg-red-500 text-white font-bold font-satoshi text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all overflow-hidden flex items-center justify-between gap-4 w-56 sm:w-auto shadow-[0_0_20px_rgba(239,68,68,0.2)] rounded-lg cursor-target"
              >
                <span>Explore Projects</span>
                <Zap size={14} fill="currentColor" />
              </button>
              
              <button 
                onClick={handleViewCV}
                className="group relative px-4 py-2.5 sm:px-6 sm:py-3 bg-[#0d0d0d] border border-white/10 text-white/80 font-bold font-satoshi text-xs uppercase tracking-wider hover:bg-white/10 hover:text-white transition-all flex items-center justify-between gap-4 w-56 sm:w-auto rounded-lg cursor-target"
              >
                <span>Explore CV</span>
                <FileText size={14} className="group-hover:text-red-500 transition-colors" />
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
        </div>
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
