'use client';
import { useEffect, useRef } from 'react';

export default function MarkdownView({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    import('mermaid').then((m) => {
      if (cancelled || !ref.current) return;
      m.default.initialize({ startOnLoad: false, theme: 'neutral' });
      const nodes = ref.current.querySelectorAll<HTMLElement>('pre.mermaid');
      if (nodes.length) m.default.run({ nodes });
    });
    return () => {
      cancelled = true;
    };
  }, [html]);
  return (
    <div
      ref={ref}
      className="prose max-w-none p-8"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
