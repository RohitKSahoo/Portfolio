import React from 'react';
import Folder from './Folder/Folder';
import { RotateCw, Sparkles } from 'lucide-react';

interface LanyardTechFoldersProps {
  onFlipBack?: () => void;
  scale?: number;
}

const LANGUAGES = [
  'Kotlin',
  'Java',
  'TypeScript',
  'JavaScript',
  'Python',
  'C / C++'
];

const FRAMEWORKS = [
  'React 18 / 19',
  'Next.js',
  'Three.js',
  'Tailwind CSS',
  'Framer Motion',
  'Jetpack Compose'
];

const SYSTEMS = [
  'Node.js & Express',
  'Git & GitHub Actions',
  'Linux & Bash CLI',
  'REST & GraphQL',
  'Firebase & SQLite',
  'Android NDK'
];

export const LanyardTechFolders: React.FC<LanyardTechFoldersProps> = ({ onFlipBack, scale = 1 }) => {
  return (
    <div 
      className="relative flex flex-col items-center justify-between p-6 rounded-2xl bg-[#09090c]/95 border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(239,68,68,0.12)] backdrop-blur-md select-none"
      style={{
        width: '680px',
        height: '420px',
        transform: `scale(${scale})`,
        transformOrigin: 'center center'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <span className="text-[11px] font-mono font-bold tracking-widest text-red-500 uppercase">
            // 02 · ARCHITECTURE DOSSIERS
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-white/40 tracking-wider hidden sm:inline-block">
            HOVER OR CLICK TO EXPAND
          </span>
          {onFlipBack && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFlipBack();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-[10px] font-mono text-white/80 hover:text-red-400 transition-all cursor-pointer"
            >
              <RotateCw size={11} />
              <span>FLIP TO FRONT</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 Folders Grid */}
      <div className="w-full flex-1 flex items-center justify-around gap-2 px-2 pt-4 pb-2">
        {/* Folder 1: Languages */}
        <div className="flex flex-col items-center">
          <Folder
            label="LANGUAGES"
            tabPosition="left"
            color="#ef4444"
            paperColor="#121217"
            variant="solid"
            mode="flap"
            layout="spread"
            openOn="hover"
            size={0.88}
            items={LANGUAGES}
            className="cursor-pointer"
          />
          <span className="mt-3 text-[11px] font-mono font-semibold tracking-wider text-white/50 uppercase">
            01 · Core Languages
          </span>
        </div>

        {/* Folder 2: Frameworks */}
        <div className="flex flex-col items-center">
          <Folder
            label="FRAMEWORKS"
            tabPosition="center"
            color="#e11d48"
            paperColor="#121217"
            variant="solid"
            mode="flap"
            layout="spread"
            openOn="hover"
            size={0.88}
            items={FRAMEWORKS}
            className="cursor-pointer"
          />
          <span className="mt-3 text-[11px] font-mono font-semibold tracking-wider text-white/50 uppercase">
            02 · Frameworks & UI
          </span>
        </div>

        {/* Folder 3: Systems */}
        <div className="flex flex-col items-center">
          <Folder
            label="SYSTEMS"
            tabPosition="right"
            color="#b91c1c"
            paperColor="#121217"
            variant="solid"
            mode="flap"
            layout="spread"
            openOn="hover"
            size={0.88}
            items={SYSTEMS}
            className="cursor-pointer"
          />
          <span className="mt-3 text-[11px] font-mono font-semibold tracking-wider text-white/50 uppercase">
            03 · Systems & Tooling
          </span>
        </div>
      </div>

      {/* Bottom Status Readout */}
      <div className="w-full pt-2 flex items-center justify-between text-[10px] font-mono text-white/30 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <Sparkles size={11} className="text-red-500/70" />
          <span>REACTBITS FOLDER ENGINE</span>
        </div>
        <span>TAP PAGES TO SELECT</span>
      </div>
    </div>
  );
};

export default LanyardTechFolders;
