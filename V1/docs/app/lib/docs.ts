import fs from 'node:fs';
import path from 'node:path';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

export type Doc = { slug: string; title: string; raw: string };
export type DocGroup = { label: string; docs: { slug: string; title: string }[] };

const SLIDES_DIR = path.join(process.cwd(), '..', 'slides');

// Grupos por uso. A ordem aqui define a ordem na barra lateral e os params estáticos.
const GROUPS: { label: string; slugs: string[] }[] = [
  {
    label: 'Ensaiar',
    slugs: ['discurso_verbatim', 'discurso_simples', 'cartoes_imagens', 'imagens_por_slide'],
  },
  {
    label: 'Na defesa',
    slugs: ['defesa_simples_completa', 'cola_defesa', 'perguntas_previstas'],
  },
  {
    label: 'Referência',
    slugs: [
      'mapa_logico',
      'roteiro_por_slide',
      'glossario_flashcards',
      'ferramentas_explicadas',
      'justificativas_decisoes',
    ],
  },
];

export const DOC_ORDER = GROUPS.flatMap((g) => g.slugs);

const TITLES: Record<string, string> = {
  // Ensaiar
  discurso_verbatim: 'Discurso (15 min, ler)',
  discurso_simples: 'Discurso simples',
  cartoes_imagens: 'Cartões das imagens',
  imagens_por_slide: 'Imagens por slide',
  // Na defesa
  defesa_simples_completa: 'Defesa simples (Q&A)',
  cola_defesa: 'Cola de defesa',
  perguntas_previstas: 'Perguntas previstas',
  // Referência
  mapa_logico: 'Mapa lógico',
  roteiro_por_slide: 'Roteiro por slide',
  glossario_flashcards: 'Glossário / Flashcards',
  ferramentas_explicadas: 'Ferramentas explicadas',
  justificativas_decisoes: 'Justificativas',
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

// Documentos agrupados por uso, só os que existem em disco. Para a barra lateral.
export function listGroupedDocs(): DocGroup[] {
  return GROUPS.map((g) => ({
    label: g.label,
    docs: g.slugs
      .map(getDoc)
      .filter((d): d is Doc => d !== null)
      .map((d) => ({ slug: d.slug, title: d.title })),
  })).filter((g) => g.docs.length > 0);
}

export async function renderMarkdown(raw: string): Promise<string> {
  const out = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(raw);
  // Reescreve blocos ```mermaid``` para <pre class="mermaid"> (render client-side).
  return String(out).replace(
    /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
    (_, code) =>
      `<pre class="mermaid">${code
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')}</pre>`,
  );
}
