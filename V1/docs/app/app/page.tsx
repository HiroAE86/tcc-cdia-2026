import Link from 'next/link';
import { listDocs } from '@/lib/docs';
import { IconPresent, IconCards, IconDoc, IconArrowRight, IconMonitor } from '@/components/icons';

export default function Home() {
  const docs = listDocs();
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 sm:px-10">
      {/* Hero */}
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
        TCC · CDIA PUC-SP
      </span>
      <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-[var(--fg)] sm:text-5xl">
        Defesa do TCC
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-[var(--fg-muted)]">
        Predição de direção de preços de ações brasileiras com sentimento de notícias.
      </p>

      <blockquote className="mt-6 rounded-r-lg border-l-4 border-[var(--coral)] bg-[var(--surface)] p-5 text-[var(--fg)] shadow-sm">
        Obtive <span className="tnum font-semibold">AUC 0,709</span> usando sentimento, desconfiei,
        rodei <span className="tnum font-semibold">~1.510</span> execuções e provei que era artefato de
        janela única — o sentimento não adiciona valor detectável
        (<span className="tnum font-semibold">Δ = +0,003</span>,{' '}
        <span className="tnum font-semibold">p = 0,49</span>).
      </blockquote>

      {/* Mode cards */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Link
          href="/slides"
          className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--fg)] shadow-md transition-transform duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-lg"
        >
          <IconMonitor size={28} className="text-[var(--accent)]" />
          <div className="mt-3 font-display text-xl font-bold">Slides</div>
          <div className="mt-1 text-sm text-[var(--fg-muted)]">
            Projetar o deck (PDF) com fala e cronômetro ao lado.
          </div>
          <IconArrowRight
            size={18}
            className="absolute right-5 top-6 text-[var(--fg-subtle)] transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>

        <Link
          href="/apresentar"
          className="group relative overflow-hidden rounded-xl bg-[var(--primary)] p-6 text-[var(--on-brand)] shadow-md transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <IconPresent size={28} className="text-white/90" />
          <div className="mt-3 font-display text-xl font-bold">Apresentar</div>
          <div className="mt-1 text-sm text-white/75">
            Discurso slide-a-slide + cronômetro de 15 min.
          </div>
          <IconArrowRight
            size={18}
            className="absolute right-5 top-6 text-white/60 transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>

        <Link
          href="/flashcards"
          className="group relative overflow-hidden rounded-xl bg-[var(--teal)] p-6 text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <IconCards size={28} className="text-white/90" />
          <div className="mt-3 font-display text-xl font-bold">Flashcards</div>
          <div className="mt-1 text-sm text-white/75">
            Treinar termos e números na ponta da língua.
          </div>
          <IconArrowRight
            size={18}
            className="absolute right-5 top-6 text-white/60 transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Docs */}
      <h2 className="mt-12 text-xs font-bold uppercase tracking-wide text-[var(--fg-subtle)]">
        Documentos de estudo
      </h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {docs.map((d) => (
          <Link
            key={d.slug}
            href={`/doc/${d.slug}`}
            className="group flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-[var(--fg)] shadow-sm transition-colors hover:border-[var(--accent)]"
          >
            <IconDoc size={18} className="shrink-0 text-[var(--accent)]" />
            <span className="truncate">{d.title}</span>
            <IconArrowRight
              size={16}
              className="ml-auto shrink-0 text-[var(--fg-subtle)] opacity-0 transition-opacity group-hover:opacity-100"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
