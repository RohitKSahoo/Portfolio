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

  // Background pre-warm 3D Lanyard & History WebGL context 600ms after load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldPreloadHistory(true);
    }, 600);
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

  const handleTabChange = (nextTab: string) => {
    if (nextTab === activeTab) return;

    const prevIdx = TAB_ORDER.indexOf(activeTab);
    const nextIdx = TAB_ORDER.indexOf(nextTab);
    const newDir = nextIdx > prevIdx ? 1 : -1;
    setDirection(newDir);
    setActiveTab(nextTab);
  };

  const renderContent = () => {
    return (
      <div className="w-full relative">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          {activeTab !== 'experience' && (
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
          className={`w-full ${activeTab === 'experience' ? 'block' : 'hidden'}`}
          aria-hidden={activeTab !== 'experience'}
        >
          <Suspense fallback={null}>
            {(shouldPreloadHistory || activeTab === 'experience') && (
              <HistoryPage isActive={activeTab === 'experience'} />
            )}
          </Suspense>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen selection:bg-[var(--theme-accent)] selection:text-white antialiased relative transition-colors overflow-x-clip">
      {/* MAGNETIC DOCK NAVIGATION */}
      <SystemDock 
        activeTab={activeTab} 
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
      <main className="flex flex-col relative z-10 transition-all duration-500 pointer-events-none">
        {/* TOP TELEMETRY HEADER */}
        <Header 
          activeTab={activeTab}
        />

        {/* ACTIVE MODULE VIEWPORT */}
        <div ref={scrollContainerRef} className="px-4 sm:px-6 lg:px-8 pt-[78px] sm:pt-[92px] lg:pt-[112px] pb-20 lg:pb-24 pointer-events-none" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="max-w-[1600px] w-full mx-auto pointer-events-none">
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
