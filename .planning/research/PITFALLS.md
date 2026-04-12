# Research: Potential Pitfalls

**Analysis Date:** 2026-04-12
**Focus:** Stability and Performance Guardrails

## Critical Pitfalls

### 1. The "100% CPU" Grid
- **Issue:** Running complex trigonometry for 500+ dots on every mouse move.
- **Prevention:** Use `OffscreenCanvas` if possible, or limit redraws to the "active" region around the mouse rather than the whole screen.

### 2. Spline Engine Bloat
- **Issue:** Scenes exported with too many lights (>3) or raw textures cause fragment shader cooling/lag on mobile.
- **Prevention:** Optimize the scene in the Spline editor Performance Panel before exporting. Use baked lighting where possible.

### 3. State-Loop Lock
- **Issue:** Updating React state (e.g., `mouseX`) which then triggers a component re-render, which in turn tries to update Spline.
- **Prevention:** Access the Spline instance via `useRef` and call its methods directly. Avoid putting 3D position data into high-frequency React state.

### 4. Memory Leaks
- **Issue:** Not cleaning up GSAP tweens or Spline runtimes when switching modules/pages.
- **Prevention:** Always call `gsap.killTweensOf(dot)` and ensure the Spline component is properly unmounted.

---
*Research synthesized from 2026 engineering post-mortems*
