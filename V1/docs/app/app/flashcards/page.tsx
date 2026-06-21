import { getDoc } from '@/lib/docs';
import { parseFlashcards } from '@/lib/parse-flashcards';
import Flashcards from '@/components/Flashcards';

export default function FlashcardsPage() {
  const doc = getDoc('glossario_flashcards');
  if (!doc) return <div className="p-10">Glossário não encontrado.</div>;
  return <Flashcards cards={parseFlashcards(doc.raw)} />;
}
