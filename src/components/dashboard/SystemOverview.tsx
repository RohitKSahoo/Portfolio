import React from 'react';
import { DashboardCard } from './DashboardCard';
import { MetricBar } from './MetricBar';
import { LogStream } from './LogStream';
import { Activity, Cpu, Database, Server, Terminal } from 'lucide-react';

export const SystemOverview: React.FC = () => {
  return (
    <div className="col-span-full grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Primary Metrics Panel */}
      <DashboardCard 
        title="SYSTEM_CORE_STATUS" 
        subtitle="OVERVIEW" 
        metadata="0x77_LIVE" 
        className="lg:col-span-2 min-h-[300px] border-[var(--border-active)] bg-white/[0.01]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 border-b border-[var(--border-muted)] pb-4">
               <div className="p-2 bg-[var(--theme-glow)] text-[var(--theme-accent)]">
                 <Activity size={20} />
               </div>
               <div className="flex flex-col">
                 <span className="text-[0.6rem] text-tier-3 font-mono">CORE_THERMAL_LOAD</span>
                 <span className="text-xl font-bold font-mono tracking-tighter text-tier-1 tabular-nums">42.5°C</span>
               </div>
            </div>

            <MetricBar label="CPU_LOAD (API_PIPELINES)" value="78%" percentage={78} />
            <MetricBar label="MEMORY_UTIL (ML_WORKLOADS)" value="65%" percentage={65} />
            <MetricBar label="DISK_IO (STREAM_BUFFER)" value="31%" percentage={31} />
          </div>

          <div className="flex flex-col gap-6">
             <div className="flex justify-between items-center text-[0.6rem] text-tier-3 font-mono border-b border-[var(--border-muted)] pb-2">
                <span>SYSTEM_HEALTH</span>
                <span className="text-green-500 font-bold">STABLE</span>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-[var(--border-muted)] flex flex-col gap-2">
                   <Server size={14} className="text-tier-3" />
                   <span className="text-[0.5rem] text-tier-3 font-mono">UPTIME</span>
                   <span className="text-sm font-bold font-mono text-tier-2 tabular-nums">1,248H</span>
                </div>
                <div className="p-4 border border-[var(--border-muted)] flex flex-col gap-2">
                   <Database size={14} className="text-tier-3" />
                   <span className="text-[0.5rem] text-tier-3 font-mono">QUERIES/S</span>
                   <span className="text-sm font-bold font-mono text-tier-2 tabular-nums">1.2K</span>
                </div>
                <div className="p-4 border border-[var(--border-muted)] flex flex-col gap-2">
                   <Cpu size={14} className="text-tier-3" />
                   <span className="text-[0.5rem] text-tier-3 font-mono">PROCESSES</span>
                   <span className="text-sm font-bold font-mono text-tier-2 tabular-nums">246_ACTIVE</span>
                </div>
                 <div className="p-4 border-[2px] border-[var(--theme-accent)] shadow-[0_0_15px_var(--theme-glow)] flex flex-col gap-2 bg-[var(--theme-glow)]">
                    <Activity size={14} className="text-[var(--theme-accent)]" />
                    <span className="text-[0.5rem] text-[var(--theme-accent)] font-mono font-bold tracking-widest">LATENCY // PRIMARY</span>
                    <span className="text-sm font-bold font-mono text-tier-2 tabular-nums">34MS</span>
                 </div>
             </div>
          </div>
        </div>
      </DashboardCard>

      {/* Log Feed Panel */}
      <DashboardCard 
        title="TELEMETRY_LOGS" 
        subtitle="STREAM" 
        metadata="VER_02" 
        className="lg:col-span-1"
      >
        <div className="mt-2 h-full flex flex-col">
          <LogStream />
          <div className="w-20 h-20 border border-[var(--border-active)] flex items-center justify-center text-3xl text-tier-3 bg-[var(--bg-black)] relative z-10">
            <Terminal size={32} />
          </div>
          <div className="mt-auto pt-4 border-t border-[var(--border-muted)] flex justify-between items-center text-[0.5rem] font-mono text-tier-3 opacity-40">
             <span>BUFFER: 1024KB</span>
             <span>STREAM: STABLE</span>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};
