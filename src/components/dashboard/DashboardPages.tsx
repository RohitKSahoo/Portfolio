import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardCard } from './DashboardCard';
import { MetricBar } from './MetricBar';
import { SystemOverview } from './SystemOverview';
import { StatusIndicator } from './StatusIndicator';
import { Code, ExternalLink, Github, Terminal, Zap, Hash, Mail } from 'lucide-react';
import { SystemAvatar } from '../SystemAvatar';

export const ProfilePage = ({ onExploreProjects }: { onExploreProjects?: () => void }) => {
  const [displayName, setDisplayName] = React.useState("ROHIT KUMAR SAHOO");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%#!@$*";

  React.useEffect(() => {
    let iterations = 0;
    const target = "ROHIT KUMAR SAHOO";
    const interval = setInterval(() => {
      setDisplayName(prev => 
        target.split("").map((char, index) => {
          if (index < iterations) return target[index];
          if (char === " ") return " ";
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );
      if (iterations >= target.length) clearInterval(interval);
      iterations += 1/3;
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full">
      <div className="relative min-h-[600px] lg:min-h-[calc(100vh-164px)] border-none bg-transparent overflow-hidden flex flex-col justify-between p-0">
        {/* Background/Avatar Center */}
        <div className="absolute inset-0 flex justify-center items-center z-0">
           <div className="relative w-full h-full max-w-xl pointer-events-none flex items-center justify-center">
              <SystemAvatar 
                className="w-[120%] h-[120%] lg:w-full lg:h-full opacity-40 lg:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-black)] via-transparent to-[var(--bg-black)]/40 pointer-events-none" />
           </div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col min-h-[inherit] justify-between p-4 lg:p-6 lg:px-8">
          {/* Top Section */}
          <div className="flex flex-col lg:flex-row justify-between gap-8 items-start w-full">
            {/* Left Column */}
            <div className="flex flex-col gap-4 lg:gap-6 max-w-lg">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-[var(--theme-accent)] animate-pulse shadow-[0_0_8px_var(--theme-accent)]" />
                 <span className="text-[0.6rem] lg:text-[0.7rem] text-tier-3 font-mono font-bold tracking-[0.4em] uppercase">UPLINK_ACTIVE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black tracking-tightest leading-[1.1] text-tier-1 uppercase">
                CS_STUDENT & <br /> Systems_Builder <br /> Based in India
              </h2>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6 lg:gap-8 lg:text-right lg:items-end">
              <p className="text-[0.75rem] lg:text-[0.95rem] text-tier-2 font-medium leading-[1.6] max-w-[280px] lg:max-w-sm uppercase tracking-wide opacity-80">
                EXPLORING REAL-TIME SYSTEMS, BACKEND ARCHITECTURES, AND UNCONVENTIONAL IDEAS — [REDACTED]
              </p>
            <div className="flex flex-col sm:flex-row lg:self-end">
              <button 
                onClick={onExploreProjects}
                className="group relative px-6 py-2.5 lg:px-8 lg:py-3 bg-[var(--theme-accent)] text-black font-black text-[0.6rem] lg:text-xs uppercase tracking-[0.3em] hover:bg-white transition-all overflow-hidden flex items-center gap-4 w-fit shadow-[0_0_20px_rgba(var(--theme-accent-rgb),0.3)]"
              >
                <span>EXPLORE_PROJECTS</span>
                <Zap size={14} fill="currentColor" />
              </button>
            </div>
            </div>
          </div>

          {/* Bottom Section: Name Overlay */}
          <div className="mt-auto w-full pt-10 pb-0 pointer-events-none">
             <h1 className="text-[10vw] lg:text-[6.8vw] font-black tracking-tighter leading-none text-tier-1 drop-shadow-[0_0_50px_rgba(var(--theme-accent-rgb),0.2)] uppercase whitespace-nowrap text-center lg:text-left translate-y-3 lg:translate-y-4">
               {displayName}<span className="inline-block w-[1.2vw] h-[1.2vw] bg-[var(--theme-accent)] ml-2 align-baseline translate-y-[-0.3vw]" />
             </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

const PROJECTS = [
  { 
    id: 'P_01', 
    name: 'PAUSIFY', 
    ver: '1.0.0',
    details: ['Real-time audio pipeline (JNI + C++)', '<50ms latency on 16khz streams', 'VAD + Speaker Recognition + Yamnet'],
    architecture: 'State-machine driven audio control engine with low-latency signal processing and noise robustness',
    metrics: { LATENCY: '<50ms', DETECTION: 'High', STABILITY: 'Fault-Tolerant' },
    stack: ['C++', 'JNI', 'Python'],
    access: 'PUBLIC',
    github: 'https://github.com/RohitKSahoo/Pausify',
    image: '/pausify_module_1775283678626.png'
  },
  { 
    id: 'P_02', 
    name: 'SOSAFE', 
    ver: '1.2.0',
    details: ['WebRTC Audio streaming (P2P)', 'Live location tracking (Firestore)', 'Cloud fallback (Cloudinary)'],
    architecture: 'Hybrid real-time communication system with dynamic failover between P2P and Cloud streaming',
    metrics: { SYNC_LATENCY: '<1s', RELIABILITY: 'High', STABILITY: 'Multi-Channel' },
    stack: ['Flutter', 'WebRTC', 'Firebase'],
    access: 'PUBLIC',
    github: 'https://github.com/RohitKSahoo/sosafe',
    image: '/sosafe_module_1775283699833.png'
  },
  { 
    id: 'P_03', 
    name: 'AUTOCOMMITBOT', 
    ver: '1.1.0',
    details: ['AI-generated commits (Gemini API)', 'Diff analysis via GitPython', 'Background Execution (Task Scheduler)'],
    architecture: 'Autonomous CLI agent for context-aware version control with failsafe fallback execution',
    metrics: { AUTOMATION: 'High', FAILOVER: 'Enabled', MODE: 'Background' },
    stack: ['Python', 'Gemini', 'Bash'],
    access: 'PUBLIC',
    github: 'https://github.com/RohitKSahoo/auto-commit-bot',
    image: '/autocommit_module_1775283716495.png'
  },
  { 
    id: 'P_04', 
    name: 'SYS_MONITOR_UI', 
    ver: '0.9.0',
    details: ['Real-time metric visualization', 'System telemetry log streaming', 'Dashboard-driven UI Architecture'],
    architecture: 'Frontend system interface simulating backend state, metrics, and operational status',
    metrics: { UI_LATENCY: 'Low', RENDER: '<100ms', DATA_FLOW: 'Real-Time' },
    stack: ['React', 'Framer', 'Tailwind'],
    access: 'INTERNAL',
    github: 'https://github.com/RohitKSahoo',
    image: '/monitor_module_ui_1775283735380.png'
  }
];

// Triple the array for seamless infinite-feeling scroll
const INFINITE_PROJECTS = [...PROJECTS, ...PROJECTS, ...PROJECTS];

const ProjectModuleCard = ({ project }: { project: typeof PROJECTS[0] }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div 
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={`dashboard-card h-full flex flex-col gap-6 p-6 bg-[var(--bg-black)] border-[var(--border-muted)] transition-all duration-300 ${isHovered ? 'ring-1 ring-[var(--theme-accent)] shadow-[0_20px_50px_rgba(0,0,0,0.6)] border-[var(--theme-accent)]/30' : ''}`}>
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-0.5">
            <span className="text-[0.6rem] lg:text-[0.7rem] text-tier-3 opacity-40 font-mono tracking-widest">{project.id}</span>
            <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-tier-1 uppercase">{project.name}</h3>
          </div>
          <span className="text-[0.5rem] lg:text-[0.6rem] px-2 py-0.5 border border-[var(--border-muted)] text-tier-3 font-mono opacity-60">
            SYS_{project.ver}
          </span>
        </div>

        <div className="relative aspect-video w-full border border-[var(--border-muted)] overflow-hidden bg-black/40">
           <img 
             src={project.image} 
             alt={project.name}
             className="w-full h-full object-cover opacity-20 grayscale group-hover:opacity-40 group-hover:grayscale-0 transition-all duration-700"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-black)] to-transparent" />
        </div>

        <div className="flex flex-col gap-5">
           <div className="flex flex-col gap-2.5">
              {project.details.map((d, j) => (
                <div key={j} className="flex items-start gap-3 text-[0.6rem] font-mono text-tier-3 font-medium">
                   <div className="w-1 h-1 bg-[var(--theme-accent)] mt-1.5 shrink-0 shadow-[0_0_8px_var(--theme-accent)]" />
                   <span className="uppercase tracking-wide leading-relaxed">{d}</span>
                </div>
              ))}
           </div>
           
           <div className="flex flex-col gap-2 pt-4 border-t border-[var(--border-muted)]">
             <span className="text-[0.45rem] text-tier-3 opacity-30 font-mono tracking-widest">ARCHITECTURE // FLOW:</span>
             <p className="text-[0.6rem] text-tier-3 font-light leading-snug uppercase italic opacity-70">
               {project.architecture}
             </p>
           </div>

           <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 pt-4 border-t border-[var(--border-muted)]">
              {Object.entries(project.metrics).map(([k, v], i) => (
                <div key={i} className="flex justify-between text-[0.5rem] font-mono border-b border-white/5 pb-1">
                  <span className="text-tier-3 opacity-30 uppercase">{k}</span>
                  <span className="text-[var(--theme-accent)] font-bold">{v}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="mt-auto pt-6 border-t border-[var(--border-muted)] flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
          <span className="text-[0.55rem] tracking-[0.2em] text-tier-3 font-mono font-bold uppercase">UPLINK: {project.access}</span>
          <a 
            href={project.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[0.55rem] text-[var(--theme-accent)] font-mono font-bold hover:translate-x-1 transition-all"
          >
             <span>SRC_UPLINK</span>
             <Github size={12} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export const RegistryPage = () => (
  <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="flex justify-between items-end mb-4">
      <div className="flex flex-col gap-1">
        <span className="section-label mb-0">PROJECT_REGISTRY // LOGS</span>
        <span className="text-[0.45rem] font-mono text-tier-3 opacity-30 uppercase tracking-[0.3em]">ALL_NODES_ACTIVE // STATIC_VIEW</span>
      </div>
      <span className="text-[0.45rem] font-mono text-tier-3 opacity-20 tracking-tighter uppercase font-bold tracking-widest">[ GRID_MODE ]</span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {PROJECTS.map((p) => (
        <ProjectModuleCard key={p.id} project={p} />
      ))}
    </div>
  </div>
);

export const HistoryPage = () => (
  <div className="max-w-4xl flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <span className="section-label">HISTORY // EXPERIENCE</span>
    <div className="flex flex-col gap-0">
      {[
        { role: 'BACKEND_ENGINEER_INTERNAL', period: '2023.08 - PRESENT', company: 'SILICON_V_LABS', logs: ['Engineered high-concurrency API pipelines handling 100k+ RPM', 'Reduced Postgres query latency by 42% via complex index optimization', 'Architected automated deployment system for 50+ microservices'], active: true },
        { role: 'OPEN_SOURCE_CONTRIBUTOR', period: '2022.01 - 2023.07', company: 'DISTRIBUTED_CORE', logs: ['Merged 200+ PRs focusing on vector search engine core algorithms', 'Authored the widely used Python-GRPC bridge module (+50k downloads)', 'Optimized matrix multiplication routines for CUDA acceleration'] },
        { role: 'SYSTEM_ARCH_ASSISTANT', period: '2021.10 - 2021.12', company: 'CORP_INFRA_GLOBAL', logs: ['Implemented real-time thermal telemetry monitoring for cluster R-04', 'Maintained 99.99% uptime protocols across production regions', 'Deployment and scaling of containerized AI models using Kubernetes'] }
      ].map((log, i) => (
        <div key={i} className="flex gap-8 group">
          <div className="flex flex-col items-center">
            <div className={`w-3 h-3 border ${log.active ? 'border-[var(--theme-accent)] bg-[var(--theme-accent)]' : 'border-[var(--border-muted)]'} group-hover:border-[var(--theme-accent)] transition-all`}></div>
            <div className="w-[1px] h-full bg-[var(--border-muted)] mt-2 border-dashed group-hover:bg-[var(--theme-glow)] transition-all"></div>
          </div>
          <div className="flex-1 pb-16">
            <div className="flex justify-between items-baseline mb-4">
              <h3 className={`text-md font-bold tracking-[0.15em] ${log.active ? 'text-[var(--theme-accent)]' : 'text-tier-1'}`}>{log.role}</h3>
              <span className="text-[0.6rem] text-tier-3 font-mono tabular-nums">{log.period}</span>
            </div>
            <div className="flex items-center gap-2 text-[0.55rem] text-tier-3 mb-6 font-mono tracking-widest uppercase">
               <Hash size={10} strokeWidth={3} className="text-[var(--theme-accent)]" /> {log.company}
            </div>
            <div className="flex flex-col gap-4">
               {log.logs.map((item, j) => (
                 <div key={j} className="text-[0.7rem] text-tier-3 leading-relaxed flex items-start gap-4 font-light">
                   <div className="mt-1.5 w-1 h-1 rounded-full bg-tier-3 opacity-30 group-hover:bg-[var(--theme-accent)] transition-all" />
                   <span className="uppercase tracking-wide group-hover:text-tier-2 transition-colors">{item}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);



export const ContactPage = () => (
  <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <span className="section-label">UPLINK_PROTOCOL // CONTACT</span>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { label: 'EMAIL_ENDPOINT', val: 'ROHIT@SYSTEM.ORG', icon: Mail, type: 'SECURE' },
        { label: 'GITHUB_SIGNAL', val: 'GITHUB.COM/ROHITKSAHOO', icon: Github, type: 'PUBLIC' },
        { label: 'LINKEDIN_UPLINK', val: 'LL/IN/ROHITKSAHOO', icon: ExternalLink, type: 'SECURE' },
        { label: 'PHYSICAL_LOC', val: 'DELHI_NCR_NODE_01', icon: Terminal, type: 'ENCRYPTED' }
      ].map((item, i) => (
        <a key={i} href="#" className="dashboard-card group flex flex-col gap-8 transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div className="p-2 border border-[var(--border-muted)] text-tier-3 group-hover:text-[var(--theme-accent)] group-hover:border-[var(--theme-glow)] transition-all">
              <item.icon size={20} />
            </div>
            <span className="text-[0.5rem] text-tier-3 opacity-40 uppercase tracking-[0.2em] font-mono">{item.type}_CONN_0{i+1}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[0.55rem] text-tier-3 uppercase tracking-widest font-mono font-bold">{item.label}</span>
            <span className="text-sm font-semibold tracking-wider text-tier-2 group-hover:text-tier-1 transition-colors">{item.val}</span>
          </div>
          <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 transition-transform duration-300">
             <span className="text-[0.5rem] font-mono text-[var(--theme-accent)]">INITIALIZE_UPLINK</span>
             <Zap size={10} className="text-[var(--theme-accent)]" fill="currentColor" />
          </div>
        </a>
      ))}
    </div>
  </div>
);
