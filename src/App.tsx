import { useState, useEffect, useRef } from 'react';
import { Header } from './components/layout/Header';
import { 
  ProfilePage, 
  RegistryPage, 
  HistoryPage, 
  ContactPage 
} from './components/dashboard/DashboardPages';
import DotGrid from './components/effects/DotGrid';
import { motion, AnimatePresence } from 'framer-motion';

import './styles/index.css';

import { SystemDock } from './components/layout/SystemDock';

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
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
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
      
      {/* MAGNETIC DOCK NAVIGATION */}
      <SystemDock 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDockVisible={isDockVisible}
        setIsDockVisible={setIsDockVisible}
      />

      {/* INTERACTIVE KINETIC GRID (Primary Background) */}
      <DotGrid className="fixed inset-0 -z-10" />

      {/* MAIN SYSTEM VIEWPORT */}
      <main className="flex flex-col relative transition-all duration-500">
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
