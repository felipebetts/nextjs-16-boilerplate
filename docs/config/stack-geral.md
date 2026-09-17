# Stack geral

Visão geral de como o projeto está configurado em nível de plataforma: Node, package manager, Next.js e TypeScript. Para testes, estilização e lint/formatação, veja os documentos irmãos nesta pasta.

## Node e package manager

- **`.nvmrc`** fixa a versão do Node em `lts/jod` (Node 22 LTS). Rode `nvm use` antes de instalar dependências para garantir a mesma versão usada no projeto.
- **`package.json`** declara `"packageManager": "pnpm@11.22.0"` — o pnpm é o único gerenciador suportado; não use `npm`/`yarn` neste repo.
- **`pnpm-workspace.yaml`** desabilita builds nativos de dois pacotes (`sharp` e `unrs-resolver`) via `allowBuilds`. Isso evita que o pnpm tente compilar binários que o projeto não usa, deixando o `pnpm install` mais rápido e sem prompts de aprovação de build.

## Scripts (`package.json`)

| Script | Comando | Uso |
| --- | --- | --- |
| `dev` | `next dev` | Servidor de desenvolvimento |
| `build` | `next build` | Build de produção |
| `start` | `next start` | Sobe o build de produção |
| `lint` | `eslint` | Roda o ESLint (flat config) |
| `format` | `prettier --write .` | Formata todo o repo |
| `test` | `vitest run --config src/tests/config/vitest.config.mts` | Testes unitários |
| `test:watch` | `vitest --config src/tests/config/vitest.config.mts` | Testes unitários em watch mode |
| `test:e2e` | `playwright test --config src/tests/config/playwright.config.ts` | Testes E2E |

Repare que os configs de teste não ficam na raiz — veja [`testes.md`](./testes.md) para o porquê.

## Next.js

- **`next.config.ts`** está praticamente vazio (`const nextConfig: NextConfig = {}`). É o ponto de entrada para qualquer configuração de build/runtime do Next (imagens, redirects, headers, etc.).
- Este boilerplate usa o **App Router** (`src/app`), não o Pages Router.
- **Importante (ver `AGENTS.md`)**: este é o Next.js 16, uma versão com mudanças que podem quebrar o que você já sabe de versões anteriores. Antes de alterar `next.config.ts` ou qualquer convenção de `src/app`, leia o guia correspondente em `node_modules/next/dist/docs/` (resolvido a partir da raiz do projeto) em vez de confiar em conhecimento prévio sobre o Next.js.

## TypeScript (`tsconfig.json`)

- `strict: true` — todo o projeto roda com checagem estrita de tipos.
- `moduleResolution: "bundler"` + `module: "esnext"` — resolução de módulos alinhada ao bundler do Next, não ao Node puro.
- `jsx: "react-jsx"` — não é necessário importar `React` nos arquivos `.tsx`.
- `paths`: `"@/*": ["./src/*"]` — o alias `@/` aponta para `src/`. É o mesmo alias usado pelos `aliases` do `components.json` (veja [`estilizacao.md`](./estilizacao.md)).
- O plugin `"next"` é registrado em `compilerOptions.plugins` para habilitar os tipos gerados automaticamente pelo Next (`.next/types`).
- `noEmit: true` — o TypeScript aqui é só para checagem; quem gera o JS final é o Next/SWC.

## Variáveis de ambiente

- **`.env.example`** é o template versionado; qualquer `.env*` real é ignorado pelo git (ver `.gitignore`), exceto o próprio `.env.example`.
- **`src/utils/env.ts`** concentra a leitura de envs através de `requireEnv(name, optional?)`, que lança erro se uma env obrigatória estiver ausente. Padrão de uso: adicionar uma constante exportada por env (ver o exemplo comentado no próprio arquivo) em vez de acessar `process.env` diretamente pelo código da aplicação.
