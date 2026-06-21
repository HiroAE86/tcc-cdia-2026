# Imagens por slide — o que está na tela e o que falar

> Inventário visual do deck (`apresentacao.tex`). Para cada slide: **o que aparece** (figura, tabela, diagrama ou texto) e **como narrar a imagem** — onde apontar, o que dizer, o que NÃO dizer.
> Regra de ouro da banca (Prof. Tanara): **não leia a tabela — interprete o número.** Aponta para a parte da figura que importa e diz o que ela significa.
> 4 figuras PNG reais (slides 13–16, todas em `V1/9.baselines/`). O resto é tabela `booktabs`, diagrama TikZ ou texto.

---

## Slide 1 — Título
**Imagem:** nenhuma. Só capa (título, subtítulo, autor, orientador, instituição, data).
**Falar:** não aponta nada. Olha para a banca, não para o telão.

## Slide 2 — Roteiro
**Imagem:** nenhuma. Lista numerada (5 partes) + bloco "Mensagem central" em destaque (caixa teal à direita).
**Falar:** percorre os 5 itens rápido com a mão. Para no bloco da direita e crava a tese ("não sobreviveu ao rigor — documentar isso é a contribuição").

## Slide 3 — Contexto e motivação
**Imagem:** nenhuma. 4 bullets + bloco "Lacuna".
**Falar:** corre. Banca já leu. Fecha apontando o bloco "Lacuna".

## Slide 4 — Pergunta de pesquisa
**Imagem:** nenhuma. Pergunta grande centralizada + 2 caixas (representação textual / robustez) + linha do estudo de caso.
**Falar:** ÚNICO slide que pode LER. Lê a pergunta grande. Aponta a caixa (a) e a (b). Fecha com os 3 ativos e os horizontes.

## Slide 5 — Dados
**Imagem:** **tabela** (corpus InfoMoney: 3 ativos × artigos × período) à esquerda + bullets de mercado/alvo à direita. Não é figura, é tabela.
**Falar sobre a tabela:** não lê linha por linha. Aponta o **Total 5.872** e a **assimetria** — "Itaú concentra 2.572, Vale só 1.525; cobertura desigual, limitação que eu declaro". Depois pula para o alvo binário e o desbalanceamento 59/41.

## Slide 6 — Pipeline ⭐ (diagrama)
**Imagem:** **diagrama TikZ** — fluxo horizontal de 5 caixas: Notícias → Representação textual → Left join + forward-fill → Modelos → Avaliação. Uma caixa embaixo (Yahoo Finance) entra no merge.
**Falar sobre o diagrama:** percorre o fluxo com o dedo, esquerda→direita. Para na caixa do meio (**merge + forward-fill**) — é a zona quente. "Aqui está o ponto que eu levanto antes que perguntem." Aí solta a fala do forward-fill: propaga passado, não futuro; risco real é intradiário; viés favorece o sentimento → nulo é limite superior otimista.
**Não dizer:** não entra em detalhe de biblioteca Python. O diagrama é o mapa, não o código.

## Slide 7 — Etapa 3 (embeddings genéricos)
**Imagem:** **tabela** pequena (4 modelos × AUC) à direita, legenda "ROC-AUC, janela única, h=21".
**Falar sobre a tabela:** aponta a linha do **XGBoost 0,610** (o melhor) e diz "mesmo o melhor caso ficou **acima do acaso, mas fraco** — e os baselines de preço já superam isso". Não lê as outras 3 linhas — só menciona "os outros, mais perto de 0,5". Interpreta: embedding genérico = ruído semântico irrelevante. *(Não diga "0,61 é quase chute" — a banca corrigiu: 0,61 ≠ 0,5.)*

## Slide 8 — Etapa 4 (FinBERT-PT-BR)
**Imagem:** nenhuma figura. Bullets do modelo (esquerda) + lista das 5 features (direita) + bloco "Hipótese".
**Falar:** explica o FinBERT em uma frase (BERT afinado em PT financeiro). Aponta as 5 features. Fecha no bloco "Hipótese".

## Slide 9 — O resultado que "confirmou" ⭐ (tabela-chave)
**Imagem:** **tabela** E3 vs E4 com a coluna Δ. A célula **Transformer 0,709** está em coral (alert) — é o número-âncora do trabalho.
**Falar sobre a tabela:** aponta direto a célula coral. "O Transformer salta de 0,568 para 0,709, ganho de 0,141." Não lê as linhas do BiLSTM. Constrói a tensão: narrativa coerente, bate com a literatura → "Caso encerrado? Não." (pausa antes de virar).

## Slide 10 — Três sinais de alerta
**Imagem:** nenhuma. Lista numerada (3 sinais) + bloco "Decisão".
**Falar:** os 3 sinais, com ênfase no número de cada um (11/177 · 76% ≈ 69% · sem IC/1 semente/1 janela). Fecha no bloco "Decisão".

## Slide 11 — Investigação (tabela de experimentos)
**Imagem:** **tabela** (8 experimentos × runs, total 1.435) à esquerda + regras fixas à direita. *(Fonte ajustada para `\footnotesize` — diretriz Tanara ≥18.)*
**Falar sobre a tabela:** não lê os 8 nomes. Aponta o **Total 1.435** e diz "oito experimentos, mil quatrocentas e trinta e cinco execuções". Depois move para as **regras fixas** (direita) — é o que blinda contra a acusação de p-hacking: hiperparâmetros congelados, scaler só no treino, bootstrap, Wilcoxon.

## Slide 12 — Hierarquia de baselines (tabela)
**Imagem:** **tabela** (4 preditores × AUC com IC). A linha **Autoregressivo 0,658 [0,565; 0,744]** em negrito.
**Falar sobre a tabela:** aponta a linha do autoregressivo. O golpe é o IC: "esse intervalo, de 0,565 a 0,744, **já engloba o 0,709**." Esse é o ponto inteiro do slide — diz devagar. As 3 linhas de cima (triviais) só de passagem.

## Slide 13 — Multi-seed ⭐ (FIGURA: 2 histogramas)
**Imagem:** `multi_seed_histograms.png` — **dois painéis lado a lado**.
- **Painel esquerdo "AUC across 20 seeds":** barras AZUIS (Transformer+FinBERT) espalhadas de ~0,08 a ~0,93; barras VERMELHAS finas (baseline) apertadas perto de 0,65. Linha tracejada preta vertical no 0,709 (resultado original). Linha pontilhada cinza no 0,5 (acaso).
- **Painel direito "Precision-Down across 20 seeds":** mostra que em quase todas as sementes a precision da classe "Desce" fica perto de 0 — só raríssimas passam do threshold 0,85 de "detector útil".

**Como narrar (esta é a estrela do bloco — vale 30-40s):**
1. Aponta as **barras azuis espalhadas**: "cada barra é uma semente. Olha a dispersão — vai de 0,08 a 0,93."
2. Aponta as **barras vermelhas apertadas**: "agora o baseline: todas empilhadas perto de 0,65. Estável. Desvio 21 vezes menor."
3. Aponta a **linha tracejada no 0,709**: "e aqui está o resultado original. Ele cai bem na ponta direita da nuvem azul — foi uma semente sortuda, não o desempenho do modelo."
4. Nomeia o formato: "repara que o azul é **bimodal** — acumula nas pontas, não no meio. O modelo colapsa para 'sempre sobe' ou 'sempre desce'."
**Não dizer:** não precisa explicar o painel direito em detalhe — é reforço. Se sobrar tempo: "à direita, a precisão da classe Desce quase nunca chega a ser útil."
**⚠️ Cuidado:** a legenda diz "Dumb baseline (XGB)". No texto do TCC isso virou "baseline autoregressivo". Se a banca apontar: "é o mesmo objeto — na figura ficou o nome antigo, no texto está autoregressivo."

## Slide 14 — Expanding-window CV ⭐ (FIGURA: 3 painéis + tabela)
**Imagem:** `expanding_cv_overtime.png` — **três painéis** (ITUB4, PETR4, VALE3). Cada um: eixo x = fold (tempo →), eixo y = ROC-AUC. Linha VERMELHA (baseline XGB) e linha AZUL (Transformer+FinBERT) com barras de erro. Linha pontilhada no 0,5.
+ **tabela** ao lado (AUC médio por ativo, coluna Δ).

**Como narrar:**
1. "Agora, em vez de uma janela, cinco folds ao longo do tempo."
2. Aponta **ITUB4 e PETR4**: "olha a linha vermelha, o preço, ficando consistentemente **acima** da azul. O sentimento fica colado no acaso, às vezes abaixo."
3. Aponta a **tabela, linha Média**: "na média dos três, baseline 0,667, Transformer 0,509. **Inverteu.**"
4. Aponta **VALE3** (terceiro painel): "uma exceção — aqui o azul encosta no vermelho. Ganho pequeno, 0,036. E eu fui atrás dela." → gancha o próximo slide.
**Não dizer:** não descreve fold por fold. O olho da banca precisa ver "vermelho em cima na maioria".

## Slide 15 — VALE3 deep-dive ⭐ (FIGURA: histograma sobreposto)
**Imagem:** `vale3_deepdive_hist.png` — **um histograma** de 880 runs. Barras AZUIS (Transformer, mean=0,484) e VERMELHAS/rosa (baseline, mean=0,544) sobrepostas. Linhas tracejadas verticais nas duas médias + pontilhada no acaso (0,5).

**Como narrar:**
1. "Aprofundei só a Vale: 52 folds vezes 10 sementes, 880 execuções."
2. Aponta as **pontas do azul**: "de novo o colapso bimodal — picos perto de 0 e perto de 1. Assinatura de classificador degenerado."
3. Aponta as **médias tracejadas**: "e a média do Transformer, 0,484, fica **abaixo** da do baseline, 0,544. Mesmo na exceção, o sentimento perde." Wilcoxon p = 0,194, não significativo.
**⚠️ Atenção ao número:** esta figura mostra o Transformer **abaixo** do baseline (−0,06), enquanto o slide 14 mostrava a Vale com +0,036 no CV. Não é contradição — são protocolos diferentes (CV 5×5 vs deep-dive 52×10). Narra como "o ganho aparente do CV não resistiu ao aprofundamento". Se perguntarem, ver `perguntas_previstas.md` Q12b.
**⚠️ Legenda:** "Dumb baseline" de novo — mesmo aviso do slide 13.

## Slide 16 — Ablation ⭐ (FIGURA: boxplot 9 caixas)
**Imagem:** `ablation_boxplot.png` — **boxplot com 9 caixas**, agrupadas por ativo (ITUB4 | PETR4 | VALE3), cada grupo com 3 caixas: PRICE (vermelha), SENT (verde), PRICE+SENT (azul). Triângulo verde = média. Linha pontilhada no 0,5.
+ **tabela** ao lado (PRICE/SENT/P+S/Δ por ativo).

**Como narrar (o veredito — vale uns 40s):**
1. "Ablation final, com XGBoost porque é o modelo estável. Três condições: só preço, só sentimento, preço+sentimento."
2. Aponta as **caixas verdes (SENT)**: "olha o sentimento sozinho — as caixas verdes ficam **na linha do acaso ou abaixo**. Sozinho, o sentimento não prevê nada."
3. Compara **vermelha (PRICE) vs azul (PRICE+SENT)** dentro de cada ativo: "e adicionar o sentimento ao preço — vermelha vs azul — quase não move a caixa."
4. Aponta a **tabela, coluna Δ**: "ITUB4 **piora** 0,033, PETR4 **piora** 0,016, só a Vale sobe 0,058. Média: mais 0,003. Dois dos três pioram. A média perto de zero é ganho e perda se cancelando — não um efeito positivo pequeno."
5. Crava: "p de 0,49, IC cruzando o zero. Estatisticamente, zero. Efeito 44 a 74 vezes abaixo do detectável. Veredito final."
**Não dizer:** não lê as 9 caixas uma a uma — agrupa por cor (verde=fraco, vermelho≈azul).

## Slide 17 — Síntese
**Imagem:** nenhuma. Bloco "Conclusão unificada" + lista numerada (3 causas do artefato) + nota de escopo.
**Falar:** lê/parafraseia o bloco. Os 3 itens (variância de semente, viés de janela, ausência de IC). Fecha no escopo: vale para a representação adotada, não para todo texto.

## Slide 18 — Contribuições e protocolos
**Imagem:** nenhuma. Duas colunas (3 contribuições | 6 protocolos) + nota López de Prado.
**Falar:** 3 contribuições rápido. Os 6 protocolos com a mão (não decora um a um se apertar). Honestidade: protocolos são de Prado; a contribuição é a magnitude do dano (0,709 → ~0,51).

## Slide 19 — Limitações e trabalhos futuros
**Imagem:** nenhuma. Duas colunas (6 limitações | 5 futuros).
**Falar:** já antecipou a maioria — passa rápido. Destaca o look-ahead "joga contra a conclusão, não a favor". Futuros: diversificar fontes, arquiteturas estáveis, outros mercados, MCC.

## Slide 20 — Mensagem final
**Imagem:** nenhuma. Bloco central grande (a frase-tese) + 3 bullets + "Obrigado".
**Falar:** desacelera. Lê o bloco central devagar — é a frase que fica. 3 bullets. Termina exatamente em "autocorreção documentada vale mais que um resultado positivo frágil. Obrigado."

---

## Resumo: onde estão as figuras (e onde PARAR mais tempo)

| Slide | Tipo de imagem | Tempo na imagem | O que o olho da banca precisa ver |
|---|---|---|---|
| 6 | Diagrama TikZ (pipeline) | médio | a caixa do merge + forward-fill |
| 9 | Tabela (célula coral 0,709) | curto | o salto para 0,709 |
| 12 | Tabela (IC do baseline) | médio | o IC já engloba 0,709 |
| **13** | **Figura: 2 histogramas** | **longo ⭐** | azul espalhado vs vermelho apertado; 0,709 na ponta |
| **14** | **Figura: 3 painéis + tabela** | **longo ⭐** | vermelho acima do azul em ITUB4/PETR4 |
| **15** | **Figura: histograma sobreposto** | **médio ⭐** | bimodal nas pontas; média azul < vermelha |
| **16** | **Figura: boxplot 9 caixas** | **longo ⭐** | verde no acaso; vermelho ≈ azul |

As 4 figuras reais (13–16) são o coração visual. Slides de texto (1–4, 8, 10, 17–20): olha para a banca, não para o telão.

## Pendência cosmética (decidir antes de imprimir o PDF)
- Figuras dos slides 13 e 15 trazem a legenda **"Dumb baseline (XGB)"**. O texto do TCC usa **"baseline autoregressivo"**. Para consistência total, regenerar as 2 figuras com o rótulo novo. Se não der tempo: ter a frase pronta ("mesmo objeto, nome antigo na figura").
