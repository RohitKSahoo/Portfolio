import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, BarChart3, Database, Mail } from 'lucide-react';

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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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

      <div className={`fixed left-4 lg:left-6 top-[calc((100vh+80px)/2)] -translate-y-1/2 z-[120] flex flex-col gap-4 transition-all ${!isOpen ? 'pointer-events-none lg:pointer-events-auto' : ''}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.div 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              initial={false}
              animate={{
                scale: isActive ? 1.05 : 1,
                borderColor: isActive ? 'var(--theme-accent)' : 'var(--glass-border)',
              }}
              style={{
                width: 64,
                height: 64,
                backgroundColor: 'var(--glass-bg)',
                backdropFilter: 'blur(var(--glass-blur)) saturate(150%)',
                border: '1px solid var(--glass-border)',
                boxShadow: isActive ? '0 0 25px rgba(239, 68, 68, 0.25)' : '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: '1.25rem',
              }}
              className="relative flex items-center justify-center cursor-pointer group/item overflow-hidden"
            >
              {/* Active Glow Indicator */}
              {isActive && (
                <motion.div 
                   layoutId="active-bg"
                   className="absolute inset-0 bg-[var(--theme-accent)]/5 pointer-events-none"
                />
              )}

              <div className={`transition-all duration-300 flex items-center justify-center relative z-10 ${isActive ? 'text-[var(--theme-accent)] drop-shadow-[0_0_12px_var(--theme-glow)]' : 'text-tier-3 group-hover/item:text-tier-1'}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredItem === item.id && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="absolute left-full ml-4 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/10 text-[0.6rem] font-mono text-tier-1 whitespace-nowrap z-50 pointer-events-none tracking-[0.2em] shadow-2xl rounded-sm"
                  >
                    <span className="text-[var(--theme-accent)] opacity-50 mr-2">//</span>
                    {item.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </>
  );
};
