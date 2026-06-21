import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import SearchPalette from '@/components/SearchPalette';
import { listDocs } from '@/lib/docs';

export const metadata: Metadata = {
  title: 'Defesa TCC — André Takeo',
  description: 'Sistema de apoio à defesa do TCC',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const all = listDocs();
  const navDocs = all.map((d) => ({ slug: d.slug, title: d.title }));
  const index = all.map((d) => ({ slug: d.slug, title: d.title, text: d.raw }));
  return (
    <html lang="pt-BR">
      <body>
        <SearchPalette index={index} />
        <div className="flex min-h-screen">
          <Sidebar docs={navDocs} />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
