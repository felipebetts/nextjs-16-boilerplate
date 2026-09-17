# Linters e formatadores (ESLint + Prettier + EditorConfig)

## ESLint (`eslint.config.mjs`)

Flat config (formato novo do ESLint 9, via `defineConfig`/`globalIgnores` de `eslint/config`). Ordem dos blocos importa:

1. **`nextVitals` (`eslint-config-next/core-web-vitals`)** + **`nextTs` (`eslint-config-next/typescript`)** — regras oficiais do Next.js para Core Web Vitals e TypeScript.
2. **`jsx-a11y`** — `eslint-config-next` já registra o plugin `jsx-a11y` internamente, então este bloco **só aplica o ruleset `recommended`** (`languageOptions` + `rules`), sem redeclarar o plugin — flat config lança erro se o mesmo plugin for declarado duas vezes. Ver o comentário no próprio arquivo.
3. **`eslint-plugin-check-file`** — impõe convenções de nomenclatura de arquivos/pastas:
   - `filename-naming-convention`: todo `.ts`/`.tsx` deve ser `KEBAB_CASE` (com `ignoreMiddleExtensions: true`, o que permite nomes como `vitest.config.mts` ou `home.spec.ts` sem quebrar a regra pelo sufixo do meio).
   - `folder-naming-convention`: pastas dentro de `src/app/**` seguem `NEXT_JS_APP_ROUTER_CASE` (a convenção de rotas do App Router, incluindo `(group)`, `[slug]`, `[...catchAll]`, etc.).
   - Regras extras: `prefer-arrow-callback` e `prefer-template` como erro.
4. **`prettier` (`eslint-config-prettier/flat`)** — **precisa vir por último**: desliga qualquer regra de estilo do ESLint que conflite com o Prettier (que é quem formata o código). O comentário no arquivo já reforça isso.
5. **`globalIgnores([...])`** — repete os ignores padrão do `eslint-config-next` (`.next/**`, `out/**`, `build/**`, `next-env.d.ts`) explicitamente, pois usar um config customizado via `defineConfig` sobrescreve os ignores implícitos do preset do Next.

Rodar:

```bash
pnpm lint
```

## Prettier

### `.prettierrc.json`

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "importOrder": ["^(react|next?/?([a-zA-Z/]*))$", "<THIRD_PARTY_MODULES>", "^@/(.*)$", "^[./]"],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true,
  "plugins": ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"]
}
```

- Estilo de código: sem ponto e vírgula, aspas simples, 2 espaços de indentação, vírgula final em toda estrutura multilinha (`trailingComma: all`).
- **`@trivago/prettier-plugin-sort-imports`** ordena os imports em 4 grupos (nessa ordem, com linha em branco entre eles graças a `importOrderSeparation`):
  1. `react` / `next` e subpaths (`next/image`, `next/navigation`, etc.);
  2. módulos de terceiros (`<THIRD_PARTY_MODULES>`);
  3. imports internos via alias `^@/(.*)$` (ou seja, `@/components/...`, `@/lib/...`);
  4. imports relativos (`^[./]`, ex. `./foo`, `../bar`).
  - `importOrderSortSpecifiers: true` também ordena os specifiers dentro de um mesmo `import { a, b, c } from '...'`.
- **A ordem dos plugins importa**: `prettier-plugin-tailwindcss` deve vir **por último** na lista (está por último aqui) porque ele reordena classes do Tailwind dentro de strings/`className`, e precisa rodar depois que a ordenação de imports já foi aplicada.

### `.prettierignore`

```
.next
node_modules
designs
```

Ignora build do Next, dependências e uma eventual pasta `designs` (ex. assets/specs de design que não são código).

Rodar:

```bash
pnpm format
```

## `.editorconfig`

```ini
root = true

[*]
indent_style = space
indent_size = 2
```

Garante indentação consistente (2 espaços) mesmo em editores sem suporte nativo ao Prettier/ESLint, para qualquer tipo de arquivo (`[*]`).

## Integração com o editor (`.vscode/settings.json`)

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always",
    "source.organizeImports": "always"
  },
  "files.associations": { "*.css": "tailwindcss" },
  "conventionalCommits.scopes": []
}
```

- `formatOnSave` + `source.fixAll.eslint` — ao salvar, o VS Code formata (Prettier, se configurado como formatter padrão) e aplica automaticamente os fixes do ESLint.
- `source.organizeImports` — organiza/remove imports não usados ao salvar (nota: a ordenação fina de imports por grupo continua sendo responsabilidade do `@trivago/prettier-plugin-sort-imports` ao rodar `pnpm format`).
- `files.associations`: trata arquivos `*.css` como `tailwindcss` para habilitar IntelliSense de diretivas como `@theme`, `@apply`, `@custom-variant` usadas em `globals.css`.

## Resumo prático

| Ferramenta | Config | Comando |
| --- | --- | --- |
| ESLint | `eslint.config.mjs` | `pnpm lint` |
| Prettier | `.prettierrc.json` / `.prettierignore` | `pnpm format` |
| EditorConfig | `.editorconfig` | automático no editor |
| VS Code | `.vscode/settings.json` | automático ao salvar (neste editor) |
