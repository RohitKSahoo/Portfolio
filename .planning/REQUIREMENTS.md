# Requirements: Hero Page Refinement

## System Vision

Transform the static/SVG Hero experience into a high-fidelity, interactive "System UI" using 3D Spline and kinetic physics.

## User Flow

1. **Uplink Established:** User lands on the page; DotGrid background initializes with a subtle ambient pulse.
2. **Kinetic Response:** Mouse movement triggers a "glow" radius and physical displacement in the grid.
3. **3D Immersion:** The Spline Avatar tracks the pointer with subtle inertia and physical weight.
4. **Interaction Phase:** Clicking triggers a "Shockwave" ripple across the background grid.

## Functional Requirements

### 1. Interactive DotGrid Background (Canvas)
- [ ] **Proximity Glow:** Dots within a fixed radius of the mouse must glow with the `--theme-accent` color.
- [ ] **Inertia Physics:** Movement should have "drag" and a return-to-center spring effect (via GSAP).
- [ ] **Shockwave Effect:** Clicking anywhere on the screen must trigger a circular displacement wave that moves the dots temporarily.

### 2. Spline 3D Avatar
- [ ] **Modern Mecha Model:** Replace existing SVG illustration with a high-fidelity Spline 3D scene.
- [ ] **Look-At Tracking:** The 3D model (or its specific "head" mesh) must follow the pointer.
- [ ] **Greeting Animation:** Entering the hero's hover-state (long hover) should trigger a specific Spline state (e.g., waving or system check).

### 3. Layout & Aesthetic
- [ ] **Premium Typography:** Update `ProfilePage` fonts and spacing to match high-end 2026 aesthetics.
- [ ] **Telemetry Elements:** Integrate floating HUD-style data text around the avatar.

## Non-Functional Requirements

- **Performance:** Maintain 60 FPS on desktop; gracefully degrade to 30 FPS or static dots on low-end mobile.
- **Responsiveness:** Dot density and Spline scale must adapt to various viewport sizes.
- **Asset Load:** Spline scene must load via `Suspense` with an appropriate loading placeholder.

---
*Requirements frozen: 2026-04-12*
