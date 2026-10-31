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

function App() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDockVisible, setIsDockVisible] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load persistence logic
  useEffect(() => {
    const savedTab = localStorage.getItem('active-tab');
    if (savedTab) setActiveTab(savedTab);
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
    setActiveTab(nextTab);
  };

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="w-full"
        >
          <Suspense fallback={null}>
            {(() => {
              switch (activeTab) {
                case 'profile': return (
                  <ProfilePage 
                    onExploreProjects={() => handleTabChange('projects')} 
                    isDockVisible={isDockVisible}
                  />
                );
                case 'projects': return <RegistryPage />;
                case 'experience': return <HistoryPage />;
                case 'contact': return <ContactPage />;
                default: return <ProfilePage onExploreProjects={() => handleTabChange('projects')} />;
              }
            })()}
          </Suspense>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen selection:bg-[var(--theme-accent)] selection:text-white antialiased relative transition-colors">
      {/* MAGNETIC DOCK NAVIGATION */}
      <SystemDock 
        activeTab={activeTab} 
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
        <div ref={scrollContainerRef} className="px-5 pt-[95px] lg:pt-[110px] pb-24 lg:pb-24 pointer-events-none" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="max-w-[1600px] w-full mx-auto pointer-events-none">
             {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
