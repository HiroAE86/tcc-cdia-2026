'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconSearch } from './icons';

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
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-24 backdrop-blur-sm"
      onClick={() => setAberto(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4">
          <IconSearch size={18} className="text-[var(--fg-subtle)]" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar termo, pergunta, número…"
            className="w-full bg-transparent py-4 text-[var(--fg)] outline-none placeholder:text-[var(--fg-subtle)]"
          />
          <kbd className="tnum rounded border border-[var(--border)] bg-[var(--surface-2)] px-1.5 text-xs text-[var(--fg-subtle)]">
            Esc
          </kbd>
        </div>
        <ul className="max-h-80 overflow-auto p-1">
          {resultados.map((r, k) => (
            <li key={k}>
              <button
                onClick={() => {
                  setAberto(false);
                  setQ('');
                  router.push(`/doc/${r.slug}`);
                }}
                className="block w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-[var(--surface-2)]"
              >
                <div className="text-sm font-semibold text-[var(--fg)]">{r.title}</div>
                <div className="truncate text-xs text-[var(--fg-subtle)]">…{r.trecho}…</div>
              </button>
            </li>
          ))}
          {q && resultados.length === 0 && (
            <li className="px-4 py-3 text-sm text-[var(--fg-subtle)]">Nada encontrado.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
