import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Header } from './components/layout/Header';
import { ProfilePage } from './components/dashboard/ProfilePage';
import LiquidEther from './components/effects/LiquidEther';
import { motion, AnimatePresence } from 'framer-motion';

import './styles/index.css';

import { SystemDock } from './components/layout/SystemDock';
import { inject } from '@vercel/analytics';

const RegistryPage = lazy(() => import('./components/dashboard/RegistryPage'));
const HistoryPage = lazy(() => import('./components/dashboard/HistoryPage'));
const ContactPage = lazy(() => import('./components/dashboard/ContactPage'));

inject();

const LIQUID_COLORS = ['#5227FF', '#FF9FFC', '#B497CF'];

function App() {
  const [activeTab, setActiveTab] = useState('profile');
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [isHomeExiting, setIsHomeExiting] = useState(false);
  const [isDockVisible, setIsDockVisible] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load persistence logic
  useEffect(() => {
    const savedTab = localStorage.getItem('active-tab');
    if (savedTab) setActiveTab(savedTab);
  }, []);

  useEffect(() => {
    localStorage.setItem('active-tab', activeTab);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  const handleTabChange = (nextTab: string) => {
    if (nextTab === activeTab && !pendingTab) return;
    if (isHomeExiting) return;

    if (activeTab === 'profile' && nextTab !== 'profile') {
      // Initiate avatar downward exit transition before switching pages
      setPendingTab(nextTab);
      setIsHomeExiting(true);
    } else {
      setActiveTab(nextTab);
    }
  };

  const handleHomeExitComplete = () => {
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
    setIsHomeExiting(false);
  };

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full"
        >
          <Suspense fallback={
            <div className="w-full min-h-[60vh] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            {(() => {
              switch (activeTab) {
                case 'profile': return (
                  <ProfilePage 
                    onExploreProjects={() => handleTabChange('projects')} 
                    isDockVisible={isDockVisible}
                    isExiting={isHomeExiting}
                    onExitComplete={handleHomeExitComplete}
                  />
                );
                case 'projects': return <RegistryPage />;
                case 'experience': return <HistoryPage />;
                case 'contact': return <ContactPage />;
                default: return <ProfilePage />;
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
        activeTab={pendingTab || activeTab} 
        setActiveTab={handleTabChange} 
        isDockVisible={isDockVisible}
        setIsDockVisible={setIsDockVisible}
      />

      {/* LIQUID ETHER FLUID SIMULATION BACKGROUND */}
      <LiquidEther
        colors={LIQUID_COLORS}
        mouseForce={20}
        cursorSize={130}
        persistence={0.92}
        autoDemo={true}
        autoSpeed={0.6}
        autoIntensity={3.2}
        className="fixed inset-0 z-0 pointer-events-none"
      />

      {/* MAIN SYSTEM VIEWPORT */}
      <main className="flex flex-col relative z-10 transition-all duration-500">
        {/* TOP TELEMETRY HEADER */}
        <Header 
          activeTab={activeTab}
        />

        {/* ACTIVE MODULE VIEWPORT */}
        <div ref={scrollContainerRef} className="px-5 pt-[95px] lg:pt-[110px] pb-24 lg:pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="max-w-[1600px] w-full mx-auto">
             {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
