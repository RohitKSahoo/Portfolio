import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  ExternalLink, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface CVViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl?: string;
  downloadFilename?: string;
}

export const CVViewerModal: React.FC<CVViewerModalProps> = ({
  isOpen,
  onClose,
  pdfUrl = '/rohitkumarsahoo_cv.pdf',
  downloadFilename = 'rohitkumarsahoo_cv.pdf'
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [justDownloaded, setJustDownloaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      setZoomLevel(100);
      setJustDownloaded(false);
    }
  }, [isOpen]);

  const handleDownload = async () => {
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setJustDownloaded(true);
    setTimeout(() => setJustDownloaded(false), 4000);
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 15, 175));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 15, 65));
  const handleResetZoom = () => setZoomLevel(100);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-2 sm:p-4 lg:p-6 select-none">
          {/* Windows 11 Acrylic Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Windows 11 Window Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className={`relative z-10 w-full bg-[#202020]/95 backdrop-blur-2xl border border-white/[0.14] rounded-xl shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_1px_rgba(255,255,255,0.2)] flex flex-col overflow-hidden transition-all duration-300 font-sans ${
              isMaximized 
                ? 'h-[97vh] max-w-[98vw] rounded-none' 
                : 'h-[88vh] max-w-5xl'
            }`}
          >
            {/* Windows 11 Title Bar */}
            <div className="h-10 sm:h-11 bg-[#1f1f1f] border-b border-white/[0.08] flex items-center justify-between pl-3 pr-0 shrink-0">
              {/* Left: App Icon & File Name */}
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                {/* Windows Fluent PDF Icon */}
                <div className="w-5 h-5 rounded flex items-center justify-center bg-red-600/90 shadow-sm shrink-0">
                  <FileText size={12} className="text-white" strokeWidth={2.5} />
                </div>
                
                <span className="text-xs font-normal text-white/90 truncate tracking-tight">
                  rohitkumarsahoo_cv.pdf
                </span>

                {/* Windows 11 Subtle Toast / Pill */}
                <AnimatePresence>
                  {justDownloaded && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    >
                      <CheckCircle2 size={12} />
                      <span>Downloaded</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right: Windows 11 Caption Controls */}
              <div className="flex items-center h-full">
                {/* Minimize Button */}
                <button
                  onClick={() => setIsMaximized(false)}
                  aria-label="Minimize"
                  title="Minimize"
                  className="w-11 sm:w-12 h-full flex items-center justify-center text-white/70 hover:bg-white/[0.08] active:bg-white/[0.05] transition-colors cursor-target"
                >
                  <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor">
                    <rect width="10" height="1" />
                  </svg>
                </button>

                {/* Maximize / Restore Button */}
                <button
                  onClick={() => setIsMaximized(prev => !prev)}
                  aria-label={isMaximized ? "Restore down" : "Maximize"}
                  title={isMaximized ? "Restore down" : "Maximize"}
                  className="w-11 sm:w-12 h-full flex items-center justify-center text-white/70 hover:bg-white/[0.08] active:bg-white/[0.05] transition-colors cursor-target"
                >
                  {isMaximized ? (
                    // Windows 11 Restore Double Square icon
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="2.5" y="0.5" width="7" height="7" rx="0.5" />
                      <path d="M0.5 2.5V9.5H7.5" />
                    </svg>
                  ) : (
                    // Windows 11 Maximize Single Square icon
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="0.5" y="0.5" width="9" height="9" rx="0.5" />
                    </svg>
                  )}
                </button>

                {/* Close Button (Classic Windows 11 Red Hover) */}
                <button
                  onClick={onClose}
                  aria-label="Close"
                  title="Close (Esc)"
                  className="w-11 sm:w-12 h-full flex items-center justify-center text-white/70 hover:bg-[#c42b1c] hover:text-white active:bg-[#b32617] transition-colors cursor-target"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M1 1L9 9M9 1L1 9" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Windows 11 Command Bar / Ribbon */}
            <div className="h-10 bg-[#2b2b2b]/90 border-b border-white/[0.08] px-3 flex items-center justify-between text-xs text-white/80 shrink-0">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 65}
                  title="Zoom Out"
                  className="p-1.5 rounded-md hover:bg-white/10 active:bg-white/5 disabled:opacity-30 transition-colors cursor-target"
                >
                  <ZoomOut size={14} />
                </button>
                <span className="font-mono text-[11px] text-white/60 min-w-[42px] text-center">
                  {zoomLevel}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 175}
                  title="Zoom In"
                  className="p-1.5 rounded-md hover:bg-white/10 active:bg-white/5 disabled:opacity-30 transition-colors cursor-target"
                >
                  <ZoomIn size={14} />
                </button>
                <div className="h-3.5 w-px bg-white/15 mx-1" />
                <button
                  onClick={handleResetZoom}
                  title="Reset Zoom (100%)"
                  className="px-2 py-1 rounded-md text-[11px] hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-target flex items-center gap-1"
                >
                  <RotateCcw size={11} />
                  <span className="hidden sm:inline">Fit</span>
                </button>
              </div>

              {/* Action Tools */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Save Copy / Download */}
                <button
                  onClick={handleDownload}
                  title="Save another copy"
                  className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/15 active:bg-white/20 text-white transition-colors flex items-center gap-1.5 cursor-target text-[11px] font-medium"
                >
                  <Download size={13} />
                  <span>Save Copy</span>
                </button>

                {/* Open Original PDF in New Tab */}
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open original vector PDF in new browser tab"
                  className="p-1.5 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-target"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Document Workspace: Flawless Native Document Preview */}
            <div className="relative flex-1 w-full bg-[#181818] overflow-auto flex justify-center items-start p-3 sm:p-6 lg:p-8">
              <motion.div 
                style={{ width: `${zoomLevel}%`, maxWidth: isMaximized ? '1100px' : '900px' }}
                className="bg-white rounded-sm shadow-[0_12px_45px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden transition-all duration-150 origin-top"
              >
                <picture>
                  <source srcSet="/cv_preview.webp" type="image/webp" />
                  <img
                    src="/cv_page_1.png"
                    alt="Rohit Kumar Sahoo Curriculum Vitae"
                    className="w-full h-auto block select-none pointer-events-none"
                    loading="eager"
                  />
                </picture>
              </motion.div>
            </div>

            {/* Windows 11 Status Bar */}
            <div className="h-6 bg-[#1f1f1f] border-t border-white/[0.08] px-3 flex items-center justify-between text-[11px] text-white/50 shrink-0 font-mono">
              <div className="flex items-center gap-3">
                <span>Page 1 of 1</span>
                <span>•</span>
                <span>Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{downloadFilename}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
