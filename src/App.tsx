import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Header } from './components/layout/Header';
import { ProfilePage } from './components/dashboard/ProfilePage';
import LiquidEther from './components/effects/LiquidEther';
import { motion, AnimatePresence } from 'framer-motion';
import { CVViewerModal } from './components/CVViewerModal';

import './styles/index.css';

import { SystemDock } from './components/layout/SystemDock';
import { inject } from '@vercel/analytics';

const loadRegistry = () => import('./components/dashboard/RegistryPage');
const loadHistory = () => import('./components/dashboard/HistoryPage');
const loadContact = () => import('./components/dashboard/ContactPage');

const RegistryPage = lazy(loadRegistry);
const HistoryPage = lazy(loadHistory);
const ContactPage = lazy(loadContact);

inject();

const LIQUID_COLORS = ['#5227FF', '#FF9FFC', '#B497CF'];
const TAB_ORDER = ['profile', 'projects', 'experience', 'contact'];

const pageVariants = {
  enter: {
    y: 65,
    opacity: 0,
    scale: 0.98,
  },
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      y: { type: 'spring', stiffness: 280, damping: 28, mass: 0.85 },
      opacity: { duration: 0.24, ease: 'easeOut' },
      scale: { duration: 0.24, ease: 'easeOut' },
    },
  },
  exit: {
    y: 65,
    opacity: 0,
    scale: 0.98,
    transition: {
      y: { duration: 0.22, ease: [0.32, 0, 0.67, 0] },
      opacity: { duration: 0.18, ease: 'linear' },
      scale: { duration: 0.22, ease: 'easeIn' },
    },
  },
};

function App() {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('active-tab') || 'profile';
    }
    return 'profile';
  });
  const [direction, setDirection] = useState<number>(0);
  const [isDockVisible, setIsDockVisible] = useState(false);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [cvTriggerRect, setCvTriggerRect] = useState<DOMRect | null>(null);
  const [shouldPreloadHistory, setShouldPreloadHistory] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleOpenCV = (rect?: DOMRect | null) => {
    setCvTriggerRect(rect || null);
    setIsCVModalOpen(true);
  };

  // Background pre-warm 3D Lanyard & History WebGL context well after home page settles
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldPreloadHistory(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Background prefetch all page chunks during idle time for instantaneous tab switching
  useEffect(() => {
    const prefetchPages = () => {
      loadRegistry();
      loadHistory();
      loadContact();
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(prefetchPages);
    } else {
      setTimeout(prefetchPages, 200);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('active-tab', activeTab);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [isHistoryExiting, setIsHistoryExiting] = useState(false);
  const exitTimeoutRef = useRef<number | null>(null);

  // Lock mobile touch scrolling completely on Hero/Profile page so avatar and text stay locked in place
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.innerWidth < 1024;
    if (isMobile && activeTab === 'profile') {
      const preventTouch = (e: TouchEvent) => {
        const target = e.target as HTMLElement | null;
        if (target && target.closest('button, a, [role="button"], input, textarea, select, .pointer-events-auto')) {
          return;
        }
        if (e.cancelable) {
          e.preventDefault();
        }
      };

      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100dvh';
      document.documentElement.style.overscrollBehavior = 'none';
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100dvh';
      document.body.style.overscrollBehavior = 'none';
      document.body.style.touchAction = 'none';

      window.addEventListener('touchmove', preventTouch, { passive: false });

      return () => {
        document.documentElement.style.overflow = '';
        document.documentElement.style.height = '';
        document.documentElement.style.overscrollBehavior = '';
        document.body.style.overflow = '';
        document.body.style.height = '';
        document.body.style.overscrollBehavior = '';
        document.body.style.touchAction = '';
        window.removeEventListener('touchmove', preventTouch);
      };
    }
  }, [activeTab]);

  const finalizeSwitchFromExperience = (targetTab: string) => {
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }
    setIsHistoryExiting(false);
    setPendingTab(null);
    const prevIdx = TAB_ORDER.indexOf('experience');
    const nextIdx = TAB_ORDER.indexOf(targetTab);
    setDirection(nextIdx > prevIdx ? 1 : -1);
    setActiveTab(targetTab);
  };

  const handleTabChange = (nextTab: string) => {
    if (nextTab === activeTab || nextTab === pendingTab) return;

    if (activeTab === 'experience') {
      // 1. Immediately indicate the targeted tab on dock
      setPendingTab(nextTab);
      // 2. Trigger upward lanyard ceiling pull exit before mounting new page
      setIsHistoryExiting(true);

      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = window.setTimeout(() => {
        finalizeSwitchFromExperience(nextTab);
      }, 310);
      return;
    }

    const prevIdx = TAB_ORDER.indexOf(activeTab);
    const nextIdx = TAB_ORDER.indexOf(nextTab);
    const newDir = nextIdx > prevIdx ? 1 : -1;
    setDirection(newDir);
    setActiveTab(nextTab);
  };

  const renderContent = () => {
    // Only render new page components when lanyard exit has completed
    const showNewPage = activeTab !== 'experience' && !isHistoryExiting;

    return (
      <div className={`w-full relative ${activeTab === 'profile' ? 'flex-1 flex flex-col' : ''}`}>
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          {showNewPage && (
            <motion.div
              key={activeTab}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={`w-full ${activeTab === 'profile' ? 'flex-1 flex flex-col' : ''}`}
            >
              <Suspense fallback={null}>
                {(() => {
                  switch (activeTab) {
                    case 'profile': return (
                      <ProfilePage 
                        onExploreProjects={() => handleTabChange('projects')} 
                        isDockVisible={isDockVisible}
                        onViewCV={handleOpenCV}
                      />
                    );
                    case 'projects': return <RegistryPage />;
                    case 'contact': return <ContactPage />;
                    default: return (
                      <ProfilePage 
                        onExploreProjects={() => handleTabChange('projects')} 
                        isDockVisible={isDockVisible}
                        onViewCV={handleOpenCV}
                      />
                    );
                  }
                })()}
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PERSISTENT & PRE-WARMED 3D LANYARD / EXPERIENCE MODULE */}
        <div
          className={`w-full ${(activeTab === 'experience' || isHistoryExiting) ? 'block' : 'hidden'}`}
          aria-hidden={activeTab !== 'experience'}
        >
          <Suspense fallback={null}>
            {(shouldPreloadHistory || activeTab === 'experience' || isHistoryExiting) && (
              <HistoryPage 
                isActive={activeTab === 'experience' && !isHistoryExiting}
                isExiting={isHistoryExiting}
                onExitComplete={() => {
                  if (pendingTab) {
                    finalizeSwitchFromExperience(pendingTab);
                  } else {
                    setIsHistoryExiting(false);
                  }
                }}
              />
            )}
          </Suspense>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen selection:bg-[var(--theme-accent)] selection:text-white antialiased relative transition-colors ${
      activeTab === 'profile' ? 'h-[100dvh] max-h-[100dvh] overflow-hidden' : 'overflow-x-clip'
    }`}>
      {/* MAGNETIC DOCK NAVIGATION */}
      <SystemDock 
        activeTab={pendingTab || activeTab} 
        setActiveTab={handleTabChange} 
        isDockVisible={isDockVisible}
        setIsDockVisible={setIsDockVisible}
        onViewCV={handleOpenCV}
      />

      {/* LIQUID ETHER FLUID SIMULATION BACKGROUND */}
      <LiquidEther
        colors={LIQUID_COLORS}
        mouseForce={12}
        intensity={0.75}
        cursorSize={85}
        persistence={0.85}
        viscosity={0.88}
        autoDemo={true}
        autoSpeed={0.22}
        autoIntensity={1.2}
        className="fixed inset-0 z-0 pointer-events-none"
      />

      {/* MAIN SYSTEM VIEWPORT */}
      <main className={`flex flex-col relative z-10 transition-all duration-500 pointer-events-none ${
        activeTab === 'profile' ? 'h-[100dvh] max-h-[100dvh] overflow-hidden' : ''
      }`}>
        {/* TOP TELEMETRY HEADER */}
        <Header 
          activeTab={activeTab}
        />

        {/* ACTIVE MODULE VIEWPORT */}
        <div 
          ref={scrollContainerRef} 
          className={`px-4 sm:px-6 lg:px-8 pt-[74px] sm:pt-[92px] lg:pt-[112px] ${
            activeTab === 'profile' 
              ? 'pb-16 sm:pb-20 lg:pb-24 h-[100dvh] overflow-hidden flex flex-col' 
              : 'pb-20 lg:pb-24'
          } pointer-events-none`} 
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className={`max-w-[1600px] w-full mx-auto pointer-events-none ${
            activeTab === 'profile' ? 'flex-1 flex flex-col' : ''
          }`}>
             {renderContent()}
          </div>
        </div>
      </main>

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
}

export default App;
