// Copia o deck compilado (../slides/apresentacao.pdf) para public/slides.pdf.
// Roda em predev e prebuild — assim o /slides sempre serve a versão atual do PDF
// sem manter uma cópia versionada nem depender de symlink (compatível com Vercel/CI).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.join(here, '..');
const src = path.join(appDir, '..', 'slides', 'apresentacao.pdf');
const destDir = path.join(appDir, 'public');
const dest = path.join(destDir, 'slides.pdf');

try {
  if (!fs.existsSync(src)) {
    console.warn(`[sync-pdf] fonte não encontrada: ${src} — pulando (compile o deck com pdflatex).`);
    process.exit(0);
  }
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
  const kb = Math.round(fs.statSync(dest).size / 1024);
  console.log(`[sync-pdf] public/slides.pdf atualizado (${kb} KB) a partir de slides/apresentacao.pdf`);
} catch (err) {
  console.warn(`[sync-pdf] falha ao copiar: ${err.message} — seguindo sem atualizar.`);
  process.exit(0);
}
