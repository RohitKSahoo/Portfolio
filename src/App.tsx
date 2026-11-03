import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Header } from './components/layout/Header';
import { ProfilePage } from './components/dashboard/ProfilePage';
import LiquidEther from './components/effects/LiquidEther';
import { motion, AnimatePresence } from 'framer-motion';

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
  enter: (direction: number) => ({
    y: direction >= 0 ? 55 : -55,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      y: { type: 'spring', stiffness: 280, damping: 28, mass: 0.85 },
      opacity: { duration: 0.22, ease: 'easeOut' },
      scale: { duration: 0.22, ease: 'easeOut' },
    },
  },
  exit: (direction: number) => ({
    y: direction >= 0 ? 45 : -45,
    opacity: 0,
    scale: 0.95,
    transition: {
      y: { duration: 0.18, ease: [0.32, 0, 0.67, 0] },
      opacity: { duration: 0.15, ease: 'linear' },
      scale: { duration: 0.18, ease: 'easeIn' },
    },
  }),
};

function App() {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('active-tab') || 'profile';
    }
    return 'profile';
  });
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [direction, setDirection] = useState<number>(0);
  const [isProfileExiting, setIsProfileExiting] = useState(false);
  const [isHistoryExiting, setIsHistoryExiting] = useState(false);
  const [isDockVisible, setIsDockVisible] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const handleProfileExitComplete = () => {
    if (pendingTab) {
      const prevIdx = TAB_ORDER.indexOf(activeTab);
      const nextIdx = TAB_ORDER.indexOf(pendingTab);
      setDirection(nextIdx > prevIdx ? 1 : -1);
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
    setIsProfileExiting(false);
  };

  const handleHistoryExitComplete = () => {
    if (pendingTab) {
      const prevIdx = TAB_ORDER.indexOf(activeTab);
      const nextIdx = TAB_ORDER.indexOf(pendingTab);
      setDirection(nextIdx > prevIdx ? 1 : -1);
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
    setIsHistoryExiting(false);
  };

  const handleTabChange = (nextTab: string) => {
    if (nextTab === (pendingTab || activeTab)) return;

    const prevIdx = TAB_ORDER.indexOf(activeTab);
    const nextIdx = TAB_ORDER.indexOf(nextTab);
    const newDir = nextIdx > prevIdx ? 1 : -1;
    setDirection(newDir);

    if (isProfileExiting || isHistoryExiting) {
      setPendingTab(nextTab);
      return;
    }

    if (activeTab === 'profile' && nextTab !== 'profile') {
      // Trigger avatar reverse slide-down exit animation before transitioning
      setPendingTab(nextTab);
      setIsProfileExiting(true);
    } else if (activeTab === 'experience' && nextTab !== 'experience') {
      // Trigger lanyard pull-up exit animation before transitioning
      setPendingTab(nextTab);
      setIsHistoryExiting(true);
    } else {
      setActiveTab(nextTab);
    }
  };

  // Safety fallback in case animation completion event is dropped
  useEffect(() => {
    if (isProfileExiting) {
      const fallbackTimer = setTimeout(() => {
        handleProfileExitComplete();
      }, 750);
      return () => clearTimeout(fallbackTimer);
    }
  }, [isProfileExiting, pendingTab]);

  useEffect(() => {
    if (isHistoryExiting) {
      const fallbackTimer = setTimeout(() => {
        handleHistoryExitComplete();
      }, 650);
      return () => clearTimeout(fallbackTimer);
    }
  }, [isHistoryExiting, pendingTab]);

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={activeTab}
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="w-full"
        >
          <Suspense fallback={null}>
            {(() => {
              switch (activeTab) {
                case 'profile': return (
                  <ProfilePage 
                    onExploreProjects={() => handleTabChange('projects')} 
                    isDockVisible={isDockVisible}
                    isExiting={isProfileExiting}
                    onExitComplete={handleProfileExitComplete}
                  />
                );
                case 'projects': return <RegistryPage />;
                case 'experience': return (
                  <HistoryPage 
                    isExiting={isHistoryExiting}
                    onExitComplete={handleHistoryExitComplete}
                  />
                );
                case 'contact': return <ContactPage />;
                default: return (
                  <ProfilePage 
                    onExploreProjects={() => handleTabChange('projects')} 
                    isDockVisible={isDockVisible}
                    isExiting={isProfileExiting}
                    onExitComplete={handleProfileExitComplete}
                  />
                );
              }
            })()}
          </Suspense>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen selection:bg-[var(--theme-accent)] selection:text-white antialiased relative transition-colors overflow-x-clip">
      {/* MAGNETIC DOCK NAVIGATION */}
      <SystemDock 
        activeTab={pendingTab || activeTab} 
        setActiveTab={handleTabChange} 
        isDockVisible={isDockVisible}
        setIsDockVisible={setIsDockVisible}
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
      <main className="flex flex-col relative z-10 transition-all duration-500 pointer-events-none">
        {/* TOP TELEMETRY HEADER */}
        <Header 
          activeTab={activeTab}
        />

        {/* ACTIVE MODULE VIEWPORT */}
        <div ref={scrollContainerRef} className="px-4 sm:px-6 lg:px-8 pt-[76px] sm:pt-[84px] lg:pt-[92px] xl:pt-[104px] pb-20 lg:pb-24 pointer-events-none" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="max-w-[1600px] w-full mx-auto pointer-events-none">
             {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
