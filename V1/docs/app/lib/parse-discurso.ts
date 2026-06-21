export type Slide = { n: number; titulo: string; texto: string };

// Casa "## [Slide 12 — título qualquer] ~1min30" capturando n e o miolo do colchete.
const SLIDE_RE = /^##\s*\[Slide\s+(\d+)\s*[—-]\s*([^\]]+)\]/;

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
    // Encerra o último slide ao bater na seção pós-discurso.
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
