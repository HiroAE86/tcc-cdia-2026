'use client';
import { useMemo, useState } from 'react';
import type { Card, Nivel } from '@/lib/parse-flashcards';

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

  if (!card) return <div className="p-10">Sem cards para este filtro.</div>;

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-4 flex items-center gap-2">
        {(['todos', '🔴', '🟡', '⚪'] as const).map((f) => (
          <button
            key={f}
            onClick={() => {
              setFiltro(f);
              setPos(0);
              setRevelado(false);
            }}
            className={`rounded px-3 py-1 text-sm ${
              filtro === f ? 'bg-[var(--petroleo)] text-white' : 'bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
        <button
          onClick={embaralhar}
          className="ml-auto rounded bg-[var(--teal)] px-3 py-1 text-sm text-white"
        >
          🔀 Embaralhar
        </button>
      </div>

      <div
        onClick={() => setRevelado(true)}
        className="min-h-64 cursor-pointer rounded-xl bg-white p-8 shadow-md"
      >
        <div className="text-xs text-gray-400">
          {card.nivel} · {pos + 1}/{filtrados.length}
        </div>
        <div className="mt-4 text-2xl font-bold text-[var(--petroleo)]">{card.termo}</div>
        {revelado ? (
          <div className="mt-6 text-lg text-gray-800">{card.resposta}</div>
        ) : (
          <div className="mt-6 text-sm text-gray-400">clique para revelar</div>
        )}
      </div>

      {revelado && (
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => proximo(false)}
            className="flex-1 rounded bg-[var(--coral)] py-3 text-white"
          >
            Não sabia
          </button>
          <button
            onClick={() => proximo(true)}
            className="flex-1 rounded bg-[var(--teal)] py-3 text-white"
          >
            Sabia →
          </button>
        </div>
      )}

      <div className="mt-4 text-center text-sm text-gray-500">
        Acertos: {acertos} · Erros: {erros}
      </div>
    </div>
  );
}
