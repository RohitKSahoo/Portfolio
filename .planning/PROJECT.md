# Portfolio

## What This Is

A high-performance, cinematic "System OS" themed portfolio designed to showcase technical projects and engineering identity. It utilizes React, Vite, and advanced VFX (GSAP, Spline, Canvas) to create a futuristic, interactive dashboard environment.

## Core Value

Deliver an unforgettable "first uplink" impression through world-class 3D visuals and responsive background interactions that signal technical depth.

## Requirements

### Validated

- ✓ System OS Portfolio SPA structure — existing
- ✓ Dashboard-based module navigation (switchToModule state logic) — existing
- ✓ LocalStorage persistence for UI state (tab memory) — existing
- ✓ High-tech "UPLINK" visual identity and glassmorphism design system — existing

### Active

- [ ] **ReactBits DotGrid Background:** Rewrite background effect to feature mouse proximity glow, inertia physics, and click-triggered shockwaves.
- [ ] **3D Spline Avatar:** Replace legacy 2D SVG avatar with a real interactive Spline 3D model.
- [ ] **Hero Page Refinement:** Optimize typography, telemetry elements, and layout for a "more modern and better" aesthetic.

### Out of Scope

- **Traditional URL Routing:** Explicitly staying with state-based viewport switching to maintain the "OS Application" feel.
- **Backend Database:** Remaining a static SPA to prioritize performance and VFX fidelity over data persistence.

## Context

The project is currently in a "Version 2" refinement phase. While the foundation is solid, the primary visual anchors (background and hero avatar) are considered "too plain" for the desired premium identity. The tech stack already includes Spline and GSAP, which should be leveraged for these upgrades.

## Constraints

- **Performance**: Must maintain 60FPS despite complex 3D and Canvas interactions.
- **Tech Stack**: Must remain within React/Vite/Tailwind ecosystem.
- **Asset Load**: High-fidelity 3D models (Spline) must be optimized for web entry.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Spline for 3D | Already in stack; provides faster iteration on 3D scenes than raw Three.js | — Pending |
| Canvas for Background | Required for high-density dot performance (DOM would lag) | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-12 after initialization*
