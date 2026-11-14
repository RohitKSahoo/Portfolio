import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Database, Mail } from 'lucide-react';
import { LiquidNavbar, LiquidNavItem } from '../effects/LiquidNavbar';

interface DockProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDockVisible: boolean;
  setIsDockVisible: (visible: boolean) => void;
}

const TAB_ORDER = ['profile', 'projects', 'experience', 'contact'] as const;

export const SystemDock: React.FC<DockProps> = ({ 
  activeTab, 
  setActiveTab, 
  isDockVisible, 
  setIsDockVisible 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initial peek animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDockVisible(true);
      setTimeout(() => setIsDockVisible(false), 2200);
    }, 400);
    return () => clearTimeout(timer);
  }, [setIsDockVisible]);

  // Peek dock when mouse approaches screen bottom
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerHeight - e.clientY < 75) {
        setIsDockVisible(true);
      } else if (!isHovered) {
        setIsDockVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered, setIsDockVisible]);

  const activeIndex = useMemo(() => {
    const idx = TAB_ORDER.indexOf(activeTab as any);
    return idx >= 0 ? idx : 0;
  }, [activeTab]);

  const navItems: LiquidNavItem[] = useMemo(() => [
    {
      id: 'profile',
      label: 'HOME',
      icon: <User size={18} strokeWidth={2.2} />,
      fx: 'glow'
    },
    {
      id: 'projects',
      label: 'PROJECTS',
      icon: <Database size={18} strokeWidth={2.2} />,
      fx: 'pop'
    },
    {
      id: 'experience',
      label: 'EXPERIENCE',
      icon: <Briefcase size={18} strokeWidth={2.2} />,
      fx: 'wave'
    },
    {
      id: 'contact',
      label: 'CONTACT',
      icon: <Mail size={18} strokeWidth={2.2} />,
      fx: 'drop'
    }
  ], []);

  const handleNavChange = (index: number) => {
    const target = TAB_ORDER[index];
    if (target && target !== activeTab) {
      setActiveTab(target);
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[200] pointer-events-none flex justify-center items-end pb-3 sm:pb-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDockVisible(false);
      }}
    >
      <motion.div
        initial={{ y: 90, opacity: 0 }}
        animate={{
          y: isDockVisible || isHovered || isMobile ? 0 : 70,
          opacity: 1,
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="pointer-events-auto"
      >
        <LiquidNavbar
          items={navItems}
          active={activeIndex}
          onChange={handleNavChange}
          tone="dark"
          compact={isMobile}
          sound={false}
        />
      </motion.div>
    </div>
  );
};

