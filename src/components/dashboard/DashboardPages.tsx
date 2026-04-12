import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardCard } from './DashboardCard';
import { MetricBar } from './MetricBar';
import { SystemOverview } from './SystemOverview';
import { StatusIndicator } from './StatusIndicator';
import { Code, ExternalLink, Github, Terminal, Zap, Hash, Mail } from 'lucide-react';
import { SystemAvatar } from '../SystemAvatar';
import { CardSwap } from '../CardSwap';
import { ImageRibbon } from '../ImageRibbon';
import Folder from '../effects/Folder';

export const ProfilePage = ({ 
  onExploreProjects, 
  isDockVisible = false 
}: { 
  onExploreProjects?: () => void,
  isDockVisible?: boolean 
}) => {
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
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative min-h-[calc(100vh-180px)] border-none bg-transparent overflow-hidden flex flex-col justify-between p-0">
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
        <div className="relative z-10 flex flex-col min-h-[inherit] justify-between p-0">
          {/* Top Section */}
          <div className="flex flex-col lg:flex-row justify-between gap-8 items-start w-full px-0">
            {/* Left Column */}
            <div className="flex flex-col gap-4 lg:gap-6 max-w-lg text-left">
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
          <motion.div 
            animate={{ 
              y: isDockVisible ? -85 : 0,
              opacity: 1
            }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
            className="mt-auto w-full pt-10 pb-0 pointer-events-none"
          >
             <h1 className="text-[10vw] lg:text-[6.8vw] font-black tracking-tighter leading-none text-tier-1 drop-shadow-[0_0_50px_rgba(var(--theme-accent-rgb),0.2)] uppercase whitespace-nowrap text-center">
               {displayName}<span className="inline-block w-[1.2vw] h-[1.2vw] bg-[var(--theme-accent)] ml-2 align-baseline translate-y-[-0.3vw]" />
             </h1>
          </motion.div>
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




import MagicBento from '../effects/MagicBento';

export const RegistryPage = () => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const activeProject = PROJECTS.find(p => p.id === selectedId) || PROJECTS[0];

  const getFolderItems = (project: typeof PROJECTS[0]) => [
    <div key="1" className="w-full h-full flex flex-col items-center justify-center p-2 bg-white text-black">
      <span className="text-[0.4rem] font-bold opacity-30 mb-1">DATA_01</span>
      <div className="w-full h-px bg-black/10 mb-2" />
      <span className="text-[0.6rem] font-black uppercase tracking-tighter text-center">{project.name}</span>
    </div>,
    <div key="2" className="w-full h-full flex items-center justify-center bg-gray-100">
       <img src={project.image} className="w-full h-full object-cover opacity-80" alt="Preview" />
    </div>,
    <div key="3" className="w-full h-full flex flex-col items-center justify-center p-2 bg-white text-red-600">
       <Terminal size={12} strokeWidth={3} />
       <span className="text-[0.5rem] font-black mt-1">UPLINK</span>
    </div>
  ];


  return (
    <AnimatePresence mode="wait">
      {!selectedId ? (
        <motion.div 
          key="grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex flex-col gap-12 pb-20 pt-10"
        >
          <div className="flex flex-col gap-6 pt-6">
            <h2 className="text-3xl font-black text-tier-1 tracking-widest uppercase leading-none">
              Explore Projects
            </h2>
            <div className="w-full h-px bg-white/10" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 pt-10">
            {PROJECTS.map((project) => (
              <motion.div 
                key={project.id}
                layoutId={`project-${project.id}`}
                className="flex flex-col items-center gap-8 group cursor-pointer"
                onClick={() => setSelectedId(project.id)}
              >
                <div className="relative transform transition-transform duration-500 group-hover:scale-110">
                   <Folder color="var(--theme-accent)" size={1.1} items={getFolderItems(project)} />
                   <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Zap size={12} className="text-[var(--theme-accent)]" />
                   </div>
                </div>
                <div className="flex flex-col items-center text-center mt-2">
                  <span className="text-[0.6rem] font-mono text-tier-3 tracking-[0.4em] font-bold opacity-40 uppercase mb-2">PRJ_IDX_0{project.id.slice(-1)}</span>
                  <span className="text-xl font-black text-tier-2 group-hover:text-[var(--theme-accent)] transition-colors uppercase tracking-widest">{project.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="detail"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="flex flex-col gap-8"
        >
           <div className="flex justify-between items-center">
             <button 
              onClick={() => setSelectedId(null)}
              className="flex items-center gap-2 text-tier-3 hover:text-[var(--theme-accent)] transition-all group w-fit"
             >
               <Terminal size={12} className="rotate-180 opacity-40 group-hover:opacity-100" />
               <span className="text-[0.6rem] font-mono font-bold tracking-[0.3em] uppercase">ESC_GRID</span>
             </button>

             <a 
                href={activeProject.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-6 px-6 py-3 border border-[var(--theme-accent)]/20 hover:border-[var(--theme-accent)] text-[var(--theme-accent)] text-[0.6rem] font-black uppercase tracking-[0.3em] transition-all rounded-lg"
              >
                <Github size={14} />
                <span>LINK_REPO</span>
                <ExternalLink size={12} className="opacity-40 group-hover:opacity-100" />
              </a>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[0.6rem] font-black text-[var(--theme-accent)] tracking-widest">
                      {activeProject.id}
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>
                  <h2 className="text-5xl font-black text-tier-1 tracking-tightest uppercase">
                    {activeProject.name}
                  </h2>
                </div>

                <div className="p-8 border border-white/5 bg-white/[0.02] rounded-2xl">
                   <span className="text-[0.55rem] font-mono text-tier-3 opacity-30 uppercase tracking-[0.4em] font-bold block mb-4">ENGINEERING_SPEC</span>
                   <p className="text-xl text-tier-2 leading-relaxed uppercase font-medium">
                     {activeProject.architecture}
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="flex flex-col gap-4">
                      <span className="text-[0.55rem] font-mono text-tier-3 opacity-30 uppercase tracking-[0.4em] font-bold">TECH_STACK</span>
                      <div className="flex flex-wrap gap-2">
                        {activeProject.stack.map(s => (
                          <span key={s} className="px-3 py-1 text-[0.65rem] font-mono text-tier-2 border border-white/10 rounded-md">
                            {s}
                          </span>
                        ))}
                      </div>
                   </div>

                   <div className="flex flex-col gap-4">
                      <span className="text-[0.55rem] font-mono text-tier-3 opacity-30 uppercase tracking-[0.4em] font-bold">TELEMETRY</span>
                      <div className="flex gap-8">
                         {Object.entries(activeProject.metrics).map(([k, v]) => (
                           <div key={k} className="flex flex-col">
                              <span className="text-[0.5rem] font-mono text-tier-3 opacity-40 uppercase tracking-widest">{k}</span>
                              <span className="text-xl font-black text-[var(--theme-accent)] tabular-nums">{v}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                <a 
                  href={activeProject.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between px-8 py-5 border border-[var(--theme-accent)]/20 hover:border-[var(--theme-accent)] text-[var(--theme-accent)] text-[0.7rem] font-black uppercase tracking-[0.3em] transition-all rounded-xl w-fit gap-8"
                >
                  <div className="flex items-center gap-4">
                    <Github size={18} />
                    <span>FETCH_REPO</span>
                  </div>
                  <ExternalLink size={14} className="opacity-40 group-hover:opacity-100" />
                </a>
              </div>

              <div className="aspect-video lg:aspect-square relative rounded-2xl overflow-hidden border border-white/10">
                 <img src={activeProject.image} className="w-full h-full object-cover grayscale opacity-40" alt="Preview" />
                 <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
                 <div className="absolute bottom-8 left-8 p-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)] animate-pulse" />
                      <span className="text-[0.6rem] font-mono font-bold tracking-[0.2em] text-tier-3 uppercase">LIVE_UPLINK</span>
                    </div>
                    <span className="text-[0.55rem] font-mono text-tier-3 opacity-40 uppercase tracking-widest leading-relaxed">
                      {activeProject.details[0]}
                    </span>
                 </div>
              </div>
           </div>
        </motion.div>
    )}
    </AnimatePresence>
  );
};

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



export const ContactPage = () => {
  const contactCards = [
    {
      title: 'EMAIL_ENDPOINT',
      description: 'rohitksahoot@gmail.com',
      label: 'SECURE_MAIL',
    },
    {
      title: 'GITHUB_SIGNAL',
      description: 'github.com/RohitKSahoo',
      label: 'SOURCE_CODE',
    },
    {
      title: 'LINKEDIN_UPLINK',
      description: 'linkedin.com/in/rohitksahoo',
      label: 'PROFESSIONAL_NET',
    },
    {
      title: 'PHYSICAL_LOC',
      description: 'BHUBANESWAR // INDIA',
      label: 'LOCATION_NODE',
    },
    {
      title: 'AVAILABILITY',
      description: 'OPEN_FOR_COLLABORATIONS // FULL_STACK',
      label: 'STATUS',
    },
    {
      title: 'SYSTEM_HEARTBEAT',
      description: '99.9%_UPTIME // READY_TO_BUILD',
      label: 'HEARTBEAT',
    }
  ];

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-6 pt-6">
        <h2 className="text-3xl font-black text-tier-1 tracking-widest uppercase leading-none">
          Contact Protocol
        </h2>
        <div className="w-full h-px bg-white/10" />
      </div>
      
      <MagicBento cards={contactCards} />
    </div>
  );
};
