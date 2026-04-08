import gsap from 'gsap';

export const pageLeave = (container: HTMLElement | null) => {
  if (!container) return Promise.resolve();
  
  const tl = gsap.timeline({ defaults: { ease: 'power2.in' } });

  // 1. Content fades out + slight upward motion
  tl.to(container, { opacity: 0, y: -20, duration: 0.3 });

  // 2. Full-screen red overlay flash ( opacity 0 -> 0.2 -> 0 )
  tl.to('.page-overlay', { 
    opacity: 0.2, 
    filter: 'brightness(1.5)', 
    duration: 0.1 
  }, "-=0.2")
  .to('.page-overlay', { 
    opacity: 0, 
    duration: 0.1 
  });

  return tl;
};

export const pageEnter = (container: HTMLElement | null) => {
  if (!container) return;
  
  const q = gsap.utils.selector(container);
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  // 1. Content fades in + reveal from below
  tl.fromTo(container, 
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4 }
  );

  // 2. Staggered child reveal
  const children = q('section, .hero, .project-card, .capability-block');
  if (children.length > 0) {
    tl.fromTo(children,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 },
      "-=0.2"
    );
  }

  return tl;
};
