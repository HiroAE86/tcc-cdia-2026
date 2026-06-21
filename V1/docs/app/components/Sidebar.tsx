'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconHome, IconPresent, IconCards, IconDoc, IconSearch } from './icons';
import ThemeToggle from './ThemeToggle';

type Item = { slug: string; title: string };

export default function Sidebar({ docs }: { docs: Item[] }) {
  const path = usePathname();

  const link = (href: string, label: string, Icon: typeof IconHome) => {
    const active = path === href;
    return (
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
          active
            ? 'bg-[var(--primary)] text-[var(--on-brand)] shadow-sm'
            : 'text-[var(--fg-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]'
        }`}
      >
        <Icon
          size={18}
          className={active ? 'text-[var(--on-brand)]' : 'text-[var(--accent)]'}
        />
        <span className="truncate">{label}</span>
      </Link>
    );
  };

  return (
    <nav className="flex w-64 shrink-0 flex-col gap-1 border-r border-[var(--border)] bg-[var(--surface)] p-3">
      <Link href="/" className="mb-2 flex items-center gap-2 px-2 py-1">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] font-display text-sm font-bold text-[var(--on-brand)]">
          TCC
        </span>
        <span className="font-display text-sm font-semibold leading-tight text-[var(--fg)]">
          Defesa
          <span className="block text-xs font-normal text-[var(--fg-subtle)]">André Takeo</span>
        </span>
      </Link>

      <button
        onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
        className="mb-2 flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--fg-subtle)] transition-colors hover:border-[var(--accent)]"
      >
        <IconSearch size={16} />
        <span>Buscar…</span>
        <kbd className="tnum ml-auto rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 text-xs text-[var(--fg-subtle)]">
          Ctrl K
        </kbd>
      </button>

      <div className="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wide text-[var(--fg-subtle)]">
        Modos
      </div>
      {link('/', 'Início', IconHome)}
      {link('/apresentar', 'Apresentar', IconPresent)}
      {link('/flashcards', 'Flashcards', IconCards)}

      <div className="px-3 pb-1 pt-4 text-xs font-bold uppercase tracking-wide text-[var(--fg-subtle)]">
        Documentos
      </div>
      <div className="flex flex-col gap-0.5">
        {docs.map((d) => (
          <span key={d.slug}>{link(`/doc/${d.slug}`, d.title, IconDoc)}</span>
        ))}
      </div>

      <div className="mt-auto border-t border-[var(--border)] pt-3">
        <ThemeToggle />
      </div>
    </nav>
  );
}
