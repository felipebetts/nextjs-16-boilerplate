# Testes (Vitest + Testing Library + Playwright)

Todos os configs de teste ficam centralizados em `src/tests/config/`, não na raiz do projeto. Os arquivos de teste em si ficam um nível acima, em `src/tests/unit` (unitários) e `src/tests/e2e` (end-to-end).

```
src/tests/
├── config/
│   ├── vitest.config.mts     # config dos testes unitários
│   ├── vitest.setup.ts       # setup global do Vitest (matchers do jest-dom)
│   └── playwright.config.ts  # config dos testes E2E
├── unit/
│   └── page.test.tsx
└── e2e/
    └── home.spec.ts
```

## Testes unitários — Vitest

Config: `src/tests/config/vitest.config.mts`.

Pontos importantes:

- **`root: testsRoot`** aponta a raiz do Vitest para `src/tests` (um nível acima do arquivo de config), então `include: ['unit/**/*.test.{ts,tsx}']` é resolvido como `src/tests/unit/**/*.test.{ts,tsx}`.
- **`cacheDir`** é forçado para `<repo>/node_modules/.vite`. Isso existe porque, como `root` aponta para `src/tests`, o Vite por padrão criaria o cache dentro de `src/tests/node_modules` — o override evita isso.
- **`environment: 'jsdom'`** — os testes rodam em um DOM simulado (necessário para testar componentes React).
- **`plugins: [tsconfigPaths(), react()]`** — `tsconfigPaths()` faz o Vitest entender o alias `@/*` do `tsconfig.json`; `react()` (do `@vitejs/plugin-react`) habilita JSX/Fast Refresh no ambiente de teste.
- **`setupFiles`** aponta para `vitest.setup.ts`, que só importa `@testing-library/jest-dom/vitest` — isso registra matchers como `toHaveTextContent`, `toBeInTheDocument`, etc.

Exemplo de teste (`src/tests/unit/page.test.tsx`): usa `@testing-library/react` (`render`, `screen`) para renderizar a página e `vitest` (`test`, `expect`) como test runner — sem describe/it do Jest, é a API nativa do Vitest.

Rodar:

```bash
pnpm test         # roda uma vez (CI-friendly)
pnpm test:watch   # modo watch
```

Ambos os scripts já passam `--config src/tests/config/vitest.config.mts` — não é necessário (nem funcionaria bem) rodar `vitest` direto na raiz sem apontar o config.

## Testes E2E — Playwright

Config: `src/tests/config/playwright.config.ts`.

Pontos importantes:

- **Porta dedicada (`3100`)**: evita colidir com um `next dev` já rodando na porta padrão `3000` durante desenvolvimento local.
- **`testDir: '../e2e'`** e **`outputDir`/reporter apontados explicitamente para `src/tests/e2e/...`** — como o Playwright resolve caminhos relativos a `process.cwd()` por padrão (não à localização do arquivo de config), os paths são construídos com `path.resolve`/`path.join` a partir de `__dirname` para não vazar artefatos de teste para a raiz do repo.
- **`webServer`**: roda `pnpm build && pnpm start` com `cwd` apontando para a raiz do projeto (`projectRoot`, calculado a partir de `src/tests/config`), já que os scripts do Next.js precisam ser executados da raiz. `reuseExistingServer: !process.env.CI` permite reaproveitar um servidor já de pé localmente, mas força start limpo em CI.
- **`projects`**: roda os testes em `chromium`, `firefox` e `webkit` (via `devices` do Playwright), cobrindo os três motores de renderização.
- **`retries`** e **`forbidOnly`** só ficam mais estritos quando `process.env.CI` está setado (2 retries em CI, 0 localmente; `test.only` esquecido falha o CI).

Artefatos gerados (`playwright-report/`, `test-results/`) ficam dentro de `src/tests/e2e/` e são ignorados pelo git (ver `.gitignore`).

Rodar:

```bash
pnpm test:e2e
```

Isso builda e sobe a aplicação de produção automaticamente (via `webServer`) antes de rodar os specs.

## Convenções ao adicionar testes

- Teste unitário novo → `src/tests/unit/*.test.{ts,tsx}`.
- Spec E2E novo → `src/tests/e2e/*.spec.ts`.
- Nomes de arquivo seguem `KEBAB_CASE` (regra do ESLint `check-file/filename-naming-convention`, com `ignoreMiddleExtensions` para permitir sufixos como `.test.ts`/`.spec.ts`) — veja [`lint-formatacao.md`](./lint-formatacao.md).
