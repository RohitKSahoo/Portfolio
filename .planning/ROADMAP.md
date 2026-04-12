# Roadmap: Hero Page Refinement

## Overview

This roadmap directs the transformation of the Portfolio's entry experience from a "plain" SVG-based hero to a high-fidelity 3D and kinetic environment. We will rewrite the background grid for physical interactivity and replace the 2D avatar with a modern 3D Spline model.

## Phases

- [ ] **Phase 1: Background Kinetics** - Implement ReactBits-style DotGrid with inertia and shockwaves.
- [ ] **Phase 2: 3D Foundation** - Integrate Spline runtime and lazy-loading architecture.
- [ ] **Phase 3: Avatar Interactivity** - Implement Look-At tracking and React-to-Spline event bridge.
- [ ] **Phase 4: Aesthetic Refinement** - Modernize Hero typography and telemetry elements.
- [ ] **Phase 5: Optimization & Polish** - Performance tuning and responsive validation.

---

## Phase Details

### Phase 1: Background Kinetics
**Goal**: Replace the current static/simple DotGrid with a high-performance Canvas implementation featuring physics-based interactivity.
**Depends on**: Nothing
**Requirements**: 
- Implement mouse proximity glow
- Add GSAP-powered inertia return
- Implement click-triggered shockwave ripples
**Success Criteria**:
  1. Dots glow when mouse is within proximity.
  2. Dots have "weight" and return to position with a spring effect.
  3. Clicking creates a visible ripple displacement across the grid.
**Plans**: 2 plans

### Phase 2: 3D Foundation
**Goal**: Set up the infrastructure for real 3D assets without compromising initial load speed.
**Depends on**: Phase 1
**Requirements**:
- Integrate `@splinetool/react-spline`
- Implement `Suspense`-based lazy loading for the avatar
- Set up a fallback placeholder while Spline loads
**Success Criteria**:
  1. Spline runtime loads successfully in the browser.
  2. Hero page renders a placeholder immediately and swaps to 3D when ready.
**Plans**: 2 plans

### Phase 3: Avatar Interactivity
**Goal**: Make the 3D Avatar feel "alive" by responding to user context.
**Depends on**: Phase 2
**Requirements**:
- Bind mouse coordinates to Spline model's Look-At properties
- Implement `emitEvent` bridge for triggering animations
- Add high-velocity "glitch" artifacts to the avatar view
**Success Criteria**:
  1. The 3D model head tracks the mouse cursor.
  2. Rapid mouse movement triggers a visual "intensity" reaction.
**Plans**: 2 plans

### Phase 4: Aesthetic Refinement
**Goal**: Upgrade the surrounding UI panels to match the new 3D/Kinetic fidelity.
**Depends on**: Phase 3
**Requirements**:
- Modernize typography and vertical telemetry bars
- Add floating HUD text that tracks the avatar's position
- Refine color palette for better contrast against the DotGrid
**Success Criteria**:
  1. Hero section layout feels structured and premium.
  2. Floating telemetry remains legible but non-intrusive.
**Plans**: 1 plan

### Phase 5: Optimization & Polish
**Goal**: Ensure the "System OS" experience is stable and performant across devices.
**Depends on**: Phase 4
**Requirements**:
- Throttle mouse events to protect the main thread
- Implement responsive scaling for the Spline scene
- Verify 60FPS performance on desktop
**Success Criteria**:
  1. Performance metrics stay within the 60FPS target.
  2. Hero page looks and works correctly on mobile and tablet resolutions.
**Plans**: 1 plan

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Background Kinetics | 0/2 | Not started | - |
| 2. 3D Foundation | 0/2 | Not started | - |
| 3. Avatar Interactivity | 0/2 | Not started | - |
| 4. Aesthetic Refinement | 0/1 | Not started | - |
| 5. Optimization & Polish | 0/1 | Not started | - |

---
*Roadmap initialized: 2026-04-12*
