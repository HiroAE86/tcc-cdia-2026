'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Entry = { slug: string; title: string; text: string };

export default function SearchPalette({ index }: { index: Entry[] }) {
  const [aberto, setAberto] = useState(false);
  const [q, setQ] = useState('');
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setAberto((a) => !a);
      }
      if (e.key === 'Escape') setAberto(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const resultados = useMemo(() => {
    const term = q.toLowerCase().trim();
    if (!term) return [];
    return index
      .map((e) => {
        const hay = (e.title + ' ' + e.text).toLowerCase();
        const at = hay.indexOf(term);
        if (at < 0) return null;
        const start = Math.max(0, at - 40);
        const trecho = e.text.slice(start, at + 80);
        return { slug: e.slug, title: e.title, trecho };
      })
      .filter((r): r is { slug: string; title: string; trecho: string } => r !== null)
      .slice(0, 12);
  }, [q, index]);

  if (!aberto) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-24"
      onClick={() => setAberto(false)}
    >
      <div
        className="w-full max-w-xl rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar termo, pergunta, número…"
          className="w-full rounded-t-lg border-b p-4 outline-none"
        />
        <ul className="max-h-80 overflow-auto">
          {resultados.map((r, k) => (
            <li key={k}>
              <button
                onClick={() => {
                  setAberto(false);
                  setQ('');
                  router.push(`/doc/${r.slug}`);
                }}
                className="block w-full px-4 py-2 text-left hover:bg-[var(--cinza-claro)]"
              >
                <div className="text-sm font-bold text-[var(--petroleo)]">{r.title}</div>
                <div className="truncate text-xs text-gray-500">…{r.trecho}…</div>
              </button>
            </li>
          ))}
          {q && resultados.length === 0 && (
            <li className="px-4 py-3 text-sm text-gray-400">Nada encontrado.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
