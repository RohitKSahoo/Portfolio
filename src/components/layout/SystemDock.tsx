import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { User, Briefcase, Database, Mail } from 'lucide-react';

interface DockProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDockVisible: boolean;
  setIsDockVisible: (visible: boolean) => void;
}

const navItems = [
  { id: 'profile', icon: User, label: 'DASHBOARD' },
  { id: 'projects', icon: Database, label: 'PROJECTS' },
  { id: 'experience', icon: Briefcase, label: 'EXPERIENCE' },
  { id: 'contact', icon: Mail, label: 'CONTACT' },
];

const DockItem = ({ 
  item, 
  activeTab, 
  setActiveTab, 
  mouseX 
}: { 
  item: typeof navItems[0], 
  activeTab: string, 
  setActiveTab: (tab: string) => void,
  mouseX: any 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isActive = activeTab === item.id;
  
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [60, 100, 60]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      onClick={() => setActiveTab(item.id)}
      style={{ width }}
      className="aspect-square relative flex items-center justify-center cursor-pointer group"
    >
      <motion.div 
        ref={ref}
        onClick={() => setActiveTab(item.id)}
        style={{ 
          width, 
          height: width,
          y: useTransform(width, [60, 100], [0, -20]) 
        }}
        className="absolute bottom-0 rounded-xl transition-colors duration-300 flex items-center justify-center shadow-lg z-10"
      >
        <div className={`absolute inset-0 rounded-xl transition-colors duration-300 bg-[#0a0a0a] ${
          isActive 
            ? 'border border-[var(--theme-accent)] shadow-[0_0_20px_rgba(var(--theme-accent-rgb),0.25)]' 
            : 'border border-white/10 group-hover:border-white/20'
        }`} />
        
        {isActive && (
          <div className="absolute inset-0 rounded-xl bg-[var(--theme-accent)]/20 pointer-events-none" />
        )}
        
        <div className={`relative z-10 transition-all duration-300 ${
          isActive ? 'text-[var(--theme-accent)] scale-110' : 'text-tier-3 group-hover:text-tier-1'
        }`}>
          <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        </div>

        {/* Tooltip */}
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="bg-[#0a0a0a] border border-white/10 px-2.5 py-1 rounded-lg whitespace-nowrap">
             <span className="text-[9px] font-black tracking-[.2em] text-white uppercase">{item.label}</span>
          </div>
        </div>

        {/* Active Indicator Removed */}
      </motion.div>
    </motion.div>
  );
};

export const SystemDock: React.FC<DockProps> = ({ activeTab, setActiveTab, isDockVisible, setIsDockVisible }) => {
  const mouseX = useMotionValue(Infinity);
  const [isHovered, setIsHovered] = useState(false);

  // Initial landing animation: Show then Hide
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDockVisible(true);
      setTimeout(() => setIsDockVisible(false), 2000);
    }, 500);
    return () => clearTimeout(timer);
  }, []); // Only run once on mount

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Show dock when cursor is near the bottom (within 35px)
      if (window.innerHeight - e.clientY < 35) {
        setIsDockVisible(true);
      } else if (!isHovered) {
        setIsDockVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered, setIsDockVisible]);

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 h-32 z-[200] pointer-events-none flex justify-center items-end pb-3 lg:pb-5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDockVisible(false);
      }}
    >
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: isDockVisible || isHovered ? 0 : 75, 
          opacity: 1,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
        className="flex items-end gap-4 p-2 px-4 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl relative pointer-events-auto h-[76px]"
      >
        {/* Subtle accent line on top */}
        <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-[var(--theme-accent)]/20 to-transparent" />
        
        {navItems.map((item) => (
          <DockItem 
            key={item.id} 
            item={item} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            mouseX={mouseX} 
          />
        ))}
      </motion.div>
    </div>
  );
};
