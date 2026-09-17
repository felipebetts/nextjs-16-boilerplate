# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

> **Setup instruction (self-removing):** the description below is still the generic boilerplate one. Ask the user what the actual project being built here is (name, purpose/domain, intended users) before doing other work. Once they answer, rewrite this "## Project" section to describe the real project instead of the generic boilerplate blurb (keep the stack facts — Next.js 16 App Router, TypeScript strict, Tailwind v4 + shadcn/ui, Vitest + Playwright, ESLint + Prettier — since they're still true), then delete this instruction block entirely so the question is never asked again.

Next.js 16 boilerplate/starter (App Router), meant to be cloned as a starting point for new projects rather than a product with existing features: TypeScript strict, Tailwind CSS v4 + shadcn/ui, Vitest + Playwright, ESLint + Prettier.

## Commands

pnpm is the only supported package manager (pinned via `packageManager` in `package.json`) — never use `npm`/`yarn` in this repo.

- `pnpm install` — install deps
- `pnpm dev` / `pnpm build` / `pnpm start` — dev server / production build / serve build
- `pnpm lint` — ESLint (flat config)
- `pnpm format` — Prettier, writes across the whole repo
- `pnpm test` — unit tests once (Vitest)
- `pnpm test:watch` — unit tests in watch mode
- `pnpm test:e2e` — Playwright E2E; builds and boots the app on port 3100 automatically first, so it's much slower than the unit suite
- Single unit test file: `pnpm test src/tests/unit/page.test.tsx` (Vitest CLI filtering, e.g. `-t <name>`, works the same way through this script)
- Single e2e spec: `pnpm test:e2e src/tests/e2e/home.spec.ts`

## Architecture

- **Test layout is non-default and deliberate**: configs live in `src/tests/config/` (`vitest.config.mts`, `playwright.config.ts`), unit tests in `src/tests/unit/`, e2e specs in `src/tests/e2e/` — none at the repo root. Always run tests through the `pnpm test*` scripts; invoking `vitest`/`playwright` directly without `--config src/tests/config/...` won't resolve correctly.
- **Tailwind v4 has no `tailwind.config.js`**: all theme tokens (colors, radius, dark-mode variant) live in `src/app/globals.css` under `@theme inline`, `:root`, `.dark`. Change the design system there, not via ad hoc utility classes scattered through components.
- **shadcn/ui is on `base-nova`**, which is built on `@base-ui/react` (not Radix) — that's why `@base-ui/react` (not `@radix-ui/*`) is the primitive layer under `src/components/ui`. `lucide-react` is a leftover from `create-next-app`; new components should use `@remixicon/react` per `components.json`'s `iconLibrary`.
- **UI components are meant to be generated, not hand-written**: reuse what's already in `src/components/ui` first; if missing, install via `pnpm dlx shadcn@latest add <component>` (reads `components.json`); only hand-write as a last resort, following the pattern in the existing `button.tsx` (base-ui primitive + `cva` variants + `cn` + `data-slot`).
- Path alias `@/*` → `src/*`, matching both `tsconfig.json` and the shadcn `aliases` in `components.json`. If `src/components/ui` or `src/lib` ever move, update `components.json` too or the shadcn CLI will generate files in the wrong place.
- Env vars are centralized in `src/utils/env.ts` via `requireEnv(name, optional?)`; add new envs as exported constants there instead of reading `process.env` directly elsewhere in the app.
- File/folder naming is enforced by ESLint (`eslint-plugin-check-file`): `.ts`/`.tsx` files must be `KEBAB_CASE`; folders under `src/app/**` must follow Next's App Router casing (`(group)`, `[slug]`, `[...catchAll]`).
- Deep-dive docs for each area of the stack (the *why* behind non-default config choices) live in `docs/config/`: `stack-geral.md` (Node/pnpm/Next/TS/env), `testes.md` (Vitest/Playwright), `estilizacao.md` (Tailwind/shadcn), `lint-formatacao.md` (ESLint/Prettier). Read the relevant one before making non-trivial changes in that area.

## Keeping docs current

- `docs/config/*.md` is the source of truth for *how and why* each part of the stack is configured. When you change tooling/config non-cosmetically (test setup, lint rules, styling system, env handling, Next.js config, package manager), update the matching file there — or add a new one if the change doesn't fit an existing doc — rather than letting the docs drift from reality.
- `docs/notas.md` is a chronological log for decisions, constraints, and non-obvious learnings that don't belong in a specific `docs/config/` area doc. When you learn or decide something a future session would otherwise have to rediscover from scratch, add a dated entry there.
- Update this file (`CLAUDE.md`) itself when the architecture, commands, or conventions described here change — it should never describe a state of the repo that no longer exists.
