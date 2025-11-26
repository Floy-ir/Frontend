## Agent Guidelines for This Repo

This document is for AI/code agents working in this repository.  
Follow these rules for all changes unless the user explicitly overrides them.

### UI Components

- Always prefer existing UI primitives under `components/elements` instead of creating ad‑hoc HTML or using third‑party components directly.
- For **buttons**, always use the shared `Button` in `components/elements/Button/Button.tsx` (or other exported button variants in `components/elements`), not raw `<button>` unless you are inside those primitives.
- For **tooltips**, use the tooltip component(s) from `components/elements` (or other local shared tooltip wrappers), not Radix or other libraries directly in feature code.
- For **selects / comboboxes / dropdowns**, use the existing components in `components/elements` (for example `ComboboxSelect`) instead of raw `<select>` or Radix `Select` directly.
- For **text inputs, labels, chips, tags, badges, etc.**, prefer the customized components under `components/elements` before introducing new primitives.
- If a matching element does not exist in `components/elements`, add or extend it there first, then reuse it elsewhere.

### API Calls / Data Fetching

- Always use `apiFetch` from `services/api` for HTTP calls.
- Do **not** call `fetch`, `axios`, or other HTTP clients directly in components, hooks, or services unless you are inside `services/api` extending `apiFetch`.
- Put API‑specific helpers or wrappers in `services/*` (for example, flight APIs, city APIs) and have UI layers call those helpers instead of hitting endpoints directly.
- Handle errors and typing at the service layer (with proper TypeScript types) and keep components focused on rendering and user interaction.

### Project Structure & Style

- This is a Next.js 15 / React 19 / TypeScript project; keep new code **typed** and follow existing patterns in adjacent files.
- Prefer **server components** / data fetching strategies already used in this repo; do not introduce new patterns unless necessary and clearly localized.
- Use existing **hooks** in `hooks/` where applicable (`useStoredCities`, persistence hooks, etc.) instead of re‑implementing similar logic.
- Keep styling consistent with current Tailwind utility usage and class patterns from nearby components.
- For colors, always use the project’s predefined Tailwind tokens (as configured in `tailwind.config.js`, e.g. `bg-primary-500`, `text-Primary-P500main`, etc.) instead of raw Tailwind default colors (`bg-blue-500`) or hard-coded values like `#RRGGBB` / `rgb(...)` in components.

### Testing & Tooling

- When changing non‑trivial logic (hooks, services, utilities), check for existing tests and update/add tests in the same style.
- Use `pnpm test`, `pnpm lint`, and `pnpm format` locally to validate changes when possible.

### General Principles

- Prefer small, focused changes that align with current architecture rather than large refactors.
- Reuse existing utilities and helpers in `utils/` and `services/` before adding new ones.
- Avoid introducing new runtime dependencies unless absolutely necessary; if you must, keep them well‑justified and localized.

### Eitaa MiniApp Integration

- When working on the Eitaa MiniApp version of Floy (login, notifications, or in-app experience), follow the detailed guide in `docs/EitaaMiniAppGuide.md`.
- Always validate Eitaa `initData` hashes on the backend (Django) before trusting any user information from `initDataUnsafe`.
- Use the Eitaa JS SDK (`window.Eitaa.WebApp`) only in the MiniApp environment; guard such calls so they don’t execute in a regular browser.
- For sending messages/notifications via Eitaa, implement and reuse backend helpers that call the documented `verify` and `sendMessage` APIs instead of ad‑hoc HTTP calls.
