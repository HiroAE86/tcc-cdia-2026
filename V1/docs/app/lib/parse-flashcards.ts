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
