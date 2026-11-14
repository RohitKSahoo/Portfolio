import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Mail, Github, Linkedin, Instagram, ArrowUpRight } from 'lucide-react';

export interface SocialItem {
  title: string;
  badge: string;
  handle: string;
  claim: string;
  href: string;
  external: boolean;
  icon: React.ElementType;
  image: string;
  alt: string;
  offsetY?: number;
}

const DEFAULT_SOCIALS: SocialItem[] = [
  {
    title: 'Email',
    badge: '01',
    handle: 'rohitkumarsahoo37@gmail.com',
    claim: 'Direct inquiries & collaborations. Send a message to connect.',
    href: 'mailto:rohitkumarsahoo37@gmail.com',
    external: false,
    icon: Mail,
    image: 'https://images.unsplash.com/photo-1517071148094-e0c3f35783ce?q=80&w=1394&auto=format&fit=crop',
    alt: 'Warm neon lighting and minimalist creative atmosphere',
    offsetY: 0,
  },
  {
    title: 'GitHub',
    badge: '02',
    handle: 'github.com/RohitKSahoo',
    claim: 'Open source repositories, distributed systems & full-stack code.',
    href: 'https://github.com/RohitKSahoo',
    external: true,
    icon: Github,
    image: 'https://images.unsplash.com/photo-1761646062236-274331e70d7b?q=80&w=1615&auto=format&fit=crop',
    alt: 'High-contrast studio silhouette with dramatic orange lighting',
    offsetY: -200,
  },
  {
    title: 'LinkedIn',
    badge: '03',
    handle: 'linkedin.com/in/rohitksahoo',
    claim: 'Professional journey, career updates & engineering network.',
    href: 'https://linkedin.com/in/rohitksahoo',
    external: true,
    icon: Linkedin,
    image: 'https://images.unsplash.com/photo-1734290173221-4899e9cc2b65?q=80&w=1470&auto=format&fit=crop',
    alt: 'Dramatic moody doorway with red lighting',
    offsetY: -150,
  },
  {
    title: 'Instagram',
    badge: '04',
    handle: '@rohitks.2407',
    claim: 'Visual narratives, creative snippets & life beyond the terminal.',
    href: 'https://www.instagram.com/rohitks.2407?igsh=MTU4c3hhMGI1eXdqMQ==',
    external: true,
    icon: Instagram,
    image: 'https://images.unsplash.com/photo-1783767772392-8a58cd7843f8?q=80&w=1471&auto=format&fit=crop',
    alt: 'Vibrant magenta and crimson chromatic lights',
    offsetY: 0,
  },
];

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const MIN_W = 350;
const MIN_H = 370;
const PAD = 16;
const COLUMN = 326;
const PILL_GAP = 9;
const PHOTO_BLEED = 2;
const NOTE_W = COLUMN - 18 * 2 - 2;

const SPRING = { type: 'spring' as const, stiffness: 340, damping: 28, mass: 0.8 };
const HEIGHT_SPRING = { type: 'spring' as const, stiffness: 340, damping: 34, mass: 0.8 };
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const FALLBACK_WIDTHS: Record<string, number> = {
  Email: 104,
  GitHub: 114,
  LinkedIn: 124,
  Instagram: 134,
};

function posOf(offsetY: unknown): string {
  const o = typeof offsetY === 'number' && Number.isFinite(offsetY) ? Math.max(-250, Math.min(250, offsetY)) : 0;
  return `50% ${50 - (o / 250) * 50}%`;
}

function Note({ item, reduce }: { item: SocialItem; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setH(el.offsetHeight);
    const ro = new ResizeObserver(() => setH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const spring = reduce ? { duration: 0 } : HEIGHT_SPRING;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: h, transition: { height: spring, opacity: { duration: 0.28, delay: 0.06 } } }}
      exit={{ opacity: 0, height: 0, transition: { height: spring, opacity: { duration: 0.2 } } }}
      style={{ overflowX: 'visible', overflowY: 'clip', width: 0, minWidth: '100%' }}
    >
      <div ref={ref} style={{ paddingTop: 10 }}>
        <div style={{ boxSizing: 'border-box', width: NOTE_W, paddingLeft: 24 }}>
          <p className="text-[12px] sm:text-[13px] text-white/80 font-inter leading-relaxed m-0 break-words">
            {item.claim}
          </p>
          <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-white/10 text-red-400 font-satoshi font-semibold text-[11px] tracking-wide">
            <span className="truncate">{item.handle}</span>
            <span className="text-white/40">·</span>
            <span className="shrink-0 flex items-center gap-1 text-white/90">
              Click again to open <ArrowUpRight size={12} className="inline text-red-400" />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export interface SocialsAccordionProps {
  items?: SocialItem[];
  defaultOpen?: number;
  autoplay?: boolean;
  radius?: number;
  className?: string;
}

export const SocialsAccordion: React.FC<SocialsAccordionProps> = ({
  items = DEFAULT_SOCIALS,
  defaultOpen = 0,
  radius = 20,
  className = '',
}) => {
  const n = items.length;
  const reduce = useReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState({ w: 350, h: 370 });
  const [active, setActive] = useState<number | null>(defaultOpen);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth && el.clientHeight) {
        setFrame({ w: el.clientWidth, h: el.clientHeight });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cardW = frame.w;
  const cardH = frame.h;
  const scale = Math.min(cardW / MIN_W, cardH / MIN_H);
  const stageW = cardW / scale;
  const stageH = cardH / scale;

  const select = useCallback((next: number | null) => {
    setActive(next);
  }, []);

  const handlePillClick = (i: number, item: SocialItem) => {
    if (active === i) {
      if (item.external) {
        window.open(item.href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = item.href;
      }
    } else {
      select(i);
    }
  };

  const titleEls = useRef<(HTMLSpanElement | null)[]>([]);
  const [titleW, setTitleW] = useState<number[]>([]);

  useIsoLayoutEffect(() => {
    const els = titleEls.current.slice(0, n);
    const ro = new ResizeObserver((entries) => {
      const ws = els.map((el) => {
        const e = entries.find((x) => x.target === el);
        return e ? e.contentRect.width : -1;
      });
      setTitleW((prev) => {
        const next = ws.map((v, i) => (v >= 0 ? v : prev[i] ?? 0));
        return prev.length === next.length && prev.every((v, i) => Math.abs(v - next[i]) < 0.01) ? prev : next;
      });
    });
    els.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [n]);

  const closedW = (item: SocialItem, i: number) => {
    const measured = titleW[i];
    const textW = measured && measured > 20 ? measured : (FALLBACK_WIDTHS[item.title] ? FALLBACK_WIDTHS[item.title] - 46 : 60);
    return Math.min(COLUMN, Math.max(92, Math.round(textW + 48)));
  };

  const fade = reduce ? { duration: 0 } : { duration: 0.45, ease: EASE_OUT };
  const lastShown = useRef(0);
  if (active !== null && active < n) lastShown.current = active;
  const shown = Math.min(lastShown.current, n - 1);

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      aria-label="Socials showcase accordion"
      className={`relative w-full h-[370px] sm:h-[390px] select-none outline-none overflow-hidden ${className}`}
      style={{
        borderRadius: radius,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.65)',
        isolation: 'isolate',
      }}
    >
      {/* Background Photos with Cross-fade */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {items.map((item, i) => {
          const on = i === shown;
          return (
            <motion.img
              key={i}
              src={item.image}
              alt={item.alt}
              draggable={false}
              decoding="async"
              initial={false}
              animate={{ opacity: on ? 1 : 0 }}
              transition={on ? fade : { ...fade, delay: fade.duration }}
              style={{
                position: 'absolute',
                top: -PHOTO_BLEED,
                left: -PHOTO_BLEED,
                width: `calc(100% + ${PHOTO_BLEED * 2}px)`,
                height: `calc(100% + ${PHOTO_BLEED * 2}px)`,
                objectFit: 'cover',
                objectPosition: posOf(item.offsetY),
                maxWidth: 'none',
                maxHeight: 'none',
                display: 'block',
                zIndex: on ? 2 : 1,
              }}
            />
          );
        })}

        {/* Ambient Dark Gradient Overlays */}
        <div
          className="absolute inset-0 pointer-events-none z-[3]"
          style={{
            background:
              'linear-gradient(135deg, rgba(8, 8, 12, 0.82) 0%, rgba(10, 10, 14, 0.48) 50%, rgba(0, 0, 0, 0.9) 100%)',
          }}
        />
        <div
          className="absolute -top-12 -left-12 w-52 h-52 rounded-full pointer-events-none z-[3] opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(circle, #ef4444 0%, transparent 70%)' }}
        />
      </div>

      {/* Logical Stage scaled to the frame */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: stageW,
          height: stageH,
          scale,
          originX: 0,
          originY: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: PAD,
            left: PAD,
            bottom: PAD,
            width: COLUMN,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          {/* Column of Pills */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: PILL_GAP, width: '100%' }}>
            {items.map((item, i) => {
              const open = active === i;
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={false}
                  animate={{ width: open ? COLUMN : closedW(item, i) }}
                  transition={reduce ? { duration: 0 } : SPRING}
                  role="button"
                  tabIndex={0}
                  aria-expanded={open}
                  onClick={() => handlePillClick(i, item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePillClick(i, item);
                    }
                  }}
                  whileHover={reduce ? undefined : { scale: open ? 1.01 : 1.025, x: 2 }}
                  whileTap={reduce ? undefined : { scale: 0.98 }}
                  className="group relative cursor-pointer outline-none overflow-hidden"
                  style={{
                    boxSizing: 'border-box',
                    maxWidth: COLUMN,
                    padding: open ? '13px 18px' : '9px 15px',
                    borderRadius: 20,
                    background: open ? 'rgba(12, 12, 18, 0.92)' : 'rgba(20, 20, 28, 0.78)',
                    border: open ? '1px solid rgba(239, 68, 68, 0.65)' : '1px solid rgba(255, 255, 255, 0.16)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    boxShadow: open
                      ? '0 8px 28px rgba(0, 0, 0, 0.65), 0 0 18px rgba(239, 68, 68, 0.22)'
                      : '0 2px 10px rgba(0, 0, 0, 0.3)',
                    transition: 'background-color .25s ease, border-color .25s ease, box-shadow .25s ease, padding .25s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%' }}>
                    {/* Brand icon and name only (no plus icon) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <Icon size={open ? 16 : 15} className={open ? 'text-red-400 shrink-0' : 'text-white/80 shrink-0 group-hover:text-red-400 transition-colors'} />
                      <span
                        ref={(el) => {
                          titleEls.current[i] = el;
                        }}
                        className={`${open ? 'text-sm' : 'text-xs'} font-bold font-satoshi text-white tracking-wide whitespace-nowrap`}
                      >
                        {item.title}
                      </span>
                    </div>

                    {/* Badge shown only when open */}
                    {open && item.badge && (
                      <span className="text-[11px] font-mono font-bold text-red-400/90 shrink-0 pl-2">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <AnimatePresence initial={false}>
                    {open && <Note key="claim" item={item} reduce={!!reduce} />}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SocialsAccordion;
