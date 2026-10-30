import { useState, useEffect, useRef } from 'react';
import { Header } from './components/layout/Header';
import { 
  ProfilePage, 
  RegistryPage, 
  HistoryPage, 
  ContactPage 
} from './components/dashboard/DashboardPages';
import LiquidEther from './components/effects/LiquidEther';
import { motion, AnimatePresence } from 'framer-motion';

import './styles/index.css';

import { SystemDock } from './components/layout/SystemDock';
import TargetCursor from './components/effects/TargetCursor';
import { inject } from '@vercel/analytics';

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

  useEffect(() => {
    localStorage.setItem('active-tab', activeTab);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          {(() => {
            switch (activeTab) {
              case 'profile': return (
                <ProfilePage 
                  onExploreProjects={() => setActiveTab('projects')} 
                  isDockVisible={isDockVisible}
                />
              );
              case 'projects': return <RegistryPage />;
              case 'experience': return <HistoryPage />;
              case 'contact': return <ContactPage />;
              default: return <ProfilePage />;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen selection:bg-[var(--theme-accent)] selection:text-white antialiased relative transition-colors">
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor={true}
        parallaxOn={true}
      />
      
      {/* MAGNETIC DOCK NAVIGATION */}
      <SystemDock 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
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
