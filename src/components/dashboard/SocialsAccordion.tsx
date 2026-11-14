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

const MIN_W = 380;
const MIN_H = 420;
const PAD = 16;
const COLUMN = 310;
const PILL_GAP = 9;
const PILL_PAD = 14;
const PHOTO_BLEED = 2;
const NOTE_W = COLUMN - PILL_PAD * 2 - 2;

const SPRING = { type: 'spring' as const, stiffness: 340, damping: 28, mass: 0.8 };
const HEIGHT_SPRING = { type: 'spring' as const, stiffness: 340, damping: 34, mass: 0.8 };
const BOUNCY = { type: 'spring' as const, stiffness: 400, damping: 22 };
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

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
      animate={{ opacity: 1, height: h, transition: { height: spring, opacity: { duration: 0.3, delay: 0.08 } } }}
      exit={{ opacity: 0, height: 0, transition: { height: spring, opacity: { duration: 0.25 } } }}
      style={{ overflowX: 'visible', overflowY: 'clip', width: 0, minWidth: '100%' }}
    >
      <div ref={ref} style={{ paddingTop: 10 }}>
        <div style={{ boxSizing: 'border-box', width: NOTE_W, paddingLeft: 34 }}>
          <p className="text-[12px] text-white/70 font-inter leading-relaxed m-0 break-words">
            {item.claim}
          </p>
          <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-white/10 text-red-400 group-hover:text-red-300 font-satoshi font-semibold text-[11px] tracking-wide transition-colors">
            <span className="truncate">{item.handle}</span>
            <span className="text-white/40">·</span>
            <span className="shrink-0 flex items-center gap-0.5 text-white/80">
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
  interval?: number;
  pauseOnHover?: boolean;
  radius?: number;
  className?: string;
}

export const SocialsAccordion: React.FC<SocialsAccordionProps> = ({
  items = DEFAULT_SOCIALS,
  defaultOpen = 0,
  autoplay = false,
  interval = 4,
  pauseOnHover = true,
  radius = 20,
  className = '',
}) => {
  const n = items.length;
  const reduce = useReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState({ w: 380, h: 420 });
  const [active, setActive] = useState<number | null>(defaultOpen);

  const pausedRef = useRef(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth && el.clientHeight) {
        setFrame({ w: el.clientWidth, h: el.clientHeight });
      }
    });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const cardW = frame.w;
  const cardH = frame.h;
  const scale = Math.min(cardW / MIN_W, cardH / MIN_H);
  const stageW = cardW / scale;
  const stageH = cardH / scale;

  const select = useCallback((next: number | null) => {
    setActive(next);
  }, []);

  const activeRef = useRef(active);
  activeRef.current = active;

  const step = useCallback(
    (dir: 1 | -1) => {
      const prev = activeRef.current;
      const next = prev === null ? 0 : (prev + dir + n) % n;
      activeRef.current = next;
      select(next);
    },
    [n, select]
  );

  useEffect(() => {
    if (!autoplay || !visible) return;
    const id = setInterval(() => {
      if (pauseOnHover && pausedRef.current) return;
      step(1);
    }, Math.max(1000, interval * 1000));
    return () => clearInterval(id);
  }, [autoplay, visible, pauseOnHover, interval, step]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const k = e.key.toLowerCase();
    if (k === 'arrowdown' || k === 'arrowright' || k === 's') step(1);
    else if (k === 'arrowup' || k === 'arrowleft' || k === 'w') step(-1);
    else if (k === 'escape') select(null);
    else if (/^[1-9]$/.test(k) && +k <= n) select(+k - 1);
    else return;
    e.preventDefault();
  };

  const handlePillClick = (i: number, item: SocialItem) => {
    if (active === i) {
      // Expanded card clicked again -> navigate to link!
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

  // Border 1 + padding + 22px icon + 10px gap + 16px brand icon + 10px gap on title
  const closedW = (i: number) => Math.min(COLUMN, 2 + PILL_PAD * 2 + 22 + 10 + 16 + 10 + (titleW[i] ?? 0));

  const fade = reduce ? { duration: 0 } : { duration: 0.45, ease: EASE_OUT };
  const lastShown = useRef(0);
  if (active !== null && active < n) lastShown.current = active;
  const shown = Math.min(lastShown.current, n - 1);

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      aria-label="Socials showcase accordion"
      onKeyDown={onKeyDown}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onFocus={() => {
        pausedRef.current = true;
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          pausedRef.current = false;
        }
      }}
      className={`relative w-full h-[420px] sm:h-[450px] select-none outline-none overflow-hidden ${className}`}
      style={{
        borderRadius: radius,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
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

        {/* Ambient Dark Gradient Overlays for optimal contrast & cyberpunk aesthetic */}
        <div
          className="absolute inset-0 pointer-events-none z-[3]"
          style={{
            background:
              'linear-gradient(135deg, rgba(8, 8, 12, 0.78) 0%, rgba(10, 10, 14, 0.45) 50%, rgba(0, 0, 0, 0.85) 100%)',
          }}
        />
        {/* Subtle red atmospheric glow from top-left */}
        <div
          className="absolute -top-12 -left-12 w-64 h-64 rounded-full pointer-events-none z-[3] opacity-25 blur-3xl"
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
                  animate={titleW.length === n ? { width: open ? COLUMN : closedW(i) } : undefined}
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
                  whileHover={reduce ? undefined : { scale: open ? 1.01 : 1.03, x: 3 }}
                  whileTap={reduce ? undefined : { scale: 0.98 }}
                  className="group relative cursor-pointer outline-none overflow-hidden"
                  style={{
                    boxSizing: 'border-box',
                    maxWidth: COLUMN,
                    padding: `12px ${PILL_PAD}px`,
                    borderRadius: 22,
                    background: open ? 'rgba(12, 12, 18, 0.88)' : 'rgba(20, 20, 28, 0.72)',
                    border: open ? '1px solid rgba(239, 68, 68, 0.55)' : '1px solid rgba(255, 255, 255, 0.16)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    boxShadow: open
                      ? '0 8px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(239, 68, 68, 0.2)'
                      : '0 4px 16px rgba(0, 0, 0, 0.3)',
                    transition: 'background-color .25s ease, border-color .25s ease, box-shadow .25s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
                    {/* Expand/Collapse round toggle */}
                    <motion.div
                      animate={{
                        backgroundColor: open ? '#ef4444' : 'rgba(255, 255, 255, 0.12)',
                        color: '#ffffff',
                        borderColor: open ? '#ef4444' : 'rgba(255, 255, 255, 0.25)',
                      }}
                      transition={BOUNCY}
                      onClick={(e) => {
                        if (open) {
                          e.stopPropagation();
                          select(null);
                        }
                      }}
                      title={open ? 'Collapse (or click card to open link)' : 'Expand'}
                      style={{
                        width: 22,
                        height: 22,
                        flexShrink: 0,
                        boxSizing: 'border-box',
                        borderRadius: '50%',
                        border: '1.5px solid',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: open ? '0 0 10px rgba(239, 68, 68, 0.5)' : '0 1px 3px rgba(0,0,0,0.2)',
                      }}
                    >
                      <motion.svg
                        viewBox="0 0 24 24"
                        width={13}
                        height={13}
                        animate={{ rotate: open ? 135 : 0 }}
                        transition={BOUNCY}
                        aria-hidden
                      >
                        <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                        <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                      </motion.svg>
                    </motion.div>

                    {/* Brand icon */}
                    <div className="shrink-0 text-white/80 group-hover:text-red-400 transition-colors">
                      <Icon size={16} />
                    </div>

                    {/* Title & Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flex: 1, minWidth: 0 }}>
                      <span
                        ref={(el) => {
                          titleEls.current[i] = el;
                        }}
                        className="text-sm font-bold font-satoshi text-white tracking-wide truncate group-hover:text-red-300 transition-colors"
                      >
                        {item.title}
                      </span>

                      {item.badge && (
                        <motion.span
                          aria-hidden={!open}
                          initial={false}
                          animate={{ opacity: open ? 1 : 0 }}
                          transition={reduce ? { duration: 0 } : { duration: 0.2, delay: open ? 0.12 : 0 }}
                          className="text-[11px] font-mono font-bold text-red-400/90 shrink-0"
                        >
                          {item.badge}
                        </motion.span>
                      )}
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {open && <Note key="claim" item={item} reduce={!!reduce} />}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Stepper Deck at bottom */}
          <div style={{ marginTop: 'auto', paddingTop: 18 }}>
            <AnimatePresence>
              {active !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.9 }}
                  transition={reduce ? { duration: 0 } : BOUNCY}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '4px 6px',
                    borderRadius: 100,
                    background: 'rgba(18, 18, 24, 0.78)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <button
                    type="button"
                    aria-label="Previous social"
                    onClick={() => step(-1)}
                    className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-white/70 hover:text-white bg-white/10 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 transition-all cursor-pointer focus:outline-none"
                  >
                    <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-1 h-[26px] px-1 text-[11px] font-mono font-bold text-white/80">
                    <span className="text-red-400">{String((active ?? 0) + 1).padStart(2, '0')}</span>
                    <span className="text-white/30">/</span>
                    <span>{String(n).padStart(2, '0')}</span>
                  </div>

                  <button
                    type="button"
                    aria-label="Next social"
                    onClick={() => step(1)}
                    className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-white/70 hover:text-white bg-white/10 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 transition-all cursor-pointer focus:outline-none"
                  >
                    <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SocialsAccordion;
