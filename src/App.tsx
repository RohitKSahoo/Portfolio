import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Header } from './components/layout/Header';
import { ProfilePage } from './components/dashboard/ProfilePage';
import HeroBackground from './components/effects/HeroBackground';
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

const TAB_ORDER = ['profile', 'projects', 'experience', 'contact'];

const getTabFromLocation = (): string => {
  if (typeof window === 'undefined') return 'profile';
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (TAB_ORDER.includes(hash)) {
    return hash;
  }
  return 'profile';
};

const isPageReload = (): boolean => {
  if (typeof window === 'undefined' || !window.performance) return false;
  const navEntries = window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  if (navEntries && navEntries.length > 0) {
    return navEntries[0].type === 'reload';
  }
  return (window.performance as any)?.navigation?.type === 1;
};

const pageVariants = {
  enter: (dir: number) => ({
    y: dir >= 0 ? 24 : -24,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
    transition: {
      y: { type: 'spring', stiffness: 280, damping: 28, mass: 0.8 },
      opacity: { duration: 0.22, ease: 'easeOut' },
    },
  },
  exit: (dir: number) => ({
    y: dir >= 0 ? -18 : 18,
    opacity: 0,
    transition: {
      y: { duration: 0.18, ease: [0.32, 0, 0.67, 0] },
      opacity: { duration: 0.16, ease: 'linear' },
    },
  }),
};

function App() {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      if (isPageReload()) {
        return 'profile';
      }
      const fromHash = getTabFromLocation();
      if (window.location.hash) {
        return fromHash;
      }
      return 'profile';
    }
    return 'profile';
  });
  const [direction, setDirection] = useState<number>(0);
  const [isDockVisible, setIsDockVisible] = useState(false);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [cvTriggerRect, setCvTriggerRect] = useState<DOMRect | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [isHistoryExiting, setIsHistoryExiting] = useState(false);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [hasVisitedExperience, setHasVisitedExperience] = useState(() => activeTab === 'experience');
  const exitTimeoutRef = useRef<number | null>(null);

  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;

  const pendingTabRef = useRef(pendingTab);
  pendingTabRef.current = pendingTab;

  const isHistoryExitingRef = useRef(isHistoryExiting);
  isHistoryExitingRef.current = isHistoryExiting;

  const handleOpenCV = (rect?: DOMRect | null) => {
    setCvTriggerRect(rect || null);
    setIsCVModalOpen(true);
  };

  // Set initial history state on mount if not already present & disable horizontal overscroll swipe navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.overscrollBehaviorX = 'none';
      document.body.style.overscrollBehaviorX = 'none';

      if (isPageReload()) {
        window.history.replaceState({ tab: 'profile' }, '', window.location.pathname + window.location.search);
        localStorage.setItem('active-tab', 'profile');
      } else if (!window.history.state?.tab) {
        const targetHash = activeTab === 'profile' ? '' : `#${activeTab}`;
        const url = targetHash === '' ? (window.location.pathname + window.location.search) : targetHash;
        window.history.replaceState({ tab: activeTab }, '', url);
      }
    }
  }, []);

  // Listen for browser Back/Forward (popstate) navigation on mobile & desktop
  useEffect(() => {
    const handlePopState = () => {
      const targetTab = getTabFromLocation();
      handleTabChange(targetTab, false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Eagerly prefetch subpage bundles and pre-decode avatar frame
  useEffect(() => {
    loadRegistry();
    loadHistory();
    loadContact();

    if (typeof window !== 'undefined') {
      const img = new Image();
      img.src = '/avatar-frames/dir_center.png?v=5';

      const prewarm = () => setHasVisitedExperience(true);
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(prewarm, { timeout: 2000 });
      } else {
        setTimeout(prewarm, 1200);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('active-tab', activeTab);
  }, [activeTab]);

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
        document.documentElement.style.overscrollBehaviorX = 'none';
        document.body.style.overflow = '';
        document.body.style.height = '';
        document.body.style.overscrollBehavior = '';
        document.body.style.overscrollBehaviorX = 'none';
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
    setIsPageTransitioning(true);
    setActiveTab(targetTab);
  };

  const handleTabChange = (nextTab: string, pushHistory = true) => {
    const currentTab = activeTabRef.current;
    const currentPending = pendingTabRef.current;
    const isExiting = isHistoryExitingRef.current;

    if (nextTab === currentTab && !isExiting) return;
    if (nextTab === currentPending) return;

    if (pushHistory && typeof window !== 'undefined') {
      const targetHash = nextTab === 'profile' ? '' : `#${nextTab}`;
      const currentHash = window.location.hash;
      const isAlreadyMatching = targetHash === '' ? (!currentHash || currentHash === '#') : (currentHash === targetHash);
      if (!isAlreadyMatching) {
        const newUrl = targetHash === '' ? (window.location.pathname + window.location.search) : targetHash;
        window.history.pushState({ tab: nextTab }, '', newUrl);
      }
    }

    if (isExiting) {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
      setIsHistoryExiting(false);
      setPendingTab(null);
      if (nextTab === currentTab) return;
    }

    if (currentTab === 'experience') {
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

    const prevIdx = TAB_ORDER.indexOf(currentTab);
    const nextIdx = TAB_ORDER.indexOf(nextTab);
    const newDir = nextIdx > prevIdx ? 1 : -1;
    setDirection(newDir);
    setIsPageTransitioning(true);
    if (nextTab === 'experience') {
      setHasVisitedExperience(true);
    }
    setActiveTab(nextTab);
  };

  const isProfileLocked = activeTab === 'profile' && !isPageTransitioning;

  const renderContent = () => {
    // Only render new page components when lanyard exit has completed
    const showNewPage = activeTab !== 'experience' && !isHistoryExiting;

    return (
      <div className={`w-full relative ${isProfileLocked ? 'flex-1 flex flex-col' : ''}`}>
        <AnimatePresence 
          mode="wait" 
          custom={direction} 
          initial={false}
          onExitComplete={() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
        >
          {showNewPage && (
            <motion.div
              key={activeTab}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              onAnimationComplete={(definition) => {
                if (definition === 'center') {
                  setIsPageTransitioning(false);
                }
              }}
              className={`w-full transform-gpu will-change-[transform,opacity] ${isProfileLocked ? 'flex-1 flex flex-col' : ''}`}
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

        {/* 3D LANYARD / EXPERIENCE MODULE */}
        <div
          className={`w-full ${(activeTab === 'experience' || isHistoryExiting) ? 'block' : 'hidden'}`}
          aria-hidden={activeTab !== 'experience'}
        >
          <Suspense fallback={null}>
            {(hasVisitedExperience || activeTab === 'experience' || isHistoryExiting) && (
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
    <div className={`min-h-screen selection:bg-[var(--theme-accent)] selection:text-white antialiased relative transition-colors overscroll-x-none touch-pan-y ${
      isProfileLocked ? 'h-[100dvh] max-h-[100dvh] overflow-hidden' : 'overflow-x-clip'
    }`}>
      {/* MAGNETIC DOCK NAVIGATION */}
      <SystemDock 
        activeTab={pendingTab || activeTab} 
        setActiveTab={handleTabChange} 
        isDockVisible={isDockVisible}
        setIsDockVisible={setIsDockVisible}
        onViewCV={handleOpenCV}
      />

      {/* ORIGINKIT HERO 68 BACKGROUND (FibreArc Ribbon + Laser Pulse Matrix) */}
      <HeroBackground />

      {/* MAIN SYSTEM VIEWPORT */}
      <main className={`flex flex-col relative z-10 transition-all duration-300 pointer-events-none ${
        isProfileLocked ? 'h-[100dvh] max-h-[100dvh] overflow-hidden' : ''
      }`}>
        {/* TOP TELEMETRY HEADER */}
        <Header 
          activeTab={activeTab}
        />

        {/* ACTIVE MODULE VIEWPORT */}
        <div 
          ref={scrollContainerRef} 
          className={`px-4 sm:px-6 lg:px-8 pt-[74px] sm:pt-[92px] lg:pt-[112px] ${
            isProfileLocked 
              ? 'pb-16 sm:pb-20 lg:pb-24 h-[100dvh] overflow-hidden flex flex-col' 
              : 'pb-20 lg:pb-24'
          } pointer-events-none`} 
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className={`max-w-[1600px] w-full mx-auto pointer-events-none ${
            isProfileLocked ? 'flex-1 flex flex-col' : ''
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
