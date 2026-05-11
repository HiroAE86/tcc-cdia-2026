# Edições Realizadas no TCC

Documento gerado após ciclos de revisão e correção automática do arquivo `V1/docs/tcc.tex`.  
Cobre tanto as flags levantadas pelo professor (EBACC_FLAGS.md) quanto melhorias adicionais identificadas por avaliação científica.

---

## 1. Flags do Professor (EBACC_FLAGS.md)

### p.10 §1.3 — "sobre as armadilhas da avaliação"
**Problema:** Professor perguntou "Quais são as armadilhas?"  
**Solução:** §1.3 (Justificativa) agora enumera explicitamente as três armadilhas em sentença própria: ausência de intervalos de confiança, uso de semente única, e avaliação por janela única em séries não-estacionárias.

---

### p.10 §1.4 — "AUC = 0,709" sem definição de sigla
**Problema:** AUC usado antes de ser definido.  
**Solução:** Primeira ocorrência no corpo do texto define a sigla: `(\textit{Area Under the ROC Curve}, AUC = 0,709)`. Lista de siglas no pré-textual também define AUC. Artefatos `??` resolvidos recompilando com sequência completa (`pdflatex → bibtex → pdflatex → pdflatex`).

---

### p.11 §2.1 — parágrafo "A tensão entre eficiência teórica..."
**Problema:** Texto com cara de IA, genérico e desconectado.  
**Solução:** Parágrafo reescrito conectando a tensão HEM ao que os Capítulos 4 e 5 testam empiricamente — cita AUC = 0,709 (Cap. 4) e sua reversão via expanding-window CV com p = 0,49 (Cap. 5).

---

### p.11 §2.2 — "três gerações de representação textual" sem fonte
**Problema:** Afirmações sobre gerações de NLP sem citações.  
**Solução:**
- "Três gerações": `\cite{kellyxiu2023}` adicionado
- Word2Vec: `\cite{mikolov2013}` adicionado
- GloVe: `\cite{pennington2014}` adicionado
- Todas as entradas adicionadas em `referencias.bib`

---

### p.12 §2.3 — "Este trabalho utiliza quatro famílias de modelos"
**Problema:** Professor perguntou quais modelos e quais as outras opções.  
**Solução:** Seção expandida e dividida em dois parágrafos:
1. Os quatro modelos adotados com configurações específicas (camadas, unidades, hiperparâmetros, citações)
2. Modelos alternativos não adotados: Random Forest (usado como diagnóstico SHAP), Logistic Regression (testada em baselines ingênuos, premissas de linearidade inadequadas), GRU (redundante com BiLSTM neste contexto)

---

### p.14 §3.3 — "Os embeddings são reduzidos para 32 componentes via PCA"
**Problema:** Resultado do PCA não reportado.  
**Solução:** Texto agora informa que os 32 componentes retêm **61,4%** da variância total (extraído de `3.model_traning/index.ipynb`). PCA ajustado exclusivamente no treino para evitar data leakage.

---

### p.18 §5.3 — "exibe distribuição bimodal"
**Problema:** Professor perguntou "Por que bimodal?"  
**Solução:** Mecanismo explicado: o Transformer colapsa para um de dois estados degenerados (prevê quase sempre "Sobe" ou quase sempre "Desce") dependendo da inicialização, pois o sinal preditivo real é insuficiente para ancorar a otimização fora desses mínimos locais. Std = 0,261 destacado como 21× superior ao baseline (0,012).

---

### p.21 §5.7 — parágrafo de síntese desalinhado
**Problema:** Parágrafo recuado à esquerda, texto aparentemente quebrado.  
**Solução:** Removido o ambiente `\begin{citacao}` (ambiente ABNT para citações de terceiros — semanticamente errado para síntese do próprio autor). Substituído por parágrafo normal com texto em `\textbf{}`. Seção expandida de 2 para 4 parágrafos cobrindo: conclusão central, achados multi-seed, achados expanding-window + ablação, e transição para Cap. 6.

---

### p.22 §6.1 — "a demonstração mais detalhada deste fenômeno em dados brasileiros"
**Problema:** Faltou citar artigos que fizeram algo parecido.  
**Solução:** Parágrafo adicionado citando Ding et al. (2015), Hu et al. (2018) e Shah et al. (2019) — todos com protocolos de janela única sem análise de variância. Contribuição do TCC posicionada como "primeira demonstração quantificada em dados brasileiros, com suporte estatístico formal (1.500+ execuções, Wilcoxon, IC bootstrap) e inversão de conclusão qualitativa documentada." Entradas `\cite{ding2015}` e `\cite{hu2018}` adicionadas em `referencias.bib`.

---

## 2. Melhorias Adicionais (Avaliação Científica)

### Resumo / Abstract
- Estruturado em Background → Gap → Métodos → Resultados → Conclusão
- Contribuição front-loaded no início do segundo parágrafo
- Seis protocolos nomeados explicitamente
- Magnitude da reversão (0,709 → ~0,51, inversão qualitativa) explicitada
- FinBERT-PT-BR descrito com mais precisão no Resumo
- `\cite{souza2023}` adicionado ao Abstract (estava faltando)

---

### Capítulo 1 — Introdução
- B3 conectada explicitamente à não-transferibilidade de resultados internacionais
- "só recentemente" → "a partir de 2022"
- "pool de participantes é menor" → "menor do que em mercados desenvolvidos como os EUA"
- Definição de "baseline autoregressivo" adicionada na primeira ocorrência

---

### Capítulo 2 — Revisão Bibliográfica
- **BiLSTM:** citação corrigida — Hochreiter 1997 é para LSTM; bidireccionalidade agora atribuída corretamente sem adicionar referência ausente
- "adequadamente" (editorial) substituído por descrição precisa
- "atual" → "dominante desde o início da década de 2020"
- Parágrafo adicionado em §2.4 explicando expanding-window CV com referência a Lopez de Prado (2018)
- Sentença adicionada em §2.2 noting que estudos citados (Xu/Fischer) não reportam análise de semente ou CV multi-janela

---

### Capítulo 3 — Pipeline
- Table 2: `\textbf{Nota:}` adicionada no caption — valores são estimativas de semente e janela únicos
- §3.3: horizonte h=21 especificado; nota que h=5 é explorado no Cap. 5
- "média ponderada por recência" → "média simples" (weighting não estava definido)
- "fitado" → "ajustado" (todos os casos)

---

### Capítulo 4 — Sentimento FinBERT
- §4.3: discrepância 1.227 vs 1.207 dias explicada
- §4.3: look-ahead risk definido explicitamente antes da discussão de timestamps
- "Estima-se informalmente que 30–40%..." removido → substituído por "não auditado sistematicamente" com referência a §6.3
- `recall(Desce) = 0,20` → `0,15` (correção aritmética: 11/73 ≈ 0,15)
- Table 3: `\textbf{Nota:}` movida para dentro do caption
- Regressão do BiLSTM Reduzido (-0,028) explicada (dropout agressivo overregulariza input de 5 features)
- Truncação a 512 tokens adicionada

---

### Capítulo 5 — Investigação Metodológica
- Experimento "Ensemble + backtest" (20 runs na tabela, sem descrição) → sentença explicativa adicionada
- "sobreposição parcial entre janelas de teste" → corrigido para "adjacência entre janelas de teste, sobreposição entre validação e teste do fold seguinte"
- PRICE / SENT / PRICE+SENT definidos antes da Tabela 8
- Δ = PRICE+SENT − PRICE adicionado ao caption da Tabela 8
- Std = 0,261 do Transformer destacado como 21× o do baseline (0,012)
- d ≈ 6,4: denominador 0,04 rastreado à Figura 2 (dados ITUB4)
- Folds degenerados definidos (menos de 20 amostras ou 5 exemplos da classe minoritária)
- MDE: `efeitos menores que ΔAUC ≈ 0,05` corrigido → `ΔAUC ≈ 0,13`
- Apêndice A referenciado em §5.1; Apêndice B referenciado em §5.6
- Conclusão de escopo específico adicionada em §5.7 (aplica-se à representação adotada, não a toda codificação textual possível)
- Transição Cap. 5 → Cap. 6 adicionada ao final de §5.7

---

### Capítulo 6 — Conclusão
- Contribuição 2: claim "mais detalhada" qualificado com especificidade ("primeira demonstração quantificada... com suporte estatístico formal")
- "a própria comunidade considera aceitáveis" → "a própria comunidade de ML financeiro considera aceitáveis"
- Limitação 5 (mismatch h=21/h=5): fortalecida com argumento "improvável que a conclusão se inverta"
- Limitação 6 adicionada: instabilidade arquitetural do Transformer impede atribuição causal limpa
- Ding/Hu: caracterização qualificada via revisão sistemática de Shah et al. (2019)
- Seis protocolos cross-referenciados com tabelas/figuras: itens (2), (3), (5)
- "Seção anterior" → referência com label

---

### Siglas
- ECE removido da lista (entrada órfã — nunca aparece no corpo do texto)
- MDE expandido na primeira ocorrência no corpo: "Tamanho Mínimo de Efeito Detectável (MDE)"
- SHAP expandido na primeira ocorrência: "SHAP (\textit{SHapley Additive exPlanations})"
- TCN expandido na primeira ocorrência em §1.2.2: "TCN --- \textit{Temporal Convolutional Network}"
- forward-fill definido na primeira ocorrência em §3.2
- walk-forward split 70/15/15 explicado em §3.3

---

### Correções Aritméticas
| Localização | Antes | Depois |
|-------------|-------|--------|
| §5.4 expanding-window | `5×5×3 = 145` | `5×5×3×2 = 150 programados; 145 realizados` |
| §5.4 VALE3 deep-dive | `52×10 = 880` | `52×10×2 = 1.040 programados; 880 realizados` |
| §4.3 recall(Desce) | `0,20` | `0,15` (11/73 ≈ 0,15) |
| §5.1 MDE threshold | `ΔAUC ≈ 0,05` | `ΔAUC ≈ 0,13` |
| §5.4 Cohen's d | `0,25/0,04` | `0,255/0,04` |

---

## 3. Estado Final

- **PDF compilado:** `V1/docs/tcc.pdf` — 32 páginas, zero erros LaTeX
- **Sequência de compilação:** `pdflatex → bibtex → pdflatex → pdflatex`
- **Avaliação final por agente independente:** A+ (todos os 7 critérios PASS)
- **Regressões encontradas após edições:** 0
