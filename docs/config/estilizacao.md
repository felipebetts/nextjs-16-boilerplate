# Estilização (Tailwind CSS v4 + shadcn/ui)

> **Regra de ouro deste projeto:** antes de escrever markup/CSS novo para um componente de UI, **reutilize o que já existe em `src/components/ui`**. Se o componente não existir ainda, **consulte o catálogo do shadcn e instale via CLI** em vez de codar o componente à mão. Detalhes na seção [Adicionando/reutilizando componentes](#adicionandoreutilizando-componentes) abaixo.

## Tailwind CSS v4

- **`postcss.config.mjs`** registra apenas o plugin `@tailwindcss/postcss` — no Tailwind v4 não existe mais `tailwind.config.js` por padrão; a configuração vive em CSS (ver abaixo). Isso também explica por que `components.json` tem `tailwind.config: ""` (vazio, de propósito).
- **`src/app/globals.css`** é o ponto central:
  - `@import 'tailwindcss'` — importa o Tailwind v4.
  - `@import "tw-animate-css"` — utilitários de animação (substituto do antigo `tailwindcss-animate` compatível com v4).
  - `@import "shadcn/tailwind.css"` — camada de estilos base que o shadcn injeta.
  - `@custom-variant dark (&:is(.dark *))` — define o dark mode como uma classe (`.dark` em um ancestral), não `prefers-color-scheme`.
  - Bloco `@theme inline { ... }` — mapeia tokens de design (`--color-primary`, `--radius-lg`, `--color-sidebar`, etc.) para variáveis CSS, permitindo usar classes como `bg-primary`, `text-muted-foreground`, `rounded-xl` etc. com base nos valores definidos em `:root`/`.dark`.
  - `:root { ... }` e `.dark { ... }` — os valores reais dos tokens, em `oklch(...)`, um por tema. Trocar o tema visual do projeto é editar essas variáveis, não trocar classes utilitárias espalhadas pelo código.
  - `@layer base` aplica `border-border`, `outline-ring/50`, `bg-background`, `text-foreground` e `font-mono` globalmente — a fonte base do projeto é mono (`--font-mono` / `font-heading` também disponível para títulos).

## Configuração do shadcn (`components.json`)

Esse arquivo é o que a **CLI do shadcn** lê para saber como/onde gerar código neste projeto:

```json
{
  "style": "base-nova",
  "rsc": true,
  "tailwind": { "css": "src/app/globals.css", "baseColor": "zinc", "cssVariables": true },
  "iconLibrary": "remixicon",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

- **`style: "base-nova"`** — o preset visual do shadcn usado (baseado em `@base-ui/react`, não em Radix — por isso a dependência `@base-ui/react` no `package.json` em vez de `@radix-ui/*`).
- **`rsc: true`** — os componentes gerados assumem React Server Components (App Router).
- **`iconLibrary: "remixicon"`** — a biblioteca de ícones oficial deste setup é o `@remixicon/react`. Mesmo com `lucide-react` também instalado (resquício do `create-next-app`), **prefira ícones do Remix Icon** em componentes novos para manter consistência com o que a CLI do shadcn vai gerar.
- **`aliases`** — batem com os paths do `tsconfig.json` (`@/*` → `src/*`): `@/components/ui` para componentes de UI, `@/lib/utils` para o util `cn`, etc. A CLI usa esses aliases para saber onde colocar cada arquivo gerado — não mova `src/components/ui` ou `src/lib` sem atualizar este arquivo também.
- **`baseColor: "zinc"`** + `cssVariables: true` — a paleta neutra de base e o uso de variáveis CSS (em vez de classes utilitárias hard-coded) para os tokens de cor.

## `cn` (merge de classes)

`src/lib/utils.ts` apenas reexporta o util `cn` do pacote `cn` (`export { cn } from "cn"`) — é o helper padrão do shadcn para mesclar classes do Tailwind com `class-variance-authority` (resolve conflitos de classes, ex. duas classes de `padding` diferentes).

## Anatomia de um componente shadcn já instalado

`src/components/ui/button.tsx` é o único componente de UI já presente e serve de referência para o padrão esperado:

- Usa o primitivo do **base-ui** (`@base-ui/react/button`) como base acessível/headless.
- Usa **`cva`** (`class-variance-authority`) para declarar `variant` (`default`, `outline`, `secondary`, `ghost`, `destructive`, `link`) e `size` (`default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`) como variantes tipadas.
- Usa `cn(...)` para combinar as classes calculadas pelo `cva` com um `className` externo.
- Expõe `data-slot="button"` — convenção do shadcn para permitir estilização/seleção via `[data-slot=...]` em componentes compostos.
- Exporta tanto o componente quanto `buttonVariants`, permitindo aplicar o mesmo estilo em elementos que não são o `<Button>` (ex. um `<Link>` estilizado como botão).

Qualquer componente novo gerado pela CLI vai seguir essa mesma estrutura (primitivo do base-ui + `cva` + `cn` + `data-slot`).

## Adicionando/reutilizando componentes

Fluxo recomendado ao precisar de UI nova:

1. **Procure primeiro em `src/components/ui`** — se o componente (ou algo próximo) já existe, reutilize/estenda em vez de recriar.
2. **Se não existir, consulte o catálogo do shadcn** (`https://ui.shadcn.com`, style `base-nova`) para ver se o componente já é oferecido antes de escrevê-lo do zero.
3. **Instale via CLI**, nunca copiando/colando manualmente:

   ```bash
   pnpm dlx shadcn@latest add <componente>
   ```

   Exemplo:

   ```bash
   pnpm dlx shadcn@latest add dialog
   ```

   A CLI lê `components.json`, instala as dependências necessárias e gera o arquivo já em `src/components/ui`, seguindo os `aliases` configurados — mantendo o mesmo padrão do `button.tsx` (base-ui + `cva` + `cn`).

   Rodar `pnpm dlx shadcn@latest add` sem argumento lista todos os componentes disponíveis no registry.

4. Só depois de confirmar que o componente não existe no registry do shadcn é que faz sentido implementá-lo manualmente — e, mesmo assim, seguindo a mesma anatomia descrita acima (primitivo headless + `cva` + `cn` + `data-slot`) para manter consistência com o restante do design system.
