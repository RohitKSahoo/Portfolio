# Research: System Architecture

**Analysis Date:** 2026-04-12
**Focus:** High-Performance VFX Integration

## Component Hierarchy

```text
App
├── DotGrid (Canvas, z-index: -1)
└── MainContainer
    ├── Header
    ├── Sidebar
    └── Viewport (ProfilePage)
        └── SplineAvatar (Spline Runtime)
```

## Performance Strategies

- **Canvas Decoupling:** The `DotGrid` should calculate physics in a separate `requestAnimationFrame` loop from React rendering.
- **Isolation:** `SplineAvatar` must be memoized or placed in a "leaf" component to prevent unnecessary re-initialization of the 3D engine when parent state changes.
- **Throttling:** Pointer event listeners should be throttled (at least 16ms/60fps) to prevent event-buffer overflow during rapid movement.

## Data Flow (Interactivity)

1. **Global Events:** `mousemove` captured at the `window` level.
2. **Background Dispatch:** Passed directly to raw Canvas logic for `DotGrid` (fast path).
3. **Avatar Dispatch:** Passed to Spline instance via `emitEvent` or direct property setters (controlled path).

---
*Research synthesized from 2026 high-performance UI patterns*
