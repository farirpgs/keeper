# Repository Guidelines

## Project Structure & Module Organization

- Source: `src/` with:
  - `pages/` (Astro routes and API endpoints: `.astro`, `*.ts` like `image.png.ts`).
  - `components/` (client/server React `.tsx` and `.astro`).
  - `layouts/`, `styles/`, `domains/` (domain logic), `routes/` (route helpers), and `content/` (MDX content).
- Public assets: `public/` (served at `/`, e.g., `/background.png`). Build output: `dist/`.
- Content collections: configured in `src/content.config.ts` using Astro Content. Collections include `creators`, `games`, `assets`, `resources`, and `docs`, with content under `src/content/<collection>/`.

## Build & Development

- `bun install`: install dependencies.
- `bun run dev`: start local dev server (defaults to `http://localhost:4321`).
- `bun run build`: production build to `dist/` (runs `astro build`).
- `bun run preview`: serve the built site locally.
- `bun run check`: Astro/TS diagnostics (type and config checks).
- Deployment: Netlify adapter is configured in `astro.config.mjs`; scripts `alpha`/`prod` use the Netlify CLI.

## Style & Syntax

- Prettier + Tailwind plugin enforce formatting. Use PascalCase for components, camelCase for functions, UPPER_SNAKE for constants; filenames generally kebab-case. Dynamic route params use descriptive camelCase (e.g., `[creatorSlug]`).
- Prefer `function` declarations/expressions for non-passed functions (route handlers, utilities). Use arrow functions when passing (React event handlers, callbacks). Prefer `type` over `interface`.
- For non-render functions, accept a single `params` object (no destructuring); favor readable, multi-line steps over deep chains.
- Curly braces: always include `{}` for control statements (`if/else`, `for`, `while`, `do`, `switch`, and non-trivial arrow bodies). Avoid single-line or inline `if` without braces.

## Components & UI

- Single `props` param: components accept a single `props` parameter. Do not destructure in the signature.
- Inline prop types: annotate the parameter inline; avoid exporting standalone `*Props` types.
- Defaults rule: create local defaults from `props`, e.g., `const size = props.size ?? "2"`.
- Spreading rule: if spreading HTML attributes, destructure inside the body to obtain `...rest`; otherwise avoid destructuring `props`.
- Order: function declaration and defaults → React state hooks → derived consts → effects (name `useEffect` callbacks) → event handlers (`function handleClick() {}`) → return JSX → sub-render helpers at bottom.
- React hooks import: import hooks directly (`import { useState, useEffect } from "react"`), do not call them off the React namespace (avoid `React.useEffect`, `React.useState`).
- Styling: prefer Tailwind utilities; use `cn(...)`/`twMerge(...)` for class merging when needed.
- Sub-render helpers: when extracting tiny render fragments inside a component, use plain functions scoped to that component and name them `renderThing(params)`. These are not React components and should not use hooks; they return JSX and are called like `renderThing({ ... })`.
- Components vs helpers: anything used as `<Thing />` is a real React component and must accept a single `props` parameter (not `params`). Reserve `params` objects for non-React functions and sub-render helpers.
- Render helpers placement: do not declare render helpers inline inside JSX. Define them as `function` declarations after the component’s return block. Call them inside JSX like `renderThing({ ... })`.

## Testing & PRs

- Run `bun run check` to check for errors/warnings.
- Commits: conventional prefixes (`feat:`, `fix:`, `chore:`). PRs: summary, linked issues, screenshots for UI, and notes on env/migrations.
