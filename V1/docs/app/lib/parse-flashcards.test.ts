import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parseFlashcards } from './parse-flashcards';

const raw = fs.readFileSync(
  path.join(import.meta.dirname, '..', '..', 'slides', 'glossario_flashcards.md'),
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

  it('captura ao menos um card de cada nível principal', () => {
    const niveis = new Set(parseFlashcards(raw).map((c) => c.nivel));
    expect(niveis.has('🔴')).toBe(true);
    expect(niveis.has('🟡')).toBe(true);
  });
});
