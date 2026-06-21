'use client';
import { useEffect, useRef } from 'react';

export default function MarkdownView({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    const dark =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    import('mermaid').then((m) => {
      if (cancelled || !ref.current) return;
      m.default.initialize({ startOnLoad: false, theme: dark ? 'dark' : 'neutral' });
      const nodes = ref.current.querySelectorAll<HTMLElement>('pre.mermaid');
      if (nodes.length) m.default.run({ nodes });
    });
    return () => {
      cancelled = true;
    };
  }, [html]);
  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8">
      <div
        ref={ref}
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
