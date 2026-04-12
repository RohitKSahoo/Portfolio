# Architecture

**Analysis Date:** 2026-04-12

## System Overview

This project is a high-performance, single-page application (SPA) portfolio built with React and Vite. It features a "System OS" aesthetic, simulating a technical dashboard environment with real-time UI transitions and interactive elements.

## Core Patterns

**State Management:**
- **Component Local State:** Primary state for UI interactions (active tabs, modal states, etc.) is handled via React's `useState`.
- **Persistence:** Key UI preferences (like the active dashboard tab) are persisted in `localStorage`.
- **Prop Drilling:** State is passed down from `App.tsx` to key layout components like `Sidebar` and `MainContent`.

**UI Architecture:**
- **Centralized Viewport:** `App.tsx` acts as the orchestrator, containing the persistent `Sidebar`, `Header`, and a dynamic `renderContent` area.
- **Switch-Based Routing:** Uses a simple state-driven switch in `App.tsx` to swap between "modules" (Profile, Projects, Experience, Contact) instead of a traditional router (like React Router).
- **Animatable Transitions:** `AnimatePresence` and `motion.div` from Framer Motion wrap the module content for smooth entry/exit animations.

**Styling & Design System:**
- **Atomic Styling:** Utilizes Tailwind CSS for utility-first styling.
- **Tokenized CSS:** Core theme variables (colors, fonts, glassmorphism tokens) are defined in `src/styles/index.css` using CSS Variables.
- **Glassmorphism:** Heavy use of backdrop filters and semi-transparent backgrounds for the "OS" look.

## Data Flow

1. **User Interaction:** User clicks a navigation item in the `Sidebar`.
2. **State Transition:** `setActiveTab` is called in `App.tsx`.
3. **Persistence:** `useEffect` hook saves the new `activeTab` to `localStorage`.
4. **Re-render:** `App.tsx` re-renders, triggering `renderContent()`.
5. **Animation:** Framer Motion detects the key change and executes the transition animation.
6. **Module Mount:** The selected page component (e.g., `RegistryPage`) mounts with its own local animations.

## Key Abstractions

- **Dashboard Components:** Reusable UI blocks found in `src/components/dashboard/` (e.g., `DashboardCard`, `MetricBar`).
- **Effect Components:** Dedicated components for background visuals like `DotGrid` and `AsciiBackground` located in `src/components/effects/`.
- **System Avatar:** A complex component (`SystemAvatar.tsx`) that integrates Spline runtime for interactive 3D rendering.

## Entry Points

- **`src/main.tsx`:** Standard React entry point.
- **`src/App.tsx`:** Main application orchestrator and layout container.
- **`src/styles/index.css`:** Global styles and design system tokens.

---

*Architectural audit: 2026-04-12*
*Update during major structural refactoring*
