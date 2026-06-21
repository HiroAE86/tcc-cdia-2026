'use client';
import { useEffect, useState, useCallback } from 'react';
import type { Slide } from '@/lib/parse-discurso';
import { IconArrowLeft, IconArrowRight, IconPlay, IconPause } from './icons';

const TOTAL_SEG = 15 * 60;

export default function SlideViewer({
  pdf,
  total,
  slides,
  ancoras,
}: {
  pdf: string | null;
  total: number;
  slides: Slide[];
  ancoras: string[];
}) {
  const [pagina, setPagina] = useState(1);
  const [seg, setSeg] = useState(0);
  const [rodando, setRodando] = useState(false);

  const n = Math.max(total, slides.length, 1);
  const prev = useCallback(() => setPagina((p) => Math.max(1, p - 1)), []);
  const next = useCallback(() => setPagina((p) => Math.min(n, p + 1)), [n]);

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
  const esperado = (pagina / n) * TOTAL_SEG;
  const atrasado = seg > esperado + 60;
  const proximo = seg > esperado;
  const corTimer = atrasado ? 'var(--coral)' : proximo ? 'var(--ambar)' : 'var(--teal)';
  const labelRitmo = atrasado ? 'Atrasado' : proximo ? 'No limite' : 'No ritmo';

  // Fala associada à página (assume página 1 = slide 1).
  const fala = slides.find((s) => s.n === pagina)?.texto;

  if (!pdf) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-display text-2xl font-bold text-[var(--fg)]">Slides para apresentar</h1>
        <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--fg-muted)] shadow-sm">
          <p className="font-medium text-[var(--fg)]">Nenhum PDF encontrado ainda.</p>
          <p className="mt-3 text-sm leading-relaxed">
            Para ativar esta área, exporte o deck final em <strong>PDF</strong> e salve como:
          </p>
          <pre className="mt-3 overflow-auto rounded-lg bg-[var(--surface-2)] p-3 text-sm text-[var(--fg)]">
V1/docs/app/public/slides.pdf
          </pre>
          <p className="mt-3 text-sm leading-relaxed">
            Recarregue a página. O PDF aparece aqui, projetável em tela cheia, com a fala e o
            cronômetro ao lado — e já fica salvo em PDF para o pen-drive (dica da Prof. Tanara).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--bg)]">
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 bg-[var(--primary)] px-6 py-3 text-[var(--on-brand)]">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wide text-white/60">Slide</div>
            <div className="tnum font-display text-base font-semibold">
              {pagina} / {n}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/30 px-3 py-1 text-xs font-medium text-white/90 transition-colors hover:border-white/60"
            >
              Abrir em tela cheia
            </a>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{ background: corTimer, color: '#fff' }}
            >
              {labelRitmo}
            </span>
            <span
              className="tnum text-2xl font-bold"
              style={{ color: corTimer === 'var(--teal)' ? '#fff' : corTimer }}
            >
              {mm}:{ss}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-[var(--surface-2)]">
          <div
            className="h-full bg-[var(--accent)] transition-[width] duration-300"
            style={{ width: `${(pagina / n) * 100}%` }}
          />
        </div>

        {/* PDF — key força recarga da página ao navegar (#page) */}
        <div className="flex-1 bg-[var(--surface-2)]">
          <object
            key={pagina}
            data={`${pdf}#page=${pagina}&view=FitH&toolbar=0`}
            type="application/pdf"
            className="h-full w-full"
            aria-label={`Slide ${pagina}`}
          >
            <iframe
              src={`${pdf}#page=${pagina}`}
              className="h-full w-full"
              title={`Slide ${pagina}`}
            />
          </object>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--surface)] px-6 py-3">
          <button
            onClick={prev}
            disabled={pagina === 1}
            className="flex items-center gap-2 rounded-lg bg-[var(--surface-2)] px-4 py-2 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--border)] disabled:opacity-40"
          >
            <IconArrowLeft size={18} /> Anterior
          </button>
          <button
            onClick={() => setRodando((r) => !r)}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--fg)] transition-colors hover:border-[var(--accent)]"
          >
            {rodando ? <IconPause size={16} /> : <IconPlay size={16} />}
            {rodando ? 'Pausar' : 'Iniciar'}
          </button>
          <button
            onClick={next}
            disabled={pagina === n}
            className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--on-brand)] transition-colors hover:opacity-90 disabled:opacity-40"
          >
            Próximo <IconArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Side panel: fala do slide + âncoras */}
      <aside className="hidden w-80 shrink-0 flex-col overflow-auto border-l border-[var(--border)] bg-[var(--surface)] p-5 lg:flex">
        {fala && (
          <div className="mb-5">
            <div className="text-xs font-bold uppercase tracking-wide text-[var(--accent)]">
              O que falar neste slide
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--fg)]">
              {fala}
            </p>
          </div>
        )}
        {ancoras.length > 0 && (
          <>
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
          </>
        )}
      </aside>
    </div>
  );
}
