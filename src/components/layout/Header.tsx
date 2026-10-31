import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';

interface HeaderProps {
  activeTab?: string;
  onMenuToggle?: () => void;
}

const TAB_TITLES: Record<string, string> = {
  profile: 'Home',
  projects: 'Projects',
  experience: 'Experience',
  contact: 'Contact'
};

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}*^?#';

const useScrambleText = (targetText: string = '', glyphs = GLYPHS, speed = 25) => {
  const [displayText, setDisplayText] = useState(targetText || '');

  useEffect(() => {
    if (!targetText) {
      setDisplayText('');
      return;
    }
    let iteration = 0;
    const maxIterations = targetText.length * 3;
    const interval = setInterval(() => {
      setDisplayText(() => {
        return targetText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration / 3) {
              return targetText[index];
            }
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join('');
      });

      iteration += 1;
      if (iteration > maxIterations) {
        setDisplayText(targetText);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [targetText, glyphs, speed]);

  return displayText;
};

export const Header: React.FC<HeaderProps> = ({ activeTab = 'profile', onMenuToggle }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${y}.${m}.${d} | ${hh}:${mm}`;
  };

  const currentTitle = TAB_TITLES[activeTab] || TAB_TITLES.profile;
  const scrambledTitle = useScrambleText(currentTitle, GLYPHS, 25);

  return (
    <header className="fixed top-5 left-5 right-5 h-16 lg:h-20 px-4 lg:px-8 flex justify-between items-center z-[130] transition-all duration-500 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden pointer-events-auto">
      {/* Subtle accent line on top */}
      <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-[var(--theme-accent)]/20 to-transparent" />

      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-baseline">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-widest text-tier-1 uppercase truncate max-w-[200px] md:max-w-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:relative lg:left-auto lg:top-auto lg:translate-x-0 lg:translate-y-0">
              {scrambledTitle}
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
      </div>
    </header>
  );
};
