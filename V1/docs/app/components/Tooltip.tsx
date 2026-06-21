'use client';
import { useState, useRef, useId } from 'react';

type Tipo = 'termo' | 'numero';

export default function Tooltip({
  texto,
  conteudo,
  tipo,
}: {
  texto: string;
  conteudo: string;
  tipo: Tipo;
}) {
  const [aberto, setAberto] = useState(false);
  const fecharTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();

  const abrir = () => {
    if (fecharTimer.current) clearTimeout(fecharTimer.current);
    setAberto(true);
  };
  const fechar = () => {
    fecharTimer.current = setTimeout(() => setAberto(false), 80);
  };

  const cor = tipo === 'numero' ? 'var(--coral)' : 'var(--accent)';

  return (
    <span className="relative inline-block">
      <button
        type="button"
        aria-describedby={aberto ? id : undefined}
        onMouseEnter={abrir}
        onMouseLeave={fechar}
        onFocus={abrir}
        onBlur={fechar}
        onClick={() => setAberto((a) => !a)}
        className="cursor-help font-semibold underline decoration-dotted decoration-1 underline-offset-4 outline-none"
        style={{ color: cor, textDecorationColor: cor }}
      >
        {texto}
      </button>
      {aberto && (
        <span
          id={id}
          role="tooltip"
          onMouseEnter={abrir}
          onMouseLeave={fechar}
          className="absolute bottom-full left-1/2 z-50 mb-2 w-72 -translate-x-1/2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-sm font-normal not-italic leading-relaxed text-[var(--fg)] shadow-lg"
        >
          <span
            className="mb-1 block text-xs font-bold uppercase tracking-wide"
            style={{ color: cor }}
          >
            {texto}
          </span>
          {conteudo}
        </span>
      )}
    </span>
  );
}
