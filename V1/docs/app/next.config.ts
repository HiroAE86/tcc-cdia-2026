import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  // Repo tem múltiplos lockfiles; fixa a raiz neste app para silenciar o aviso.
  turbopack: {
    root: path.join(import.meta.dirname),
  },
};

export default nextConfig;
