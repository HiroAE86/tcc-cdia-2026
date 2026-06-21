export type Slide = { n: number; titulo: string; texto: string };

// Casa o cabeçalho de slide em dois formatos:
//   "## [Slide 12 — título] ~1min30"   (formato antigo, com colchetes)
//   "## Slide 12 — título · ~1min30"    (discurso_verbatim, sem colchetes)
// Captura n e o título (parando em ']', '·' ou fim da linha).
const SLIDE_RE = /^##\s*\[?\s*Slide\s+(\d+)\s*[—-]\s*([^\]·]+?)(?:\s*[\]·].*)?$/;

// Remove marcação inline (negrito/código) — o discurso é exibido como texto puro.
function limpaInline(s: string): string {
  return s.replace(/\*\*(.*?)\*\*/g, '$1').replace(/`([^`]*)`/g, '$1');
}

export function parseDiscurso(raw: string): Slide[] {
  const lines = raw.split('\n');
  const slides: Slide[] = [];
  let cur: Slide | null = null;
  const buf: string[] = [];

  const flush = () => {
    if (cur) {
      cur.texto = limpaInline(buf.join('\n').trim());
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
    // Encerra o último slide ao bater na primeira seção pós-discurso.
    // Cobre os dois arquivos: "Tática"/"As 5 frases" (antigo) e
    // "Checkpoints"/"Soma dos tempos"/"Se AINDA"/"Termina SEMPRE" (verbatim).
    if (
      cur &&
      /^##\s+(Tática|As 5 frases|Checkpoints|Soma dos tempos|Se AINDA|Termina SEMPRE)/i.test(line)
    ) {
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
    if (/^##\s+.*frases-âncora/i.test(line)) {
      inSection = true;
      continue;
    }
    if (inSection && /^##\s/.test(line)) break;
    const m = line.match(/^\d+\.\s+(.*\S)/);
    if (inSection && m) out.push(m[1].replace(/^"|"$/g, '').trim());
  }
  return out;
}
