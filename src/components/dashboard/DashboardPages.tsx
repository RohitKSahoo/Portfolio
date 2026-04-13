import React, { Suspense, Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardCard } from './DashboardCard';
import { MetricBar } from './MetricBar';
import { SystemOverview } from './SystemOverview';
import { StatusIndicator } from './StatusIndicator';
import { Code, ExternalLink, Github, Terminal, Zap, Hash, Linkedin, Mail } from 'lucide-react';
import { SystemAvatar } from '../SystemAvatar';
import { CardSwap } from '../CardSwap';
import { ImageRibbon } from '../ImageRibbon';
import Folder from '../effects/Folder';
import MagicBento, { MagicBentoCard, MagicBentoSpotlight } from '../effects/MagicBento';
import TextType from '../effects/TextType';
import Lanyard from '../effects/Lanyard';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error("3D_RENDER_ERROR:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black/20 rounded-2xl border border-white/5 p-8 text-center">
          <Terminal size={32} className="text-red-500 mb-4 opacity-50" />
          <h3 className="text-xl font-heading text-tier-1 uppercase mb-2">3D_HARDWARE_FAILURE</h3>
          <p className="text-sm text-tier-3 font-mono uppercase tracking-widest max-w-xs">Uplink bypassed due to WebGL context exhaustion. Direct access nodes remaining stable.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export const ProfilePage = ({ 
  onExploreProjects, 
  isDockVisible = false 
}: { 
  onExploreProjects?: () => void,
  isDockVisible?: boolean 
}) => {
  const [displayName, setDisplayName] = React.useState("ROHIT KUMAR SAHOO");
  const [isMobile, setIsMobile] = React.useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%#!@$*";

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        <div className="absolute inset-0 flex justify-center items-center z-0">
           <div className="relative w-full h-full max-w-xl pointer-events-none flex items-center justify-center">
              <SystemAvatar 
                className="w-[110%] h-[110%] lg:w-full lg:h-full opacity-25 lg:opacity-90 scale-95 lg:scale-100 translate-y-8 lg:translate-y-0 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-black)] via-transparent to-[var(--bg-black)]/40 pointer-events-none" />
           </div>
        </div>

        <div className="relative z-10 flex flex-col min-h-[inherit] justify-between p-0">
          <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-8 items-start w-full px-0">
            <div className="flex flex-col gap-4 lg:gap-6 max-w-lg text-left">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-[var(--theme-accent)] animate-pulse shadow-[0_0_8px_var(--theme-accent)]" />
                 <span className="text-[0.8rem] lg:text-[0.9rem] text-tier-3 font-heading tracking-[0.2em] uppercase pt-0.5">UPLINK_ACTIVE</span>
              </div>
              <h2 className="text-[1.70rem] sm:text-3xl lg:text-5xl tracking-[0.1em] text-tier-1 uppercase leading-none">
                CS_STUDENT & <br className="hidden sm:block lg:hidden" /> Systems_Builder <br /> Based in India
              </h2>
            </div>

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

          <motion.div 
            animate={{ 
              y: isMobile ? -65 : (isDockVisible ? -95 : 12),
              opacity: 1
            }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
            className="mt-auto w-full pt-10 pb-0 pointer-events-none"
          >
             <h1 className="text-[11vw] sm:text-[13vw] lg:text-[7vw] tracking-wider leading-none text-tier-1 drop-shadow-[0_0_50px_rgba(var(--theme-accent-rgb),0.2)] uppercase whitespace-nowrap text-center">
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
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--theme-accent)]/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                </h2>
              </div>
            </div>
            <div className="w-full h-px bg-white/10 relative">
               <div className="absolute -top-1 -right-1 w-2 h-2 border border-white/20" />
               <div className="absolute -bottom-1 -left-1 w-2 h-2 border border-white/20" />
            </div>
          </div>
          
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 pt-6 relative">
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
          className="flex flex-col gap-10 lg:gap-12"
        >
          <div className="flex flex-col h-full max-h-[82vh] lg:max-h-[75vh] gap-6 lg:gap-10 pb-24 lg:pb-0 overflow-hidden">
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
               <div className="flex-[1.2] flex flex-col justify-between py-1 min-h-0">
                  <div className="flex flex-col gap-3 lg:gap-5">
                    <div className="flex flex-col">
                      <h2 className="text-4xl lg:text-5xl tracking-[0.1em] text-tier-1 uppercase leading-none">
                        {activeProject.name}
                      </h2>
                    </div>

                    <p className="text-[0.9rem] sm:text-base lg:text-lg text-tier-1 font-medium leading-relaxed tracking-wide">
                      {activeProject.primaryDescription}
                    </p>

                    <div className="flex flex-wrap gap-8 lg:gap-12">
                       {Object.entries(activeProject.metrics).map(([k, v]) => (
                         <div key={k} className="flex flex-col pl-4 border-l-2 border-[var(--theme-accent)]/30">
                            <span className="text-[0.7rem] lg:text-[0.5rem] font-mono text-tier-3 opacity-60 uppercase tracking-widest mb-1.5">{k}</span>
                            <span className="text-xl lg:text-base font-bold text-[var(--theme-accent)] tabular-nums">{v}</span>
                         </div>
                       ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {activeProject.stack.map(tech => (
                        <span key={tech} className="text-[0.65rem] font-mono text-[var(--theme-accent)] border border-[var(--theme-accent)]/20 bg-[var(--theme-accent)]/5 px-2 py-0.5 rounded uppercase tracking-widest">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-col gap-4 mt-2">
                       <ul className="flex flex-col gap-4">
                         {activeProject.details.map((bullet, i) => (
                           <li key={i} className="text-[1rem] lg:text-[0.8rem] text-tier-2 flex items-start lg:items-center gap-3 leading-relaxed">
                             <div className="w-1.5 h-1.5 mt-2 lg:mt-0 bg-[var(--theme-accent)]/80 rounded-sm shrink-0" />
                             <span className="opacity-90">{bullet}</span>
                           </li>
                         ))}
                       </ul>
                    </div>
                  </div>
                </div>

               <div className="hidden sm:flex flex-1 min-h-0 relative">
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
                        </div>
                        <p className="text-[0.65rem] font-mono text-tier-3 opacity-60 uppercase tracking-wider leading-relaxed italic">
                          {activeProject.details[0]}
                        </p>
                     </div>

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
    <div className="w-full flex flex-col xl:flex-row gap-12 xl:gap-24 lg:pt-4 h-full min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex-[1.5] flex flex-col gap-6 lg:max-w-4xl min-h-0 shrink-0">
        <span className="section-label text-[var(--theme-accent)]">HISTORY // EXPERIENCE</span>
        <div className="flex flex-col mt-4">
          {experiences.map((log, i) => (
            <div key={i} className="flex gap-6 lg:gap-10 group">
              <div className="flex flex-col items-center mt-3 shrink-0">
                <div className={`w-2.5 h-2.5 rounded-sm border ${log.active ? 'border-[var(--theme-accent)] bg-[var(--theme-accent)] shadow-[0_0_12px_rgba(var(--theme-accent-rgb),0.6)]' : 'border-white/20 bg-[#0a0a0a]'} group-hover:border-[var(--theme-accent)] transition-all`} />
                {i !== experiences.length - 1 && (
                  <div className="w-[1px] h-full bg-white/10 my-3 group-hover:bg-[var(--theme-accent)]/30 transition-all" />
                )}
              </div>
              
              <div className={`flex-1 pb-10 ${i === experiences.length - 1 ? 'pb-4' : ''}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 lg:gap-4 mb-2">
                  <div className="flex items-center gap-4 flex-wrap">
                    <h3 className={`text-2xl lg:text-3xl tracking-[0.1em] uppercase ${log.active ? 'text-[var(--theme-accent)]' : 'text-tier-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.05)]'}`}>
                      {log.role}
                    </h3>
                    <div className="flex gap-3">
                      {log.tags.map(tag => (
                        <span key={tag} className="text-[0.75rem] leading-none pt-1 font-heading tracking-widest border border-white/10 px-2.5 py-0.5 rounded uppercase text-tier-3 group-hover:text-tier-2 group-hover:border-white/30 transition-all mt-0.5 sm:mt-0">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[0.8rem] text-tier-3 font-mono font-bold tracking-widest uppercase shrink-0 opacity-60">{log.period}</span>
                </div>
                
                <div className="flex items-center gap-2 text-[0.85rem] text-tier-2 mb-5 font-mono font-bold tracking-widest uppercase opacity-80">
                   <Hash size={14} strokeWidth={2.5} className="text-[var(--theme-accent)]" /> {log.company}
                </div>
                
                <div className="flex flex-col gap-3.5">
                   {log.logs.map((item, j) => (
                     <div key={j} className="text-[1rem] lg:text-[1.1rem] text-tier-2 leading-relaxed flex items-start gap-4">
                       <div className="mt-2.5 w-1.5 h-1.5 rounded-sm bg-white/20 group-hover:bg-[var(--theme-accent)] transition-all shrink-0" />
                       <span className="tracking-normal font-medium opacity-90">{item}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full xl:w-[350px] shrink-0 mt-2 xl:mt-16 mb-8 xl:mb-0">
        <div className="p-7 border border-white/10 bg-black/40 backdrop-blur-md rounded-2xl relative overflow-hidden group hover:border-[var(--theme-accent)]/20 transition-all shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-accent)]/5 to-transparent opacity-50" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--theme-accent)]/80 to-transparent" />
          
          <div className="relative flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Github size={18} className="text-[var(--theme-accent)]" />
              <span className="text-[0.95rem] tracking-[0.2em] font-heading text-tier-1 uppercase pt-0.5 leading-none">GITHUB_IMPACT</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
          </div>

          <div className="relative grid grid-cols-2 gap-y-7 gap-x-6">
            <div className="flex flex-col gap-1.5">
               <span className="text-[0.75rem] font-heading pt-0.5 text-tier-3 tracking-widest uppercase leading-none opacity-40">REPOSITORIES</span>
               <span className="text-3xl font-bold font-mono text-tier-1 tabular-nums">14</span>
            </div>
            <div className="flex flex-col gap-1.5">
               <span className="text-[0.75rem] font-heading pt-0.5 text-tier-3 tracking-widest uppercase leading-none opacity-40">COMMITS</span>
               <span className="text-3xl font-bold font-mono text-tier-1 tabular-nums">520+</span>
            </div>
            <div className="flex flex-col gap-1.5">
               <span className="text-[0.75rem] font-heading pt-0.5 text-tier-3 tracking-widest uppercase leading-none opacity-40">SINCE</span>
               <span className="text-3xl font-bold font-mono text-tier-1 tabular-nums">2021</span>
            </div>
            <div className="flex flex-col gap-1.5">
               <span className="text-[0.75rem] font-heading pt-0.5 text-tier-3 tracking-widest uppercase leading-none opacity-40">UPLINK</span>
               <div className="flex items-center mt-1">
                 <span className="text-[0.9rem] font-bold font-mono text-green-500 tracking-[0.3em] uppercase">STABLE</span>
               </div>
            </div>
          </div>
          
          <div className="relative mt-10 border-t border-white/5 pt-6">
             <span className="text-[0.7rem] font-heading text-tier-3 tracking-[0.2em] uppercase mb-2 block opacity-40">CONTRIBUTION_VELOCITY</span>
             <div className="flex items-end gap-[2px] h-10 opacity-40 group-hover:opacity-100 transition-opacity">
               {[40, 70, 45, 90, 65, 80, 50, 100, 75, 40, 85, 60, 95, 30, 60, 80].map((h, i) => (
                 <div key={i} className="flex-1 bg-white/20 group-hover:bg-[var(--theme-accent)] transition-colors rounded-t-[1px]" style={{ height: `${h}%` }} />
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactPage = () => {
  const contacts = [
    {
      id: 'COMM_01',
      title: 'EMAIL_ENDPOINT',
      value: 'rohitksahoot@gmail.com',
      label: 'SECURE_MAIL',
      icon: Mail,
      url: 'mailto:rohitksahoot@gmail.com'
    },
    {
      id: 'COMM_02',
      title: 'GITHUB_SIGNAL',
      value: 'github.com/RohitKSahoo',
      label: 'SOURCE_CODE',
      icon: Github,
      url: 'https://github.com/RohitKSahoo'
    },
    {
      id: 'COMM_03',
      title: 'LINKEDIN_UPLINK',
      value: 'linkedin.com/in/rohitksahoo',
      label: 'PROFESSIONAL_NET',
      icon: Linkedin,
      url: 'https://linkedin.com/in/rohitksahoo'
    }
  ];

  return (
    <div className="w-full flex flex-col xl:flex-row gap-12 xl:gap-16 lg:pt-4 h-full min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 3D Lanyard (Anchored to Screen Top) */}
      <div className="fixed top-0 left-0 w-full lg:w-[500px] h-screen pointer-events-none z-50">
        <ErrorBoundary>
          <div className="w-full h-full pointer-events-auto">
            <Suspense fallback={null}>
              <Lanyard transparent={true} />
            </Suspense>
          </div>
        </ErrorBoundary>
      </div>

      {/* Center Column: Direct Uplinks */}
      <div className="flex-1 flex flex-col gap-10 min-h-0">
        <div className="flex flex-col gap-2">
          <span className="section-label text-[var(--theme-accent)]">COMMUNICATION // PROTOCOL</span>
          <h2 className="text-3xl lg:text-4xl tracking-widest text-tier-1 uppercase leading-tight mt-2">
            AVAILABLE_FOR <br /> COLLABORATIONS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {contacts.map((contact, i) => (
            <a 
              key={contact.id}
              href={contact.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-7 border border-white/10 bg-black/40 backdrop-blur-md rounded-2xl group hover:border-[var(--theme-accent)]/30 transition-all shadow-xl relative overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--theme-accent)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex flex-col gap-5 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-white/5 rounded-xl text-[var(--theme-accent)] group-hover:bg-[var(--theme-accent)] group-hover:text-black transition-all">
                    <contact.icon size={18} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[0.65rem] font-heading text-[var(--theme-accent)] tracking-widest uppercase mb-1">{contact.label}</span>
                  <h3 className="text-lg lg:text-xl tracking-[0.1em] text-tier-1 uppercase leading-none group-hover:text-[var(--theme-accent)] transition-all">
                    {contact.title}
                  </h3>
                  <p className="text-[0.8rem] text-tier-2 font-mono mt-2 opacity-50 group-hover:opacity-90 transition-all truncate">
                    {contact.value}
                  </p>
                </div>
              </div>
            </a>
          ))}
          
          <div className="p-7 border border-white/5 bg-white/[0.01] rounded-2xl relative overflow-hidden flex flex-col gap-5">
              <div className="p-2.5 bg-white/5 rounded-xl text-tier-3 w-fit">
                <Terminal size={18} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[0.65rem] font-heading text-tier-3 tracking-widest uppercase mb-1">LOCATION</span>
                <h3 className="text-lg lg:text-xl tracking-[0.1em] text-tier-1 uppercase leading-none">BHUBANESWAR // IND</h3>
                <p className="text-[0.8rem] text-tier-2 font-mono mt-2 opacity-30">LOCAL_TIME_SYNCED</p>
              </div>
          </div>
        </div>

         <div className="p-7 border border-white/5 bg-white/[0.01] rounded-2xl flex flex-col gap-8">
            <div className="flex flex-col gap-5">
               <span className="text-[0.7rem] font-heading text-[var(--theme-accent)] tracking-[0.3em] uppercase opacity-50">AVAILABILITY_SYNC</span>
               <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2.5">
                     <div className="flex justify-between items-end">
                        <span className="text-[0.7rem] text-tier-2 font-mono tracking-widest uppercase">SYD_UPLINK</span>
                        <span className="text-[0.7rem] text-[var(--theme-accent)] font-bold font-mono">100%_OPEN</span>
                     </div>
                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.5 }} className="h-full bg-[var(--theme-accent)]" />
                     </div>
                  </div>
                  <div className="flex flex-col gap-2.5">
                     <div className="flex justify-between items-end">
                        <span className="text-[0.7rem] text-tier-2 font-mono tracking-widest uppercase">LATENCY</span>
                        <span className="text-[0.7rem] text-green-500 font-bold font-mono">{"<"}12H_EXPECTED</span>
                     </div>
                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ duration: 1.5, delay: 0.2 }} className="h-full bg-green-500" />
                     </div>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-3 py-4 px-6 bg-green-500/5 border border-green-500/20 rounded-xl">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
               <span className="text-[0.65rem] font-mono text-green-500 font-bold tracking-[0.2em] uppercase">READY_TO_RECEIVE</span>
            </div>
         </div>
      </div>
    </div>
  );
};
