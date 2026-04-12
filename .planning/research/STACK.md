# Research: Technology Stack (Project Level)

**Analysis Date:** 2026-04-12
**Focus:** 3D & Interactive Backgrounds

## Core Technologies

### 1. 3D Engine: Spline
- **Runtime:** `@splinetool/react-spline` v4.x
- **Rationale:** High-speed development of interactive 3D without the boilerplate of raw Three.js. Native support for events (hover, click) and state-machine transitions.
- **2026 Pattern:** Utilizing the `onLoad` callback to store the `SplineApplication` instance for programmatic control.

### 2. Interaction & Animation: GSAP
- **Library:** `gsap` v3.14+
- **Rationale:** Industry standard for "juicy" physics and inertia. Essential for the `DotGrid` background's inertia and shockwave effects.
- **Inertia Fallback:** If `InertiaPlugin` (Club GSAP) is unavailable, custom distance-decay functions or standard "elastic" eases provide a viable alternative.

### 3. Canvas Background: React Bits DotGrid
- **Implementation:** Custom HTML5 Canvas renderer.
- **Physics:** Frame-independent calculations for dot displacement based on pointer proximity and velocity.

## Integration Patterns

| Pattern | Technology | Rationale |
|---------|------------|-----------|
| **Lazy Loading** | `React.lazy` + `Suspense` | Prevents large 3D runtimes from blocking initial DOM paint. |
| **Object Search** | `app.findObjectByName` | Enables precise manipulation of sub-meshes within a Spline scene. |
| **State Sync** | `emitEvent` | Triggers Spline-internal animations/transitions from React logic. |

---
*Research synthesized from 2026 best practices*
