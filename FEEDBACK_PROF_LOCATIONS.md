# FEEDBACK_PROF_LOCATIONS — saída Batch 1 (LOCALIZAR)

Input único da Batch 2 (CORRIGIR). Alvo: `V1/docs/tcc.tex`.
Critérios de correção: ver `FEEDBACK_PROF_A_B_thesis.md`.

---

## A1 — Forward-refs a caps 4/5

| Linha | Trecho | "Estrutura do trabalho"? → ação |
|------|--------|----------|
| 198 | "O trabalho está organizado em seis capítulos. O presente capítulo introduz..." | YES → **manter** (roteiro legítimo) |
| 211 | "se os preços já incorporam o sentimento..." (transição p/ investigação) | NO → revisar: corte se for só antecipação |

**Veredito A1:** problema pequeno. A única forward-ref real fica na Estrutura (L198, manter). L211 ver em conjunto com A3 (mesma linha tem "0,709"). **Nenhuma edição agressiva.**

---

## A2 — Auto-referência numérica do capítulo atual

| Linha | Trecho | Cap | Classe |
|------|--------|-----|--------|
| 205 | "Este capítulo apresenta os fundamentos teóricos..." | 2 | ABERTURA-TOPICA → manter |
| 240 | "Este capítulo descreve as três primeiras etapas..." | 3 | ABERTURA-TOPICA → manter |
| 294 | "Os resultados do Capítulo~\ref{cap:pipeline} sugeriram... Este capítulo testa..." | 4 | ABERTURA + CROSS-REF (aponta cap:pipeline, OK) → manter |
| 334 | "Este capítulo aplica protocolos..." | 5 | ABERTURA-TOPICA → manter |
| 488 | "A conclusão unificada dos experimentos deste capítulo..." | 5 | ABERTURA-TOPICA → manter |

**Veredito A2:** **ZERO self-ref-numeric.** Nenhum "no capítulo 3" estando no cap 3. Aberturas tópicas são aceitáveis.
**Ação Batch 2:** NENHUMA edição obrigatória. Opcional: confirmar que nenhuma abertura cita o número literal ("capítulo 3"). Hoje usam "Este capítulo" (sem número) → já correto. **A2 = sem trabalho.**

---

## A3 — AUC 0,709 (12 ocorrências → meta ~4-5)

| Linha | Seção | Veredito | Substituição anafórica |
|------|-------|----------|----------|
| 99 | Resumo (pt) | **KEEP** | — |
| 111 | Abstract (en) | **KEEP** | — |
| 198 | Intro/Estrutura | **KEEP** (1ª aparição corpo) | — |
| 211 | Revisão/HEM | **ANAPHORIZE** | "o resultado dessa avaliação inicial" |
| 318 | Cap4 tabela (célula) | **KEEP** (é dado de tabela) | — |
| 325 | Cap4 análise | **KEEP** (objeto sob investigação) | — |
| 334 | Cap5 motivação | **ANAPHORIZE** | "esse valor inicial" |
| 490 | Cap5 síntese | **ANAPHORIZE** | "O resultado da janela única" |
| 494 | Cap5 síntese | **ANAPHORIZE** | "Esse valor previamente observado" |
| 512 | Conclusão/contrib | já não-literal | — (deixar) |
| 519 | Cap6 reflexão | **ANAPHORIZE** | "esse resultado preliminar" |
| 521 | Cap6 reflexão | **ANAPHORIZE** | "da métrica inicial" → mas manter par "0,709 para ~0,51" se for o ponto de contraste; ver nota |

**Nota L521:** a frase contrasta "0,709 → ~0,51". O contraste numérico tem valor retórico. Opção: anaforizar o primeiro ("da avaliação inicial para ~0,51") OU manter. Batch 2: **manter o contraste, anaforizar o lado esquerdo** → "uma inversão da métrica inicial para $\sim$0,51".

**Resultado esperado:** literais mantidos = L99,111,198,318,325 (+contexto tabela) ≈ **5**. Anaforizar: 211, 334, 490, 494, 519, 521. → meta atingida.

---

## B1 — Artigos citados sem número (alvo: adicionar métrica ou TODO)

JÁ TÊM número (não mexer): `chen2016` (AUC 0,658, L370), `bai2018` (AUC 0,643/0,513/0,556, L478).

FALTAM número (**alvos**):

| Linha | Cite | Contexto | Ação |
|------|------|----------|------|
| 219 | xu2018 | tweets+preço melhora predição S&P500 | add métrica reportada OU `% TODO-PROF-B1: métrica xu2018` |
| 219 | fischer2018 | LSTM S&P500, superior a buy-and-hold | add métrica OU TODO |
| 219 | cavalcante2016 | sentimento notícias PT → volatilidade IBOVESPA | add métrica OU TODO |
| 219 | santos2020 | BERT em textos CVM | add métrica OU TODO |
| 512 | ding2015 | event-driven S&P500, split único | add métrica OU TODO |
| 512 | hu2018 | trend prediction ações chinesas, janela única | add métrica OU TODO |

**Regra:** NÃO inventar números. Se não achar na bib/fonte → inserir comentário `% TODO-PROF-B1: buscar e inserir métrica de <autor>` no ponto. Onde houver número conhecido, escrever no formato "Autor (ano) reportam <métrica> em <dataset>".
**Local preferido p/ a comparação consolidada:** discussão (Cap5 Síntese L486+ / Cap6). Pode-se enriquecer L219/L512 in loco E/OU criar parágrafo comparativo. Batch 2 decide o mínimo: garantir que cada alvo tenha número OU TODO visível.

---

## B2 — Figuras

5 figuras, TODAS com `\label` (bom). Problemas reais:

| Figura | Label | Menções | Distância | Problema | Ação |
|--------|-------|---------|-----------|----------|------|
| multi_seed_histograms.png | fig:multiseed | L391 (d=17), **L514 (d=103)** | L514 = **103 linhas** | **FAR — prof "Figura 1 ficou atrás"** | reaproximar: na L514 (Conclusão) inserir lembrete do conteúdo + `\autoref{fig:multiseed}` |
| expanding_cv_overtime.png | fig:expandingcv | L440 (d=3) | OK | — | — |
| vale3_deepdive_hist.png | fig:vale3 | L440 | OK | — | — |
| ablation_boxplot.png | fig:ablation | **NENHUMA** | — | **figura órfã, zero menção no texto** | inserir `\autoref{fig:ablation}` na discussão de ablation (Cap5, perto L448-470) |
| tcn_validation_hist.png | fig:tcn | L478 | OK | — | — |

**Vereditos B2:**
1. `fig:multiseed` @ L514: mais de 100 linhas longe. Adicionar releitura curta ("a distribuição bimodal do Transformer — \autoref{fig:multiseed} — ...") na L514. **NÃO** há "Figura 1" hardcoded — já usa `\ref`. O problema do prof = distância, não numeração.
2. `fig:ablation`: órfã. Adicionar referência no parágrafo de ablation.
3. Nenhuma conversão de número literal necessária (já tudo `\ref`).

---

## Resumo p/ Batch 2 — quanto trabalho real

| Item | Trabalho |
|------|----------|
| A1 | mínimo (1 linha opcional) |
| A2 | **nenhum** |
| A3 | anaforizar 6 linhas (211,334,490,494,519,521) |
| B1 | 6 citações: add número OU TODO |
| B2 | 2 ações: reaproximar fig:multiseed @L514; referenciar fig:ablation órfã |

**Serialização:** A3 e B2 tocam Cap5/Cap6 (linhas próximas 490-521) → **mesma subagent, sequencial**. B1 (L219 Cap2 + L512) pode ser subagent separada paralela. A1/A2 = skip.
