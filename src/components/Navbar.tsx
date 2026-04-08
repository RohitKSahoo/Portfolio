import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const navItems = [
  { label: 'MISSION_CONTROL', id: 'mission' },
  { label: 'CORE_LOGIC', id: 'capabilities' },
  { label: 'BLUEPRINTS', id: 'blueprints' },
  { label: 'ARCHIVE_LOGS', id: 'experience' },
  { label: 'ESTABLISH_UPLINK', id: 'uplink' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { contextSafe } = useGSAP({ scope: navRef });

  const onHover = contextSafe(() => {
    gsap.to('.nav-container', { 
      y: 2, 
      boxShadow: '0 10px 40px rgba(255, 0, 0, 0.2)', 
      borderColor: 'var(--theme-color)',
      duration: 0.3, 
      ease: 'power2.out' 
    });
  });

  const onLeave = contextSafe(() => {
    gsap.to('.nav-container', { 
      y: 0, 
      boxShadow: scrolled ? '0 5px 20px rgba(255, 0, 0, 0.1)' : 'none', 
      borderColor: scrolled ? 'rgba(255, 0, 0, 0.3)' : 'transparent',
      duration: 0.3, 
      ease: 'power2.out' 
    });
  });

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav 
        ref={navRef}
        className="fixed top-0 left-0 w-full z-[10005] px-4 md:px-10 pt-4 md:pt-6 pointer-events-none"
      >
        <div 
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
          className={`nav-container pointer-events-auto max-w-[1400px] mx-auto transition-all duration-500 border-2 rounded-sm flex justify-between items-center px-6 md:px-10 h-16 md:h-20 bg-black/80 backdrop-blur-md ${scrolled ? 'border-theme border-opacity-40 shadow-[0_0_30px_rgba(255,0,0,0.1)] py-2' : 'border-theme border-opacity-10'}`}
        >
          {/* LOGO AREA */}
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-heading text-white tracking-widest leading-none">RKS_SYSTEM_OS</span>
            <span className="text-[0.55rem] text-theme font-mono tracking-tighter opacity-80 uppercase">VER: 1.0 // ARCHITECT_01</span>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a 
                key={item.id} 
                href={`#${item.id}`} 
                className="text-xs font-mono text-grey hover:text-white transition-colors relative group py-2 uppercase tracking-widest"
              >
                <span className="text-theme opacity-0 group-hover:opacity-100 transition-opacity mr-2">[</span>
                {item.label}
                <span className="text-theme opacity-0 group-hover:opacity-100 transition-opacity ml-2">]</span>
              </a>
            ))}
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            onClick={toggleMenu}
            className="lg:hidden flex flex-col gap-1.5 p-2 bg-theme bg-opacity-10 border border-theme border-opacity-30"
          >
            <div className={`w-6 h-0.5 bg-theme transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`w-6 h-0.5 bg-theme transition-all ${isOpen ? 'opacity-0' : ''}`} />
            <div className={`w-6 h-0.5 bg-theme transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* MOBILE OVERLAY MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[1001] bg-black border-l-2 border-theme flex flex-col p-10 lg:hidden"
          >
            <div className="flex justify-between items-center mb-16">
              <div className="text-2xl font-heading uppercase text-theme tracking-widest">SUB_MODULES</div>
              <button onClick={toggleMenu} className="p-4 border border-theme text-theme font-mono text-xs uppercase hover:bg-theme/10 transition-colors">CLOSE_TER [X]</button>
            </div>
            <div className="flex flex-col gap-8">
              {navItems.map((item, index) => (
                <motion.a 
                  key={item.id} href={`#${item.id}`} onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                  className="text-3xl md:text-4xl font-heading text-white hover:text-theme transition-colors flex items-center gap-4 uppercase"
                >
                  <span className="text-theme font-mono text-xs">// 0{index + 1}</span>{item.label}
                </motion.a>
              ))}
            </div>
            <div className="mt-auto pt-10 border-t border-[#222]">
              <div className="text-[0.6rem] text-grey font-mono leading-relaxed uppercase opacity-40">
                SYSTEM_ID: ARCHITECT_01<br />
                ENCRYPTION: ENABLED<br />
                STATUS: NOMINAL
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
