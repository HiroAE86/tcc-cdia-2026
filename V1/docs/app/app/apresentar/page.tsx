import { getDoc } from '@/lib/docs';
import { parseDiscurso, parseAncoras } from '@/lib/parse-discurso';
import { buildEntradas } from '@/lib/glossario';
import Presenter from '@/components/Presenter';

export default function ApresentarPage() {
  // Usa a fala enxuta de 15 min (mesma do /slides), não a versão longa antiga.
  const doc = getDoc('discurso_verbatim');
  if (!doc) return <div className="p-10">Discurso não encontrado.</div>;
  const slides = parseDiscurso(doc.raw);
  const ancoras = parseAncoras(doc.raw);
  const entradas = buildEntradas();
  return <Presenter slides={slides} ancoras={ancoras} entradas={entradas} />;
}
