import React from 'react';

interface StatusIndicatorProps {
  status?: 'active' | 'processing' | 'warning' | 'offline';
  label?: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status = 'active', label, className }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
      case 'processing': return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)] animate-pulse';
      case 'warning': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]';
      case 'offline': return 'bg-grey-500 opacity-40';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor()}`} />
      {label && <span className="text-[0.6rem] font-mono tracking-widest text-tier-3 uppercase">{label}</span>}
    </div>
  );
};
