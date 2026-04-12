# External Integrations

**Analysis Date:** 2026-04-12

## APIs & External Services

**Visual Assets & Runtime:**
- **Spline** - Used for interactive 3D elements (System Avatar)
  - SDK/Client: `@splinetool/react-spline`, `@splinetool/runtime`
  - Implementation: Loads custom scenes for the robotic avatar

**Social & Professional Uplinks:**
- **GitHub** - Source code hosting and project registry
  - Integration method: Direct links to repositories and profile
- **LinkedIn** - Professional network integration
  - Integration method: Direct link to profile

## Data Storage

**Client-Side Persistence:**
- **Local Storage** - Used for persistent UI state
  - Key: `active-tab` - Stores the last active dashboard module

**Databases & Backend:**
- None currently active in the portfolio itself.
- Note: Referenced projects (Pausify, SoSafe) utilize external services like Firestore, Cloudinary, and Gemini API, but these are independent of the portfolio's runtime.

## Monitoring & Observability

**Logs:**
- Browser console - Standard development logging
- No external monitoring service (Sentry, etc.) detected.

## CI/CD & Deployment

**Hosting:**
- Target Platform: Static hosting (Vercel/GitHub Pages/Netlify)
  - Deployment: Manual or GitHub Action triggered builds

**CI Pipeline:**
- None detected in `.github/workflows/` (need to verify if it exists).

## Environment Configuration

**Development:**
- No environment variables required for basic execution.
- Configured via static constants and local theme variables.

---

*Integration audit: 2026-04-12*
*Update when adding/removing external services*
