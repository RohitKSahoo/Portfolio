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
                 <span className="text-[0.8rem] lg:text-[0.9rem] text-tier-3 font-heading tracking-[0.2em] uppercase pt-0.5">UPLINK_ACTIVE</span>
              </div>
              <h2 className="text-3xl lg:text-5xl tracking-[0.1em] text-tier-1 uppercase leading-none">
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
                className="group relative px-6 py-2.5 lg:px-8 lg:py-3 bg-[var(--theme-accent)] text-black font-bold text-[0.6rem] lg:text-xs uppercase tracking-[0.3em] hover:bg-white transition-all overflow-hidden flex items-center gap-4 w-fit shadow-[0_0_20px_rgba(var(--theme-accent-rgb),0.3)]"
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
              y: isDockVisible ? -95 : 12,
              opacity: 1
            }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
            className="mt-auto w-full pt-10 pb-0 pointer-events-none"
          >
             <h1 className="text-[13vw] lg:text-[7vw] tracking-wider leading-none text-tier-1 drop-shadow-[0_0_50px_rgba(var(--theme-accent-rgb),0.2)] uppercase whitespace-nowrap text-center">
               {displayName}<span className="inline-block w-[1.5vw] h-[1.5vw] bg-[var(--theme-accent)] ml-3 align-baseline translate-y-[-0.2vw]" />
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
    category: 'SYSTEMS',
    status: 'STABLE',
    ver: '1.0.0',
    primaryDescription: 'Automatically pauses and resumes media playback using real-time voice detection with sub-50ms latency.',
    details: ['Real-time voice detection', 'Audio focus handling', 'Silence-based resume logic'],
    architecture: 'State-machine driven audio control engine with low-latency signal processing and noise robustness.',
    metrics: { LATENCY: '<50ms', RELIABILITY: 'High', STABILITY: 'Fault-Tolerant' },
    stack: ['C++', 'JNI', 'Python'],
    access: 'PUBLIC',
    github: 'https://github.com/RohitKSahoo/Pausify',
    image: '/pausify_module_1775283678626.png',
    featured: true,
    whyItMatters: 'Designed to eliminate manual interruptions during conversations while listening to music.'
  },
  { 
    id: 'P_02', 
    name: 'SOSAFE', 
    category: 'COMMUNICATION',
    status: 'OPERATIONAL',
    ver: '1.2.0',
    primaryDescription: 'Enables seamless voice communication with automatic P2P to cloud failover and live tracking.',
    details: ['WebRTC Audio streaming (P2P)', 'Live location tracking (Firestore)', 'Cloud fallback (Cloudinary)'],
    architecture: 'Hybrid real-time communication system with dynamic failover between P2P and Cloud streaming.',
    metrics: { SYNC_LATENCY: '<1s', RELIABILITY: 'High', STABILITY: 'Multi-Channel' },
    stack: ['Flutter', 'WebRTC', 'Firebase'],
    access: 'PUBLIC',
    github: 'https://github.com/RohitKSahoo/sosafe',
    image: '/sosafe_module_1775283699833.png',
    whyItMatters: 'Ensures continuous communication in low-bandwidth scenarios.'
  },
  { 
    id: 'P_03', 
    name: 'AUTOCOMMITBOT', 
    category: 'AUTOMATION',
    status: 'ACTIVE',
    ver: '1.1.0',
    primaryDescription: 'Automates Git version control entirely by writing commits driven by AI context analysis.',
    details: ['AI-generated commits (Gemini API)', 'Diff analysis via GitPython', 'Background Execution (Task)'],
    architecture: 'Autonomous CLI agent for context-aware version control with failsafe fallback execution.',
    metrics: { AUTOMATION: 'High', FAILOVER: 'Enabled', MODE: 'Background' },
    stack: ['Python', 'Gemini', 'Bash'],
    access: 'PUBLIC',
    github: 'https://github.com/RohitKSahoo/auto-commit-bot',
    image: '/autocommit_module_1775283716495.png',
    featured: true,
    whyItMatters: 'Designed to eliminate manual commit overhead and guarantee semantic git histories.'
  },
  { 
    id: 'P_04', 
    name: 'SYS_MONITOR_UI', 
    category: 'FRONTEND',
    status: 'INTERNAL_BETA',
    ver: '0.9.0',
    primaryDescription: 'Visualizes live system telemetry and operational metrics with sub-100ms render latency.',
    details: ['Real-time metric visualization', 'System telemetry log streaming', 'Dashboard-driven UI Architecture'],
    architecture: 'Frontend system interface simulating backend state, metrics, and operational status.',
    metrics: { UI_LATENCY: 'Low', RENDER: '<100ms', DATA_FLOW: 'Real-Time' },
    stack: ['React', 'Framer', 'Tailwind'],
    access: 'INTERNAL',
    github: 'https://github.com/RohitKSahoo',
    image: '/monitor_module_ui_1775283735380.png',
    whyItMatters: 'Provides immediate high-level system observability for mission-critical infrastructure.'
  }
];




import MagicBento, { MagicBentoCard, MagicBentoSpotlight } from '../effects/MagicBento';

import TextType from '../effects/TextType';

export const RegistryPage = () => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const activeProject = PROJECTS.find(p => p.id === selectedId) || PROJECTS[0];
  const gridRef = React.useRef<HTMLDivElement>(null);

  const getFolderItems = (project: typeof PROJECTS[0]) => [
    <div key="1" className="w-full h-full flex flex-col items-center justify-center p-2 bg-[#0c0c0c] text-[var(--theme-accent)] overflow-hidden">
      <div className="w-full flex justify-between items-center opacity-40 mb-1">
        <span className="text-[0.35rem] font-mono">TRACE_0x{project.id.slice(-2)}</span>
        <Zap size={6} />
      </div>
      <div className="w-full h-px bg-[var(--theme-accent)]/20 mb-1" />
      <div className="flex flex-col gap-0.5 w-full opacity-60">
        <span className="text-[0.4rem] font-mono truncate">{">>"} PINIT_CORE...</span>
        <span className="text-[0.4rem] font-mono truncate">{">>"} SYSCALL_01_OK</span>
        <span className="text-[0.4rem] font-mono truncate">{">>"} UPLINK_READY</span>
      </div>
    </div>,
    <div key="2" className="w-full h-full flex items-center justify-center bg-black relative">
       <img src={project.image} className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-500" alt="Preview" />
       <div className="absolute inset-0 bg-black/40" />
       <div className="absolute top-1 left-1 px-1 bg-[var(--theme-accent)] text-black text-[0.4rem] font-bold uppercase">LIVE</div>
    </div>,
    <div key="3" className="w-full h-full flex flex-col items-center justify-center p-2 bg-[#0c0c0c] border border-[var(--theme-accent)]/30">
       <Terminal size={14} strokeWidth={2.5} className="text-[var(--theme-accent)] mb-1" />
       <span className="text-[0.4rem] font-bold text-white/40 tracking-widest">EXECUTABLE</span>
    </div>
  ];


  const [filter, setFilter] = React.useState('ALL');

  const categories = ['ALL', ...Array.from(new Set(PROJECTS.map(p => p.category)))];
  
  const filteredProjects = PROJECTS.filter(p => filter === 'ALL' || p.category === filter);

  return (
    <AnimatePresence mode="wait">
      {!selectedId ? (
        <motion.div 
          key="grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex flex-col gap-4 pb-8 pt-4 bento-section"
        >
          {/* Header Section */}
          <div className="flex flex-col gap-4 pt-2 relative">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
              <div className="flex flex-col gap-2 max-w-none">
                <span className="text-[0.8rem] pt-0.5 font-heading text-[var(--theme-accent)] tracking-[0.2em] uppercase opacity-60 leading-none">REGISTRY_MOD_01</span>
                <h2 className="text-2xl lg:text-3xl tracking-[0.1em] text-tier-1 uppercase leading-none relative group mt-1">
                  <TextType 
                    text="ENGINEERING SYSTEMS THAT AUTOMATE, OPTIMIZE, AND SCALE EVERYDAY WORKFLOWS."
                    typingSpeed={40}
                    initialDelay={500}
                    loop={false}
                    cursorCharacter={<span className="inline-block w-1.5 h-[0.9em] bg-[var(--theme-accent)] ml-1 align-baseline" />}
                    className="relative z-10 block transition-all duration-700 group-hover:text-[var(--theme-accent)] group-hover:translate-x-1"
                  />
                  {/* Technical Scanning Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--theme-accent)]/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                </h2>
              </div>
            </div>
            <div className="w-full h-px bg-white/10 relative">
               <div className="absolute -top-1 -right-1 w-2 h-2 border border-white/20" />
               <div className="absolute -bottom-1 -left-1 w-2 h-2 border border-white/20" />
            </div>
          </div>
          
          {/* Uniform Grid Implementation */}
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 pt-6 relative">
            {/* Background Blueprint Decorative Elements */}
            <div className="absolute inset-0 -z-10 opacity-5 pointer-events-none overflow-hidden">
               <div className="absolute top-0 left-2/4 w-px h-full bg-white/20" />
               <div className="absolute top-2/4 left-0 w-full h-px bg-white/20" />
               <div className="absolute bottom-10 right-10 flex flex-col font-mono text-[10px] text-white/40 items-end">
                  <span>COORD_X: 77.218</span>
                  <span>COORD_Y: 28.613</span>
                  <span>SYSTEM_STABLE: 99.8%</span>
               </div>
            </div>

            {PROJECTS.map((project, idx) => (
              <MagicBentoCard 
                key={project.id}
                particleCount={0}
                glowColor="239, 68, 68"
                enableTilt={false}
                enableMagnetism={false}
                clickEffect={false}
                className="magic-bento-card magic-bento-card--border-glow flex flex-col gap-3 group cursor-pointer relative p-4 bg-white/[0.01] border border-white/5 transition-all duration-500 rounded-xl"
                onClick={() => setSelectedId(project.id)}
              >
                {/* Status Indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    project.status === 'STABLE' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-[0.45rem] font-mono font-bold text-tier-3 tracking-[0.2em]">[{project.status}]</span>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-6 group-hover:translate-y-[-4px] transition-transform duration-500">
                   <div className="relative">
                      <Folder color="var(--theme-accent)" size={0.9} items={getFolderItems(project)} />
                   </div>

                   <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                      <span className="text-[0.8rem] pt-0.5 font-heading text-[var(--theme-accent)] tracking-widest uppercase mb-1 leading-none">
                        PRJ_MOD_0{project.id.slice(-1)}
                      </span>
                      <h3 className="text-xl lg:text-2xl tracking-[0.1em] text-tier-1 group-hover:text-[var(--theme-accent)] transition-colors uppercase leading-none">
                        {project.name}
                      </h3>
                      
                      {/* Tech Stack Metadata Tags */}
                      <div className="flex flex-wrap gap-2 mt-3 justify-center lg:justify-start">
                        {project.stack.slice(0, 3).map(tech => (
                          <span key={tech} className="text-[0.5rem] font-mono text-tier-3 border border-white/10 px-1.5 py-0.5 rounded uppercase">
                            {tech}
                          </span>
                        ))}
                      </div>
                   </div>
                </div>

                <div className="hidden lg:flex flex-col gap-2 mt-2 pt-4 border-t border-white/5 opacity-40 group-hover:opacity-100 transition-opacity">
                    <p className="text-[0.65rem] font-medium leading-relaxed uppercase tracking-wider line-clamp-2">
                      {project.architecture}
                    </p>
                    <div className="flex gap-4">
                       <MetricBar label="FAULTS" value="0" percentage={0} />
                       <MetricBar label="LOAD" value={`${idx * 15 + 20}`} percentage={idx * 15 + 20} />
                    </div>
                </div>
              </MagicBentoCard>
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
          {/* Advanced Detail View: High-Density Workstation Layout */}
          <div className="flex flex-col h-full max-h-[75vh] gap-6 overflow-hidden">
            {/* Header: Navigation & Global Actions */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <button 
                onClick={() => setSelectedId(null)}
                className="flex items-center gap-3 text-tier-3 hover:text-[var(--theme-accent)] transition-all group px-4 py-2 bg-white/5 rounded-full border border-white/5 hover:border-[var(--theme-accent)]/30"
              >
                <Terminal size={14} className="rotate-180" />
                <span className="text-[0.85rem] font-heading tracking-widest uppercase pt-0.5 leading-none">SYSTEM_BACK</span>
              </button>

              <div className="flex items-center gap-4">
                <a 
                  href={activeProject.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-5 py-2.5 bg-[var(--theme-accent)] text-black text-[0.65rem] font-bold uppercase tracking-widest transition-all rounded-md hover:scale-[1.02] active:scale-95"
                >
                  <Github size={14} />
                  <span>VIEW SOURCE</span>
                </a>
              </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-8 lg:gap-10 min-h-0">
               {/* Left: Intelligence & Analytics */}
               <div className="flex-[1.2] flex flex-col justify-between py-1 min-h-0">
                  <div className="flex flex-col gap-4 lg:gap-5">
                    {/* 1. Project Title */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[0.75rem] font-heading text-[var(--theme-accent)] tracking-[0.2em] uppercase opacity-50">
                        ACCESS_NODE::{activeProject.id}
                      </span>
                      <h2 className="text-4xl lg:text-5xl tracking-[0.1em] text-tier-1 uppercase leading-none">
                        {activeProject.name}
                      </h2>
                    </div>

                    {/* 2. Primary Description */}
                    <p className="text-base lg:text-lg text-tier-1 font-medium leading-snug tracking-wide">
                      {activeProject.primaryDescription}
                    </p>

                    {/* 3. Key Metrics */}
                    <div className="flex gap-4">
                       {Object.entries(activeProject.metrics).map(([k, v]) => (
                         <div key={k} className="flex flex-col pl-3 border-l-2 border-[var(--theme-accent)]/30">
                            <span className="text-[0.45rem] font-mono text-tier-3 opacity-60 uppercase tracking-widest mb-0.5">{k}</span>
                            <span className="text-sm lg:text-base font-bold text-[var(--theme-accent)] tabular-nums">{v}</span>
                         </div>
                       ))}
                    </div>

                    {/* 4. Tech Stack (inline format) */}
                    <div className="flex items-center gap-2">
                      <span className="text-[0.7rem] font-heading text-tier-3 opacity-50 uppercase tracking-[0.2em]">STACK //</span>
                      <span className="text-[0.65rem] font-mono text-tier-2 uppercase tracking-widest font-bold bg-white/5 px-2 py-1 rounded">
                        {activeProject.stack.join(' · ')}
                      </span>
                    </div>

                    {/* 5. Secondary Technical Description & 6. Bullets */}
                    <div className="flex flex-col gap-2 p-4 lg:p-5 bg-white/[0.02] border border-white/5 rounded-xl">
                       <p className="text-[0.7rem] lg:text-[0.8rem] text-tier-2 leading-relaxed font-mono uppercase opacity-80">
                         {activeProject.architecture}
                       </p>
                       <ul className="flex flex-col gap-1.5 mt-2">
                         {activeProject.details.map((bullet, i) => (
                           <li key={i} className="text-[0.65rem] font-mono text-tier-3 flex items-center gap-2">
                             <span className="w-1.5 h-1.5 bg-[var(--theme-accent)]/80 rounded-sm" />
                             {bullet}
                           </li>
                         ))}
                       </ul>
                    </div>

                    {/* 7. Why it matters */}
                    <p className="text-[0.65rem] italic text-tier-3 opacity-50 leading-tight">
                      {activeProject.whyItMatters}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                     <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                           <span className="text-[0.7rem] pt-0.5 font-heading text-tier-3 opacity-50 uppercase tracking-[0.2em] leading-none mb-0.5">COMMIT_HASH</span>
                           <span className="text-[0.6rem] font-mono text-tier-2">0x{activeProject.id.slice(0, 8)}...</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[0.7rem] pt-0.5 font-heading text-tier-3 opacity-50 uppercase tracking-[0.2em] leading-none mb-0.5">UPTIME</span>
                           <span className="text-[0.6rem] font-mono text-green-500/80">99.98%</span>
                        </div>
                     </div>
                     <span className="text-[0.8rem] font-heading text-white/30 tracking-[0.2em] pt-1">SYSTEM://READY</span>
                  </div>
               </div>

               {/* Right: Visual Projection */}
               <div className="flex-1 min-h-0 relative">
                  <MagicBentoCard 
                    glowColor="239, 68, 68"
                    enableTilt={false}
                    enableMagnetism={false}
                    clickEffect={false}
                    particleCount={0}
                    className="w-full h-full rounded-3xl border border-white/10 bg-black/40 overflow-hidden relative group/image"
                  >
                     <img src={activeProject.image} className="w-full h-full object-cover grayscale opacity-60 group-hover/image:grayscale-0 group-hover/image:scale-105 transition-all duration-1000" alt="Preview" />
                     <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/20 to-transparent" />
                     
                     <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)] animate-pulse" />
                            <span className="text-[0.8rem] pt-0.5 font-heading tracking-widest text-white uppercase leading-none">LIVE_UPLINK</span>
                          </div>
                          <span className="text-[0.7rem] pt-0.5 font-heading text-white/40 uppercase tracking-widest leading-none">SECURE://V.2.0.4</span>
                        </div>
                        <p className="text-[0.65rem] font-mono text-tier-3 opacity-60 uppercase tracking-wider leading-relaxed italic">
                          {activeProject.details[0]}
                        </p>
                     </div>

                     {/* Blueprint Deco */}
                     <div className="absolute top-6 right-6 w-12 h-12 border-t border-r border-white/20" />
                     <div className="absolute bottom-6 left-6 w-12 h-12 border-b border-l border-white/20 pointer-events-none" />
                  </MagicBentoCard>
               </div>
            </div>
          </div>
        </motion.div>
    )}
    </AnimatePresence>
  );
};

export const HistoryPage = () => {
  const experiences = [
    {
      role: 'Backend Systems Developer',
      period: '2023 - PRESENT',
      company: 'PROJECT-BASED',
      tags: ['BACKEND', 'SYSTEMS'],
      logs: [
        'Built voice-triggered audio control system with sub-50ms response time.',
        'Implemented real-time monitoring with efficient background thread handling.',
        'Optimized system lifecycle to auto-suspend idle services.'
      ],
      active: true
    },
    {
      role: 'App Developer (Personal)',
      period: '2022 - 2023',
      company: 'COMMUNICATION PROJECTS',
      tags: ['ANDROID', 'WEBRTC'],
      logs: [
        'Developed continuous P2P voice network with dynamic cloud fallback routing.',
        'Synchronized live geolocation tracking across highly constrained network states.'
      ]
    },
    {
      role: 'Open Source Contributor',
      period: '2021 - 2022',
      company: 'AUTOMATION PROJECTS',
      tags: ['PYTHON', 'AI'],
      logs: [
        'Authored autonomous CLI agent validating and generating git commits via AI context analysis.',
        'Formulated secure CI/CD deployment routines using robust git-hook automation.'
      ]
    }
  ];

  return (
    <div className="w-full flex flex-col xl:flex-row gap-8 xl:gap-16 lg:pt-2 h-full min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Left Timeline */}
      <div className="flex-1 flex flex-col gap-5 lg:max-w-2xl min-h-0 shrink-0">
        <span className="section-label">HISTORY // EXPERIENCE</span>
        <div className="flex flex-col mt-2">
          {experiences.map((log, i) => (
            <div key={i} className="flex gap-4 lg:gap-6 group">
              {/* Timeline Line */}
              <div className="flex flex-col items-center mt-2.5 shrink-0">
                <div className={`w-2 h-2 rounded-sm border ${log.active ? 'border-[var(--theme-accent)] bg-[var(--theme-accent)] shadow-[0_0_10px_rgba(var(--theme-accent-rgb),0.5)]' : 'border-white/20 bg-[#0a0a0a]'} group-hover:border-[var(--theme-accent)] transition-all`} />
                {i !== experiences.length - 1 && (
                  <div className="w-[1px] h-full bg-white/10 my-2 group-hover:bg-[var(--theme-accent)]/30 transition-all" />
                )}
              </div>
              
              {/* Content Box */}
              <div className={`flex-1 pb-6 ${i === experiences.length - 1 ? 'pb-2' : ''}`}>
                {/* Title & Dates */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 lg:gap-4 mb-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className={`text-xl tracking-[0.1em] uppercase ${log.active ? 'text-[var(--theme-accent)]' : 'text-tier-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.05)]'}`}>
                      {log.role}
                    </h3>
                    <div className="flex gap-2">
                      {log.tags.map(tag => (
                        <span key={tag} className="text-[0.7rem] leading-none pt-0.5 font-heading tracking-widest border border-white/10 px-2 rounded uppercase text-tier-3 group-hover:text-tier-2 group-hover:border-white/30 transition-all mt-0.5 sm:mt-0">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[0.6rem] text-tier-3 font-mono font-bold tracking-widest uppercase shrink-0">{log.period}</span>
                </div>
                
                {/* Company/Context */}
                <div className="flex items-center gap-2 text-[0.6rem] text-tier-2 mb-3.5 font-mono font-bold tracking-widest uppercase">
                   <Hash size={12} strokeWidth={2.5} className="text-[var(--theme-accent)]/70" /> {log.company}
                </div>
                
                {/* Bullets */}
                <div className="flex flex-col gap-2">
                   {log.logs.map((item, j) => (
                     <div key={j} className="text-[0.8rem] text-tier-2 leading-[1.5] flex items-start gap-3">
                       <div className="mt-2 w-1 h-1 rounded-sm bg-white/30 group-hover:bg-[var(--theme-accent)] transition-all shrink-0" />
                       <span className="tracking-normal font-medium">{item}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Proof Layer */}
      <div className="w-full xl:w-[280px] shrink-0 mt-2 xl:mt-10 mb-8 xl:mb-0">
        <div className="p-5 border border-white/10 bg-black/40 backdrop-blur-md rounded-xl relative overflow-hidden group hover:border-white/20 transition-all shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-accent)]/5 to-transparent opacity-50" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--theme-accent)]/80 to-transparent" />
          
          <div className="relative flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Github size={16} className="text-[var(--theme-accent)]" />
              <span className="text-[0.85rem] tracking-widest font-heading text-tier-1 uppercase pt-0.5 leading-none">GITHUB_IMPACT</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </div>

          <div className="relative grid grid-cols-2 gap-y-5 gap-x-4">
            <div className="flex flex-col gap-1">
               <span className="text-[0.75rem] font-heading pt-0.5 text-tier-3 tracking-widest uppercase leading-none">REPOSITORIES</span>
               <span className="text-xl font-bold font-mono text-tier-1 tabular-nums">14</span>
            </div>
            <div className="flex flex-col gap-1">
               <span className="text-[0.75rem] font-heading pt-0.5 text-tier-3 tracking-widest uppercase leading-none">COMMITS</span>
               <span className="text-xl font-bold font-mono text-tier-1 tabular-nums">520+</span>
            </div>
            <div className="flex flex-col gap-1">
               <span className="text-[0.75rem] font-heading pt-0.5 text-tier-3 tracking-widest uppercase leading-none">SINCE</span>
               <span className="text-xl font-bold font-mono text-tier-1 tabular-nums">2021</span>
            </div>
            <div className="flex flex-col gap-1">
               <span className="text-[0.75rem] font-heading pt-0.5 text-tier-3 tracking-widest uppercase leading-none">UPLINK</span>
               <div className="flex items-center mt-1">
                 <span className="text-[0.7rem] font-bold font-mono text-green-500 tracking-widest uppercase shadow-[0_0_8px_rgba(34,197,94,0)]">STABLE</span>
               </div>
            </div>
          </div>
          
          {/* Activity Graph */}
          <div className="relative mt-8 border-t border-white/5 pt-4">
             <span className="text-[0.7rem] font-heading text-tier-3 tracking-widest uppercase mb-1 block">CONTRIBUTION_VELOCITY</span>
             <div className="flex items-end gap-[1px] h-8 opacity-60 group-hover:opacity-100 transition-opacity">
               {[40, 70, 45, 90, 65, 80, 50, 100, 75, 40, 85, 60, 95, 30, 60, 80].map((h, i) => (
                 <div key={i} className="flex-1 bg-white/20 group-hover:bg-[var(--theme-accent)]/80 transition-colors rounded-t-[1px]" style={{ height: `${h}%` }} />
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};



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
        <h2 className="text-3xl lg:text-4xl text-tier-1 uppercase tracking-[0.1em] leading-none mb-1">
          Contact Protocol
        </h2>
        <div className="w-full h-px bg-white/10" />
      </div>
      
      <MagicBento cards={contactCards} />
    </div>
  );
};
