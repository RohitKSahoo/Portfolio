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

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  onCardChange?: (index: number) => void;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  children: ReactNode;
}

export const CardSwap: React.FC<CardSwapProps> = ({
  width = '100%',
  height = 'auto',
  cardDistance = 40,
  verticalDistance = 30,
  onCardChange,
  skewAmount = 4,
  easing = 'elastic',
  children
}) => {
  const config = {
    ease: 'power1.inOut',
    durDrop: 0.6,
    durMove: 0.5,
    durReturn: 0.5,
    promoteOverlap: 0.5,
    returnDelay: 0.1
  };

  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  const totalCards = childArr.length;
  const refs = useMemo<CardRef[]>(() => childArr.map(() => React.createRef<HTMLDivElement>()), [totalCards]);
  const order = useRef<number[]>(Array.from({ length: totalCards }, (_, i) => i));
  const activeIdxRef = useRef(0);
  const isTransitioning = useRef(false);

  useEffect(() => {
    // Initial Placement
    refs.forEach((r, i) => {
        if(r.current) placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, totalCards), skewAmount);
    });

    const performSwap = () => {
      if (order.current.length < 2 || isTransitioning.current) return;
      isTransitioning.current = true;

      const [front, ...rest] = order.current;
      const elFront = refs[front]?.current;
      if (!elFront) {
        isTransitioning.current = false;
        return;
      }

      // Update index
      activeIdxRef.current = (activeIdxRef.current + 1) % totalCards;
      onCardChange?.(activeIdxRef.current);

      const tl = gsap.timeline({
         onComplete: () => {
            order.current = [...rest, front];
            isTransitioning.current = false;
         }
      });

      // Eject
      tl.to(elFront, {
        y: '+=800',
        x: '+=100',
        rotationZ: 10,
        scale: 0.9,
        opacity: 0,
        duration: config.durDrop,
        ease: "power2.in"
      });

      // Promote others
      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx]?.current;
        if (!el) return;
        const nextSlot = makeSlot(i, cardDistance, verticalDistance, totalCards);

        tl.set(el, { zIndex: nextSlot.zIndex }, 'promote');
        tl.to(el, {
            x: nextSlot.x,
            y: nextSlot.y,
            z: nextSlot.z,
            duration: config.durMove,
            ease: "circ.out"
          },
          `promote+=${i * 0.05}`
        );
      });

      // Return to back
      const backSlot = makeSlot(totalCards - 1, cardDistance, verticalDistance, totalCards);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(() => gsap.set(elFront, { zIndex: backSlot.zIndex }), undefined, 'return');
      
      tl.to(elFront, {
        x: backSlot.x,
        y: backSlot.y,
        z: backSlot.z,
        rotationZ: 0,
        scale: 1,
        opacity: 1,
        duration: config.durReturn,
        ease: "circ.out"
      }, 'return');
    };

    let lastSwapTime = 0;
    const handleWheel = (e: WheelEvent) => {
       const now = Date.now();
       if (e.deltaY > 30 && now - lastSwapTime > 600) {
          lastSwapTime = now;
          performSwap();
       }
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [cardDistance, verticalDistance, skewAmount, refs, totalCards, onCardChange]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width: '100%', height: 'auto', ...(child.props.style ?? {}) },
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child
  );

  return (
    <div className="card-swap-container">
      {rendered}
    </div>
  );
};
