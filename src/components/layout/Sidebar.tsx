import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, BarChart3, Database, Mail, Terminal } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { id: 'profile', icon: User, label: 'DASHBOARD' },
  { id: 'projects', icon: Database, label: 'PROJECTS' },
  { id: 'experience', icon: Briefcase, label: 'EXPERIENCE' },
  { id: 'metrics', icon: BarChart3, label: 'METRICS' },
  { id: 'contact', icon: Mail, label: 'CONTACT' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const [mouseY, setMouseY] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (sidebarRef.current) {
      const rect = sidebarRef.current.getBoundingClientRect();
      setMouseY(e.clientY - rect.top);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        ref={sidebarRef}
        onMouseMove={handleMouseMove}
        initial={false}
        animate={{ 
          x: isOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -120 : 0),
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          width: 80,
          backgroundColor: 'var(--glass-bg)',
          backdropFilter: 'blur(var(--glass-blur)) saturate(150%)',
          border: '1px solid var(--glass-border)',
          boxShadow: '0 8px 32px 0 var(--glass-shadow)',
        }}
        className={`fixed left-6 top-[154px] bottom-10 flex flex-col items-center py-8 gap-12 z-[120] transition-all overflow-hidden group/sidebar rounded-[1.25rem] lg:left-6 lg:translate-x-0 ${!isOpen ? 'pointer-events-none lg:pointer-events-auto' : ''}`}
      >
        {/* Mobile Close Indicator */}
        <div className="lg:hidden absolute top-2 w-8 h-1 bg-white/10 rounded-full" />
      {/* Reactive Edge Glow */}
      <div 
        className="absolute right-0 top-0 w-[2px] h-full pointer-events-none transition-opacity duration-500 opacity-0 group-hover/sidebar:opacity-100"
        style={{
          background: `radial-gradient(circle at 50% ${mouseY}px, var(--theme-accent) 0%, transparent 150px)`,
          filter: 'drop-shadow(0 0 8px var(--theme-accent))'
        }}
      />

      <div className="w-10 h-10 border border-[var(--border-muted)] flex items-center justify-center text-tier-1 mb-4 bg-white/[0.03] relative z-10 transition-all group-hover:border-[var(--theme-accent)]/30 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]">
        <Terminal size={18} />
      </div>
      
      <div className="flex flex-col gap-6 w-full relative z-10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <div 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className="relative w-full h-12 flex items-center justify-center cursor-pointer group/item"
            >
              {/* Active Indicator */}
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 w-[2px] h-2/3 bg-[var(--theme-accent)] shadow-[2px_0_15px_var(--theme-glow)]"
                />
              )}

              {/* Hover highlight background */}
              <div className="absolute inset-x-2 inset-y-0 bg-white/[0.02] opacity-0 group-hover/item:opacity-100 transition-opacity rounded-sm" />

              <div className={`transition-all duration-300 flex items-center justify-center relative z-10 ${isActive ? 'text-[var(--theme-accent)] scale-110 drop-shadow-[0_0_8px_var(--theme-glow)]' : 'text-tier-3 hover:text-tier-2'}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>

              {/* Tooltip - Now individual based on hoveredItem */}
              <AnimatePresence>
                {hoveredItem === item.id && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="absolute left-full ml-4 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/10 text-[0.6rem] font-mono text-tier-1 whitespace-nowrap z-50 pointer-events-none tracking-[0.2em] shadow-2xl"
                  >
                    <span className="text-[var(--theme-accent)] opacity-50 mr-2">//</span>
                    {item.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col gap-4 items-center relative z-10">
         <div className="text-[0.45rem] font-mono text-tier-3 opacity-30 vertical-text py-4 border-t border-white/5 w-full text-center tracking-[0.3em]">
            SYSTEM_OS_V1.0.4
         </div>
         <div className="w-9 h-9 rounded-sm border border-white/5 flex items-center justify-center text-tier-3 hover:text-[var(--theme-accent)] hover:border-[var(--theme-accent)]/30 transition-all cursor-pointer bg-white/[0.02] hover:bg-[var(--theme-accent)]/5 group/rks">
            <span className="text-[0.55rem] font-bold tracking-tighter">RKS</span>
            
            {/* Tiny corners for the RKS box */}
            <div className="absolute -top-px -left-px w-1 h-1 border-t border-l border-[var(--theme-accent)] opacity-0 group-hover/rks:opacity-100 transition-opacity" />
            <div className="absolute -bottom-px -right-px w-1 h-1 border-b border-r border-[var(--theme-accent)] opacity-0 group-hover/rks:opacity-100 transition-opacity" />
         </div>
      </div>
    </motion.aside>
    </>
  );
};
