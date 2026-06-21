import { getDoc } from '@/lib/docs';
import { parseDiscurso, parseAncoras } from '@/lib/parse-discurso';
import { getSlidesPdf } from '@/lib/slides-pdf';
import SlideViewer from '@/components/SlideViewer';

export default function SlidesPage() {
  const pdf = getSlidesPdf();
  const doc = getDoc('discurso_para_decorar');
  const slides = doc ? parseDiscurso(doc.raw) : [];
  const ancoras = doc ? parseAncoras(doc.raw) : [];
  return (
    <SlideViewer
      pdf={pdf?.url ?? null}
      total={pdf?.paginas ?? 0}
      slides={slides}
      ancoras={ancoras}
    />
  );
}
