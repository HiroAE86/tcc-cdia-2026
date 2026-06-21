import { getDoc } from './docs';
import { parseFlashcards } from './parse-flashcards';

export type Entrada = { texto: string; conteudo: string; tipo: 'termo' | 'numero' };

// Números-chave curados (da cola de defesa) — significado na ponta da língua.
// Chave = string EXATA como aparece no discurso.
const NUMEROS: Record<string, string> = {
  '0,709': 'AUC do Transformer+FinBERT em janela única — o artefato. Não sobreviveu à avaliação múltipla.',
  '0,658': 'AUC do baseline autoregressivo (só preço). IC [0,565; 0,744] já engloba o 0,709.',
  '0,667': 'AUC médio do baseline sob expanding-window CV — estável. Mostra que o protocolo detecta sinal real.',
  '0,509': 'AUC médio do Transformer sob CV — caiu abaixo do baseline. A inversão.',
  '+0,003': 'Ganho do sentimento na ablation (225 runs). Estatisticamente zero — o veredito.',
  '0,003': 'Ganho do sentimento na ablation. 44–74× abaixo do mínimo detectável.',
  'p = 0,49': 'p-valor da ablation: totalmente compatível com acaso. Sentimento não adiciona valor.',
  'p=0,49': 'p-valor da ablation: totalmente compatível com acaso.',
  'p = 0,194': 'p-valor do deep-dive de VALE3 (880 runs) — não significativo.',
  'p=0,194': 'p-valor do deep-dive de VALE3 (880 runs) — não significativo.',
  '0,261': 'Desvio-padrão multi-seed do Transformer — instável (21× o baseline).',
  '0,012': 'Desvio-padrão multi-seed do baseline — estável.',
  '0,13–0,22': 'Faixa do mínimo efeito detectável (MDE). O sentimento (0,003) está muito abaixo.',
  '1.510': 'Total aproximado de execuções da investigação — para destruir o positivo, não garimpar.',
  '1.435': 'Total de execuções citado no deck (8 experimentos).',
  '5.872': 'Total de artigos InfoMoney (2.572 ITUB4 / 1.775 PETR4 / 1.525 VALE3).',
  '61,4%': 'Variância retida pelo PCA com 32 componentes, ajustado só no treino.',
  '76,3%': 'Acurácia enganosa do Transformer — quase só prevendo a classe majoritária (~69%).',
};

// Normaliza para casar acentos/caixa de forma estável.
function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/**
 * Constrói a lista de entradas (termos do glossário + números curados),
 * já ordenada do mais longo para o mais curto para o matcher priorizar
 * o casamento mais específico.
 */
export function buildEntradas(): Entrada[] {
  const entradas: Entrada[] = [];

  const doc = getDoc('glossario_flashcards');
  if (doc) {
    const vistos = new Set<string>();
    for (const card of parseFlashcards(doc.raw)) {
      // Só termos "destacáveis": pula frases longas e meta-cards.
      if (card.termo.length < 3 || card.termo.length > 32) continue;
      if (/por que|e por que|\(e por que/i.test(card.termo)) continue;
      const chave = norm(card.termo);
      if (vistos.has(chave)) continue;
      vistos.add(chave);
      entradas.push({ texto: card.termo, conteudo: card.resposta, tipo: 'termo' });
      // Sinônimos: parte antes da "/" (ex.: "AUC / ROC-AUC" → "AUC")
      const slash = card.termo.split('/').map((s) => s.trim());
      if (slash.length > 1) {
        for (const alt of slash) {
          const k = norm(alt);
          if (alt.length >= 3 && alt.length <= 32 && !vistos.has(k)) {
            vistos.add(k);
            entradas.push({ texto: alt, conteudo: card.resposta, tipo: 'termo' });
          }
        }
      }
    }
  }

  for (const [texto, conteudo] of Object.entries(NUMEROS)) {
    entradas.push({ texto, conteudo, tipo: 'numero' });
  }

  // Mais longo primeiro (matcher non-overlapping prioriza o específico).
  entradas.sort((a, b) => b.texto.length - a.texto.length);
  return entradas;
}
