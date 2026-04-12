---
phase: 1
slug: background-kinetics
status: draft
shadcn_initialized: false
preset: none
created: 2026-04-12
---

# Phase 1 — UI Design Contract

> Visual and interaction contract for the Background Kinetics phase. Focuses on the transition from simple dot grid to a high-fidelity, interactive physical system.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none |
| Preset | not applicable |
| Component library | none (Canvas-based) |
| Icon library | Lucide (if needed for HUD) |
| Font | JetBrains Mono / Space Mono |

---

## Spacing Scale (Grid Parameters)

Declared values for the kinetic grid:

| Token | Value | Usage |
|-------|-------|-------|
| dot-size | 2px | Fixed diameter of each grid dot |
| dot-gap | 32px | Default spacing between dots (cell size) |
| proximity | 150px | Interaction radius for mouse glow |
| ripple-speed | 400ms | Duration of the expansion phase of the ripple |
| return-ease | 1.5s | Duration of the elastic return to center |

Exceptions: major section headers maintain 64px padding (3xl) as per root design system.

---

## Typography (HUD & Telemetry)

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Telemetry | 10px | 400 | 1.0 (Fixed) |
| HUD Labels | 12px | 700 | 1.1 |
| Header HUD | 14px | 500 | 1.2 |

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | #0a0a0a | Main background (Canvas clear color) |
| Secondary (30%) | #1a1a1a | Dot base color (low opacity, ~20%) |
| Accent (10%) | #f43f5e | Dot glow and ripple highlight |

Accent reserved for:
- Dot glow when mouse is in proximity.
- Ripple shockwave leading edge.
- Interactive HUD text pulses.

---

## Kinetics & Physics Contract

| Interaction | Behavior | Ease / Physics |
|-------------|----------|----------------|
| **Hover Prox** | Proximity-based radial glow. Color transitions from #1a1a1a to #f43f5e. | Exponential falloff |
| **Mouse Drag** | Dots are pushed away from the mouse cursor based on velocity. | GSAP Inertia / Power2.out |
| **Click Ripple** | A wave expands from click point, displacing dots by 10-20px depending on distance. | Elastic.out (1, 0.75) |

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-04-12
