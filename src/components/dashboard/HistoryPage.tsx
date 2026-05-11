import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Smartphone, Code, Clock, Hash, ArrowRight } from 'lucide-react';
const iconMap: Record<string, string> = {
  'Kotlin': 'kotlin/kotlin-original',
  'Java': 'java/java-original',
  'TypeScript': 'typescript/typescript-original',
  'JavaScript': 'javascript/javascript-original',
  'Python': 'python/python-original',
  'HTML': 'html5/html5-original',
  'CSS': 'css3/css3-original',
  'C++': 'cplusplus/cplusplus-original',
  'C': 'c/c-original',
  'C#': 'csharp/csharp-original',
  'Go': 'go/go-original',
  'Ruby': 'ruby/ruby-original',
  'PHP': 'php/php-original',
  'Swift': 'swift/swift-original',
  'Dart': 'dart/dart-original',
  'Rust': 'rust/rust-original',
  'Jupyter Notebook': 'jupyter/jupyter-original',
  'Shell': 'bash/bash-original',
};

export const HistoryPage = () => {
  const [githubStats, setGithubStats] = useState({
    projects: '3+',
    technologies: '5+',
    since: '2025',
    calendar: Array(154).fill(0).map(() => Math.floor(Math.random() * 5)), // 22 weeks * 7 days mock data
    languagesList: ['Kotlin', 'Java', 'TypeScript', 'JavaScript', 'Python', 'HTML', 'CSS']
  });

  useEffect(() => {
    fetch('/api/github')
      .then(res => {
        if (!res.ok) throw new Error('API not available');
        return res.json();
      })
      .then(data => {
        if (!data.error && !data.errors) {
          setGithubStats(prev => ({
            projects: data.projects.toString(),
            technologies: data.technologies.toString(),
            since: data.since.toString(),
            calendar: data.calendar && data.calendar.length > 0 ? data.calendar : prev.calendar,
            languagesList: data.languagesList && data.languagesList.length > 0 ? data.languagesList : prev.languagesList,
          }));
        }
      })
      .catch(() => {
        // Fallback silently to mock data if API fails or runs locally without Vercel CLI
      });
  }, []);

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

        {/* Right Column (4/12) - GitHub Card */}
        <div className="lg:col-span-4 flex flex-col py-2">
          <div className="p-6 bg-[#0d0d0d] border border-white/5 rounded-xl flex flex-col gap-6 h-full">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Github size={20} className="text-red-500" />
                <span className="text-sm font-bold font-satoshi text-white">Student Impact</span>
              </div>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.65rem] font-satoshi font-medium text-white/30 uppercase tracking-wider">Projects</span>
                <span className="text-4xl font-bold font-satoshi text-white tracking-tight">{githubStats.projects}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.65rem] font-satoshi font-medium text-white/30 uppercase tracking-wider">Technologies</span>
                <span className="text-4xl font-bold font-satoshi text-white tracking-tight">{githubStats.technologies}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.65rem] font-satoshi font-medium text-white/30 uppercase tracking-wider">Since</span>
                <span className="text-4xl font-bold font-satoshi text-white tracking-tight">{githubStats.since}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.65rem] font-satoshi font-medium text-white/30 uppercase tracking-wider">Status</span>
                <span className="text-base font-bold font-satoshi text-green-500 mt-1">Learning</span>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-white/5">
              <span className="text-[0.6rem] font-satoshi font-medium text-white/30 uppercase block mb-3 tracking-wider">Tech Space</span>
              <div className="flex flex-wrap gap-2.5">
                {githubStats.languagesList.map((lang, i) => {
                  const iconPath = iconMap[lang];
                  
                  return (
                    <motion.div
                      key={lang}
                      className="flex items-center justify-center p-2 rounded-full bg-[#0d0d0d] border border-white/10 shadow-lg cursor-pointer"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: 1,
                        scale: 1,
                      }}
                      whileHover={{
                        y: -5,
                        scale: 1.1,
                        borderColor: 'rgba(239, 68, 68, 0.3)',
                      }}
                      transition={{ 
                        type: "spring",
                        stiffness: 400,
                        damping: 15,
                        delay: i * 0.03
                      }}
                      title={lang}
                    >
                      {iconPath ? (
                        <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconPath}.svg`} alt={lang} className="w-5 h-5 opacity-80" />
                      ) : (
                        <div className="w-5 h-5 flex items-center justify-center">
                          <span className="text-[0.6rem] font-satoshi font-bold text-white/70">{lang.substring(0, 2).toUpperCase()}</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default HistoryPage;
