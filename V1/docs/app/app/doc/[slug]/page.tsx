import { notFound } from 'next/navigation';
import { getDoc, renderMarkdown, DOC_ORDER } from '@/lib/docs';
import MarkdownView from '@/components/MarkdownView';

export function generateStaticParams() {
  return DOC_ORDER.map((slug) => ({ slug }));
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();
  const html = await renderMarkdown(doc.raw);
  return <MarkdownView html={html} />;
}
