// Delivered by Originkit · stack: nextjs · styling: tailwind
/* eslint-disable */
// @ts-nocheck
"use client";
// Fibre Arc — Originkit
// Adapted for light or dark backgrounds: strands form a twisted ribbon coloured by a
// 6-stop palette (bands swap sides through the twist, glass fade at the bottom).

"use client"

import * as React from "react"
import { useEffect, useRef } from "react"

const MAX_DPR = 2
const MAX_STRANDS = 40
// Electric blue through violet and magenta to hot pink.
const DEFAULT_COLORS = ["#2D00F7", "#6A00F4", "#A100F2", "#BC00DD", "#DB00B6", "#F20089"]

const VERT_SRC = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG_SRC = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;
uniform float uHover;

uniform vec3  uBg, uHigh, uInk;
uniform vec3  uPal[6];
uniform vec2  uCenter, uRadii;
uniform float uTilt;
uniform float uStrands, uWidth, uTwist, uThin, uComb, uReach, uDir, uGlow;

const float TAU = 6.28318531;

float sat(float x){ return clamp(x, 0.0, 1.0); }
float pw(float x, float e){ return pow(max(x, 1e-5), e); }
float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 34.56); return fract(p.x * p.y); }

// Palette: 6 stops from the \`colors\` prop, blended smoothly across 0..1.
vec3 spectrum(float h){
  h = clamp(h, 0.0, 1.0) * 5.0;
  float f = fract(h); f = f * f * (3.0 - 2.0 * f);
  if (h < 1.0) return mix(uPal[0], uPal[1], f);
  if (h < 2.0) return mix(uPal[1], uPal[2], f);
  if (h < 3.0) return mix(uPal[2], uPal[3], f);
  if (h < 4.0) return mix(uPal[3], uPal[4], f);
  return mix(uPal[4], uPal[5], h >= 5.0 ? 1.0 : f);
}
// Palette runs across the ribbon, with a slow shimmer travelling along it.
float hue(float a01, float th, float t){ return 0.06 + 0.88 * a01 + 0.04 * sin(th * 3.0 - t * 0.4); }

void main(){
  float ar = uRes.x / max(uRes.y, 1.0);
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (uv - 0.5) * vec2(ar, 1.0);
  float t = uTime;
  float px = 1.0 / uRes.y;

  float cs = cos(uDir), sn = sin(uDir);
  mat2 rot = mat2(cs, sn, -sn, cs);
  vec2 q  = rot * p;
  vec2 pm = q - rot * ((uMouse - 0.5) * vec2(ar, 1.0));
  vec2 ps = q - normalize(pm + vec2(1e-5)) * uComb * 0.10 * sat(uHover)
            * exp(-dot(pm, pm) / max(uReach * uReach, 1e-4));

  // Centreline: a tilted ellipse (a ring seen in perspective).
  float ct = cos(uTilt), st = sin(uTilt);
  vec2 e = ps - uCenter;
  e = vec2(ct * e.x + st * e.y, -st * e.x + ct * e.y);
  float k0 = length(e / uRadii), k1 = length(e / (uRadii * uRadii));
  float d0 = k0 * (k0 - 1.0) / max(k1, 1e-4);     // signed distance to centreline
  float th = atan(e.y / uRadii.y, e.x / uRadii.x); // position along the ring

  // Ribbon half-width, with a waist where the ribbon twists.
  float node = 1.0 + 0.03 * sin(t * 0.3);
  float u_ = th - node;
  float side = smoothstep(-0.5, 0.5, u_);        // same slope both sides: no kink at the twist
  float tw = sin(clamp(mix(0.75, 1.5, side) * uTwist * u_, -1.5708, 1.5708));   // gentler slope: a longer, smoother twist
  float waist = sqrt(tw * tw + 0.3);   // keeps ~55% width at the twist
  float turn = tw / waist;               // smooth -1..1: colours swap sides through the twist
  float half_ = 0.5 * uWidth * mix(1.0, 1.25, side) * (1.0 + 0.6 * sat(uCenter.y + 0.5 - ps.y)) * waist / 1.14;   // normalise so full width stays the same away from the twist
  float across = clamp(d0 / half_, -1.0, 1.0);

  // Glassy toward the bottom of the ring.
  float vis = mix(0.10, 1.0, smoothstep(uCenter.y + 0.15 * uRadii.y, uCenter.y + 0.73 * uRadii.y, ps.y));

  // Band body
  float inside = 1.0 - smoothstep(half_ - 1.5 * px, half_ + 1.5 * px, abs(d0));
  float a01 = 0.5 + 0.5 * across * turn;
  vec3 body = mix(spectrum(hue(a01, th, t)), uHigh, 0.12);
  float rim = smoothstep(0.72, 1.0, abs(across));
  body = mix(body, body * 0.45, rim * 0.55);
  body = mix(body, uHigh, 0.35 * pw(1.0 - abs(across - 0.25), 6.0));   // soft sheen band

  vec3 col = uBg;
  col = mix(col, mix(uBg, uInk, 0.14), inside * (1.0 - vis) * 0.35);    // clear-glass tint where faded
  col = mix(col, body, inside * 0.9 * vis);
  col = mix(col, mix(uBg, uInk, 0.38), inside * rim * (1.0 - vis) * 0.5);   // glass edges

  // Fibres
  float core = 0.0, lines = 0.0;
  vec3 fcol = vec3(0.0), lcol = vec3(0.0);
  for(int i = 0; i < ${MAX_STRANDS}; i++){
    float fi = float(i);
    float on = sat(uStrands - fi);
    float f = fi / max(uStrands - 1.0, 1.0);
    float jit = hash21(vec2(fi, 1.7));
    float o = (f - 0.5) * 2.0 * half_ * (0.94 + 0.06 * jit) + 0.003 * sin(t * 0.5 + fi + th * 2.0);
    float dd = abs(d0 - o);
    float w = uThin * (0.0007 + 0.0016 * jit);
    float c = on * pw(w / (w + dd), 3.2);
    core += c;
    vec3 sc = spectrum(hue(0.5 + (f - 0.5) * turn, th, t));
    fcol += c * sc;
    // Sharp filament for the glow mode; every other strand is brighter for variety.
    float wl = 0.0009 * uThin;
    float l = on * pw(wl / (wl + dd), 2.6) * (0.35 + 0.65 * step(0.45, jit));
    lines += l;
    lcol += l * sc;
  }
  fcol /= max(core, 1e-4);
  float fa = sat(core * 0.16 / (1.0 + core * 0.06)) * mix(0.35, 1.0, vis);
  col = mix(col, mix(fcol * 0.7, uHigh, 0.35 * sat(core * 0.15 - 0.3)), fa);

  // Glow for dark backgrounds: a soft halo around the ribbon plus hot fibre cores,
  // added on top like the original Fibre Arc. Off when uGlow is 0.
  float outside = max(abs(d0) - half_, 0.0);
  float gw = 0.05 * (0.6 + 0.4 * uGlow);
  float halo = pw(gw / (gw + outside), 1.6) * (1.0 - 0.75 * inside);
  float bloom = pw(0.16 / (0.16 + outside), 2.0);   // wide, faint outer bloom
  vec3 hcol = spectrum(hue(0.5 + 0.5 * sign(d0) * turn, th, t));
  float gv = mix(0.25, 1.0, vis);
  lcol /= max(lines, 1e-4);
  col += uGlow * gv * (hcol * halo * 0.85
                     + hcol * bloom * 0.18
                     + body * inside * 0.35                       // body lit from within
                     + fcol * sat(core * 0.05) * 0.35
                     + mix(lcol, uHigh, 0.45 * sat(lines - 0.6)) * sat(lines * 0.9) * 0.35);

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
    const sh = gl.createShader(type)
    if (!sh) return null
    gl.shaderSource(sh, src)
    gl.compileShader(sh)
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("FibreArc shader:", gl.getShaderInfoLog(sh))
        gl.deleteShader(sh)
        return null
    }
    return sh
}

function parseColor(input: string | undefined, fb: [number, number, number]): [number, number, number] {
    if (!input) return fb
    const str = String(input).trim()
    if (str.charAt(0) === "#") {
        let hex = str.slice(1)
        if (hex.length === 3 || hex.length === 4) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
        }
        if (hex.length >= 6) {
            const r = parseInt(hex.slice(0, 2), 16)
            const g = parseInt(hex.slice(2, 4), 16)
            const b = parseInt(hex.slice(4, 6), 16)
            if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return [r / 255, g / 255, b / 255]
        }
        return fb
    }
    const m = str.match(/[\d.]+/g)
    if (m && m.length >= 3) {
        return [
            Math.min(255, parseFloat(m[0])) / 255,
            Math.min(255, parseFloat(m[1])) / 255,
            Math.min(255, parseFloat(m[2])) / 255,
        ]
    }
    return fb
}

function num(v: unknown, fb: number): number {
    return typeof v === "number" && isFinite(v) ? v : fb
}

function clampN(v: number, lo: number, hi: number): number {
    return v < lo ? lo : v > hi ? hi : v
}

type BundleGroup = {
    width?: number
    twist?: number
    thickness?: number
    comb?: number
}
const BUNDLE_DEFAULTS: Required<BundleGroup> = { width: 26, twist: 100, thickness: 100, comb: 170 }

interface Props {
    style?: React.CSSProperties
    width?: number
    height?: number
    background?: string
    /** Contrast colour used for the clear-glass tint (black-ish on light, white-ish on dark). */
    ink?: string
    highlight?: string
    /** Six palette stops, applied across the ribbon. */
    colors?: string[]
    /** Neon glow around the ribbon, 0-100. Use on dark backgrounds. */
    glow?: number
    density?: number
    speed?: number
    direction?: number
    hover?: number
    reach?: number
    /** Ring centre, % of frame from the top-left (may sit outside the frame). */
    centerX?: number
    centerY?: number
    /** Ring radii, % of frame height. The ring scales down evenly to fit narrow frames. */
    radiusX?: number
    radiusY?: number
    /** Ring tilt in degrees. */
    tilt?: number
    bundle?: BundleGroup
}

export default function FibreArc(props: Props) {
    const {
        style,
        background = "#EEEEEE",
        ink = "#000000",
        highlight = "#FFFFFF",
        colors = DEFAULT_COLORS,
        glow = 0,
        density = 40,
        speed = 100,
        direction = 0,
        hover = 120,
        reach = 23,
        centerX = 46.1,
        centerY = 99.7,
        radiusX = 98.1,
        radiusY = 67.9,
        tilt = 37.9,
        bundle,
        width,
        height,
    } = props

    const bundle_ = { ...BUNDLE_DEFAULTS, ...(bundle || {}) }

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const sizeRef = useRef({ w: 0, h: 0 })
    sizeRef.current = { w: num(width, 0), h: num(height, 0) }

    const vRef = useRef<Record<string, number | string>>({})
    vRef.current = {
        background,
        ink,
        highlight,
        colors: colors.join("|"),
        glow: clampN(num(glow, 0), 0, 150) / 100,
        density: clampN(num(density, 40), 4, MAX_STRANDS),
        speed: clampN(num(speed, 50), 0, 100) / 50,
        direction: (clampN(num(direction, 0), 0, 360) * Math.PI) / 180,
        hover: clampN(num(hover, 100), 0, 200) / 100,
        reach: clampN(num(reach, 30), 5, 100) / 100,
        centerX: num(centerX, 46.1) / 100,
        centerY: num(centerY, 99.7) / 100,
        radiusX: clampN(num(radiusX, 98.1), 5, 400) / 100,
        radiusY: clampN(num(radiusY, 67.9), 5, 400) / 100,
        tilt: (num(tilt, 37.9) * Math.PI) / 180,
        bwidth: clampN(num(bundle_.width, 26), 2, 80) / 100,
        twist: clampN(num(bundle_.twist, 100), 0, 300) / 100,
        thickness: clampN(num(bundle_.thickness, 100), 20, 400) / 100,
        comb: clampN(num(bundle_.comb, 170), 0, 400) / 100,
    }

    const ptrRef = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, on: 0, onTarget: 0 })

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const gl = canvas.getContext("webgl", { antialias: false, alpha: false, depth: false, preserveDrawingBuffer: true })
        if (!gl) {
            console.error("FibreArc: WebGL unavailable")
            return
        }

        const vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC)
        const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG_SRC)
        if (!vs || !fs) return
        const prog = gl.createProgram()
        if (!prog) return
        gl.attachShader(prog, vs)
        gl.attachShader(prog, fs)
        gl.linkProgram(prog)
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            console.error("FibreArc link:", gl.getProgramInfoLog(prog))
            return
        }
        gl.useProgram(prog)

        const buf = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buf)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
        const posLoc = gl.getAttribLocation(prog, "a_pos")
        gl.enableVertexAttribArray(posLoc)
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

        const locs: Record<string, WebGLUniformLocation | null> = {}
        const u = (name: string) => {
            if (!(name in locs)) locs[name] = gl.getUniformLocation(prog, name)
            return locs[name]
        }

        let raf = 0
        let last = performance.now()
        let clock = 0

        const render = (now: number) => {
            const dt = Math.min(0.05, (now - last) / 1000)
            last = now
            const v = vRef.current

            clock = (clock + dt * (v.speed as number)) % 3600

            const ptr = ptrRef.current
            const k = 1 - Math.exp(-6 * dt)
            ptr.on += (ptr.onTarget - ptr.on) * k
            ptr.x += ((ptr.onTarget > 0 ? ptr.tx : 0.5) - ptr.x) * k
            ptr.y += ((ptr.onTarget > 0 ? ptr.ty : 0.5) - ptr.y) * k

            const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
            const cw = sizeRef.current.w || canvas.clientWidth || 1200
            const ch = sizeRef.current.h || canvas.clientHeight || 800
            const bw = Math.max(1, Math.round(cw * dpr))
            const bh = Math.max(1, Math.round(ch * dpr))
            if (canvas.width !== bw || canvas.height !== bh) {
                canvas.width = bw
                canvas.height = bh
            }
            gl.viewport(0, 0, bw, bh)

            const ar = bw / bh
            gl.uniform2f(u("uRes"), bw, bh)
            gl.uniform1f(u("uTime"), clock)
            gl.uniform2f(u("uMouse"), ptr.x, 1 - ptr.y)
            gl.uniform1f(u("uHover"), Math.min(1, ptr.on) * (v.hover as number))
            const bg = parseColor(v.background as string, [0.933, 0.933, 0.933])
            gl.uniform3f(u("uBg"), bg[0], bg[1], bg[2])
            const hi = parseColor(v.highlight as string, [1, 1, 1])
            gl.uniform3f(u("uHigh"), hi[0], hi[1], hi[2])
            const ik = parseColor(v.ink as string, [0, 0, 0])
            gl.uniform3f(u("uInk"), ik[0], ik[1], ik[2])
            const pal = (v.colors as string).split("|")
            const palArr = new Float32Array(18)
            for (let i = 0; i < 6; i++) palArr.set(parseColor(pal[Math.min(i, pal.length - 1)], [1, 1, 1]), i * 3)
            gl.uniform3fv(u("uPal"), palArr)
            gl.uniform1f(u("uGlow"), v.glow as number)
            gl.uniform2f(u("uCenter"), ((v.centerX as number) - 0.5) * ar, 0.5 - (v.centerY as number))
            // Portrait frames only: shrink the whole ring evenly so it keeps its shape and fits the width.
            // Landscape frames keep full size and let the legs run off the sides.
            const fit = ar >= 1 ? 1 : Math.min(1, (ar * 0.47) / ((v.radiusX as number) + (v.bwidth as number) / 2))
            gl.uniform2f(u("uRadii"), (v.radiusX as number) * fit, (v.radiusY as number) * fit)
            gl.uniform1f(u("uStrands"), v.density as number)
            gl.uniform1f(u("uReach"), v.reach as number)
            gl.uniform1f(u("uDir"), v.direction as number)
            gl.uniform1f(u("uWidth"), (v.bwidth as number) * fit)
            gl.uniform1f(u("uTilt"), v.tilt as number)
            gl.uniform1f(u("uTwist"), v.twist as number)
            gl.uniform1f(u("uThin"), v.thickness as number)
            gl.uniform1f(u("uComb"), v.comb as number)

            gl.drawArrays(gl.TRIANGLES, 0, 3)
            raf = requestAnimationFrame(render)
        }

        // Listen on window so the pointer still combs the fibres under the text/nav overlay.
        const track = (e: PointerEvent) => {
            const r = canvas.getBoundingClientRect()
            if (r.width <= 0 || r.height <= 0) return
            const x = (e.clientX - r.left) / r.width
            const y = (e.clientY - r.top) / r.height
            const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1
            ptrRef.current.tx = clampN(x, 0, 1)
            ptrRef.current.ty = clampN(y, 0, 1)
            ptrRef.current.onTarget = inside ? 1 : 0
        }
        const onLeave = () => {
            ptrRef.current.onTarget = 0
        }

        window.addEventListener("pointermove", track)
        document.addEventListener("pointerleave", onLeave)
        raf = requestAnimationFrame(render)

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener("pointermove", track)
            document.removeEventListener("pointerleave", onLeave)
        }
    }, [])

    return (
        <div
            style={{
                position: "relative",
                overflow: "hidden",
                background,
                width: typeof width === "number" && width > 0 ? width : "100%",
                height: typeof height === "number" && height > 0 ? height : "100%",
                ...style,
            }}
        >
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
            />
        </div>
    )
}
