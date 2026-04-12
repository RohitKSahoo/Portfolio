import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CursorGradient } from './components/CursorGradient';
import { 
  ProfilePage, 
  RegistryPage, 
  HistoryPage, 
  ContactPage 
} from './components/dashboard/DashboardPages';
import DotGrid from './components/effects/DotGrid';
import { motion, AnimatePresence } from 'framer-motion';

import './styles/index.css';

function App() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load persistence logic
  useEffect(() => {
    const savedTab = localStorage.getItem('active-tab');
    if (savedTab) setActiveTab(savedTab);
  }, []);

  useEffect(() => {
    localStorage.setItem('active-tab', activeTab);
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
              case 'profile': return <ProfilePage onExploreProjects={() => setActiveTab('projects')} />;
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
    <div className="min-h-screen selection:bg-[var(--theme-accent)] selection:text-white antialiased relative transition-colors overflow-x-hidden">
      
      {/* PERSISTENT SIDEBAR */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* INTERACTIVE KINETIC GRID (Primary Background) */}
      <DotGrid 
        dotSize={2} 
        gap={32} 
        baseColor="#1a1a1a" 
        activeColor="#f43f5e" 
      />

      {/* MAIN SYSTEM VIEWPORT */}
      <main className={`lg:pl-[88px] flex flex-col h-screen overflow-hidden relative transition-all duration-500 ${isSidebarOpen ? 'blur-sm lg:blur-none pointer-events-none lg:pointer-events-auto' : ''}`}>
        {/* TOP TELEMETRY HEADER */}
        <Header 
          activeTab={activeTab}
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        />

        {/* ACTIVE MODULE VIEWPORT */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-[30px] pt-[120px] lg:pt-[134px] pb-12 lg:pb-[30px] custom-scrollbar scroll-smooth">
          <div className="max-w-[1600px] w-full mx-auto">
             {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
