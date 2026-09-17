# Next.js 16 Boilerplate

Boilerplate/starter para novos projetos em **Next.js 16** (App Router), já configurado com TypeScript estrito, Tailwind CSS v4 + shadcn/ui, testes unitários e E2E, e um pipeline de lint/formatação pronto para uso. O objetivo é servir de ponto de partida: clone, `pnpm install`, e comece a construir o produto em vez de configurar tooling.

> ⚠️ **Este não é o Next.js "padrão".** O projeto está na versão 16, que traz mudanças de API/convenções em relação a versões anteriores. Antes de mexer em configuração do Next (`next.config.ts`, App Router, etc.), consulte `node_modules/next/dist/docs/` (ver `AGENTS.md`) em vez de assumir conhecimento de versões antigas.

## Índice

- [O que já vem configurado](#o-que-já-vem-configurado)
- [Requisitos](#requisitos)
- [Como rodar](#como-rodar)
- [Scripts disponíveis](#scripts-disponíveis)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Estilização e componentes de UI](#estilização-e-componentes-de-ui)
- [Testes](#testes)
- [Lint e formatação](#lint-e-formatação)
- [Git hooks (Husky)](#git-hooks-husky)
- [Documentação completa (deep dive)](#documentação-completa-deep-dive)
- [Deploy](#deploy)

## O que já vem configurado

| Área | Ferramentas |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Linguagem | TypeScript 5 (modo `strict`) |
| Estilização | Tailwind CSS v4 + shadcn/ui (`style: base-nova`, ícones Remix Icon) |
| Componentes/UI | `@base-ui/react`, `class-variance-authority`, util `cn` |
| Testes unitários | Vitest + Testing Library + jsdom |
| Testes E2E | Playwright (chromium, firefox, webkit) |
| Lint | ESLint 9 (flat config) — `eslint-config-next`, `jsx-a11y`, `check-file` |
| Formatação | Prettier — ordenação automática de imports e de classes Tailwind |
| Git hooks | Husky + lint-staged (`pre-commit`) e testes unitários (`pre-push`) |
| Ambiente | Node fixado via `.nvmrc`, pnpm como package manager único |
| Env vars | Helper tipado (`src/utils/env.ts`) com validação de env obrigatória |

Cada uma dessas áreas está documentada em detalhe em [`docs/config/`](./docs/config) — veja a seção [Documentação completa](#documentação-completa-deep-dive).

## Requisitos

- **Node** na versão definida em [`.nvmrc`](./.nvmrc) (`lts/jod`, Node 22 LTS). Se usar `nvm`: `nvm use`.
- **pnpm** — único package manager suportado (fixado em `package.json#packageManager`). Não use `npm` ou `yarn` neste repo.

## Como rodar

```bash
# 1. instale as dependências
pnpm install

# 2. copie o template de env e preencha o que for necessário
cp .env.example .env.local

# 3. suba o servidor de desenvolvimento
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador. A página inicial pode ser editada em `src/app/page.tsx` — o Next.js atualiza a página automaticamente (Fast Refresh).

As fontes do projeto (Geist Sans, Geist Mono e Instrument Sans para headings) são carregadas e otimizadas via [`next/font/google`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) em `src/app/layout.tsx`.

## Scripts disponíveis

| Comando | O que faz |
| --- | --- |
| `pnpm dev` | Sobe o servidor de desenvolvimento (`next dev`) |
| `pnpm build` | Gera o build de produção (`next build`) |
| `pnpm start` | Sobe o build de produção já gerado (`next start`) |
| `pnpm lint` | Roda o ESLint em todo o projeto |
| `pnpm format` | Formata todo o repositório com Prettier |
| `pnpm test` | Roda os testes unitários (Vitest) uma vez |
| `pnpm test:watch` | Roda os testes unitários em modo watch |
| `pnpm test:e2e` | Builda a aplicação e roda os testes E2E (Playwright) contra ela |

## Estrutura do projeto

```
├── docs/config/          # documentação de deep dive sobre cada parte do setup
├── public/                # assets estáticos
├── src/
│   ├── app/               # App Router (rotas, layout, globals.css)
│   ├── components/ui/     # componentes de UI (gerados via shadcn CLI)
│   ├── lib/               # utilitários compartilhados (ex.: cn)
│   ├── utils/             # helpers de app (ex.: leitura de env vars)
│   └── tests/
│       ├── config/        # configs de Vitest e Playwright
│       ├── unit/          # testes unitários
│       └── e2e/           # specs end-to-end
├── components.json        # config da CLI do shadcn/ui
├── eslint.config.mjs      # config do ESLint (flat config)
├── next.config.ts         # config do Next.js
├── postcss.config.mjs     # config do Tailwind CSS v4 (via PostCSS)
├── tsconfig.json          # config do TypeScript
└── .prettierrc.json       # config do Prettier
```

Arquivos e pastas de código seguem `KEBAB_CASE` (imposto pelo ESLint) e pastas dentro de `src/app` seguem a convenção do App Router — veja [`docs/config/lint-formatacao.md`](./docs/config/lint-formatacao.md).

## Variáveis de ambiente

- [`.env.example`](./.env.example) é o template versionado; qualquer `.env*` real (`.env.local`, etc.) é ignorado pelo git.
- Envs são lidas de forma centralizada em [`src/utils/env.ts`](./src/utils/env.ts) através de um helper (`requireEnv`) que lança erro se uma env obrigatória não estiver definida. Ao adicionar uma nova env, exporte uma constante nesse arquivo em vez de acessar `process.env` diretamente pelo resto do código.

## Estilização e componentes de UI

O projeto usa **Tailwind CSS v4** (configurado via CSS em `src/app/globals.css`, sem `tailwind.config.js`) e **shadcn/ui** para componentes.

Regra importante deste boilerplate: **reutilize componentes já existentes em `src/components/ui` antes de criar algo novo**; se o componente não existir, **instale-o via CLI do shadcn** em vez de escrevê-lo à mão:

```bash
pnpm dlx shadcn@latest add <componente>
```

Detalhes completos (tokens de tema, dark mode, anatomia de um componente, fluxo recomendado) em [`docs/config/estilizacao.md`](./docs/config/estilizacao.md).

## Testes

- **Unitários**: Vitest + Testing Library, rodando em `jsdom`. Config em `src/tests/config/vitest.config.mts`; testes em `src/tests/unit`.
- **E2E**: Playwright, rodando em chromium/firefox/webkit contra um build de produção subido automaticamente. Config em `src/tests/config/playwright.config.ts`; specs em `src/tests/e2e`.

Detalhes completos em [`docs/config/testes.md`](./docs/config/testes.md).

## Lint e formatação

- **ESLint** (flat config, `eslint.config.mjs`): regras do Next.js (`core-web-vitals`, TypeScript), `jsx-a11y`, e convenções de nomenclatura de arquivos/pastas via `eslint-plugin-check-file`.
- **Prettier** (`.prettierrc.json`): sem ponto e vírgula, aspas simples, ordenação automática de imports (`@trivago/prettier-plugin-sort-imports`) e de classes Tailwind (`prettier-plugin-tailwindcss`).
- **EditorConfig** e **VS Code** (`.vscode/settings.json`) já configurados para formatar e aplicar fixes do ESLint ao salvar.

Detalhes completos em [`docs/config/lint-formatacao.md`](./docs/config/lint-formatacao.md).

## Git hooks (Husky)

- **`pre-commit`**: roda `lint-staged` (ESLint `--fix` + Prettier) apenas nos arquivos `.ts`/`.tsx` staged.
- **`pre-push`**: roda `pnpm test` (testes unitários) e bloqueia o push se algum teste falhar.
- Instalados automaticamente pelo script `prepare` do `package.json` após `pnpm install` — não é necessário nenhum passo manual.

Detalhes completos em [`docs/config/husky.md`](./docs/config/husky.md).

## Documentação completa (deep dive)

Para entender exatamente *como e por quê* cada parte do stack está configurada (não só o que está instalado), consulte:

- [`docs/config/stack-geral.md`](./docs/config/stack-geral.md) — Node/pnpm, scripts, Next.js, TypeScript e variáveis de ambiente.
- [`docs/config/testes.md`](./docs/config/testes.md) — Vitest e Playwright.
- [`docs/config/estilizacao.md`](./docs/config/estilizacao.md) — Tailwind CSS v4, shadcn/ui e o fluxo de reuso/instalação de componentes.
- [`docs/config/lint-formatacao.md`](./docs/config/lint-formatacao.md) — ESLint, Prettier e EditorConfig.
- [`docs/config/husky.md`](./docs/config/husky.md) — hooks de `pre-commit` e `pre-push`.

## Deploy

Como qualquer app Next.js, a forma mais simples de deploy é a [Vercel](https://vercel.com/new), criadora do Next.js. Veja a [documentação de deploy do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para outras opções (Docker, self-hosted, etc.).
