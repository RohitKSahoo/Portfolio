import React from 'react';

interface DashboardCardProps {
  title?: string;
  subtitle?: string;
  metadata?: string;
  children: React.ReactNode;
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, subtitle, metadata, children, className }) => {
  return (
    <div className={`dashboard-card relative group flex flex-col gap-4 ${className}`}>
      {(title || subtitle || metadata) && (
        <div className="flex flex-col gap-1 mb-2">
          <div className="flex justify-between items-baseline">
            {subtitle && (
              <span className="text-[0.7rem] text-tier-3 uppercase tracking-widest font-mono font-bold">
                {subtitle}
              </span>
            )}
            {metadata && (
              <span className="text-[0.6rem] text-tier-3 opacity-40 group-hover:opacity-100 uppercase tracking-widest font-mono transition-opacity">
                {metadata}
              </span>
            )}
          </div>
          {title && (
            <h3 className="text-xl pt-0.5 text-tier-2 font-semibold tracking-widest uppercase leading-none">
              {title}
            </h3>
          )}
        </div>
      )}
      <div className="text-tier-3 text-sm font-light leading-relaxed">
        {children}
      </div>
    </div>
  );
};
