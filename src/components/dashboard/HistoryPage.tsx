import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Lanyard } from '../effects/Lanyard';
import { generateFrontBadge, generateBackBadge, generateStrapImage, DEFAULT_COMPANIES } from '../effects/badgeGenerator';

interface TimelineItem {
  id: string;
  period: string;
  sub: string;
  title: string;
  tags: string[];
  category: string;
  points: (string | React.ReactNode)[];
  isCurrent?: boolean;
}

const TIMELINE_DATA: TimelineItem[] = [
  {
    id: 'multiplyy',
    period: 'AUG 2026 — PRESENT',
    sub: '· 4 mos · Remote',
    title: 'Full Stack Developer',
    tags: ['Multiplyy', 'Internship', 'Remote'],
    category: '# WORKSPACE & SYSTEM ARCHITECTURE',
    isCurrent: true,
    points: [
      'Building high-performance full-stack web architectures and scalable systems.',
      'Developing responsive frontend interfaces and robust backend service layers.'
    ]
  },
  {
    id: 'papercycle',
    period: 'MAY 2026 — JUL 2026',
    sub: '· 3 mos · Remote',
    title: 'Full Stack Developer',
    tags: ['Papercycle', 'Internship', 'Bhubaneswar'],
    category: '# FULL STACK & MOBILE DEVELOPMENT',
    points: [
      <>Develop and maintain full-stack applications using <strong className="text-white font-medium">NestJS</strong>, <strong className="text-white font-medium">PostgreSQL</strong>, and <strong className="text-white font-medium">Next.js</strong>.</>,
      <>Build responsive UIs using <strong className="text-white font-medium">Tailwind CSS</strong> and manage application state with <strong className="text-white font-medium">Redux</strong>.</>,
      <>Design and integrate <strong className="text-white font-medium">RESTful APIs</strong> across frontend and backend systems.</>,
      <>Develop cross-platform mobile applications using <strong className="text-white font-medium">Flutter</strong>.</>,
      'Collaborate on team projects, participate in code reviews, and deliver tasks within deadlines.'
    ]
  },
  {
    id: 'cttc',
    period: 'MAY 2025 — JUN 2025',
    sub: '· 2 mos · On-site',
    title: 'AI/ML Intern',
    tags: ['CTTC Bhubaneswar', 'On-site'],
    category: '# COMPUTER VISION & DEEP LEARNING',
    points: [
      'Applied deep learning techniques to practical AI problems, focusing on model training and performance evaluation.',
      <>Designed an <strong className="text-white font-medium">AI face detection system</strong>.</>
    ]
  },
  {
    id: 'vssut',
    period: '2023 — PRESENT',
    sub: '· B.Tech CSE',
    title: 'Computer Science Student',
    tags: ['VSSUT', 'B.Tech CSE'],
    category: '# ACADEMIC FOUNDATION',
    points: [
      <>3rd-year Computer Science student at <strong className="text-white font-medium">Veer Surendra Sai University of Technology</strong> (VSSUT).</>,
      'Focusing on Data Structures, Algorithms, Operating Systems, and Distributed Systems while engineering real-world products.'
    ]
  }
];

const DEFAULT_GITHUB_STATS = {
  projects: '23',
  technologies: '8+',
  since: '2025',
  commits: '1,047',
  languagesList: ['Kotlin', 'Java', 'TypeScript', 'JavaScript', 'Python', 'HTML', 'CSS']
};

let cachedFrontTexture: HTMLCanvasElement | null = null;
let cachedBackTexture: HTMLCanvasElement | null = null;
let cachedStrapTexture: HTMLCanvasElement | null = null;
let preloadedAvatar: HTMLImageElement | null = null;
const preloadedLogos: Record<string, HTMLImageElement> = {};

if (typeof window !== 'undefined') {
  const av = new Image();
  av.crossOrigin = 'anonymous';
  av.src = '/avatar.png';
  av.onload = () => {
    preloadedAvatar = av;
  };

  ['/papercycle.png', '/enigma.png', '/cttc.png', '/multiplyy.svg'].forEach(src => {
    const lg = new Image();
    lg.crossOrigin = 'anonymous';
    lg.src = src;
    lg.onload = () => {
      preloadedLogos[src] = lg;
    };
  });

  // Pre-generate textures once in background idle time so tab switch is 100% instant
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(getInitialTextures);
  } else {
    setTimeout(getInitialTextures, 100);
  }
}

function getInitialTextures() {
  if (typeof window === 'undefined') return { front: null, back: null, strap: null };
  if (!cachedFrontTexture) {
    cachedStrapTexture = generateStrapImage();
    cachedFrontTexture = generateFrontBadge({
      name: 'Rohit K. Sahoo',
      role: 'Computer Science Student',
      institution: 'Veer Surendra Sai Univ. of Tech',
      since: DEFAULT_GITHUB_STATS.since,
      projects: DEFAULT_GITHUB_STATS.projects,
      technologies: DEFAULT_GITHUB_STATS.technologies,
      commits: DEFAULT_GITHUB_STATS.commits,
      avatarUrl: '/avatar.png',
      avatarImage: preloadedAvatar,
      githubUsername: 'RohitKSahoo',
      githubUrl: 'https://github.com/RohitKSahoo',
      companies: DEFAULT_COMPANIES.map(comp => ({
        ...comp,
        logoImage: comp.logoUrl && preloadedLogos[comp.logoUrl] ? preloadedLogos[comp.logoUrl] : null
      })),
      languages: DEFAULT_GITHUB_STATS.languagesList,
      orientation: 'landscape'
    });
    cachedBackTexture = generateBackBadge({
      name: 'Rohit K. Sahoo',
      role: 'Computer Science Student',
      institution: 'Veer Surendra Sai Univ. of Tech',
      since: DEFAULT_GITHUB_STATS.since,
      projects: DEFAULT_GITHUB_STATS.projects,
      technologies: DEFAULT_GITHUB_STATS.technologies,
      commits: DEFAULT_GITHUB_STATS.commits,
      githubUsername: 'RohitKSahoo',
      languages: DEFAULT_GITHUB_STATS.languagesList,
      orientation: 'landscape'
    });
  }
  return { front: cachedFrontTexture, back: cachedBackTexture, strap: cachedStrapTexture };
};

interface HistoryPageProps {
  isExiting?: boolean;
  onExitComplete?: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  isExiting = false,
  onExitComplete
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(() => {
    const isSmall = typeof window !== 'undefined' && window.innerWidth < 1024;
    return {
      multiplyy: true,
      papercycle: !isSmall,
      cttc: !isSmall,
      vssut: !isSmall,
    };
  });

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [githubStats, setGithubStats] = useState(DEFAULT_GITHUB_STATS);
  const [assetsReady, setAssetsReady] = useState(false);

  const initial = getInitialTextures();
  const [frontTexture, setFrontTexture] = useState<HTMLCanvasElement | null>(initial.front);
  const [backTexture, setBackTexture] = useState<HTMLCanvasElement | null>(initial.back);
  const [strapTexture, setStrapTexture] = useState<HTMLCanvasElement | null>(initial.strap);

  const initialKey = `${DEFAULT_GITHUB_STATS.since}|${DEFAULT_GITHUB_STATS.projects}|${DEFAULT_GITHUB_STATS.technologies}|${DEFAULT_GITHUB_STATS.commits}|${DEFAULT_GITHUB_STATS.languagesList.join(',')}|${preloadedAvatar ? '1' : '0'}`;
  const lastGeneratedKeyRef = useRef<string>(cachedFrontTexture ? initialKey : '');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fontPromise = document.fonts ? document.fonts.ready : Promise.resolve();
    const avatarPromise = preloadedAvatar && preloadedAvatar.complete
      ? Promise.resolve(preloadedAvatar)
      : new Promise<HTMLImageElement | null>(res => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = '/avatar.png';
          img.onload = () => {
            preloadedAvatar = img;
            res(img);
          };
          img.onerror = () => res(null);
        });

    const logosPromises = ['/papercycle.png', '/enigma.png', '/cttc.png', '/multiplyy.svg'].map(src => {
      if (preloadedLogos[src] && preloadedLogos[src].complete) return Promise.resolve();
      return new Promise<void>(res => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = src;
        img.onload = () => {
          preloadedLogos[src] = img;
          res();
        };
        img.onerror = () => res();
      });
    });

    Promise.all([fontPromise, avatarPromise, ...logosPromises]).then(() => {
      setAssetsReady(true);
    });
  }, []);

  useEffect(() => {
    const fetchPublicGithubData = async () => {
      try {
        const [userRes, reposRes, commitsRes] = await Promise.all([
          fetch('https://api.github.com/users/RohitKSahoo'),
          fetch('https://api.github.com/users/RohitKSahoo/repos?per_page=100&sort=updated'),
          fetch('https://api.github.com/search/commits?q=author:RohitKSahoo')
        ]);

        let commitsCount = '1,047';
        if (commitsRes.ok) {
          const commitsData = await commitsRes.json();
          if (commitsData && typeof commitsData.total_count === 'number' && commitsData.total_count > 0) {
            commitsCount = commitsData.total_count.toLocaleString();
          }
        }

        if (!userRes.ok || !reposRes.ok) {
          setGithubStats(prev => {
            if (prev.commits === commitsCount) return prev;
            return { ...prev, commits: commitsCount };
          });
          return;
        }

        const userData = await userRes.json();
        const reposData = await reposRes.json();

        const languagesSet = new Set<string>();
        if (Array.isArray(reposData)) {
          reposData.forEach((repo: any) => {
            if (repo.language) {
              languagesSet.add(repo.language);
            }
          });
        }

        const sinceYear = userData.created_at ? new Date(userData.created_at).getFullYear().toString() : '2025';

        setGithubStats(prev => {
          const projects = userData.public_repos ? userData.public_repos.toString() : prev.projects;
          const technologies = languagesSet.size > 0 ? languagesSet.size.toString() : prev.technologies;
          const languagesList = languagesSet.size > 0 ? Array.from(languagesSet) : prev.languagesList;

          if (
            prev.projects === projects &&
            prev.technologies === technologies &&
            prev.since === sinceYear &&
            prev.commits === commitsCount &&
            prev.languagesList.join(',') === languagesList.join(',')
          ) {
            return prev;
          }

          return {
            ...prev,
            projects,
            technologies,
            since: sinceYear,
            commits: commitsCount,
            languagesList,
          };
        });
      } catch (e) {
        // Keep initial state if public API fails
      }
    };

    fetch('/api/github')
      .then(res => {
        if (!res.ok) throw new Error('API not available');
        return res.json();
      })
      .then(data => {
        if (data && !data.error && !data.errors) {
          setGithubStats(prev => {
            const projects = data.projects?.toString() || prev.projects;
            const technologies = data.technologies?.toString() || prev.technologies;
            const since = data.since?.toString() || prev.since;
            const commits = data.commits && data.commits !== '0' ? (isNaN(Number(data.commits)) ? data.commits : Number(data.commits).toLocaleString()) : '1,047';
            if (projects === prev.projects && technologies === prev.technologies && since === prev.since && commits === prev.commits) {
              return prev;
            }
            return {
              ...prev,
              projects,
              technologies,
              since,
              commits,
              languagesList: data.languagesList && data.languagesList.length > 0 ? data.languagesList : prev.languagesList,
            };
          });
        } else {
          fetchPublicGithubData();
        }
      })
      .catch(() => {
        fetchPublicGithubData();
      });
  }, []);

  // Generate dynamic 3D badge card textures when live stats or assets change.
  // Uses a 800ms debounce so it NEVER blocks the main thread during 60fps page transitions.
  useEffect(() => {
    const currentKey = `${githubStats.since}|${githubStats.projects}|${githubStats.technologies}|${githubStats.commits}|${githubStats.languagesList.join(',')}|${assetsReady && preloadedAvatar ? '1' : '0'}`;
    if (lastGeneratedKeyRef.current === currentKey && cachedFrontTexture) return;

    const timer = setTimeout(() => {
      lastGeneratedKeyRef.current = currentKey;
      const strap = generateStrapImage();
      cachedStrapTexture = strap;
      setStrapTexture(strap);

      const enrichedCompanies = DEFAULT_COMPANIES.map(comp => ({
        ...comp,
        logoImage: comp.logoUrl && preloadedLogos[comp.logoUrl] ? preloadedLogos[comp.logoUrl] : null
      }));

      const front = generateFrontBadge({
        name: 'Rohit K. Sahoo',
        role: 'Computer Science Student',
        institution: 'Veer Surendra Sai Univ. of Tech',
        since: githubStats.since,
        projects: githubStats.projects,
        technologies: githubStats.technologies,
        commits: githubStats.commits,
        avatarUrl: '/avatar.png',
        avatarImage: preloadedAvatar,
        githubUsername: 'RohitKSahoo',
        githubUrl: 'https://github.com/RohitKSahoo',
        companies: enrichedCompanies,
        languages: githubStats.languagesList,
        orientation: 'landscape'
      });
      cachedFrontTexture = front;
      setFrontTexture(front);

      const back = generateBackBadge({
        name: 'Rohit K. Sahoo',
        role: 'Computer Science Student',
        institution: 'Veer Surendra Sai Univ. of Tech',
        since: githubStats.since,
        projects: githubStats.projects,
        technologies: githubStats.technologies,
        commits: githubStats.commits,
        githubUsername: 'RohitKSahoo',
        languages: githubStats.languagesList,
        orientation: 'landscape'
      });
      cachedBackTexture = back;
      setBackTexture(back);
    }, 800);

    return () => clearTimeout(timer);
  }, [githubStats, assetsReady]);

  return (
    <div className="w-full min-h-[calc(100vh-160px)] lg:min-h-[750px] flex flex-col gap-6 relative overflow-visible font-inter">
      
      {/* FULL-VIEWPORT 3D LANYARD (Desktop only, spans right half of viewport) */}
      {!isMobile && typeof document !== 'undefined' && createPortal(
        <div className="hidden lg:block fixed inset-0 w-screen h-screen z-[5] pointer-events-auto overflow-hidden">
          <Lanyard
            frontImage={frontTexture || undefined}
            backImage={backTexture || undefined}
            strapImage={strapTexture || undefined}
            cardColor="#0d0e10"
            strapColor="#0a0a0c"
            strapWidth={0.55}
            metal="silver"
            finish="metallic"
            orientation="landscape"
            cornerRadius={0.1}
            size={0.58}
            anchor={0.735}
            strapLength={0.27}
            gravity={0.65}
            damping={0.2}
            elasticity={0.9}
            breeze={0.92}
            interactive={!isExiting}
            intro={true}
            introDirection="top"
            githubUrl="https://github.com/RohitKSahoo"
            companies={DEFAULT_COMPANIES}
            isExiting={isExiting}
            onExitComplete={onExitComplete}
            className="w-full h-full"
          />
        </div>,
        document.body
      )}

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0 relative z-10 pointer-events-none">
        
        {/* Left Column (5/12 or 6/12 on XL) - Timeline sliding smoothly up from bottom edge, and down on exit */}
        <motion.div 
          initial={{ opacity: 0, y: 70 }}
          animate={isExiting ? { opacity: 0, y: 40, transition: { duration: 0.2, ease: 'easeIn' } } : { opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.9, delay: 0.05 }}
          className="lg:col-span-5 xl:col-span-6 flex flex-col gap-6 py-2 overflow-y-auto max-h-[calc(100vh-140px)] pr-3 no-scrollbar pointer-events-auto pb-24"
        >

          {/* Mobile Lanyard Top Container (Mobile only: lanyard inside top card above experiences) */}
          {isMobile && (
            <div className="w-full h-[240px] sm:h-[280px] relative rounded-2xl overflow-hidden border border-white/10 bg-[#0d0e10]/80 shadow-[0_8px_32px_rgba(0,0,0,0.6)] shrink-0 mb-2 pointer-events-auto">
              <div className="absolute top-2.5 left-3.5 z-10 flex items-center gap-2 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">INTERACTIVE BADGE</span>
              </div>
              <Lanyard
                frontImage={frontTexture || undefined}
                backImage={backTexture || undefined}
                strapImage={strapTexture || undefined}
                cardColor="#0d0e10"
                strapColor="#0a0a0c"
                strapWidth={0.55}
                metal="silver"
                finish="metallic"
                orientation="landscape"
                cornerRadius={0.1}
                size={0.62}
                anchor={0.5}
                strapLength={0.17}
                gravity={0.65}
                damping={0.2}
                elasticity={0.9}
                breeze={0.92}
                interactive={!isExiting}
                intro={true}
                introDirection="top"
                githubUrl="https://github.com/RohitKSahoo"
                companies={DEFAULT_COMPANIES}
                isExiting={isExiting}
                className="w-full h-full"
              />
            </div>
          )}

          {/* Expandable Timeline Items */}
          {TIMELINE_DATA.map((item, index) => {
            const isExpanded = !!expandedIds[item.id];
            const isLast = index === TIMELINE_DATA.length - 1;

            return (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 26, delay: 0.08 * (index + 1) }}
                className="flex gap-4 sm:gap-6 group pointer-events-auto select-text"
              >
                {/* Node & Line */}
                <div className="flex flex-col items-center mt-1.5 shrink-0">
                  <div className={`w-5 h-5 rounded-sm border flex items-center justify-center ${
                    item.isCurrent 
                      ? 'border-red-500 bg-[#0d0d0d] shadow-[0_0_8px_rgba(239,68,68,0.4)]' 
                      : 'border-white/20 bg-[#0d0d0d]'
                  }`}>
                    <div className={`w-2 h-2 rounded-sm ${item.isCurrent ? 'bg-red-500' : 'bg-white/20'}`} />
                  </div>
                  {!isLast && <div className="w-[1px] h-full bg-white/10 my-2" />}
                </div>
                
                {/* Expandable Content Card */}
                <div className="flex-1 pb-4 min-w-0">
                  {/* Clickable Header */}
                  <div 
                    onClick={() => toggleExpand(item.id)}
                    className="cursor-pointer select-none group/header flex items-start justify-between gap-3 p-1.5 -m-1.5 rounded-lg hover:bg-white/[0.03] transition-colors"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleExpand(item.id); } }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-satoshi font-bold tracking-wider ${item.isCurrent ? 'text-red-500' : 'text-white/50'}`}>
                          {item.period}
                        </span>
                        <span className="text-xs text-white/40 font-mono">{item.sub}</span>
                      </div>

                      <div className="flex items-center gap-2.5 mt-1 mb-1.5 flex-wrap">
                        <h3 className="text-xl sm:text-2xl font-bold font-satoshi text-white tracking-tight group-hover/header:text-red-400 transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex gap-1.5 flex-wrap">
                          {item.tags.map((tag, tIdx) => (
                            <span 
                              key={tIdx} 
                              className={`text-[0.7rem] font-satoshi font-medium border px-2 py-0.5 rounded uppercase tracking-wider ${
                                tag === 'Internship' 
                                  ? 'border-red-500/30 bg-red-500/10 text-red-400' 
                                  : 'border-white/10 text-white/60'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Expand / Collapse Chevron */}
                    <div className="p-1.5 rounded-md border border-white/10 bg-white/5 text-white/50 group-hover/header:text-white group-hover/header:border-white/20 transition-all shrink-0 mt-1">
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform duration-200 ${isExpanded ? 'rotate-180 text-red-400' : ''}`} 
                      />
                    </div>
                  </div>

                  {/* Expandable Details */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 pb-1">
                          <span className="text-xs font-mono text-red-500/80 font-bold block mb-2 tracking-wider">
                            {item.category}
                          </span>
                          <ul className="text-sm sm:text-base text-white/65 space-y-2 list-disc list-inside font-inter leading-relaxed">
                            {item.points.map((pt, pIdx) => (
                              <li key={pIdx}>{pt}</li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Right Column (7/12 or 6/12 on XL) - Transparent to allow clicking & interacting with the 3D Lanyard */}
        <div className="hidden lg:block lg:col-span-7 xl:col-span-6 pointer-events-none" />
      </div>

    </div>
  );
};

export default HistoryPage;
