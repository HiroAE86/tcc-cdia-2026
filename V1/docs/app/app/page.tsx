import Link from 'next/link';
import { listDocs } from '@/lib/docs';

export default function Home() {
  const docs = listDocs();
  return (
    <div className="mx-auto max-w-3xl p-10">
      <h1 className="text-3xl font-bold text-[var(--petroleo)]">Defesa TCC</h1>
      <p className="mt-2 text-lg text-gray-700">
        Predição de Direção de Preços de Ações Brasileiras com Sentimento de Notícias.
      </p>
      <blockquote className="mt-4 border-l-4 border-[var(--coral)] bg-white p-4 italic">
        Obtive AUC 0,709 usando sentimento, desconfiei, rodei ~1.510 execuções e provei que era
        artefato de janela única — o sentimento não adiciona valor detectável (Δ = +0,003, p = 0,49).
      </blockquote>
      <div className="mt-8 grid grid-cols-2 gap-4">
        <Link
          href="/apresentar"
          className="rounded-lg bg-[var(--petroleo)] p-6 text-white hover:opacity-90"
        >
          <div className="text-xl font-bold">▶ Apresentar</div>
          <div className="text-sm opacity-80">Discurso slide-a-slide + cronômetro 20 min</div>
        </Link>
        <Link
          href="/flashcards"
          className="rounded-lg bg-[var(--teal)] p-6 text-white hover:opacity-90"
        >
          <div className="text-xl font-bold">🃏 Flashcards</div>
          <div className="text-sm opacity-80">Treinar termos na ponta da língua</div>
        </Link>
      </div>
      <h2 className="mt-10 text-sm font-bold uppercase text-[var(--teal)]">Documentos</h2>
      <ul className="mt-2 space-y-1">
        {docs.map((d) => (
          <li key={d.slug}>
            <Link href={`/doc/${d.slug}`} className="text-[var(--petroleo)] underline">
              {d.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
