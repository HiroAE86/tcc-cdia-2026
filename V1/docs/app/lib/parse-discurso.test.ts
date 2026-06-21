import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parseDiscurso, parseAncoras } from './parse-discurso';

const raw = fs.readFileSync(
  path.join(import.meta.dirname, '..', '..', 'slides', 'discurso_para_decorar.md'),
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
