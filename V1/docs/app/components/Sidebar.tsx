'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Item = { slug: string; title: string };

export default function Sidebar({ docs }: { docs: Item[] }) {
  const path = usePathname();
  const link = (href: string, label: string) => {
    const active = path === href;
    return (
      <Link
        href={href}
        className={`block rounded px-3 py-2 text-sm ${
          active ? 'bg-[var(--petroleo)] text-white' : 'hover:bg-[var(--cinza-claro)]'
        }`}
      >
        {label}
      </Link>
    );
  };
  return (
    <nav className="flex w-64 shrink-0 flex-col gap-1 border-r border-gray-200 bg-white p-3">
      <div className="px-3 pb-2 text-xs font-bold uppercase text-[var(--teal)]">Modos</div>
      {link('/', 'Início')}
      {link('/apresentar', '▶ Apresentar')}
      {link('/flashcards', '🃏 Flashcards')}
      <div className="px-3 pb-2 pt-4 text-xs font-bold uppercase text-[var(--teal)]">
        Documentos
      </div>
      {docs.map((d) => (
        <span key={d.slug}>{link(`/doc/${d.slug}`, d.title)}</span>
      ))}
    </nav>
  );
}
