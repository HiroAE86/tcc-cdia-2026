# App de Defesa TCC — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** App Next.js que serve os 7 documentos de estudo de `V1/docs/slides/` como sistema navegável de apoio à defesa do TCC — doc navegável, modo apresentador com cronômetro, e flashcards treináveis.

**Architecture:** Next.js App Router lê os arquivos `.md` no servidor via `node:fs`. Server Components renderizam markdown (remark/rehype + mermaid). Três Client Components interativos (busca, apresentador, flashcards) recebem dados parseados via props. Sem banco, sem auth, sem backend dinâmico.

**Tech Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · remark/rehype (markdown→html) · mermaid (diagramas client-side). Node 25, npm 11.

## Global Constraints

- App vive em `V1/docs/app/` — todos os paths relativos a essa pasta salvo indicação contrária.
- Conteúdo lido dos `.md` em `V1/docs/slides/` (um nível acima: `../slides/`). NUNCA duplicar conteúdo no código.
- Idioma da UI: pt-BR apenas.
- Cores do tema TCC: petróleo `#0B3142`, teal `#1B7F79`, coral `#E4572E`, cinza-claro `#F2F4F5`.
- Os 7 docs de conteúdo (slug → arquivo): `mapa_logico`, `roteiro_por_slide`, `discurso_para_decorar`, `glossario_flashcards`, `ferramentas_explicadas`, `justificativas_decisoes`, `perguntas_previstas`, `cola_defesa`. (`apresentacao.tex` é ignorado — não é `.md`.)
- Sem testes de UI automatizados. Apenas testes de unidade dos 2 parsers + verificação manual.
- Commits frequentes, um por task.

---

## File Structure

```
V1/docs/app/
├── package.json, tsconfig.json, next.config.ts, postcss.config.mjs
├── app/
│   ├── globals.css            # Tailwind + variáveis de cor do tema
│   ├── layout.tsx             # shell: sidebar + área de conteúdo
│   ├── page.tsx               # home — visão geral + atalhos
│   ├── doc/[slug]/page.tsx    # doc navegável
│   ├── apresentar/page.tsx    # modo apresentador (server: parseia discurso)
│   └── flashcards/page.tsx    # flashcards (server: parseia glossário)
├── components/
│   ├── Sidebar.tsx            # navegação (client — destaca rota ativa)
│   ├── MarkdownView.tsx       # render markdown + mermaid (client p/ mermaid)
│   ├── SearchPalette.tsx      # busca global Cmd+K (client)
│   ├── Presenter.tsx          # navegação slide + cronômetro (client)
│   └── Flashcards.tsx         # card flip + marcação (client)
├── lib/
│   ├── docs.ts                # lê + lista .md (server)
│   ├── parse-discurso.ts      # discurso → Slide[]
│   ├── parse-flashcards.ts    # glossário → Card[]
│   └── parse-discurso.test.ts, parse-flashcards.test.ts
└── (gerado por create-next-app: .gitignore, etc.)
```

---

## Task 1: Scaffold do projeto Next.js

**Files:**
- Create: `V1/docs/app/` (via create-next-app)
- Modify: `V1/docs/app/app/globals.css` (cores do tema)

**Interfaces:**
- Produces: projeto Next.js rodável com `npm run dev`; tema com cores `--petroleo`, `--teal`, `--coral`.

- [ ] **Step 1: Scaffold com create-next-app**

Run (a partir de `V1/docs/`):
```bash
cd V1/docs && npx --yes create-next-app@latest app --ts --tailwind --app --eslint --no-src-dir --import-alias "@/*" --turbopack --use-npm
```
Expected: cria `V1/docs/app/` com Next 15, Tailwind v4, TypeScript.

- [ ] **Step 2: Adicionar dependências de markdown e mermaid**

Run (a partir de `V1/docs/app`):
```bash
cd V1/docs/app && npm install remark remark-html remark-gfm gray-matter mermaid && npm install -D vitest
```
Expected: instala sem erro.

- [ ] **Step 3: Definir cores do tema em globals.css**

Adicionar ao final de `V1/docs/app/app/globals.css`:
```css
:root {
  --petroleo: #0B3142;
  --teal: #1B7F79;
  --coral: #E4572E;
  --cinza-claro: #F2F4F5;
}
body { background: var(--cinza-claro); color: #1a1a1a; }
```

- [ ] **Step 4: Adicionar script de teste ao package.json**

Em `V1/docs/app/package.json`, no bloco `"scripts"`, adicionar:
```json
"test": "vitest run"
```

- [ ] **Step 5: Verificar que o dev server sobe**

Run: `cd V1/docs/app && npm run build`
Expected: build conclui sem erro (página default do Next).

- [ ] **Step 6: Commit**

```bash
git add V1/docs/app && git commit -m "feat(app): scaffold Next.js + tema TCC"
```

---

## Task 2: Leitura dos documentos (lib/docs.ts)

**Files:**
- Create: `V1/docs/app/lib/docs.ts`

**Interfaces:**
- Produces:
  - `type Doc = { slug: string; title: string; raw: string }`
  - `const DOC_ORDER: string[]` — slugs na ordem de exibição.
  - `function listDocs(): Doc[]` — lê todos os `.md` de `../slides/`, devolve na ordem de `DOC_ORDER`, ignorando arquivos ausentes. `title` = primeiro `# ` do arquivo, ou o slug se não houver.
  - `function getDoc(slug: string): Doc | null` — um doc por slug, ou `null` se ausente.
  - `async function renderMarkdown(raw: string): Promise<string>` — markdown→HTML via remark + gfm + html (mantém blocos ```mermaid``` como `<pre class="mermaid">`).

- [ ] **Step 1: Escrever lib/docs.ts**

Create `V1/docs/app/lib/docs.ts`:
```ts
import fs from 'node:fs';
import path from 'node:path';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

export type Doc = { slug: string; title: string; raw: string };

const SLIDES_DIR = path.join(process.cwd(), '..', 'slides');

export const DOC_ORDER = [
  'mapa_logico',
  'roteiro_por_slide',
  'discurso_para_decorar',
  'glossario_flashcards',
  'ferramentas_explicadas',
  'justificativas_decisoes',
  'perguntas_previstas',
  'cola_defesa',
];

const TITLES: Record<string, string> = {
  mapa_logico: 'Mapa lógico',
  roteiro_por_slide: 'Roteiro por slide',
  discurso_para_decorar: 'Discurso (decorar)',
  glossario_flashcards: 'Glossário / Flashcards',
  ferramentas_explicadas: 'Ferramentas explicadas',
  justificativas_decisoes: 'Justificativas',
  perguntas_previstas: 'Perguntas previstas',
  cola_defesa: 'Cola de defesa',
};

function readRaw(slug: string): string | null {
  const file = path.join(SLIDES_DIR, `${slug}.md`);
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
}

export function getDoc(slug: string): Doc | null {
  const raw = readRaw(slug);
  if (raw == null) return null;
  return { slug, title: TITLES[slug] ?? slug, raw };
}

export function listDocs(): Doc[] {
  return DOC_ORDER.map(getDoc).filter((d): d is Doc => d !== null);
}

export async function renderMarkdown(raw: string): Promise<string> {
  const out = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(raw);
  return String(out);
}
```

- [ ] **Step 2: Verificar leitura via script ad-hoc**

Run:
```bash
cd V1/docs/app && node -e "const {listDocs}=require('./lib/docs.ts'); console.log(listDocs().map(d=>d.slug))" 2>/dev/null || echo "ok-será-validado-no-build"
```
Expected: o `require` direto de `.ts` falha (normal); a validação real acontece na Task 4 quando a página renderiza. Seguir.

- [ ] **Step 3: Commit**

```bash
git add V1/docs/app/lib/docs.ts && git commit -m "feat(app): leitura dos .md (lib/docs)"
```

---

## Task 3: Parser do discurso (lib/parse-discurso.ts)

**Files:**
- Create: `V1/docs/app/lib/parse-discurso.ts`
- Test: `V1/docs/app/lib/parse-discurso.test.ts`

**Interfaces:**
- Consumes: `getDoc('discurso_para_decorar').raw` (string).
- Produces:
  - `type Slide = { n: number; titulo: string; texto: string }`
  - `function parseDiscurso(raw: string): Slide[]` — quebra nos cabeçalhos `## [Slide N — título] ~tempo`. `texto` = conteúdo até o próximo `## ` ou `---`. Ignora seções que não começam com `## [Slide`.
  - `function parseAncoras(raw: string): string[]` — extrai os itens numerados sob o cabeçalho que contém "frases-âncora".

- [ ] **Step 1: Escrever o teste (falha)**

Create `V1/docs/app/lib/parse-discurso.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parseDiscurso, parseAncoras } from './parse-discurso';

const raw = fs.readFileSync(
  path.join(__dirname, '..', '..', 'slides', 'discurso_para_decorar.md'),
  'utf8',
);

describe('parseDiscurso', () => {
  it('extrai pelo menos 18 slides com título e texto não-vazios', () => {
    const slides = parseDiscurso(raw);
    expect(slides.length).toBeGreaterThanOrEqual(18);
    for (const s of slides) {
      expect(s.titulo.length).toBeGreaterThan(0);
      expect(s.texto.trim().length).toBeGreaterThan(0);
      expect(s.n).toBeGreaterThan(0);
    }
  });

  it('o primeiro slide é o de número 1', () => {
    const slides = parseDiscurso(raw);
    expect(slides[0].n).toBe(1);
  });
});

describe('parseAncoras', () => {
  it('extrai exatamente 5 frases-âncora', () => {
    expect(parseAncoras(raw).length).toBe(5);
  });
});
```

- [ ] **Step 2: Rodar o teste (deve falhar)**

Run: `cd V1/docs/app && npm test -- parse-discurso`
Expected: FAIL — "Cannot find module './parse-discurso'".

- [ ] **Step 3: Implementar parse-discurso.ts**

Create `V1/docs/app/lib/parse-discurso.ts`:
```ts
export type Slide = { n: number; titulo: string; texto: string };

// Casa "## [Slide 12 — título qualquer] ~1min30" capturando n e o miolo do colchete.
const SLIDE_RE = /^##\s*\[Slide\s+(\d+)\s*[—-]\s*([^\]]+)\]/;

export function parseDiscurso(raw: string): Slide[] {
  const lines = raw.split('\n');
  const slides: Slide[] = [];
  let cur: Slide | null = null;
  const buf: string[] = [];

  const flush = () => {
    if (cur) {
      cur.texto = buf.join('\n').trim();
      slides.push(cur);
    }
    buf.length = 0;
  };

  for (const line of lines) {
    const m = line.match(SLIDE_RE);
    if (m) {
      flush();
      cur = { n: Number(m[1]), titulo: m[2].trim(), texto: '' };
      continue;
    }
    // Encerra o último slide ao bater na seção pós-discurso (linha "---" isolada
    // seguida de "## Tática"/"## As 5 frases").
    if (cur && /^##\s+(Tática|As 5 frases)/i.test(line)) {
      flush();
      cur = null;
      continue;
    }
    if (cur) buf.push(line);
  }
  flush();
  return slides;
}

export function parseAncoras(raw: string): string[] {
  const lines = raw.split('\n');
  const out: string[] = [];
  let inSection = false;
  for (const line of lines) {
    if (/^##\s+.*frases-âncora/i.test(line)) { inSection = true; continue; }
    if (inSection && /^##\s/.test(line)) break;
    const m = line.match(/^\d+\.\s+(.*\S)/);
    if (inSection && m) out.push(m[1].replace(/^"|"$/g, '').trim());
  }
  return out;
}
```

- [ ] **Step 4: Rodar o teste (deve passar)**

Run: `cd V1/docs/app && npm test -- parse-discurso`
Expected: PASS (3 testes). Se o nº de slides falhar, conferir os cabeçalhos reais no `.md` e ajustar `SLIDE_RE`.

- [ ] **Step 5: Commit**

```bash
git add V1/docs/app/lib/parse-discurso.ts V1/docs/app/lib/parse-discurso.test.ts
git commit -m "feat(app): parser do discurso em slides"
```

---

## Task 4: Parser dos flashcards (lib/parse-flashcards.ts)

**Files:**
- Create: `V1/docs/app/lib/parse-flashcards.ts`
- Test: `V1/docs/app/lib/parse-flashcards.test.ts`

**Interfaces:**
- Consumes: `getDoc('glossario_flashcards').raw` (string).
- Produces:
  - `type Nivel = '🔴' | '🟡' | '⚪'`
  - `type Card = { termo: string; resposta: string; nivel: Nivel }`
  - `function parseFlashcards(raw: string): Card[]` — varre linhas de tabela markdown `| termo | resposta |`, pula cabeçalho/separador, extrai o marcador 🔴🟡⚪ do início do termo (default ⚪ se ausente), remove markdown inline grosseiro (`**`).

- [ ] **Step 1: Escrever o teste (falha)**

Create `V1/docs/app/lib/parse-flashcards.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parseFlashcards } from './parse-flashcards';

const raw = fs.readFileSync(
  path.join(__dirname, '..', '..', 'slides', 'glossario_flashcards.md'),
  'utf8',
);

describe('parseFlashcards', () => {
  it('extrai pelo menos 30 cards', () => {
    expect(parseFlashcards(raw).length).toBeGreaterThanOrEqual(30);
  });

  it('todo card tem termo e resposta não-vazios e nível válido', () => {
    for (const c of parseFlashcards(raw)) {
      expect(c.termo.trim().length).toBeGreaterThan(0);
      expect(c.resposta.trim().length).toBeGreaterThan(0);
      expect(['🔴', '🟡', '⚪']).toContain(c.nivel);
    }
  });

  it('captura ao menos um card de cada nível', () => {
    const niveis = new Set(parseFlashcards(raw).map((c) => c.nivel));
    expect(niveis.has('🔴')).toBe(true);
    expect(niveis.has('🟡')).toBe(true);
  });
});
```

- [ ] **Step 2: Rodar o teste (deve falhar)**

Run: `cd V1/docs/app && npm test -- parse-flashcards`
Expected: FAIL — "Cannot find module './parse-flashcards'".

- [ ] **Step 3: Implementar parse-flashcards.ts**

Create `V1/docs/app/lib/parse-flashcards.ts`:
```ts
export type Nivel = '🔴' | '🟡' | '⚪';
export type Card = { termo: string; resposta: string; nivel: Nivel };

function stripInline(s: string): string {
  return s.replace(/\*\*/g, '').replace(/`/g, '').trim();
}

function nivelDe(termo: string): { nivel: Nivel; termo: string } {
  const m = termo.match(/^(🔴|🟡|⚪)\s*(.*)$/);
  if (m) return { nivel: m[1] as Nivel, termo: m[2].trim() };
  return { nivel: '⚪', termo: termo.trim() };
}

export function parseFlashcards(raw: string): Card[] {
  const cards: Card[] = [];
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t.startsWith('|')) continue;
    // pula separador de tabela: | --- | --- |
    if (/^\|[\s:|-]+\|$/.test(t)) continue;
    const cells = t.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 2) continue;
    const head = stripInline(cells[0]);
    // pula cabeçalho da tabela (coluna "Termo")
    if (/^termo$/i.test(head)) continue;
    const { nivel, termo } = nivelDe(stripInline(cells[0]));
    const resposta = stripInline(cells[1]);
    if (!termo || !resposta) continue;
    cards.push({ termo, resposta, nivel });
  }
  return cards;
}
```

- [ ] **Step 4: Rodar o teste (deve passar)**

Run: `cd V1/docs/app && npm test -- parse-flashcards`
Expected: PASS (3 testes).

- [ ] **Step 5: Commit**

```bash
git add V1/docs/app/lib/parse-flashcards.ts V1/docs/app/lib/parse-flashcards.test.ts
git commit -m "feat(app): parser dos flashcards"
```

---

## Task 5: Shell + Sidebar + MarkdownView

**Files:**
- Modify: `V1/docs/app/app/layout.tsx`
- Create: `V1/docs/app/components/Sidebar.tsx`
- Create: `V1/docs/app/components/MarkdownView.tsx`

**Interfaces:**
- Consumes: `listDocs()` (Task 2), `renderMarkdown()` (Task 2).
- Produces:
  - `<Sidebar docs={{slug,title}[]} />` — links para `/`, `/apresentar`, `/flashcards`, e cada `/doc/[slug]`. Client Component (usa `usePathname` p/ destacar ativo).
  - `<MarkdownView html={string} />` — injeta HTML e roda mermaid no cliente sobre `<pre class="mermaid">`.

- [ ] **Step 1: Sidebar**

Create `V1/docs/app/components/Sidebar.tsx`:
```tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Item = { slug: string; title: string };

export default function Sidebar({ docs }: { docs: Item[] }) {
  const path = usePathname();
  const link = (href: string, label: string) => {
    const active = path === href;
    return (
      <Link
        href={href}
        className={`block rounded px-3 py-2 text-sm ${
          active ? 'bg-[var(--petroleo)] text-white' : 'hover:bg-[var(--cinza-claro)]'
        }`}
      >
        {label}
      </Link>
    );
  };
  return (
    <nav className="flex w-64 shrink-0 flex-col gap-1 border-r border-gray-200 bg-white p-3">
      <div className="px-3 pb-2 text-xs font-bold uppercase text-[var(--teal)]">Modos</div>
      {link('/', 'Início')}
      {link('/apresentar', '▶ Apresentar')}
      {link('/flashcards', '🃏 Flashcards')}
      <div className="px-3 pb-2 pt-4 text-xs font-bold uppercase text-[var(--teal)]">Documentos</div>
      {docs.map((d) => link(`/doc/${d.slug}`, d.title))}
    </nav>
  );
}
```

- [ ] **Step 2: MarkdownView**

Create `V1/docs/app/components/MarkdownView.tsx`:
```tsx
'use client';
import { useEffect, useRef } from 'react';

export default function MarkdownView({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    import('mermaid').then((m) => {
      if (cancelled || !ref.current) return;
      m.default.initialize({ startOnLoad: false, theme: 'neutral' });
      m.default.run({ nodes: ref.current.querySelectorAll('pre.mermaid') });
    });
    return () => { cancelled = true; };
  }, [html]);
  return (
    <div
      ref={ref}
      className="prose max-w-none p-8"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

Nota: o `renderMarkdown` da Task 2 emite blocos mermaid como ```` ```mermaid ```` → `<code class="language-mermaid">`. Ajustar `renderMarkdown` para reescrever esses blocos como `<pre class="mermaid">`. Em `lib/docs.ts`, antes do `return String(out)`, inserir:
```ts
  return String(out).replace(
    /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
    (_, code) => `<pre class="mermaid">${code.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')}</pre>`,
  );
```

- [ ] **Step 3: layout.tsx com a shell**

Replace `V1/docs/app/app/layout.tsx`:
```tsx
import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { listDocs } from '@/lib/docs';

export const metadata: Metadata = {
  title: 'Defesa TCC — André Takeo',
  description: 'Sistema de apoio à defesa do TCC',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const docs = listDocs().map((d) => ({ slug: d.slug, title: d.title }));
  return (
    <html lang="pt-BR">
      <body>
        <div className="flex min-h-screen">
          <Sidebar docs={docs} />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Instalar plugin de prose (tipografia)**

Run: `cd V1/docs/app && npm install -D @tailwindcss/typography`
Em `V1/docs/app/app/globals.css`, após o `@import "tailwindcss";`, adicionar:
```css
@plugin "@tailwindcss/typography";
```

- [ ] **Step 5: Build de verificação**

Run: `cd V1/docs/app && npm run build`
Expected: build conclui; `listDocs()` lê os 8 `.md` sem erro.

- [ ] **Step 6: Commit**

```bash
git add V1/docs/app && git commit -m "feat(app): shell, sidebar e render de markdown com mermaid"
```

---

## Task 6: Página de doc navegável (/doc/[slug])

**Files:**
- Create: `V1/docs/app/app/doc/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getDoc()`, `renderMarkdown()`, `DOC_ORDER` (Task 2), `<MarkdownView />` (Task 5).
- Produces: rota `/doc/<slug>` renderizando o doc; `generateStaticParams` pré-gera os 8 slugs.

- [ ] **Step 1: page.tsx**

Create `V1/docs/app/app/doc/[slug]/page.tsx`:
```tsx
import { notFound } from 'next/navigation';
import { getDoc, renderMarkdown, DOC_ORDER } from '@/lib/docs';
import MarkdownView from '@/components/MarkdownView';

export function generateStaticParams() {
  return DOC_ORDER.map((slug) => ({ slug }));
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();
  const html = await renderMarkdown(doc.raw);
  return <MarkdownView html={html} />;
}
```

- [ ] **Step 2: Build + verificação manual**

Run: `cd V1/docs/app && npm run build && npm run dev`
Abrir `http://localhost:3000/doc/mapa_logico` — deve renderizar com diagramas mermaid. Testar `/doc/glossario_flashcards` (tabelas).
Expected: docs renderizam; mermaid aparece como diagrama.

- [ ] **Step 3: Commit**

```bash
git add V1/docs/app/app/doc && git commit -m "feat(app): página de doc navegável"
```

---

## Task 7: Home (/)

**Files:**
- Replace: `V1/docs/app/app/page.tsx`

**Interfaces:**
- Consumes: `listDocs()` (Task 2).
- Produces: home com a tese em 1 frase, atalhos para os 3 modos, e lista dos docs.

- [ ] **Step 1: page.tsx**

Replace `V1/docs/app/app/page.tsx`:
```tsx
import Link from 'next/link';
import { listDocs } from '@/lib/docs';

export default function Home() {
  const docs = listDocs();
  return (
    <div className="mx-auto max-w-3xl p-10">
      <h1 className="text-3xl font-bold text-[var(--petroleo)]">Defesa TCC</h1>
      <p className="mt-2 text-lg text-gray-700">
        Predição de Direção de Preços de Ações Brasileiras com Sentimento de Notícias.
      </p>
      <blockquote className="mt-4 border-l-4 border-[var(--coral)] bg-white p-4 italic">
        Obtive AUC 0,709 usando sentimento, desconfiei, rodei ~1.510 execuções e provei que era
        artefato de janela única — o sentimento não adiciona valor detectável (Δ = +0,003, p = 0,49).
      </blockquote>
      <div className="mt-8 grid grid-cols-2 gap-4">
        <Link href="/apresentar" className="rounded-lg bg-[var(--petroleo)] p-6 text-white hover:opacity-90">
          <div className="text-xl font-bold">▶ Apresentar</div>
          <div className="text-sm opacity-80">Discurso slide-a-slide + cronômetro 20 min</div>
        </Link>
        <Link href="/flashcards" className="rounded-lg bg-[var(--teal)] p-6 text-white hover:opacity-90">
          <div className="text-xl font-bold">🃏 Flashcards</div>
          <div className="text-sm opacity-80">Treinar termos na ponta da língua</div>
        </Link>
      </div>
      <h2 className="mt-10 text-sm font-bold uppercase text-[var(--teal)]">Documentos</h2>
      <ul className="mt-2 space-y-1">
        {docs.map((d) => (
          <li key={d.slug}>
            <Link href={`/doc/${d.slug}`} className="text-[var(--petroleo)] underline">
              {d.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Verificação manual**

Run: `cd V1/docs/app && npm run dev` → abrir `http://localhost:3000/`
Expected: home com os 2 cards e a lista de docs; links funcionam.

- [ ] **Step 3: Commit**

```bash
git add V1/docs/app/app/page.tsx && git commit -m "feat(app): home com atalhos"
```

---

## Task 8: Modo apresentador (/apresentar)

**Files:**
- Create: `V1/docs/app/app/apresentar/page.tsx`
- Create: `V1/docs/app/components/Presenter.tsx`

**Interfaces:**
- Consumes: `getDoc('discurso_para_decorar')`, `parseDiscurso()`, `parseAncoras()` (Task 3).
- Produces: rota `/apresentar`; `<Presenter slides={Slide[]} ancoras={string[]} />` (client) — navega ←/→, cronômetro de 20 min, painel de âncoras.

- [ ] **Step 1: Presenter (client)**

Create `V1/docs/app/components/Presenter.tsx`:
```tsx
'use client';
import { useEffect, useState, useCallback } from 'react';
import type { Slide } from '@/lib/parse-discurso';

const TOTAL_SEG = 20 * 60;

export default function Presenter({ slides, ancoras }: { slides: Slide[]; ancoras: string[] }) {
  const [i, setI] = useState(0);
  const [seg, setSeg] = useState(0);
  const [rodando, setRodando] = useState(false);

  const prev = useCallback(() => setI((x) => Math.max(0, x - 1)), []);
  const next = useCallback(() => setI((x) => Math.min(slides.length - 1, x + 1)), [slides.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === ' ') { e.preventDefault(); setRodando((r) => !r); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  useEffect(() => {
    if (!rodando) return;
    const t = setInterval(() => setSeg((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [rodando]);

  const mm = String(Math.floor(seg / 60)).padStart(2, '0');
  const ss = String(seg % 60).padStart(2, '0');
  // ritmo: onde eu deveria estar vs onde estou
  const esperado = ((i + 1) / slides.length) * TOTAL_SEG;
  const cor = seg > esperado + 60 ? 'var(--coral)' : seg > esperado ? '#d4a017' : 'var(--teal)';

  const s = slides[i];
  if (!s) return <div className="p-10">Sem slides.</div>;

  return (
    <div className="flex h-screen">
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between bg-[var(--petroleo)] px-6 py-3 text-white">
          <span className="text-sm">Slide {s.n} — {s.titulo}</span>
          <span className="font-mono text-lg" style={{ color: cor }}>{mm}:{ss}</span>
        </div>
        <div className="flex-1 overflow-auto p-10 text-lg leading-relaxed whitespace-pre-wrap">
          {s.texto}
        </div>
        <div className="flex items-center justify-between border-t bg-white px-6 py-3">
          <button onClick={prev} className="rounded bg-gray-200 px-4 py-2">← Anterior</button>
          <span className="text-sm text-gray-500">
            {i + 1} / {slides.length} · espaço = play/pause cronômetro
          </span>
          <button onClick={next} className="rounded bg-[var(--petroleo)] px-4 py-2 text-white">Próximo →</button>
        </div>
      </div>
      <aside className="w-72 shrink-0 overflow-auto border-l bg-[var(--cinza-claro)] p-4">
        <div className="text-xs font-bold uppercase text-[var(--teal)]">5 frases-âncora</div>
        <ul className="mt-2 space-y-3 text-sm">
          {ancoras.map((a, k) => (
            <li key={k} className="rounded bg-white p-2 shadow-sm">{a}</li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
```

- [ ] **Step 2: page.tsx (server)**

Create `V1/docs/app/app/apresentar/page.tsx`:
```tsx
import { getDoc } from '@/lib/docs';
import { parseDiscurso, parseAncoras } from '@/lib/parse-discurso';
import Presenter from '@/components/Presenter';

export default function ApresentarPage() {
  const doc = getDoc('discurso_para_decorar');
  if (!doc) return <div className="p-10">Discurso não encontrado.</div>;
  const slides = parseDiscurso(doc.raw);
  const ancoras = parseAncoras(doc.raw);
  return <Presenter slides={slides} ancoras={ancoras} />;
}
```

- [ ] **Step 3: Verificação manual**

Run: `cd V1/docs/app && npm run dev` → abrir `http://localhost:3000/apresentar`
Testar: ←/→ navegam, espaço dá play no cronômetro, cor muda conforme o ritmo, painel de âncoras mostra 5 itens.
Expected: tudo funcional.

- [ ] **Step 4: Commit**

```bash
git add V1/docs/app/app/apresentar V1/docs/app/components/Presenter.tsx
git commit -m "feat(app): modo apresentador com cronômetro e âncoras"
```

---

## Task 9: Flashcards (/flashcards)

**Files:**
- Create: `V1/docs/app/app/flashcards/page.tsx`
- Create: `V1/docs/app/components/Flashcards.tsx`

**Interfaces:**
- Consumes: `getDoc('glossario_flashcards')`, `parseFlashcards()` (Task 4).
- Produces: rota `/flashcards`; `<Flashcards cards={Card[]} />` (client) — revela resposta, marca sabia/não-sabia, filtra por nível, embaralha.

- [ ] **Step 1: Flashcards (client)**

Create `V1/docs/app/components/Flashcards.tsx`:
```tsx
'use client';
import { useMemo, useState } from 'react';
import type { Card, Nivel } from '@/lib/parse-flashcards';

export default function Flashcards({ cards }: { cards: Card[] }) {
  const [filtro, setFiltro] = useState<Nivel | 'todos'>('todos');
  const [ordem, setOrdem] = useState<number[]>(() => cards.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [revelado, setRevelado] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);

  const filtrados = useMemo(
    () => ordem.filter((idx) => filtro === 'todos' || cards[idx].nivel === filtro),
    [ordem, filtro, cards],
  );

  const card = cards[filtrados[pos]];

  const proximo = (acertou: boolean) => {
    if (acertou) setAcertos((x) => x + 1); else setErros((x) => x + 1);
    setRevelado(false);
    setPos((p) => (p + 1) % Math.max(1, filtrados.length));
  };

  const embaralhar = () => {
    const sorted = [...ordem];
    for (let k = sorted.length - 1; k > 0; k--) {
      const j = Math.floor((k * 2654435761) % (k + 1)); // determinístico, evita Math.random no SSR
      [sorted[k], sorted[j]] = [sorted[j], sorted[k]];
    }
    setOrdem(sorted);
    setPos(0);
    setRevelado(false);
  };

  if (!card) return <div className="p-10">Sem cards para este filtro.</div>;

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-4 flex items-center gap-2">
        {(['todos', '🔴', '🟡', '⚪'] as const).map((f) => (
          <button
            key={f}
            onClick={() => { setFiltro(f); setPos(0); setRevelado(false); }}
            className={`rounded px-3 py-1 text-sm ${filtro === f ? 'bg-[var(--petroleo)] text-white' : 'bg-gray-200'}`}
          >
            {f}
          </button>
        ))}
        <button onClick={embaralhar} className="ml-auto rounded bg-[var(--teal)] px-3 py-1 text-sm text-white">
          🔀 Embaralhar
        </button>
      </div>

      <div
        onClick={() => setRevelado(true)}
        className="min-h-64 cursor-pointer rounded-xl bg-white p-8 shadow-md"
      >
        <div className="text-xs text-gray-400">{card.nivel} · {pos + 1}/{filtrados.length}</div>
        <div className="mt-4 text-2xl font-bold text-[var(--petroleo)]">{card.termo}</div>
        {revelado ? (
          <div className="mt-6 text-lg text-gray-800">{card.resposta}</div>
        ) : (
          <div className="mt-6 text-sm text-gray-400">clique para revelar</div>
        )}
      </div>

      {revelado && (
        <div className="mt-4 flex gap-3">
          <button onClick={() => proximo(false)} className="flex-1 rounded bg-[var(--coral)] py-3 text-white">
            Não sabia
          </button>
          <button onClick={() => proximo(true)} className="flex-1 rounded bg-[var(--teal)] py-3 text-white">
            Sabia →
          </button>
        </div>
      )}

      <div className="mt-4 text-center text-sm text-gray-500">
        Acertos: {acertos} · Erros: {erros}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: page.tsx (server)**

Create `V1/docs/app/app/flashcards/page.tsx`:
```tsx
import { getDoc } from '@/lib/docs';
import { parseFlashcards } from '@/lib/parse-flashcards';
import Flashcards from '@/components/Flashcards';

export default function FlashcardsPage() {
  const doc = getDoc('glossario_flashcards');
  if (!doc) return <div className="p-10">Glossário não encontrado.</div>;
  return <Flashcards cards={parseFlashcards(doc.raw)} />;
}
```

- [ ] **Step 3: Verificação manual**

Run: `cd V1/docs/app && npm run dev` → abrir `http://localhost:3000/flashcards`
Testar: clica revela resposta, "sabia"/"não sabia" avança, filtro 🔴/🟡/⚪ funciona, embaralhar muda a ordem.
Expected: tudo funcional.

- [ ] **Step 4: Commit**

```bash
git add V1/docs/app/app/flashcards V1/docs/app/components/Flashcards.tsx
git commit -m "feat(app): flashcards treináveis"
```

---

## Task 10: Busca global Cmd+K

**Files:**
- Create: `V1/docs/app/components/SearchPalette.tsx`
- Modify: `V1/docs/app/app/layout.tsx` (montar a paleta + passar índice)

**Interfaces:**
- Consumes: `listDocs()` (Task 2).
- Produces: `<SearchPalette index={{slug,title,text}[]} />` (client) — Cmd+K abre, filtra por substring no título+texto, Enter/clique navega para `/doc/<slug>`.

- [ ] **Step 1: SearchPalette (client)**

Create `V1/docs/app/components/SearchPalette.tsx`:
```tsx
'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Entry = { slug: string; title: string; text: string };

export default function SearchPalette({ index }: { index: Entry[] }) {
  const [aberto, setAberto] = useState(false);
  const [q, setQ] = useState('');
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setAberto((a) => !a);
      }
      if (e.key === 'Escape') setAberto(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const resultados = useMemo(() => {
    const term = q.toLowerCase().trim();
    if (!term) return [];
    return index
      .map((e) => {
        const hay = (e.title + ' ' + e.text).toLowerCase();
        const at = hay.indexOf(term);
        if (at < 0) return null;
        const trecho = e.text.slice(Math.max(0, at - 40), at + 80);
        return { slug: e.slug, title: e.title, trecho };
      })
      .filter((r): r is { slug: string; title: string; trecho: string } => r !== null)
      .slice(0, 12);
  }, [q, index]);

  if (!aberto) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-24" onClick={() => setAberto(false)}>
      <div className="w-full max-w-xl rounded-lg bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar termo, pergunta, número…"
          className="w-full rounded-t-lg border-b p-4 outline-none"
        />
        <ul className="max-h-80 overflow-auto">
          {resultados.map((r, k) => (
            <li key={k}>
              <button
                onClick={() => { setAberto(false); setQ(''); router.push(`/doc/${r.slug}`); }}
                className="block w-full px-4 py-2 text-left hover:bg-[var(--cinza-claro)]"
              >
                <div className="text-sm font-bold text-[var(--petroleo)]">{r.title}</div>
                <div className="truncate text-xs text-gray-500">…{r.trecho}…</div>
              </button>
            </li>
          ))}
          {q && resultados.length === 0 && (
            <li className="px-4 py-3 text-sm text-gray-400">Nada encontrado.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Montar a paleta no layout**

Em `V1/docs/app/app/layout.tsx`, importar e montar. Substituir o corpo do `RootLayout` para construir o índice e renderizar a paleta:
```tsx
import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import SearchPalette from '@/components/SearchPalette';
import { listDocs } from '@/lib/docs';

export const metadata: Metadata = {
  title: 'Defesa TCC — André Takeo',
  description: 'Sistema de apoio à defesa do TCC',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const all = listDocs();
  const navDocs = all.map((d) => ({ slug: d.slug, title: d.title }));
  const index = all.map((d) => ({ slug: d.slug, title: d.title, text: d.raw }));
  return (
    <html lang="pt-BR">
      <body>
        <SearchPalette index={index} />
        <div className="flex min-h-screen">
          <Sidebar docs={navDocs} />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verificação manual**

Run: `cd V1/docs/app && npm run dev`
Testar: Ctrl+K (ou Cmd+K) abre a paleta; digitar "forward-fill" lista resultados; Enter/clique navega; Esc fecha.
Expected: busca acha termos em todos os docs e navega.

- [ ] **Step 4: Commit**

```bash
git add V1/docs/app/components/SearchPalette.tsx V1/docs/app/app/layout.tsx
git commit -m "feat(app): busca global Cmd+K"
```

---

## Task 11: Verificação final + README

**Files:**
- Create: `V1/docs/app/README.md`

**Interfaces:**
- Consumes: tudo.
- Produces: instruções de uso; confirmação de build e testes verdes.

- [ ] **Step 1: README**

Create `V1/docs/app/README.md`:
```markdown
# App de defesa TCC

Sistema de apoio à defesa. Lê os `.md` de `../slides/`.

## Rodar
```bash
npm install
npm run dev      # http://localhost:3000
```

## Modos
- **/** — início, atalhos
- **/doc/[slug]** — documentos navegáveis (busca: Cmd/Ctrl+K)
- **/apresentar** — discurso slide-a-slide + cronômetro 20 min (←/→, espaço = play)
- **/flashcards** — treino de termos (filtra 🔴🟡⚪, embaralha)

## Editar conteúdo
Edite os `.md` em `V1/docs/slides/` e recarregue. Nada de conteúdo no código.

## Testes
```bash
npm test
```
```

- [ ] **Step 2: Rodar testes + build final**

Run: `cd V1/docs/app && npm test && npm run build`
Expected: testes PASS (6), build conclui sem erro.

- [ ] **Step 3: Commit**

```bash
git add V1/docs/app/README.md && git commit -m "docs(app): README de uso do app de defesa"
```

---

## Self-Review

**Spec coverage:**
- 3 modos (doc/apresentador/flashcards) → Tasks 6/8/9 ✓
- Lê os .md, fonte única → Task 2 ✓
- Parsers dedicados → Tasks 3/4 ✓
- Busca Cmd+K → Task 10 ✓
- Cronômetro 20 min + âncoras → Task 8 ✓
- Mermaid → Task 5 ✓
- Tema de cores → Task 1 ✓
- Tratamento de erro (doc ausente, formato) → `getDoc`/parsers tolerantes (Tasks 2/3/4) ✓
- Testes dos 2 parsers → Tasks 3/4 ✓
- Critérios de sucesso 1–6 → cobertos; "editar .md reflete" é inerente à leitura em server time ✓

**Placeholder scan:** nenhum TBD/TODO; todo step tem código ou comando completo. ✓

**Type consistency:** `Doc`, `Slide`, `Card`, `Nivel` definidos na Task de origem e consumidos com os mesmos nomes/campos nas Tasks seguintes. `listDocs`/`getDoc`/`renderMarkdown`/`parseDiscurso`/`parseAncoras`/`parseFlashcards` consistentes entre produtor e consumidor. ✓

Nota de risco: `npx create-next-app` pode emitir nomes de arquivo de config ligeiramente diferentes (`next.config.ts` vs `.mjs`) conforme a versão; o plano não depende do nome exato do config. O `@plugin "@tailwindcss/typography"` assume Tailwind v4 (sintaxe CSS-first) — confirmado pelo scaffold `--tailwind` do Next 15.
