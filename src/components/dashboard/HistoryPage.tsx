import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Lanyard } from '../effects/Lanyard';
import { generateFrontBadge, generateBackBadge, generateStrapImage, DEFAULT_COMPANIES } from '../effects/badgeGenerator';

const DEFAULT_GITHUB_STATS = {
  projects: '23',
  technologies: '8+',
  since: '2025',
  commits: '986+',
  languagesList: ['Kotlin', 'Java', 'TypeScript', 'JavaScript', 'Python', 'HTML', 'CSS']
};

let cachedFrontTexture = '';
let cachedBackTexture = '';
let cachedStrapTexture = '';

const getInitialTextures = () => {
  if (typeof window === 'undefined') return { front: '', back: '', strap: '' };
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
      githubUsername: 'RohitKSahoo',
      githubUrl: 'https://github.com/RohitKSahoo',
      companies: DEFAULT_COMPANIES,
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

export const HistoryPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [githubStats, setGithubStats] = useState(DEFAULT_GITHUB_STATS);
  const [avatarImg, setAvatarImg] = useState<HTMLImageElement | null>(null);
  const [companyLogos, setCompanyLogos] = useState<Record<string, HTMLImageElement>>({});
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/avatar.png';
    img.onload = () => {
      setAvatarImg(img);
    };

    const logosToLoad = [
      { key: '/papercycle.png', src: '/papercycle.png' },
      { key: '/enigma.png', src: '/enigma.png' }
    ];
    logosToLoad.forEach(({ key, src }) => {
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = src;
      logoImg.onload = () => {
        setCompanyLogos(prev => ({ ...prev, [key]: logoImg }));
      };
    });
  }, []);

  const initial = getInitialTextures();
  const [frontTexture, setFrontTexture] = useState<string>(initial.front);
  const [backTexture, setBackTexture] = useState<string>(initial.back);
  const [strapTexture, setStrapTexture] = useState<string>(initial.strap);

  useEffect(() => {
    const fetchPublicGithubData = async () => {
      try {
        const [userRes, reposRes, commitsRes] = await Promise.all([
          fetch('https://api.github.com/users/RohitKSahoo'),
          fetch('https://api.github.com/users/RohitKSahoo/repos?per_page=100&sort=updated'),
          fetch('https://api.github.com/search/commits?q=author:RohitKSahoo')
        ]);

        let commitsCount = '986+';
        if (commitsRes.ok) {
          const commitsData = await commitsRes.json();
          if (commitsData && typeof commitsData.total_count === 'number') {
            commitsCount = commitsData.total_count.toString();
          }
        }

        if (!userRes.ok || !reposRes.ok) {
          setGithubStats(prev => ({
            ...prev,
            commits: commitsCount
          }));
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

        setGithubStats(prev => ({
          ...prev,
          projects: userData.public_repos ? userData.public_repos.toString() : prev.projects,
          technologies: languagesSet.size > 0 ? languagesSet.size.toString() : prev.technologies,
          since: sinceYear,
          commits: commitsCount,
          languagesList: languagesSet.size > 0 ? Array.from(languagesSet) : prev.languagesList,
        }));
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
          setGithubStats(prev => ({
            projects: data.projects?.toString() || prev.projects,
            technologies: data.technologies?.toString() || prev.technologies,
            since: data.since?.toString() || prev.since,
            commits: data.commits && data.commits !== '0' ? data.commits.toString() : '986+',
            languagesList: data.languagesList && data.languagesList.length > 0 ? data.languagesList : prev.languagesList,
          }));
        } else {
          fetchPublicGithubData();
        }
      })
      .catch(() => {
        fetchPublicGithubData();
      });
  }, []);

  // Generate dynamic 3D badge card textures based on live GitHub stats
  useEffect(() => {
    let active = true;
    const createTextures = async () => {
      const strap = generateStrapImage();
      if (!active) return;
      cachedStrapTexture = strap;
      setStrapTexture(strap);

      const enrichedCompanies = DEFAULT_COMPANIES.map(comp => ({
        ...comp,
        logoImage: comp.logoUrl && companyLogos[comp.logoUrl] ? companyLogos[comp.logoUrl] : null
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
        avatarImage: avatarImg,
        githubUsername: 'RohitKSahoo',
        githubUrl: 'https://github.com/RohitKSahoo',
        companies: enrichedCompanies,
        languages: githubStats.languagesList,
        orientation: 'landscape'
      });
      if (!active) return;
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
      if (!active) return;
      cachedBackTexture = back;
      setBackTexture(back);
    };

    createTextures();
    return () => {
      active = false;
    };
  }, [githubStats, avatarImg, companyLogos, fontsLoaded]);

  return (
    <div className="w-full min-h-[calc(100vh-160px)] lg:min-h-[750px] flex flex-col gap-6 relative overflow-visible font-inter">
      
      {/* FULL-VIEWPORT 3D LANYARD (Attached to top edge, spans entire viewport, zero loader delay) */}
      {typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 w-screen h-screen z-[5] pointer-events-auto overflow-hidden">
          <Lanyard
            frontImage={frontTexture}
            backImage={backTexture}
            cardColor="#0d0e10"
            strapColor="#0a0a0c"
            strapWidth={0.55}
            metal="silver"
            finish="metallic"
            orientation="landscape"
            cornerRadius={0.1}
            size={isMobile ? 0.46 : 0.60}
            anchor={isMobile ? 0.5 : 0.7}
            strapLength={isMobile ? 0.25 : 0.35}
            gravity={0.65}
            damping={0.2}
            elasticity={0.92}
            breeze={0.62}
            interactive={true}
            intro={true}
            githubUrl="https://github.com/RohitKSahoo"
            companies={DEFAULT_COMPANIES}
            className="w-full h-full"
          />
        </div>,
        document.body
      )}

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0 relative z-10 pointer-events-none">
        
        {/* Left Column (5/12) - Timeline sliding smoothly up from bottom edge */}
        <motion.div 
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.9, delay: 0.05 }}
          className="lg:col-span-5 flex flex-col gap-10 py-2 overflow-y-auto pr-2 pointer-events-none"
        >

          {/* Timeline Item 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 26, delay: 0.12 }}
            className="flex gap-6 group pointer-events-auto select-text"
          >
            <div className="flex flex-col items-center mt-1 shrink-0">
              <div className="w-5 h-5 rounded-sm border border-red-500 bg-[#0d0d0d] flex items-center justify-center">
                <div className="w-2 h-2 bg-red-500 rounded-sm" />
              </div>
              <div className="w-[1px] h-full bg-white/10 my-2" />
            </div>
            
            <div className="flex-1 pb-10">
              <span className="text-sm font-satoshi text-red-500 font-bold tracking-wider">2025 — PRESENT</span>
              <div className="flex items-center gap-4 mt-1 mb-3">
                <h3 className="text-3xl font-bold font-satoshi text-white tracking-tight">Computer Science Student</h3>
                <div className="flex gap-1.5">
                  <span className="text-[0.75rem] font-satoshi font-medium border border-white/10 px-2 py-0.5 rounded text-white/50 uppercase tracking-wider">CSE</span>
                  <span className="text-[0.75rem] font-satoshi font-medium border border-white/10 px-2 py-0.5 rounded text-white/50 uppercase tracking-wider">Learning</span>
                </div>
              </div>
              <span className="text-sm font-satoshi text-red-500/80 font-bold block mb-2 tracking-wider"># ACADEMIC JOURNEY</span>
              <ul className="text-base text-white/60 space-y-3 list-disc list-inside font-inter">
                <li><strong className="text-white font-medium">3rd-year</strong> Computer Science student at <strong className="text-white font-medium">Veer Surendra Sai University of Technology</strong> (VSSUT).</li>
                <li>Focusing on mastering core CS fundamentals while building practical software solutions.</li>
              </ul>
            </div>
          </motion.div>

          {/* Timeline Item 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 26, delay: 0.22 }}
            className="flex gap-6 group pointer-events-auto select-text"
          >
            <div className="flex flex-col items-center mt-1 shrink-0">
              <div className="w-5 h-5 rounded-sm border border-white/20 bg-[#0d0d0d] flex items-center justify-center">
                <div className="w-2 h-2 bg-white/20 rounded-sm" />
              </div>
              <div className="w-[1px] h-full bg-white/10 my-2 opacity-0" />
            </div>
            
            <div className="flex-1">
              <span className="text-sm font-satoshi text-white/40 font-bold tracking-wider">2025 — PRESENT</span>
              <div className="flex items-center gap-4 mt-1 mb-3">
                <h3 className="text-3xl font-bold font-satoshi text-white/80 tracking-tight">Exploring Development</h3>
                <div className="flex gap-1.5">
                  <span className="text-[0.75rem] font-satoshi font-medium border border-white/10 px-2 py-0.5 rounded text-white/50 uppercase tracking-wider">AI</span>
                  <span className="text-[0.75rem] font-satoshi font-medium border border-white/10 px-2 py-0.5 rounded text-white/50 uppercase tracking-wider">Android</span>
                </div>
              </div>
              <span className="text-sm font-satoshi text-red-500/80 font-bold block mb-2 tracking-wider"># HOBBY PROJECTS</span>
              <ul className="text-base text-white/60 space-y-3 list-disc list-inside font-inter">
                <li><strong className="text-white font-medium">Browser Extensions & Web Animations:</strong> Explored building privacy-focused dashboards with WebGL rendering.</li>
                <li><strong className="text-white font-medium">Edge AI & Audio Processing:</strong> Implemented low-latency voice activity detection on Android.</li>
                <li><strong className="text-white font-medium">Automation & CLI Tools:</strong> Developed tools to automate Git operations and commit generation using AI.</li>
                <li><strong className="text-white font-medium">Real-time Systems & Security:</strong> Built live location and audio streaming architectures for personal safety.</li>
                <li><strong className="text-white font-medium">Location-Based Services:</strong> Explored geofencing APIs to automate system settings based on location.</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column (7/12) - Transparent to allow clicking & interacting with the 3D Lanyard */}
        <div className="hidden lg:block lg:col-span-7 pointer-events-none" />
      </div>

    </div>
  );
};

export default HistoryPage;
