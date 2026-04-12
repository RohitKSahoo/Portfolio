# Coding Conventions

**Analysis Date:** 2026-04-12

## UI & React Patterns

**Component Structure:**
- **Functional Components:** All UI components use functional definitions.
- **Hooks:** heavy use of `useState`, `useEffect` for state and lifecycle.
- **Prop Typing:** TypeScript interfaces or inline types are used for all component props.

**Styling:**
- **Utility-First:** Tailwind CSS is the primary method for styling.
- **Dynamic Classes:** `clsx` and `tailwind-merge` are used for conditional styling to avoid class conflicts.
- **Design Tokens:** Global theme values are accessed via CSS variables defined in `:root`.

## TypeScript & Logic

**Type Safety:**
- Strict typing is observed for component props and state.
- **Interfaces over Types:** Generally uses `interface` for defining object structures.

**State Management:**
- **Localized State:** State is kept as close to the usage as possible.
- **Persistence:** High-level state (like navigation) is synced with `localStorage` in `App.tsx`.

## Naming & Style

**File System:**
- Components: `PascalCase.tsx` (e.g., `SystemAvatar.tsx`).
- Styles/Utils: `kebab-case.css` or `camelCase.ts`.

**Code Style:**
- **Semicolons:** Prevalent in the codebase.
- **Quotes:** Mix of single and double quotes (Vite/Prettier defaults often seen).
- **Indentation:** 2 spaces.

## Error Handling

- **Silent Recovery:** UI components often use fallbacks (e.g., in `App.tsx`'s `renderContent` default case).
- **Defensive Programming:** Optional chaining and null checks are used when accessing state or props.

---

*Convention audit: 2026-04-12*
*Update as team standards evolve*
