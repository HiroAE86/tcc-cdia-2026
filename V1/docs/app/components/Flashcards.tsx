'use client';
import { useMemo, useState } from 'react';
import type { Card, Nivel } from '@/lib/parse-flashcards';
import { IconShuffle, IconCheck, IconX } from './icons';

const NIVEL_META: Record<Nivel, { label: string; cor: string }> = {
  '🔴': { label: 'Crítico', cor: 'var(--nivel-alto)' },
  '🟡': { label: 'Médio', cor: 'var(--nivel-medio)' },
  '⚪': { label: 'Apoio', cor: 'var(--nivel-baixo)' },
};

export default function Flashcards({ cards }: { cards: Card[] }) {
  const [filtro, setFiltro] = useState<Nivel | 'todos'>('todos');
  const [ordem, setOrdem] = useState<number[]>(() => cards.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [revelado, setRevelado] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);

  const filtrados = useMemo(
    () => ordem.filter((idx) => filtro === 'todos' || cards[idx].nivel === filtro),
    [ordem, filtro, cards],
  );

  const card = cards[filtrados[pos]];

  const proximo = (acertou: boolean) => {
    if (acertou) setAcertos((x) => x + 1);
    else setErros((x) => x + 1);
    setRevelado(false);
    setPos((p) => (p + 1) % Math.max(1, filtrados.length));
  };

  const embaralhar = () => {
    const sorted = [...ordem];
    for (let k = sorted.length - 1; k > 0; k--) {
      const j = Math.floor((k * 2654435761) % (k + 1));
      [sorted[k], sorted[j]] = [sorted[j], sorted[k]];
    }
    setOrdem(sorted);
    setPos(0);
    setRevelado(false);
  };

  const setFiltroReset = (f: Nivel | 'todos') => {
    setFiltro(f);
    setPos(0);
    setRevelado(false);
  };

  if (!card) {
    return (
      <div className="mx-auto max-w-2xl p-10 text-center text-[var(--fg-muted)]">
        Sem cards para este filtro.
      </div>
    );
  }

  const meta = NIVEL_META[card.nivel];
  const total = acertos + erros;
  const taxa = total ? Math.round((acertos / total) * 100) : 0;

  const chips: { f: Nivel | 'todos'; label: string; cor?: string }[] = [
    { f: 'todos', label: 'Todos' },
    { f: '🔴', label: 'Crítico', cor: 'var(--nivel-alto)' },
    { f: '🟡', label: 'Médio', cor: 'var(--nivel-medio)' },
    { f: '⚪', label: 'Apoio', cor: 'var(--nivel-baixo)' },
  ];

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      {/* Filtros */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {chips.map(({ f, label, cor }) => {
          const ativo = filtro === f;
          return (
            <button
              key={f}
              onClick={() => setFiltroReset(f)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                ativo
                  ? 'border-transparent bg-[var(--primary)] text-[var(--on-brand)]'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--fg-muted)] hover:border-[var(--accent)]'
              }`}
            >
              {cor && (
                <span className="h-2 w-2 rounded-full" style={{ background: cor }} />
              )}
              {label}
            </button>
          );
        })}
        <button
          onClick={embaralhar}
          className="ml-auto flex items-center gap-1.5 rounded-full bg-[var(--teal)] px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <IconShuffle size={15} /> Embaralhar
        </button>
      </div>

      {/* Card */}
      <button
        onClick={() => setRevelado(true)}
        className="block w-full cursor-pointer rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-left shadow-md transition-shadow hover:shadow-lg"
        style={{ minHeight: '17rem' }}
      >
        <div className="flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ background: `${meta.cor}1a`, color: meta.cor }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.cor }} />
            {meta.label}
          </span>
          <span className="tnum text-xs text-[var(--fg-subtle)]">
            {pos + 1} / {filtrados.length}
          </span>
        </div>

        <div className="mt-5 font-display text-2xl font-bold leading-snug text-[var(--fg)]">
          {card.termo}
        </div>

        {revelado ? (
          <div className="mt-5 border-t border-[var(--border)] pt-5 text-lg leading-relaxed text-[var(--fg-muted)]">
            {card.resposta}
          </div>
        ) : (
          <div className="mt-5 text-sm text-[var(--fg-subtle)]">clique para revelar</div>
        )}
      </button>

      {/* Ações */}
      {revelado && (
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => proximo(false)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--coral)] py-3 font-medium text-white transition-opacity hover:opacity-90"
          >
            <IconX size={18} /> Não sabia
          </button>
          <button
            onClick={() => proximo(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--teal)] py-3 font-medium text-white transition-opacity hover:opacity-90"
          >
            <IconCheck size={18} /> Sabia
          </button>
        </div>
      )}

      {/* Placar */}
      <div className="mt-5 flex items-center justify-center gap-5 text-sm">
        <span className="flex items-center gap-1.5 text-[var(--fg-muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--teal)]" /> Acertos{' '}
          <span className="tnum font-semibold text-[var(--fg)]">{acertos}</span>
        </span>
        <span className="flex items-center gap-1.5 text-[var(--fg-muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--coral)]" /> Erros{' '}
          <span className="tnum font-semibold text-[var(--fg)]">{erros}</span>
        </span>
        {total > 0 && (
          <span className="tnum text-[var(--fg-subtle)]">{taxa}% certo</span>
        )}
      </div>
    </div>
  );
}
