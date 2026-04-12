# Technical Concerns & Debt

**Analysis Date:** 2026-04-12

## Immediate Concerns

- **Unused Root Artifacts:** `style.css` and `script.js` exist in the project root. These appear to be from a legacy non-React version of the site and should be removed to avoid confusion.
- **Hardcoded Project Data:** The project registry in `src/components/dashboard/DashboardPages.tsx` is hardcoded. This makes updating the portfolio difficult and is starting to bloat the main component file.
- **Asset Management:** Several project images (e.g., `/pausify_module_1775283678626.png`) are referenced as absolute paths from root but weren't immediately visible in the initial root scan. They should be moved to `public/assets/` for better organization.

## Performance & Optimization

- **3D Runtime Overhead:** The `SystemAvatar` component loads the Spline runtime and a complex 3D scene. This may impact LCP (Largest Contentful Paint) and overall mobile performance.
- **Animation Density:** High volume of Framer Motion and GSAP animations running simultaneously (DotGrid background + Page transitions + Avatar) could lead to frame drops on lower-end devices.
- **DotGrid Calculations:** The `DotGrid` background likely recalculates dot distances and colors on every mouse move. Without proper throttling or GPU acceleration (Canvas/Shader), this could cause significant main-thread lag.

## Technical Debt

- **Lack of Centralized Routing:** Using a switch-case state for navigation in `App.tsx` works for a small portfolio but lacks the benefits of a real router (e.g., URL deep-linking, browser back-button support).
- **Empty Directories:** `src/utils` and `src/hooks` are currently empty, while some generic logic (like character scrambling and metric display) is implemented inline within components.
- **Testing Coverage:** Zero automated tests for a project with complex interactive states and critical "uplink" functionality.

## Security & Maintenance

- **Placeholder Credentials:** `ContactPage.tsx` contains placeholders like `LL/IN/ROHITKSAHOO` and `ROHIT@SYSTEM.ORG`. While intentional for "REDACTED" aesthetic, they should be updated before final deployment.
- **Environment Parity:** No evidence of `.env.example` or environment branching, making it difficult to differentiate between development and production configurations.

---

*Found a concern? Document it here for future prioritization.*

