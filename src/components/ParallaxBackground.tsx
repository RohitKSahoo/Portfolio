import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const ParallaxBackground = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Background Layer (Deepest)
    gsap.to(bgRef.current, {
      y: -40,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
      }
    });

    // Midground Layer
    gsap.to(midRef.current, {
      y: -20,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      {/* LAYER 1: Deepest Background */}
      <div 
        ref={bgRef}
        className="fixed inset-[-50px] z-0 pointer-events-none will-change-transform"
      >
        <div className="absolute inset-0 system-app opacity-[0.8]" />
        <div className="absolute inset-0 scanline opacity-[0.03]" />
      </div>

      {/* LAYER 2: Midground Decorative */}
      <div 
        ref={midRef}
        className="fixed inset-[-30px] z-10 pointer-events-none will-change-transform"
      >
        <div className="absolute top-1/4 left-10 w-[2px] h-64 bg-theme opacity-[0.05]" />
        <div className="absolute top-3/4 right-20 w-[2px] h-48 bg-theme opacity-[0.05]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full h-[1px] bg-theme opacity-[0.02]" />
      </div>
    </>
  );
};
