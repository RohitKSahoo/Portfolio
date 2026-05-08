import React from 'react';
import { motion } from 'framer-motion';
import { Github, Smartphone, Code, Clock, Hash, ArrowRight } from 'lucide-react';

export const HistoryPage = () => {
  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 relative overflow-hidden font-inter" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      
      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0 relative z-10">
        
        {/* Left Column (8/12) - Timeline */}
        <div className="lg:col-span-8 flex flex-col gap-6 py-2 overflow-y-auto pr-2">


          {/* Timeline Item 1 */}
          <div className="flex gap-6 group">
            <div className="flex flex-col items-center mt-1 shrink-0">
              <div className="w-4 h-4 rounded-sm border border-red-500 bg-[#0d0d0d] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-sm" />
              </div>
              <div className="w-[1px] h-full bg-white/10 my-2" />
            </div>
            
            <div className="flex-1 pb-8">
              <span className="text-xs font-satoshi text-red-500 font-bold tracking-wider">2025 — PRESENT</span>
              <div className="flex items-center gap-3 mt-1 mb-2">
                <h3 className="text-2xl font-bold font-satoshi text-white tracking-tight">Computer Science Student</h3>
                <div className="flex gap-1.5">
                  <span className="text-[0.65rem] font-satoshi font-medium border border-white/10 px-2 py-0.5 rounded text-white/50 uppercase tracking-wider">CSE</span>
                  <span className="text-[0.65rem] font-satoshi font-medium border border-white/10 px-2 py-0.5 rounded text-white/50 uppercase tracking-wider">Learning</span>
                </div>
              </div>
              <span className="text-xs font-satoshi text-red-500/80 font-bold block mb-2 tracking-wider"># ACADEMIC JOURNEY</span>
              <ul className="text-sm text-white/60 space-y-2 list-disc list-inside font-inter">
                <li>Started my Computer Science degree in 2025.</li>
                <li>Focused on learning fundamentals and building a strong foundation.</li>
                <li>Working on small projects to apply what I learn in class.</li>
              </ul>
            </div>
          </div>

          {/* Timeline Item 2 */}
          <div className="flex gap-6 group">
            <div className="flex flex-col items-center mt-1 shrink-0">
              <div className="w-4 h-4 rounded-sm border border-white/20 bg-[#0d0d0d] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white/20 rounded-sm" />
              </div>
              <div className="w-[1px] h-full bg-white/10 my-2 opacity-0" />
            </div>
            
            <div className="flex-1">
              <span className="text-xs font-satoshi text-white/40 font-bold tracking-wider">2025 — PRESENT</span>
              <div className="flex items-center gap-3 mt-1 mb-2">
                <h3 className="text-2xl font-bold font-satoshi text-white/80 tracking-tight">Exploring Development</h3>
                <div className="flex gap-1.5">
                  <span className="text-[0.65rem] font-satoshi font-medium border border-white/10 px-2 py-0.5 rounded text-white/50 uppercase tracking-wider">Web</span>
                  <span className="text-[0.65rem] font-satoshi font-medium border border-white/10 px-2 py-0.5 rounded text-white/50 uppercase tracking-wider">Projects</span>
                </div>
              </div>
              <span className="text-xs font-satoshi text-red-500/80 font-bold block mb-2 tracking-wider"># HOBBY PROJECTS</span>
              <ul className="text-sm text-white/60 space-y-2 list-disc list-inside font-inter">
                <li>Started building websites and small projects in 2025.</li>
                <li>Learning new technologies by working on ideas that interest me.</li>
                <li>Enjoying the process of creating things from scratch and learning as I go.</li>
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
                <span className="text-4xl font-bold font-satoshi text-white tracking-tight">3+</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.65rem] font-satoshi font-medium text-white/30 uppercase tracking-wider">Technologies</span>
                <span className="text-4xl font-bold font-satoshi text-white tracking-tight">5+</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.65rem] font-satoshi font-medium text-white/30 uppercase tracking-wider">Since</span>
                <span className="text-4xl font-bold font-satoshi text-white tracking-tight">2025</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.65rem] font-satoshi font-medium text-white/30 uppercase tracking-wider">Status</span>
                <span className="text-base font-bold font-satoshi text-green-500 mt-1">Learning</span>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-white/5">
              <span className="text-[0.6rem] font-satoshi font-medium text-white/30 uppercase block mb-2 tracking-wider">Learning Velocity</span>
              <div className="flex items-end gap-[3px] h-16">
                {[40, 70, 45, 90, 65, 80, 50, 100, 75, 40, 85, 60, 95, 30, 60, 80, 120].map((h, i) => (
                  <div key={i} className={`flex-1 ${i === 16 ? 'bg-red-500' : 'bg-white/10'} rounded-t-[1px]`} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 pt-4 mt-auto flex justify-between items-center text-sm font-satoshi relative z-10">
        <div className="flex items-center gap-12">
          <div className="flex flex-col gap-0.5">
            <span className="text-[0.65rem] text-white/30 uppercase tracking-wider font-medium">Focus Areas</span>
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <span className="text-red-500">Learning</span>
              <span className="text-white/20">•</span>
              <span className="text-red-500">Building</span>
              <span className="text-white/20">•</span>
              <span className="text-red-500">Exploring</span>
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[0.65rem] text-white/30 uppercase tracking-wider font-medium">Open To</span>
            <div className="text-white font-bold text-sm">
              Learning Opportunities & Collaborations
            </div>
          </div>
        </div>

        <ArrowRight size={16} className="text-white/50" />
      </div>
    </div>
  );
};

export default HistoryPage;
