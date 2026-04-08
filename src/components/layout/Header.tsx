import React, { useState, useEffect } from 'react';
import { StatusIndicator } from '../dashboard/StatusIndicator';
import { Sun, Moon, Menu } from 'lucide-react';

interface HeaderProps {
  activeTab?: string;
  onMenuToggle?: () => void;
}

const TAB_TITLES: Record<string, string> = {
  profile: 'DASHBOARD',
  projects: 'PROJECTS',
  experience: 'EXPERIENCE',
  metrics: 'METRICS',
  contact: 'CONTACT'
};

export const Header: React.FC<HeaderProps> = ({ activeTab = 'profile', onMenuToggle }) => {
  const [time, setTime] = useState(new Date());
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const savedTheme = localStorage.getItem('theme-mode') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme-mode', nextTheme);
  };

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${y}.${m}.${d} | ${hh}:${mm}`;
  };

  return (
    <header 
      className="fixed top-4 left-4 right-4 lg:top-6 lg:left-6 lg:right-6 h-16 lg:h-20 px-4 lg:px-8 flex justify-between items-center z-[130] transition-all duration-500 rounded-[1.25rem] border border-[var(--glass-border)]"
      style={{ 
        backgroundColor: 'var(--glass-bg)',
        backdropFilter: 'blur(var(--glass-blur)) saturate(150%)',
        boxShadow: '0 8px 32px 0 var(--glass-shadow)',
      }}
    >
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger */}
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-tier-3 hover:text-[var(--theme-accent)] transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-3">
             <span className="text-[var(--theme-accent)] font-mono text-xs opacity-50 font-bold tracking-tighter">/01</span>
             <h1 className="text-sm md:text-xl lg:text-2xl font-bold tracking-[0.1em] text-tier-1 uppercase truncate max-w-[200px] md:max-w-none">
               {TAB_TITLES[activeTab] || 'SYSTEM_OS'}
             </h1>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <span className="text-[0.45rem] lg:text-[0.55rem] text-tier-3 tracking-[0.3em] uppercase font-mono truncate max-w-[150px] md:max-w-none opacity-60">
               CURRENT_NODE // ACCESS_TERMINAL
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 lg:gap-10">
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex flex-col items-end gap-1">
            <span className="text-[0.55rem] text-tier-3 font-mono tracking-widest">SYSTEM_STATUS</span>
            <StatusIndicator status="active" label="STABLE_NODE_01" />
          </div>
          
          <div className="h-8 w-[1px] bg-[var(--border-muted)]" />

          <div className="flex flex-col items-end gap-1">
            <span className="text-[0.55rem] text-tier-3 font-mono tracking-widest">LOCAL_TIME</span>
            <span className="text-xs font-mono text-tier-2 tabular-nums">
              {formatDate(time)}
            </span>
          </div>

          <div className="h-8 w-[1px] bg-[var(--border-muted)]" />

          <div className="flex flex-col items-end gap-1">
            <span className="text-[0.55rem] text-tier-3 font-mono tracking-widest">UPLINK_STATUS</span>
            <span className="text-[0.65rem] text-tier-2 font-mono flex items-center gap-2">
              <span className="w-1 h-1 rounded-full animate-pulse bg-[var(--theme-accent)]" />
              ENCRYPTED
            </span>
          </div>
        </div>

        <button 
          onClick={toggleTheme}
          className="p-2 lg:p-2.5 border border-[var(--border-muted)] hover:border-[var(--border-active)] bg-white/[0.01] hover:bg-[var(--theme-glow)] transition-all text-tier-3 hover:text-[var(--theme-accent)] rounded-lg"
          title="TOGGLE_DARK_LIGHT_MODE"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
};
