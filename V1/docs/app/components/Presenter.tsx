'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import type { Slide } from '@/lib/parse-discurso';
import type { Entrada } from '@/lib/glossario';
import { destacar } from '@/lib/highlight';
import { IconArrowLeft, IconArrowRight, IconPlay, IconPause } from './icons';

const TOTAL_SEG = 15 * 60;

export default function Presenter({
  slides,
  ancoras,
  entradas = [],
}: {
  slides: Slide[];
  ancoras: string[];
  entradas?: Entrada[];
}) {
  const [i, setI] = useState(0);
  const [seg, setSeg] = useState(0);
  const [rodando, setRodando] = useState(false);
  const [dicas, setDicas] = useState(true);

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
  const atrasado = seg > esperado + 60;
  const proximo = seg > esperado;
  const corTimer = atrasado ? 'var(--coral)' : proximo ? 'var(--ambar)' : 'var(--teal)';
  const labelRitmo = atrasado ? 'Atrasado' : proximo ? 'No limite' : 'No ritmo';

  const s = slides[i];

  const conteudoSlide = useMemo(
    () => (s && dicas && entradas.length ? destacar(s.texto, entradas) : s?.texto),
    [s, dicas, entradas],
  );

  if (!s) return <div className="p-10 text-[var(--fg-muted)]">Sem slides.</div>;

  const progresso = ((i + 1) / slides.length) * 100;

  return (
    <div className="flex h-screen bg-[var(--bg)]">
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 bg-[var(--primary)] px-6 py-3 text-[var(--on-brand)]">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wide text-white/60">Slide {s.n}</div>
            <div className="truncate font-display text-base font-semibold">{s.titulo}</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDicas((d) => !d)}
              title="Liga/desliga dicas em termos e números"
              aria-pressed={dicas}
              className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                dicas
                  ? 'border-white/40 bg-white/15 text-white'
                  : 'border-white/20 text-white/50'
              }`}
            >
              Dicas {dicas ? 'on' : 'off'}
            </button>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{ background: corTimer, color: '#fff' }}
            >
              {labelRitmo}
            </span>
            <span className="tnum text-2xl font-bold tabular-nums" style={{ color: corTimer === 'var(--teal)' ? '#fff' : corTimer }}>
              {mm}:{ss}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-[var(--surface-2)]">
          <div
            className="h-full bg-[var(--accent)] transition-[width] duration-300"
            style={{ width: `${progresso}%` }}
          />
        </div>

        {/* Slide text — large, readable from a distance */}
        <div className="flex-1 overflow-auto px-10 py-8">
          <div className="mx-auto max-w-3xl whitespace-pre-wrap font-display text-[1.6rem] leading-[1.55] text-[var(--fg)]">
            {conteudoSlide}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--surface)] px-6 py-3">
          <button
            onClick={prev}
            disabled={i === 0}
            className="flex items-center gap-2 rounded-lg bg-[var(--surface-2)] px-4 py-2 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--border)] disabled:opacity-40"
          >
            <IconArrowLeft size={18} /> Anterior
          </button>

          <div className="flex items-center gap-3 text-sm text-[var(--fg-subtle)]">
            <button
              onClick={() => setRodando((r) => !r)}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 font-medium text-[var(--fg)] transition-colors hover:border-[var(--accent)]"
            >
              {rodando ? <IconPause size={16} /> : <IconPlay size={16} />}
              {rodando ? 'Pausar' : 'Iniciar'}
            </button>
            <span className="tnum">
              {i + 1} / {slides.length}
            </span>
          </div>

          <button
            onClick={next}
            disabled={i === slides.length - 1}
            className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--on-brand)] transition-colors hover:opacity-90 disabled:opacity-40"
          >
            Próximo <IconArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Anchor panel */}
      {ancoras.length > 0 && (
        <aside className="hidden w-80 shrink-0 overflow-auto border-l border-[var(--border)] bg-[var(--surface)] p-5 lg:block">
          <div className="text-xs font-bold uppercase tracking-wide text-[var(--accent)]">
            5 frases-âncora
          </div>
          <ul className="mt-3 space-y-2.5">
            {ancoras.map((a, k) => (
              <li
                key={k}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm leading-relaxed text-[var(--fg)]"
              >
                <span className="tnum mr-1.5 font-bold text-[var(--accent)]">{k + 1}.</span>
                {a}
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}
