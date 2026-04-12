# Technology Stack

**Analysis Date:** 2026-04-12

## Languages

**Primary:**
- TypeScript 5.2 - All application code and state management
- TSX (React) - UI components and layout

**Secondary:**
- JavaScript - Configuration files (`vite.config.ts` actually uses TS, but `postcss.config.js`, `tailwind.config.js` are JS)
- CSS - Global styles and theme variables (`src/styles/index.css`)

## Runtime

**Environment:**
- Node.js (Development)
- Modern Web Browsers (Target Environment)

**Package Manager:**
- npm 10.x
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 18.3 - Frontend library
- Tailwind CSS 3.4 - Styling framework

**Animation & VFX:**
- Framer Motion 11.2 - Page transitions and UI animations
- GSAP 3.14 - High-performance animations
- @gsap/react 2.1 - React hooks for GSAP integration
- @splinetool/runtime & @splinetool/react-spline - 3D scene integration

**Build/Dev:**
- Vite 5.3 - Build tool and development server
- PostCSS 8.4 - CSS transformation
- TypeScript 5.2 - Static typing

## Key Dependencies

**Critical:**
- `lucide-react` - Icon set
- `clsx` & `tailwind-merge` - Dynamic class management
- `gl-matrix` - WebGL mathematics (likely for custom effects)

## Configuration

**Build:**
- `vite.config.ts` - Vite configuration
- `tsconfig.json` & `tsconfig.node.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS theme and utility configuration
- `postcss.config.js` - PostCSS plugin configuration

## Platform Requirements

**Development:**
- Node.js installed
- npm installed

**Production:**
- Static site hosting (e.g., Vercel, Netlify, GitHub Pages) - Vite produces a static bundle

---

*Stack analysis: 2026-04-12*
*Update after major dependency changes*
