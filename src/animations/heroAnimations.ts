import gsap from 'gsap';

export const animateHero = (container: HTMLElement | null) => {
  if (!container) return;

  const q = gsap.utils.selector(container);
  const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });

  // Reset states
  gsap.set(q('.hero-name'), { opacity: 1 });
  gsap.set(q('.system-id'), { opacity: 0, x: -20 });
  gsap.set(q('.status-badge'), { opacity: 0, scale: 0.95 });

  // Main Intro
  timeline
    .to(q('.system-id'), { opacity: 1, x: 0, duration: 0.6 })
    .to(q('.status-badge'), { 
      opacity: 1, 
      scale: 1, 
      duration: 0.4 
    }, "-=0.4");

  // Glitch Flicker on Name
  gsap.to(q('.hero-name'), {
    opacity: 0.9,
    duration: 0.1,
    repeat: -1,
    yoyo: true,
    repeatDelay: Math.random() * 5 + 2,
    ease: "none"
  });

  // Pulse Glow on Status
  gsap.to(q('.status-badge'), {
    boxShadow: "0 0 20px var(--theme-color)",
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  return timeline;
};
