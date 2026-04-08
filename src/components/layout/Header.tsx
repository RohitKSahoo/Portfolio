import React, { useState, useEffect } from 'react';
import { StatusIndicator } from '../dashboard/StatusIndicator';
import { Sun, Moon, Menu, Mail } from 'lucide-react';

interface HeaderProps {
  activeTab?: string;
  onMenuToggle?: () => void;
}

const TAB_TITLES: Record<string, { title: string; num: string }> = {
  profile: { title: 'DASHBOARD', num: '/01' },
  projects: { title: 'PROJECTS', num: '/02' },
  experience: { title: 'EXPERIENCE', num: '/03' },
  contact: { title: 'CONTACT', num: '/04' }
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

  const currentTab = TAB_TITLES[activeTab] || TAB_TITLES.profile;

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
          <div className="flex items-center gap-6">
             <span className="text-[var(--theme-accent)] font-mono text-lg font-black tracking-tighter">
               {currentTab.num}
             </span>
             <h1 className="text-sm md:text-xl lg:text-2xl font-bold tracking-[0.1em] text-tier-1 uppercase truncate max-w-[200px] md:max-w-none">
               {currentTab.title}
             </h1>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 lg:gap-8">
        <a 
          href="mailto:rohitkumarsahoo37@gmail.com"
          className="hidden md:flex items-center gap-3 px-4 py-2.5 border-2 border-[var(--theme-accent)] bg-[var(--theme-accent)]/10 hover:bg-[var(--theme-accent)] text-[var(--theme-accent)] hover:text-black transition-all rounded-lg font-mono text-[0.65rem] tracking-[0.2em] uppercase font-bold shadow-[0_0_15px_rgba(var(--theme-accent-rgb),0.15)]"
        >
          <Mail size={14} strokeWidth={2.5} />
          <span>LETS_CONNECT</span>
        </a>

        <div className="hidden lg:flex items-center gap-8">
          <div className="flex flex-col items-end gap-1">
            <span className="text-[0.55rem] text-tier-3 font-mono tracking-widest uppercase truncate max-w-[200px]">
              BHUBANESWAR, OD // LOCAL_TIME
            </span>
            <span className="text-xs font-mono text-tier-2 tabular-nums">
              {formatDate(time)}
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
