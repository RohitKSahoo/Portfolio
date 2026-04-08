import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface MetricBarProps {
  label: string;
  value: string;
  percentage: number;
}

export const MetricBar: React.FC<MetricBarProps> = ({ label, value, percentage }) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const springValue = useSpring(0, { stiffness: 40, damping: 20 });
  const displayValue = useTransform(springValue, (latest) => Math.round(latest));

  useEffect(() => {
    if (isMounted) {
      springValue.set(percentage);
    }
  }, [isMounted, percentage, springValue]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end mb-1">
        <span className="text-[0.6rem] text-tier-3 tracking-[0.2em] font-mono leading-none">{label}</span>
        <div className="flex items-baseline gap-1 tabular-nums">
          <motion.span className="text-[0.7rem] text-tier-2 font-mono">{displayValue}</motion.span>
          <span className="text-[0.5rem] text-tier-3 font-mono opacity-60">%</span>
          <span className="text-[0.4rem] text-tier-3 font-mono opacity-40 ml-1">({value})</span>
        </div>
      </div>
      <div className="h-[2px] w-full bg-[#1a1a1a] relative overflow-visible">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: isMounted ? `${percentage}%` : 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-0 left-0 h-full bg-[var(--theme-accent)] relative"
        >
          {/* Endpoint Pulse */}
          <motion.div 
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-[6px] bg-[var(--theme-accent)] shadow-[0_0_8px_var(--theme-glow)]"
          />
        </motion.div>
      </div>
    </div>
  );
};
