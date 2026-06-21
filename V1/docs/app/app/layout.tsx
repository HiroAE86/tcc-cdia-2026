import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import SearchPalette from '@/components/SearchPalette';
import { listDocs, listGroupedDocs } from '@/lib/docs';

export const metadata: Metadata = {
  title: 'Defesa TCC — André Takeo',
  description: 'Sistema de apoio à defesa do TCC',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const all = listDocs();
  const groups = listGroupedDocs();
  const index = all.map((d) => ({ slug: d.slug, title: d.title, text: d.raw }));
  return (
    <html lang="pt-BR">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('tema');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <SearchPalette index={index} />
        <div className="flex min-h-screen bg-[var(--bg)]">
          <Sidebar groups={groups} />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
