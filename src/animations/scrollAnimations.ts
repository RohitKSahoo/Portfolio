import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateOnScroll = (element: HTMLElement | null, index: number = 0) => {
  if (!element) return;

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none',
      once: true
    }
  });

  timeline.fromTo(element, 
    { opacity: 0, y: 30 },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.5, 
      delay: index * 0.1,
      ease: 'power2.out'
    }
  );

  return timeline;
};

export const animateSectionHeader = (header: HTMLElement | null) => {
  if (!header) return;

  gsap.fromTo(header,
    { opacity: 0, y: 30, clipPath: 'inset(100% 0% 0% 0%)' },
    {
      opacity: 1,
      y: 0,
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        once: true
      }
    }
  );
};
