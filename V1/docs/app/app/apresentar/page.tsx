import { getDoc } from '@/lib/docs';
import { parseDiscurso, parseAncoras } from '@/lib/parse-discurso';
import { buildEntradas } from '@/lib/glossario';
import Presenter from '@/components/Presenter';

export default function ApresentarPage() {
  const doc = getDoc('discurso_para_decorar');
  if (!doc) return <div className="p-10">Discurso não encontrado.</div>;
  const slides = parseDiscurso(doc.raw);
  const ancoras = parseAncoras(doc.raw);
  const entradas = buildEntradas();
  return <Presenter slides={slides} ancoras={ancoras} entradas={entradas} />;
}
