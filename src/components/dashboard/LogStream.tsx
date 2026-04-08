import React, { useState, useEffect, useRef } from 'react';

const LOG_MESSAGES = [
  "[INFO] Initializing distributed modules...",
  "[OK] API gateway stabilized (v1.2)",
  "[INFO] Syncing database shards...",
  "[WARN] Cache miss spike detected (region: AP-SOUTH)",
  "[OK] Load balancer normalized traffic",
  "[INFO] Streaming telemetry packets...",
  "[OK] Heartbeat pulse verified",
  "[SECURE] Auth gateway validated tokens"
];

export const LogStream: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial logs
    setLogs(LOG_MESSAGES.slice(0, 5));

    const interval = setInterval(() => {
      setLogs((prev) => {
        const nextLog = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
        const newLogs = [...prev, nextLog];
        // Keep last 15 logs
        return newLogs.slice(-15);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center bg-[var(--border-muted)] px-2 py-1 border-b border-white/5">
        <span className="text-[0.55rem] text-tier-3 tracking-[0.2em] font-mono">LIVE_SYSTEM_LOGS</span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="h-32 overflow-y-auto scrollbar-none font-mono text-[0.6rem] text-tier-3 flex flex-col gap-1 p-2 bg-[var(--bg-black)]/50"
      >
        {logs.map((log, i) => (
          <div key={i} className={`opacity-80 hover:opacity-100 transition-opacity ${
            log.includes('[OK]') ? 'text-[var(--theme-accent)]' : 
            log.includes('[WARN]') ? 'text-yellow-600' : 
            log.includes('[SECURE]') ? 'text-[var(--theme-accent)] font-bold' : ''
          }`}>
             <span className="mr-2 opacity-30">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
             {log}
          </div>
        ))}
      </div>
    </div>
  );
};
