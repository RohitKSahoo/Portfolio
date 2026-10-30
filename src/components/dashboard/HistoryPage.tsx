import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Smartphone, Code, Clock, Hash, ArrowRight } from 'lucide-react';
import { Lanyard } from '../effects/Lanyard';
import { generateFrontBadge, generateBackBadge, generateStrapImage } from '../effects/badgeGenerator';

export const HistoryPage = () => {
  const [githubStats, setGithubStats] = useState({
    projects: '23',
    technologies: '8+',
    since: '2025',
    commits: '986+',
    calendar: Array(154).fill(0).map(() => Math.floor(Math.random() * 5)),
    languagesList: ['Kotlin', 'Java', 'TypeScript', 'JavaScript', 'Python', 'HTML', 'CSS']
  });

  const [frontTexture, setFrontTexture] = useState<string>('');
  const [backTexture, setBackTexture] = useState<string>('');
  const [strapTexture, setStrapTexture] = useState<string>('');

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
            calendar: data.calendar && data.calendar.length > 0 ? data.calendar : prev.calendar,
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
      setStrapTexture(strap);

      const front = await generateFrontBadge({
        name: 'Rohit K. Sahoo',
        role: 'Computer Science Student',
        institution: 'Veer Surendra Sai Univ. of Tech',
        since: githubStats.since,
        projects: githubStats.projects,
        technologies: githubStats.technologies,
        commits: githubStats.commits,
        avatarUrl: '/avatar.png',
        githubUsername: 'RohitKSahoo',
        languages: githubStats.languagesList
      });
      if (!active) return;
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
        languages: githubStats.languagesList
      });
      if (!active) return;
      setBackTexture(back);
    };

    createTextures();
    return () => {
      active = false;
    };
  }, [githubStats]);

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 relative overflow-hidden font-inter" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      
      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0 relative z-10">
        
        {/* Left Column (8/12) - Timeline */}
        <div className="lg:col-span-8 flex flex-col gap-10 py-2 overflow-y-auto pr-2">

          {/* Timeline Item 1 */}
          <div className="flex gap-6 group">
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
          </div>

          {/* Timeline Item 2 */}
          <div className="flex gap-6 group">
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
          </div>
        </div>

        {/* Right Column (4/12) - 3D Lanyard Card */}
        <div className="lg:col-span-4 flex flex-col py-2 h-[560px] lg:h-full min-h-[480px]">
          <div className="relative w-full h-full rounded-2xl bg-[#0d0d0d]/60 border border-white/10 backdrop-blur-md overflow-hidden flex flex-col shadow-2xl">
            {/* Top header bar */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a0a0c]/85 border border-white/10 backdrop-blur-md">
                <Github size={13} className="text-red-500" />
                <span className="text-xs font-bold font-satoshi text-white tracking-wide">Developer Badge</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a0a0c]/85 border border-white/10 backdrop-blur-md">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                <span className="text-[10px] font-mono text-white/70 uppercase">Interactive 3D</span>
              </div>
            </div>

            {/* 3D Lanyard Canvas */}
            <div className="w-full flex-1 min-h-0 relative">
              {frontTexture ? (
                <Lanyard
                  frontImage={frontTexture}
                  backImage={backTexture}
                  strapImage={strapTexture}
                  strapColor="#ef4444"
                  strapWidth={0.7}
                  metal="silver"
                  finish="holographic"
                  orientation="portrait"
                  cornerRadius={0.22}
                  size={0.76}
                  strapLength={0.42}
                  gravity={1.1}
                  damping={0.48}
                  elasticity={0.7}
                  breeze={0.45}
                  interactive={true}
                  intro={true}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Bottom Controls / Interactivity Hint */}
            <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              <span className="text-[10px] font-mono text-white/40 tracking-wider uppercase">
                [ Drag to swing • Click to flip ]
              </span>
              <a
                href="https://github.com/RohitKSahoo"
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto flex items-center gap-1.5 text-[11px] font-satoshi font-semibold text-red-500 hover:text-red-400 transition-colors"
              >
                <span>GitHub</span>
                <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HistoryPage;

