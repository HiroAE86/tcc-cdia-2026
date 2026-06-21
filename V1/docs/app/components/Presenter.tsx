'use client';
import { useEffect, useState, useCallback } from 'react';
import type { Slide } from '@/lib/parse-discurso';

const TOTAL_SEG = 20 * 60;

export default function Presenter({
  slides,
  ancoras,
}: {
  slides: Slide[];
  ancoras: string[];
}) {
  const [i, setI] = useState(0);
  const [seg, setSeg] = useState(0);
  const [rodando, setRodando] = useState(false);

  const prev = useCallback(() => setI((x) => Math.max(0, x - 1)), []);
  const next = useCallback(
    () => setI((x) => Math.min(slides.length - 1, x + 1)),
    [slides.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === ' ') {
        e.preventDefault();
        setRodando((r) => !r);
      }
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
  const esperado = ((i + 1) / slides.length) * TOTAL_SEG;
  const cor = seg > esperado + 60 ? 'var(--coral)' : seg > esperado ? '#d4a017' : 'var(--teal)';

  const s = slides[i];
  if (!s) return <div className="p-10">Sem slides.</div>;

  return (
    <div className="flex h-screen">
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between bg-[var(--petroleo)] px-6 py-3 text-white">
          <span className="text-sm">
            Slide {s.n} — {s.titulo}
          </span>
          <span className="font-mono text-lg" style={{ color: cor }}>
            {mm}:{ss}
          </span>
        </div>
        <div className="flex-1 overflow-auto whitespace-pre-wrap p-10 text-lg leading-relaxed">
          {s.texto}
        </div>
        <div className="flex items-center justify-between border-t bg-white px-6 py-3">
          <button onClick={prev} className="rounded bg-gray-200 px-4 py-2">
            ← Anterior
          </button>
          <span className="text-sm text-gray-500">
            {i + 1} / {slides.length} · espaço = play/pause cronômetro
          </span>
          <button
            onClick={next}
            className="rounded bg-[var(--petroleo)] px-4 py-2 text-white"
          >
            Próximo →
          </button>
        </div>
      </div>
      <aside className="w-72 shrink-0 overflow-auto border-l bg-[var(--cinza-claro)] p-4">
        <div className="text-xs font-bold uppercase text-[var(--teal)]">5 frases-âncora</div>
        <ul className="mt-2 space-y-3 text-sm">
          {ancoras.map((a, k) => (
            <li key={k} className="rounded bg-white p-2 shadow-sm">
              {a}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
