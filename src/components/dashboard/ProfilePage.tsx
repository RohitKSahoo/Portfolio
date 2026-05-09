import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Download } from 'lucide-react';
import { SystemAvatar } from '../SystemAvatar';
import RippleGrid from '../effects/RippleGrid';

export const ProfilePage = ({ 
  onExploreProjects, 
  isDockVisible = false 
}: { 
  onExploreProjects?: () => void,
  isDockVisible?: boolean 
}) => {
  const [displayName, setDisplayName] = React.useState("ROHIT KUMAR SAHOO");
  const [isMobile, setIsMobile] = React.useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%#!@$*";

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    let iterations = 0;
    const target = "ROHIT KUMAR SAHOO";
    const interval = setInterval(() => {
      setDisplayName(prev => 
        target.split("").map((char, index) => {
          if (index < iterations) return target[index];
          if (char === " ") return " ";
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );
      if (iterations >= target.length) clearInterval(interval);
      iterations += 1/3;
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-inter">
      <div className="relative min-h-[calc(100vh-180px)] border-none bg-transparent overflow-hidden flex flex-col justify-between p-0">
        <div className="absolute inset-0 flex justify-center items-center z-0">
           <div className="relative w-full h-full max-w-xl pointer-events-none flex items-center justify-center z-10">
              <SystemAvatar 
                className="w-[110%] h-[110%] lg:w-full lg:h-full opacity-80 lg:opacity-100 scale-95 lg:scale-100 translate-y-8 lg:translate-y-0 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-black)] via-transparent to-[var(--bg-black)]/40 pointer-events-none" />
           </div>
        </div>

        <div className="relative z-10 flex flex-col min-h-[inherit] justify-between p-0">
          <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-8 items-start w-full px-0">
            <div className="flex flex-col gap-3 lg:gap-4 max-w-lg text-left">

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-satoshi text-white leading-tight tracking-tight">
                CS Student & <br className="hidden sm:block lg:hidden" /> Systems Builder <br /> Based in India
              </h2>
            </div>

            <div className="flex flex-col gap-6 lg:gap-8 lg:text-right lg:items-end">
              <p className="text-sm lg:text-base text-white/60 font-medium leading-relaxed max-w-[280px] lg:max-w-sm font-inter">
                Exploring real-time systems, backend architectures, and unconventional ideas.
              </p>
            <div className="flex flex-col gap-3 lg:self-end">
              <button 
                onClick={onExploreProjects}
                className="group relative px-6 py-3 bg-red-500 text-white font-bold font-satoshi text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all overflow-hidden flex items-center justify-between gap-4 w-full sm:w-auto shadow-[0_0_20px_rgba(239,68,68,0.2)] rounded-lg"
              >
                <span>Explore Projects</span>
                <Zap size={14} fill="currentColor" />
              </button>
              
              <a 
                href="/cv.pdf" 
                download="Rohit_Kumar_Sahoo_CV.pdf"
                className="group relative px-6 py-3 bg-[#0d0d0d] border border-white/10 text-white/80 font-bold font-satoshi text-xs uppercase tracking-wider hover:bg-white/10 hover:text-white transition-all flex items-center justify-between gap-4 w-full sm:w-auto rounded-lg"
              >
                <span>Download CV</span>
                <Download size={14} />
              </a>
            </div>
            </div>
          </div>

          <motion.div 
            animate={{ 
              y: isMobile ? -110 : (isDockVisible ? -95 : 12),
              opacity: 1
            }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
            className="mt-auto w-full pt-10 pb-0 pointer-events-none"
          >
             <h1 className="text-[7.5vw] sm:text-[8vw] lg:text-[6vw] font-bold font-satoshi tracking-tight leading-none text-white drop-shadow-[0_0_50px_rgba(239,68,68,0.1)] uppercase text-center break-words">
                {displayName}<span className="inline-block w-[1vw] h-[1vw] bg-red-500 ml-3 align-baseline translate-y-[-0.2vw]" />
             </h1>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
