import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef
} from 'react';
import gsap from 'gsap';
import './CardSwap.css';

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

type CardRef = RefObject<HTMLDivElement | null>;
interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * 80,
  y: (total - 1 - i) * 50,
  z: -i * 120,
  zIndex: total - i
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

export const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = 'elastic',
  children
}) => {
  const config =
    easing === 'elastic'
      ? {
          ease: 'power2.out',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.9,
          returnDelay: 0.05
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.4,
          durMove: 0.4,
          durReturn: 0.4,
          promoteOverlap: 0.45,
          returnDelay: 0.1
        };

  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  const refs = useMemo<CardRef[]>(() => childArr.map(() => React.createRef<HTMLDivElement>()), [childArr.length]);
  const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const container = useRef<HTMLDivElement>(null);

  // Dynamic Scaling Logic
  const [scale, setScale] = React.useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (!container.current) return;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      
      // Content height estimate: Card height + vertical spread
      const stackHeight = Number(height) + (childArr.length - 1) * 50; 
      const stackWidth = Number(width) + (childArr.length - 1) * 100;

      const targetHeight = vh * 0.8;
      const targetWidth = vw * 0.6; // Keep 40% for left UI

      const scaleH = Math.min(1, targetHeight / stackHeight);
      const scaleW = Math.min(1, targetWidth / stackWidth);
      
      let finalScale = Math.min(scaleH, scaleW);
      
      // Responsive constraints
      if (vw < 768) finalScale *= 0.8;
      if (vw < 480) finalScale *= 0.7;

      setScale(finalScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width, height, childArr.length]);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => {
        if(r.current) placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
    });

    let lastSwapTime = 0;

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front]?.current;
      if (!elFront) return;

      const tl = gsap.timeline({
         onComplete: () => {
            order.current = [...rest, front];
         }
      });

      tl.to(elFront, {
        y: '+=1000',
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx]?.current;
        if (!el) return;
        
        const slot = makeSlot(idx === front ? refs.length - 1 : i, cardDistance, verticalDistance, refs.length);
        // We re-calculate slot for the promotion effect
        const nextSlot = makeSlot(i, cardDistance, verticalDistance, refs.length);

        tl.set(el, { zIndex: nextSlot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: nextSlot.x,
            y: nextSlot.y,
            z: nextSlot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.05}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(() => gsap.set(elFront, { zIndex: backSlot.zIndex }), undefined, 'return');
      tl.to(elFront, {
        x: backSlot.x,
        y: backSlot.y,
        z: backSlot.z,
        duration: config.durReturn,
        ease: config.ease
      }, 'return');
    };

    const handleWheel = (e: WheelEvent) => {
       const now = Date.now();
       if (e.deltaY > 20 && now - lastSwapTime > 300) {
          lastSwapTime = now;
          swap();
       }
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [cardDistance, verticalDistance, skewAmount, easing, refs, config]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: e => {
            child.props.onClick?.(e as React.MouseEvent<HTMLDivElement>);
            onCardClick?.(i);
          }
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child
  );

  return (
    <div ref={container} className="card-deck-wrapper" style={{ 
      transform: `translateY(-50%) scale(${scale})`,
      opacity: 1
    }}>
      <div className="card-swap-container">
        {rendered}
      </div>
    </div>
  );
};
