import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { animateSectionHeader, animateOnScroll } from '../../animations/scrollAnimations';

export const EstablishUplink = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const [status, setStatus] = useState('IDLE');

  useGSAP(() => {
    animateSectionHeader(headerRef.current);
    
    // Animate form and node sections on scroll
    const items = gsap.utils.selector(containerRef.current)('.uplink-item');
    items.forEach((item, i) => animateOnScroll(item as HTMLElement, i));
  }, { scope: containerRef });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('TRANSMITTING');
    setTimeout(() => setStatus('SUCCESS'), 1500);
    setTimeout(() => setStatus('IDLE'), 4500);
  };

  // Node Link Hover Animation
  const onNodeHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const icon = e.currentTarget.querySelector('.icon');
    gsap.to(icon, { x: 5, duration: 0.2, ease: 'power2.out' });
    gsap.to(e.currentTarget, { borderColor: 'var(--theme-color)', backgroundColor: 'rgba(255,0,0,0.05)', duration: 0.2 });
  };

  const onNodeLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const icon = e.currentTarget.querySelector('.icon');
    gsap.to(icon, { x: 0, duration: 0.2, ease: 'power2.out' });
    gsap.to(e.currentTarget, { borderColor: '#111', backgroundColor: 'transparent', duration: 0.2 });
  };

  return (
    <section id="uplink" ref={containerRef} className="flex flex-col gap-10 px-4 md:px-0 mt-20 pt-10 border-t-2 border-theme scroll-mt-24">
      <h2 
        ref={headerRef}
        className="glitch text-4xl md:text-6xl text-white leading-none opacity-0" 
        data-text="ESTABLISH_UPLINK"
      >
        ESTABLISH_UPLINK
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <form className="uplink-item flex flex-col gap-6 opacity-0" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-[0.6rem] md:text-xs text-theme tracking-widest font-mono">ID_IDENTIFIER</label>
            <input 
              type="text" 
              placeholder="NAME / ORGANIZATION" 
              className="w-full bg-white/[0.01] border border-[#222] p-4 text-white font-mono text-sm focus:border-theme focus:bg-theme/5 focus:shadow-[0_0_15px_rgba(255,0,0,0.1)] outline-none transition-all"
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[0.6rem] md:text-xs text-theme tracking-widest font-mono">SIGNAL_REF_EMAIL</label>
            <input 
              type="email" 
              placeholder="CONTACT_EMAIL" 
              className="w-full bg-white/[0.01] border border-[#222] p-4 text-white font-mono text-sm focus:border-theme focus:bg-theme/5 focus:shadow-[0_0_15px_rgba(255,0,0,0.1)] outline-none transition-all"
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[0.6rem] md:text-xs text-theme tracking-widest font-mono">MESSAGE_LOG_STREAM</label>
            <textarea 
              rows={4} 
              placeholder="ENTER_MESSAGE_ENCRYPTED_LOG..." 
              className="w-full bg-white/[0.01] border border-[#222] p-4 text-white font-mono text-sm focus:border-theme focus:bg-theme/5 focus:shadow-[0_0_15px_rgba(255,0,0,0.1)] outline-none transition-all"
              required 
            />
          </div>
          <button 
            type="submit" 
            onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
            className={`mt-4 py-5 bg-theme border-none text-white font-heading text-xl md:text-2xl cursor-pointer hover:brightness-120 hover:tracking-[3px] transition-all disabled:bg-[#222] disabled:text-[#555] disabled:cursor-default disabled:tracking-normal ${status === 'SUCCESS' ? '!bg-green-500 !text-black' : ''}`}
            disabled={status !== 'IDLE'}
          >
            {status === 'IDLE' ? 'TRANSMIT_SIGNAL' : status === 'TRANSMITTING' ? 'TRANSMITTING_ENCRYPTED_PACKETS...' : 'SIGNAL_SENT_SUCCESSFULLY'}
          </button>
        </form>

        <div className="uplink-item flex flex-col gap-10 opacity-0">
          <div className="space-y-6">
            <h3 className="text-xl md:text-2xl text-theme font-heading tracking-widest underline decoration-theme underline-offset-8 uppercase font-heading">NODE_LOCATIONS</h3>
            <div className="flex flex-col gap-4">
              <a 
                href="/assets/resume.pdf" 
                onMouseEnter={onNodeHover}
                onMouseLeave={onNodeLeave}
                className="p-4 md:p-5 border border-[#111] text-white transition-all font-heading text-xl flex items-center gap-4 group" 
                target="_blank"
              >
                <span className="icon text-theme font-mono text-sm">[↓]</span> FETCH_RESUME.PDF
              </a>
              <a 
                href="https://github.com/RohitKSahoo" 
                onMouseEnter={onNodeHover}
                onMouseLeave={onNodeLeave}
                className="p-4 md:p-5 border border-[#111] text-white transition-all font-heading text-xl flex items-center gap-4 group" 
                target="_blank"
              >
                <span className="icon text-theme font-mono text-sm">[‡]</span> GIT_REPOSITORY
              </a>
              <a 
                href="https://www.linkedin.com/in/rohit-kumar-sahoo-a68a452b0" 
                onMouseEnter={onNodeHover}
                onMouseLeave={onNodeLeave}
                className="p-4 md:p-5 border border-[#111] text-white transition-all font-heading text-xl flex items-center gap-4 group" 
                target="_blank"
              >
                <span className="icon text-theme font-mono text-sm">[»]</span> LINKEDIN_SIGNAL
              </a>
            </div>
          </div>
          
          <div className="text-[0.6rem] md:text-[0.65rem] text-grey leading-loose border-l-2 border-theme pl-5 font-mono opacity-60">
            TERMINAL_DITCHED: TRUE<br />
            TACTICAL_LAYOUT: ENABLED<br />
            ENCRYPTION_LEVEL: AES-256<br />
            (C) 2024 SYSTEM_ARCHITECT // RKS-01
          </div>
        </div>
      </div>
    </section>
  );
};
