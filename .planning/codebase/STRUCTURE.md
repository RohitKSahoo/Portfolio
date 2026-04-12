# Directory Structure

**Analysis Date:** 2026-04-12

## Project Layout

```text
Portfolio/
├── .planning/              # Project intelligence and GSD workflow documents
│   └── codebase/           # [Current] Mapping of the existing codebase
├── public/                 # Static assets (favicons, manifest)
├── src/                    # Primary source code
│   ├── animations/         # GSAP and Framer Motion animation configurations
│   ├── components/         # React components
│   │   ├── dashboard/      # Page-specific modules (Profile, Projects, etc.)
│   │   ├── effects/        # Background and foreground VFX (DotGrid, ASCII)
│   │   ├── layout/         # Persistent UI (Header, Sidebar)
│   │   └── sections/       # [Legacy/Unused] Previous version components
│   ├── hooks/              # Custom React hooks (for events, persistence)
│   ├── styles/             # Global CSS and Design System (index.css)
│   ├── utils/              # Helper functions (formatting, math)
│   ├── App.tsx             # Main application orchestrator
│   └── main.tsx            # React hydration point
├── assets/                 # Raw assets (images, fonts)
├── node_modules/           # Managed dependencies
├── index.html              # HTML entry point (Vite)
├── package.json            # Scripts and dependencies
├── tailwind.config.js      # CSS framework configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Build tool configuration
```

## Key File Locations

- **Styling:** `src/styles/index.css` (primary), `tailwind.config.js`.
- **Global Layout:** `src/App.tsx`.
- **Navigation:** `src/components/layout/Sidebar.tsx`.
- **Content Modules:** `src/components/dashboard/DashboardPages.tsx`.
- **System Avatar:** `src/components/SystemAvatar.tsx`.

## Naming Conventions

- **Components:** `PascalCase` (e.g., `DashboardCard.tsx`).
- **Styles:** `kebab-case` for classes, but CSS variables often use `kebab-case` with specific prefixes (e.g., `--theme-accent`).
- **Folders:** `lowercase` or `kebab-case`.
- **TypeScript:** Strict typing preferred for props and state.

## Legacy / Cleanup Items

- `style.css` & `script.js` (Root): Appear to be artifacts from a previous non-React implementation.
- `src/components/sections/`: May contain components superseded by the `dashboard` module.
- `🌍 Spline Skill/`: External resource folder for 3D modeling work, not part of the core build.

---

*Structure analysis: 2026-04-12*
*Update whenever directory organization changes*
