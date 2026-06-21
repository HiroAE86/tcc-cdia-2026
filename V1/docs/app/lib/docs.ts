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
