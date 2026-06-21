import fs from 'node:fs';
import path from 'node:path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
// Candidatos aceitos, em ordem de preferência. O 1º que existir vence.
const CANDIDATOS = ['slides.pdf', 'apresentacao.pdf', 'deck.pdf'];

export type SlidesPdf = { url: string; paginas: number } | null;

/** Conta páginas via contagem de objetos /Type /Page no binário (heurística sem libs). */
function contarPaginas(buf: Buffer): number {
  const txt = buf.toString('latin1');
  // Conta "/Type /Page" mas não "/Type /Pages" (o nó raiz da árvore).
  const matches = txt.match(/\/Type\s*\/Page(?![s])/g);
  if (matches && matches.length > 0) return matches.length;
  // Fallback: maior /Count N (nó Pages costuma trazer o total).
  const counts = [...txt.matchAll(/\/Count\s+(\d+)/g)].map((m) => Number(m[1]));
  if (counts.length) return Math.max(...counts);
  return 0;
}

export function getSlidesPdf(): SlidesPdf {
  for (const nome of CANDIDATOS) {
    const file = path.join(PUBLIC_DIR, nome);
    try {
      const buf = fs.readFileSync(file);
      return { url: `/${nome}`, paginas: contarPaginas(buf) };
    } catch {
      // tenta o próximo candidato
    }
  }
  return null;
}
