import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './Carousel.css';

interface CarouselItemData {
  title?: string;
  description?: string;
  id: string | number;
  icon?: React.ReactNode;
  image?: string;
}

interface CarouselProps {
  items: CarouselItemData[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
}

const GAP = 16;
const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const SPRING_OPTIONS = { type: 'spring', stiffness: 300, damping: 30 };

interface CarouselItemProps {
  item: CarouselItemData;
  index: number;
  itemWidth: number;
  round: boolean;
  trackItemOffset: number;
  x: any;
  transition: any;
}

function CarouselItem({ item, index, itemWidth, round, trackItemOffset, x, transition }: CarouselItemProps) {
  const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
  const outputRange = [90, 0, -90];
  const rotateY = useTransform(x, range, outputRange, { clamp: false });

  return (
    <motion.div
      key={`${item?.id ?? index}-${index}`}
      className={`carousel-item ${round ? 'round' : ''}`}
      style={{
        width: itemWidth,
        height: round ? itemWidth : '100%',
        rotateY: rotateY,
        ...(round && { borderRadius: '50%' }),
        backgroundColor: '#0d0d0d',
        border: '1px solid rgba(255,255,255,0.05)'
      }}
      transition={transition}
    >
      <div className="w-full h-full flex flex-col justify-between">
        {item.image ? (
          <div className="flex-1 flex items-center justify-center p-2 w-full h-full min-h-0">
            <img 
              src={item.image} 
              draggable="false" 
              className="max-w-full max-h-full object-contain rounded-lg min-h-0" 
              alt={item.title || 'Screenshot'} 
            />
          </div>
        ) : (
          <div className={`carousel-item-header ${round ? 'round' : ''}`}>
            <span className="carousel-icon-container">{item.icon}</span>
          </div>
        )}
        
        {(item.title || item.description) && (
          <div className="p-4 bg-black/80 backdrop-blur-sm border-t border-white/5 w-full">
            {item.title && <div className="text-sm font-bold font-satoshi text-white">{item.title}</div>}
            {item.description && <p className="text-xs text-white/50 mt-1 font-inter">{item.description}</p>}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Carousel({
  items = [],
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false
}: CarouselProps) {
  const containerPadding = 16;
  const [containerWidth, setContainerWidth] = useState(baseWidth);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const itemWidth = containerWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;
  
  const itemsForRender = useMemo(() => {
    if (!loop) return items;
    if (items.length === 0) return [];
    return [items[items.length - 1], ...items, items[0]];
  }, [items, loop]);

  const [position, setPosition] = useState(loop ? 1 : 0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return undefined;
    if (pauseOnHover && isHovered) return undefined;

    const timer = setInterval(() => {
      setPosition(prev => Math.min(prev + 1, itemsForRender.length - 1));
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length]);

  useEffect(() => {
    const startingPosition = loop ? 1 : 0;
    setPosition(startingPosition);
    x.set(-startingPosition * trackItemOffset);
  }, [items.length, loop, trackItemOffset, x]);

  useEffect(() => {
    if (!loop && position > itemsForRender.length - 1) {
      setPosition(Math.max(0, itemsForRender.length - 1));
    }
  }, [itemsForRender.length, loop, position]);

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationStart = () => {
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false);
      return;
    }
    const lastCloneIndex = itemsForRender.length - 1;

    if (position === lastCloneIndex) {
      setIsJumping(true);
      const target = 1;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    if (position === 0) {
      setIsJumping(true);
      const target = items.length;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    setIsAnimating(false);
  };

  const handleDragEnd = (_: any, info: any) => {
    const { offset, velocity } = info;
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0;

    if (direction === 0) return;

    setPosition(prev => {
      const next = prev + direction;
      const max = itemsForRender.length - 1;
      return Math.max(0, Math.min(next, max));
    });
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0),
          right: 0
        }
      };

  const activeIndex =
    items.length === 0 ? 0 : loop ? (position - 1 + items.length) % items.length : Math.min(position, items.length - 1);

  const handlePrev = () => {
    if (isAnimating) return;
    setPosition(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    if (isAnimating) return;
    setPosition(prev => Math.min(prev + 1, itemsForRender.length - 1));
  };

  return (
    <div
      ref={containerRef}
      className={`carousel-container group ${round ? 'round' : ''}`}
      style={{
        width: '100%',
        maxWidth: `${baseWidth}px`,
        height: '650px',
        ...(round && { height: `${containerWidth}px`, borderRadius: '50%' })
      }}
    >
      <motion.div
        className="carousel-track"
        drag={isAnimating ? false : 'x'}
        {...dragProps}
        style={{
          width: itemWidth,
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
          x
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(position * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((item, index) => (
          <CarouselItem
            key={`${item?.id ?? index}-${index}`}
            item={item}
            index={index}
            itemWidth={itemWidth}
            round={round}
            trackItemOffset={trackItemOffset}
            x={x}
            transition={effectiveTransition}
          />
        ))}
      </motion.div>

      {/* Controls (Arrows and Indicators) */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
        {items.length > 1 && (
          <button
            onClick={handlePrev}
            className="p-1.5 bg-black/60 border border-white/10 rounded-full text-white/70 hover:text-white z-10 transition-colors pointer-events-auto"
          >
            <ArrowLeft size={14} />
          </button>
        )}
        
        <div className="flex gap-2 pointer-events-auto">
          {items.map((_, index) => (
            <motion.div
              key={index}
              className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-colors ${
                activeIndex === index ? 'bg-red-500' : 'bg-white/30 hover:bg-white/50'
              }`}
              animate={{
                scale: activeIndex === index ? 1.2 : 1
              }}
              onClick={() => setPosition(loop ? index + 1 : index)}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>

        {items.length > 1 && (
          <button
            onClick={handleNext}
            className="p-1.5 bg-black/60 border border-white/10 rounded-full text-white/70 hover:text-white z-10 transition-colors pointer-events-auto"
          >
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
