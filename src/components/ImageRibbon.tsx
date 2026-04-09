import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

interface ImageRibbonProps {
  images: string[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

export const ImageRibbon: React.FC<ImageRibbonProps> = ({ images, activeIndex, onIndexChange }) => {
  const ribbonRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleWheel = (e: React.WheelEvent) => {
    if (isTransitioning) return;

    if (e.deltaY > 50) {
      if (activeIndex < images.length - 1) {
        onIndexChange(activeIndex + 1);
        triggerTransition();
      }
    } else if (e.deltaY < -50) {
      if (activeIndex > 0) {
        onIndexChange(activeIndex - 1);
        triggerTransition();
      }
    }
  };

  const triggerTransition = () => {
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  useEffect(() => {
    if (ribbonRef.current) {
      gsap.to(ribbonRef.current, {
        y: -activeIndex * 550, // 550px (height) - Connected (No gap)
        duration: 0.8,
        ease: "power3.inOut"
      });
    }
  }, [activeIndex]);

  return (
    <div 
      className="image-ribbon-viewport"
      onWheel={handleWheel}
    >
      <div ref={ribbonRef} className="image-ribbon-track">
        {images.map((img, i) => (
          <div 
            key={i} 
            className={`ribbon-image-container ${i === activeIndex ? 'active' : 'inactive'}`}
          >
            <img src={img} alt={`Project ${i}`} className="ribbon-image" />
            <div className="ribbon-overlay" />
          </div>
        ))}
      </div>
    </div>
  );
};
