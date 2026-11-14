"use client";

/**
 * Nimbus UI · Liquid Navbar — "Waterline"
 * Theme-adapted for Portfolio (Obsidian Glass & Crimson Neon Accent)
 * No dependencies besides React.
 */

import * as React from "react";

export type NimbusFx = "plane" | "drop" | "spin" | "glow" | "wave" | "pop" | "none";

export type LiquidNavItem = {
  id?: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  fx?: NimbusFx;
};

export type LiquidNavbarProps = {
  items?: LiquidNavItem[];
  defaultActive?: number;
  active?: number;
  onChange?: (index: number, item: LiquidNavItem) => void;
  tone?: "light" | "dark";
  compact?: boolean;
  sound?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * ============================================================================
 * DOCK CONFIGURATION VARIABLES
 * You can easily tweak any of these variables anytime to customize the design:
 * ============================================================================
 */
export const DOCK_CONFIG = {
  // --- Dimensions & Shape ---
  dockRadius: 18,               // Corner roundness of the dock (px). Set 999 for capsule, 16-20 for modern squircle
  itemRadius: 13,               // Corner roundness of the active item border (px)
  itemHeightDesktop: 44,        // Active item height on desktop (px)
  itemHeightMobile: 42,         // Active item height on mobile (px)
  itemPaddingDesktop: "0 17px", // Item padding on desktop
  itemPaddingMobile: "0 14px",  // Item padding on mobile

  // --- Typography ---
  fontSize: "12px",             // Font size for labels
  fontWeight: 400,              // Font weight (400 = regular / less thick, 500 = medium, 600 = semibold)
  letterSpacing: "0.12em",      // Spacing between letters

  // --- Colors & Transparency ---
  bgTint: "rgba(10, 10, 14, 0.82)",         // Dock background glass color
  borderColor: "rgba(255, 255, 255, 0.12)",   // Outer dock border color
  accentBorderColor: "#ef4444",               // Selected item border color (crimson red)
  accentGlowColor: "rgba(239, 68, 68, 0.38)", // Selected item border outer glow
  selectedFillOpacity: 0.0,                   // 0.0 = completely transparent inside, borders only
  borderThickness: 1.5,                       // Active border thickness (px)
  textDefault: "rgba(255, 255, 255, 0.55)",   // Inactive label/icon color
  textHover: "#ffffff",                       // Hovered label color
  textActive: "#ffffff",                      // Active label color

  // --- Physics & Animation ---
  springStiffness: 185,         // Speed of movement (higher = faster, lower = softer)
  springDamping: 21,            // Oscillation damping (higher = less bounce, perfectly damped)
  splitThreshold: 130,          // Distance before liquid stretches into droplets (px)
};

const PAD = 14; // canvas bleed around the pill for shadows and ripples

/* ---------- styles ---------- */
const NIMBUS_CSS = `
.nimbus-nav {
  --n-radius: ${DOCK_CONFIG.dockRadius}px;
  --n-item-radius: ${DOCK_CONFIG.itemRadius}px;
  --n-tint: ${DOCK_CONFIG.bgTint};
  --n-fg: ${DOCK_CONFIG.textActive};
  --n-fg-soft: ${DOCK_CONFIG.textDefault};
  --n-rim: rgba(255, 255, 255, 0.14);
  --n-accent: ${DOCK_CONFIG.accentBorderColor};
  --n-glow: ${DOCK_CONFIG.accentGlowColor};
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 7px;
  border-radius: var(--n-radius);
  isolation: isolate;
  font-family: ui-sans-serif, -apple-system, "SF Pro Text", "Segoe UI", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.nimbus-glass {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -2;
  overflow: hidden;
  background: var(--n-tint);
  -webkit-backdrop-filter: blur(16px) saturate(1.3) brightness(1.05);
  backdrop-filter: blur(16px) saturate(1.3) brightness(1.05);
  border: 1px solid ${DOCK_CONFIG.borderColor};
  box-shadow: inset 0 1px 1px var(--n-rim), 0 16px 36px -10px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 255, 255, 0.15);
}
.nimbus-nav[data-refract="on"] .nimbus-glass {
  -webkit-backdrop-filter: url(#nimbus-refract) blur(4px) saturate(1.3) brightness(1.05);
  backdrop-filter: url(#nimbus-refract) blur(4px) saturate(1.3) brightness(1.05);
}
.nimbus-water {
  position: absolute;
  left: ${-PAD}px;
  top: ${-PAD}px;
  z-index: -1;
  pointer-events: none;
}
.nimbus-nav[data-gl="off"] .nimbus-water {
  display: none;
}
.nimbus-drop {
  display: none;
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 0;
  border-radius: var(--n-item-radius);
  z-index: -1;
  pointer-events: none;
  will-change: transform, width;
  background: transparent;
  border: ${DOCK_CONFIG.borderThickness}px solid var(--n-accent);
  box-shadow: 0 0 14px var(--n-glow), inset 0 0 6px rgba(239, 68, 68, 0.12);
}
.nimbus-nav[data-gl="off"] .nimbus-drop {
  display: block;
}
.nimbus-item {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: ${DOCK_CONFIG.itemHeightDesktop}px;
  padding: ${DOCK_CONFIG.itemPaddingDesktop};
  border: 0;
  border-radius: var(--n-item-radius);
  background: none;
  color: var(--n-fg-soft);
  font-family: inherit;
  font-weight: ${DOCK_CONFIG.fontWeight};
  font-size: ${DOCK_CONFIG.fontSize};
  line-height: 1;
  letter-spacing: ${DOCK_CONFIG.letterSpacing};
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s, transform 0.16s;
}
.nimbus-item:hover {
  color: ${DOCK_CONFIG.textHover};
}
.nimbus-item[aria-current="page"] {
  color: var(--n-fg);
}
.nimbus-item:focus-visible {
  outline: 2px solid var(--n-accent);
  outline-offset: 2px;
}
.nv-ico {
  position: relative;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
}
.nv-ico svg {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.2s;
}
.nimbus-item[aria-current="page"] .nv-ico svg {
  transform: translateY(-0.5px) scale(1.08);
  stroke: var(--n-accent);
}
.nv-door {
  fill: transparent;
}
.nv-ico[data-fx="pop"] svg {
  animation: nvPop 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes nvPop {
  0% { transform: scale(0.85); }
  60% { transform: scale(1.16); }
  100% { transform: translateY(-0.5px) scale(1.08); }
}
.nv-ico[data-fx="plane"] svg {
  animation: nvPlane 1.1s cubic-bezier(0.55, 0, 0.3, 1) both;
}
@keyframes nvPlane {
  0% { transform: none; }
  12% { transform: translate(-3px, 2px) rotate(7deg); }
  42% { transform: translate(64px, -26px) rotate(-24deg) scale(0.9); opacity: 0; }
  43% { transform: translate(-60px, 16px) rotate(-12deg) scale(0.9); opacity: 0; }
  58% { opacity: 1; }
  80% { transform: translate(3px, -1px) rotate(2deg); }
  100% { transform: translateY(-0.5px) scale(1.08); }
}
.nv-ico[data-fx="drop"] svg {
  animation: nvDrop 0.85s cubic-bezier(0.16, 1, 0.3, 1) both;
  transform-origin: 50% 100%;
}
@keyframes nvDrop {
  0% { transform: translateY(-1px); }
  30% { transform: translateY(-8px) scale(0.92, 1.08); }
  60% { transform: translateY(2px) scale(1.15, 0.85); }
  100% { transform: translateY(-0.5px) scale(1.08); }
}
.nv-ico[data-fx="spin"] svg {
  animation: nvSpin 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes nvSpin {
  0% { transform: perspective(80px) rotateY(0); }
  100% { transform: perspective(80px) rotateY(360deg) translateY(-0.5px) scale(1.08); }
}
.nv-ico[data-fx="glow"] svg {
  animation: nvHop 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
  transform-origin: 50% 100%;
}
@keyframes nvHop {
  0% { transform: none; }
  40% { transform: translateY(-4px) scale(1.05, 0.95); }
  75% { transform: translateY(1px) scale(1.08, 0.92); }
  100% { transform: translateY(-0.5px) scale(1.08); }
}
.nv-ico[data-fx="wave"] svg {
  animation: nvWave 0.75s ease-in-out both;
  transform-origin: 50% 92%;
}
@keyframes nvWave {
  0% { transform: none; }
  25% { transform: rotate(-12deg); }
  50% { transform: rotate(10deg); }
  75% { transform: rotate(-5deg); }
  100% { transform: translateY(-0.5px) scale(1.08); }
}
.nimbus-nav[data-compact="true"] .nimbus-item {
  height: ${DOCK_CONFIG.itemHeightMobile}px;
  padding: ${DOCK_CONFIG.itemPaddingMobile};
}
.nimbus-nav[data-compact="true"] .nimbus-label {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
@media (max-width: 768px) {
  .nimbus-nav:not([data-compact="false"]) .nimbus-item {
    height: ${DOCK_CONFIG.itemHeightMobile}px;
    padding: ${DOCK_CONFIG.itemPaddingMobile};
  }
  .nimbus-nav:not([data-compact="false"]) .nimbus-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
}
@media (prefers-reduced-motion: reduce) {
  .nv-ico svg,
  .nv-ico::before,
  .nv-ico::after,
  .nv-door {
    animation: none !important;
    transition: none;
  }
}
`;

/* ---------- shader: transparent inside + glowing red borders & rounded squircle corners ---------- */
const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;
const FRAG = `precision highp float;
uniform vec2 uRes;uniform float uDpr;uniform float uTime;uniform vec4 uPill;
uniform vec4 uBlob[6];uniform float uSy[6];uniform vec4 uRip[6];uniform vec3 uMouse;uniform float uDark;uniform float uAmb;
float sdRB(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
float sdCap(vec2 p,vec4 B,float sy){p-=B.xy;p.y/=sy;p.x=max(abs(p.x)-B.z,0.);return(length(p)-B.w)*min(1.,sy);}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float dropD(vec2 p){float d=1e4;for(int i=0;i<6;i++){if(uBlob[i].w>.5){d=smin(d,sdCap(p,uBlob[i],uSy[i]),11.);}}return d;}
// Modern squircle corners for dock outline (radius ~18px)
float pillD(vec2 p){vec2 h=uPill.zw*.5;return sdRB(p-uPill.xy-h,h,min(18.0,h.y));}
void main(){
 vec2 p=vec2(gl_FragCoord.x,uRes.y*uDpr-gl_FragCoord.y)/uDpr;
 float dp=pillD(p);float dd=dropD(p);
 float pm=smoothstep(1.,-1.,dp);
 if(pm<=0.001){gl_FragColor=vec4(0.);return;}

 // Crimson Red Border: transparent inside, red outline with soft outer glow
 float border=smoothstep(2.3,0.5,abs(dd+0.6))*pm;
 float glow=exp(-max(0.0,dd)*0.32)*pm*0.42;
 float borderAlpha=clamp(border*0.95+glow*0.5,0.0,1.0);
 vec3 redAccent=vec3(0.94,0.27,0.27); // #ef4444
 vec3 borderColor=mix(redAccent,vec3(1.0,0.45,0.45),border*0.35);

 // Very subtle lens shadow under the pill rim
 float rimAlpha=smoothstep(1.,-2.,dp)*(1.0-smoothstep(0.,2.5,-dp))*0.18;
 vec3 c=mix(vec3(0.),borderColor,borderAlpha);
 float a=max(rimAlpha*0.2,borderAlpha);
 gl_FragColor=vec4(c,a);
}`;

type Body = { x: number; v: number };
type Sat = { x: number; y: number; vx: number; vy: number; r: number; k: number };
type Rip = { x: number; y: number; age: number; amp: number };

function makeState() {
  return {
    a: { x: 0, v: 0 } as Body,
    b: { x: 0, v: 0 } as Body,
    sy: { s: 1, v: 0 },
    lead: 0 as 0 | 1,
    lagTimer: 0,
    sats: [] as Sat[],
    rips: [] as Rip[],
    t: { x: 0, cy: 0, q: 0, r: DOCK_CONFIG.itemRadius },
    q: 0,
    mouse: { x: 0, y: 0, s: 0, on: false },
    moving: false,
    split: false,
    ready: false,
    w: 0,
    h: 0,
    visible: true,
    reduce: false,
    raf: 0,
    last: 0,
    time: 0,
    glc: null as null | { gl: WebGLRenderingContext; u: Record<string, WebGLUniformLocation | null> },
  };
}

function initGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false }) as WebGLRenderingContext | null;
  if (!gl) return null;
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = sh(gl.VERTEX_SHADER, VERT);
  const fs = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const p = gl.createProgram()!;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
  gl.useProgram(p);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(p, "a");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u: Record<string, WebGLUniformLocation | null> = {};
  for (const n of ["uRes", "uDpr", "uTime", "uPill", "uBlob", "uSy", "uRip", "uMouse", "uDark", "uAmb"]) {
    u[n] = gl.getUniformLocation(p, n);
  }
  return { gl, u };
}

function supportsRefraction() {
  if (typeof window === "undefined" || typeof CSS === "undefined") return false;
  const ua = navigator.userAgent;
  return /Chrome\/|Chromium\/|Edg\//.test(ua) && !/Firefox\//.test(ua) && !!(CSS as any).supports?.("backdrop-filter", "url(#a)");
}

export const LiquidNavbar: React.FC<LiquidNavbarProps> = ({
  items = [],
  defaultActive = 0,
  active,
  onChange,
  tone = "dark",
  compact,
  sound = false,
  className,
  style,
}) => {
  const [inner, setInner] = React.useState(defaultActive);
  const current = active ?? inner;
  const navRef = React.useRef<HTMLElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const dropRef = React.useRef<HTMLSpanElement>(null);
  const itemRefs = React.useRef<(HTMLElement | null)[]>([]);
  const audio = React.useRef<AudioContext | null>(null);
  const st = React.useRef(makeState());
  const [gl, setGl] = React.useState<"on" | "off">("on");
  const [refract, setRefract] = React.useState(false);
  const [activeFxIdx, setActiveFxIdx] = React.useState(-1);
  const dark = tone === "dark" ? 1 : 0;
  const darkRef = React.useRef(dark);
  darkRef.current = dark;

  /* ---- drawing ---- */
  const draw = React.useCallback(() => {
    const s = st.current;
    const T = s.t;
    const sep = Math.abs(s.a.x - s.b.x);
    const thin = Math.min(sep / (2 * (s.q + T.r) || 1), 1);
    const r = T.r * (1 - 0.25 * thin);
    if (s.glc) {
      const { gl: g, u } = s.glc;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight);
      g.uniform2f(u.uRes, s.w + PAD * 2, s.h + PAD * 2);
      g.uniform1f(u.uDpr, dpr);
      g.uniform1f(u.uTime, s.time);
      g.uniform4f(u.uPill, PAD, PAD, s.w, s.h);
      const blobs = new Float32Array(24);
      const sy = new Float32Array(6).fill(1);
      const head = s.lead === 0 ? s.a : s.b;
      const tail = s.lead === 0 ? s.b : s.a;
      blobs.set([head.x, T.cy, s.q * (1 - 0.2 * thin), T.r * (1 - 0.1 * thin), tail.x, T.cy, s.q * (1 - 0.75 * thin), T.r * (1 - 0.45 * thin)], 0);
      sy[0] = sy[1] = s.sy.s;
      s.sats.slice(0, 4).forEach((d, i) => blobs.set([d.x, d.y, 0, d.r], 8 + i * 4));
      g.uniform4fv(u.uBlob, blobs);
      g.uniform1fv(u.uSy, sy);
      const rips = new Float32Array(24);
      s.rips.slice(-6).forEach((p, i) => rips.set([p.x, p.y, p.age, p.amp], i * 4));
      g.uniform4fv(u.uRip, rips);
      g.uniform3f(u.uMouse, s.mouse.x, s.mouse.y, s.mouse.s);
      g.uniform1f(u.uDark, darkRef.current);
      g.uniform1f(u.uAmb, s.reduce ? 0 : 1);
      g.clearColor(0, 0, 0, 0);
      g.clear(g.COLOR_BUFFER_BIT);
      g.drawArrays(g.TRIANGLES, 0, 3);
    } else if (dropRef.current) {
      const left = Math.min(s.a.x, s.b.x) - s.q - r - PAD;
      const width = sep + 2 * (s.q + r);
      dropRef.current.style.width = `${width}px`;
      dropRef.current.style.transform = `translateX(${left}px) scaleY(${s.sy.s})`;
    }
  }, []);

  /* ---- smooth physics (eliminates lag discontinuity & jitter) ---- */
  const step = React.useCallback((dt: number, now: number) => {
    const s = st.current;
    const T = s.t;
    s.time += dt;
    s.q += (T.q - s.q) * Math.min(1, dt * 14);
    const bodies = [s.a, s.b];
    let still = true;

    if (s.reduce) {
      s.a.x = s.b.x = T.x;
      s.a.v = s.b.v = 0;
      s.sy.s = 1;
      s.sats = [];
    } else {
      // Smooth continuous tension follow instead of abrupt force multiplier jump
      bodies.forEach((B, i) => {
        const isLead = i === s.lead;
        const k = isLead ? DOCK_CONFIG.springStiffness : DOCK_CONFIG.springStiffness * 0.45;
        const c = isLead ? DOCK_CONFIG.springDamping : DOCK_CONFIG.springDamping * 0.75;
        
        // Continuous smooth tension factor
        const elapsed = (now - s.lagTimer) / 1000;
        const ramp = isLead ? 1 : Math.min(1, 0.2 + elapsed * 3.5);
        
        B.v += (k * (T.x - B.x) - c * B.v) * dt * ramp;
        B.x += B.v * dt;

        const lo = PAD + 5 + s.q + T.r;
        const hi = PAD + s.w - 5 - s.q - T.r;
        if (B.x < lo || B.x > hi) {
          B.x = Math.max(lo, Math.min(hi, B.x));
          B.v *= -0.15;
        }
        if (Math.abs(T.x - B.x) > 0.25 || Math.abs(B.v) > 2) still = false;
      });

      const L = bodies[s.lead];
      const syT = 1 - 0.15 * Math.min(Math.abs(L.v) / 1400, 1);
      s.sy.v += (260 * (syT - s.sy.s) - 12 * s.sy.v) * dt;
      s.sy.s += s.sy.v * dt;
      if (Math.abs(s.sy.s - 1) > 0.002 || Math.abs(s.sy.v) > 0.02) still = false;

      // Only split on long jumps (distance > DOCK_CONFIG.splitThreshold) to avoid jitter on adjacent tabs
      const sep = Math.abs(s.a.x - s.b.x);
      if (!s.split && s.moving && sep > DOCK_CONFIG.splitThreshold) {
        s.split = true;
        const lo = bodies[1 - s.lead];
        const hi = bodies[s.lead];
        [0.35, 0.65].forEach((t, j) => {
          s.sats.push({
            x: lo.x + (hi.x - lo.x) * t,
            y: T.cy,
            vx: (lo.v + hi.v) * 0.4,
            vy: (j === 0 ? -1 : 1) * 15,
            r: 4.5,
            k: 80,
          });
        });
      }

      s.sats = s.sats.filter((d) => {
        d.vx += (d.k * (T.x - d.x) - 10 * d.vx) * dt;
        d.vy += (90 * (T.cy - d.y) - 8 * d.vy) * dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        if (Math.abs(T.x - d.x) < T.q + T.r * 0.6) d.r -= dt * 28;
        return d.r > 0.8;
      });
      if (s.sats.length) still = false;
    }

    if (s.moving && still) {
      s.moving = false;
      if (s.split || !s.reduce) s.rips.push({ x: T.x, y: T.cy, age: 0, amp: s.split ? 1.0 : 0.55 });
    }

    s.rips.forEach((p) => (p.age += dt));
    s.rips = s.rips.filter((p) => p.age < 2.0);
    const target = s.mouse.on ? 1 : 0;
    s.mouse.s += (target - s.mouse.s) * Math.min(1, dt * 7);
  }, []);

  const loop = React.useCallback(() => {
    const s = st.current;
    if (s.raf) return;
    s.last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - s.last) / 1000, 1 / 30);
      s.last = now;
      step(dt, now);
      draw();
      const busy = s.moving || s.rips.length || s.sats.length || s.mouse.s > 0.01;
      if (s.visible && (!s.reduce || busy)) s.raf = requestAnimationFrame(tick);
      else s.raf = 0;
    };
    s.raf = requestAnimationFrame(tick);
  }, [draw, step]);

  /* ---- layout ---- */
  const measure = React.useCallback(() => {
    const nav = navRef.current;
    const el = itemRefs.current[current];
    if (!nav || !el) return;
    const s = st.current;
    s.w = nav.offsetWidth;
    s.h = nav.offsetHeight;
    const T = s.t;
    T.r = DOCK_CONFIG.itemRadius;
    T.q = Math.max(0, el.offsetWidth / 2 - T.r);
    T.cy = PAD + el.offsetTop + el.offsetHeight / 2;
    const nx = PAD + el.offsetLeft + el.offsetWidth / 2;
    if (!s.ready) {
      s.a.x = s.b.x = nx;
      s.q = T.q;
      s.ready = true;
    } else if (Math.abs(nx - T.x) > 0.5) {
      s.lead = Math.abs(nx - s.a.x) <= Math.abs(nx - s.b.x) ? 0 : 1;
      s.lagTimer = performance.now();
      s.moving = true;
      s.split = false;
    }
    T.x = nx;
    const cv = canvasRef.current;
    if (cv) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = s.w + PAD * 2;
      const Hh = s.h + PAD * 2;
      if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(Hh * dpr)) {
        cv.width = Math.round(W * dpr);
        cv.height = Math.round(Hh * dpr);
        cv.style.width = `${W}px`;
        cv.style.height = `${Hh}px`;
      }
    }
    loop();
  }, [current, loop]);

  React.useEffect(() => {
    setRefract(supportsRefraction());
    const s = st.current;
    s.reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const cv = canvasRef.current;
    s.glc = cv ? initGL(cv) : null;
    if (!s.glc) setGl("off");
    const lost = (e: Event) => {
      e.preventDefault();
      s.glc = null;
      setGl("off");
    };
    cv?.addEventListener("webglcontextlost", lost);
    const io = new IntersectionObserver(([e]) => {
      s.visible = e.isIntersecting;
      if (s.visible) loop();
    });
    if (navRef.current) io.observe(navRef.current);
    const vis = () => {
      s.visible = document.visibilityState === "visible";
      if (s.visible) loop();
    };
    document.addEventListener("visibilitychange", vis);
    return () => {
      cv?.removeEventListener("webglcontextlost", lost);
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
      cancelAnimationFrame(s.raf);
      s.raf = 0;
    };
  }, [loop]);

  React.useLayoutEffect(() => {
    measure();
  }, [measure, items.length, compact]);

  const measureRef = React.useRef(measure);
  measureRef.current = measure;

  React.useEffect(() => {
    let lastW = -1;
    const ro = new ResizeObserver(() => {
      const w = navRef.current?.offsetWidth ?? 0;
      if (w !== lastW) {
        lastW = w;
        st.current.ready = false;
        measureRef.current();
      }
    });
    if (navRef.current) ro.observe(navRef.current);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    loop();
  }, [tone, loop]);

  /* ---- interaction ---- */
  const local = (clientX: number, clientY: number) => {
    const r = navRef.current!.getBoundingClientRect();
    return { x: clientX - r.left + PAD, y: clientY - r.top + PAD };
  };

  const ripple = (x: number, y: number, amp: number) => {
    const s = st.current;
    if (s.reduce) return;
    s.rips.push({ x, y, age: 0, amp });
    loop();
  };

  const plip = () => {
    if (!sound) return;
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = (audio.current ||= new AC());
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(420 + Math.random() * 80, t);
      o.frequency.exponentialRampToValueAtTime(1500, t + 0.07);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.16, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.18);
    } catch {}
  };

  const select = (i: number) => {
    setActiveFxIdx(i);
    plip();
    if (i !== current) {
      if (active === undefined) setInner(i);
      onChange?.(i, items[i]);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = (current + (e.key === "ArrowRight" ? 1 : -1) + items.length) % items.length;
    select(n);
    itemRefs.current[n]?.focus();
  };

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const p = local(e.clientX, e.clientY);
    const s = st.current;
    s.mouse.x = p.x;
    s.mouse.y = p.y;
    s.mouse.on = true;
    loop();
  };

  return (
    <nav
      ref={navRef as any}
      className={["nimbus-nav", className].filter(Boolean).join(" ")}
      data-tone={tone}
      data-gl={gl}
      data-compact={compact === undefined ? undefined : String(compact)}
      data-refract={refract ? "on" : "off"}
      aria-label="Main Navigation"
      onKeyDown={onKeyDown}
      onPointerMove={onMove}
      onPointerLeave={() => {
        st.current.mouse.on = false;
        loop();
      }}
      onPointerDown={(e) => {
        const p = local(e.clientX, e.clientY);
        ripple(p.x, p.y, 0.6);
      }}
      style={style}
    >
      <style dangerouslySetInnerHTML={{ __html: NIMBUS_CSS }} />
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="nimbus-refract" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.02" numOctaves="2" seed="7" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
          <feDisplacementMap in="SourceGraphic" in2="soft" scale="60" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <span className="nimbus-glass" aria-hidden="true" />
      <canvas className="nimbus-water" ref={canvasRef} aria-hidden="true" />
      <span className="nimbus-drop" ref={dropRef} aria-hidden="true" />
      {items.map((it, i) => {
        const kind = it.fx ?? "pop";
        const isCurrent = i === current;
        const isPlaying = activeFxIdx === i && kind !== "none";
        const props = {
          ref: (el: HTMLElement | null) => {
            itemRefs.current[i] = el;
          },
          className: "nimbus-item",
          "aria-current": isCurrent ? ("page" as const) : undefined,
          onClick: () => select(i),
        };
        const content = (
          <>
            {it.icon && (
              <span className="nv-ico" data-fx={isPlaying ? kind : undefined}>
                {it.icon}
              </span>
            )}
            <span className="nimbus-label font-mono uppercase tracking-[0.12em] text-[12px] font-normal">
              {it.label}
            </span>
          </>
        );
        return it.href ? (
          <a key={it.label + i} {...(props as any)} href={it.href} aria-label={it.label}>
            {content}
          </a>
        ) : (
          <button key={it.label + i} {...(props as any)} type="button" aria-label={it.label}>
            {content}
          </button>
        );
      })}
    </nav>
  );
};

export default LiquidNavbar;
