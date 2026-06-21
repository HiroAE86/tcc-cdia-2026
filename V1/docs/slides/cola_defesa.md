# Cola de defesa — 1 página (ler 5 min antes)

> Defesa amanhã 12:00. Olhar isto por último.

## Pitch de 30 segundos (decorar)
"Construí pipeline completo de sentimento de notícias para prever direção de ações da B3. Obtive **AUC 0,709** — parecia confirmar a hipótese. Desconfiei: matriz de confusão degenerada, sem IC, uma semente, uma janela. Rodei **~1.510 execuções** para atacar o próprio resultado. Ele morreu: o sentimento adiciona **Δ = +0,003 (p = 0,49)** — estatisticamente zero. O 0,709 era **artefato de janela única**. Contribuição real: demonstração quantificada do viés de janela única em dados brasileiros + 6 protocolos mínimos."

## O arco em 7 passos
Pergunta → Pipeline → AUC 0,709 (parece win) → 3 sinais de alerta → 13 experimentos → resultado morre → lição metodológica = contribuição.

## 3 sinais de alerta (por que desconfiei do 0,709)
1. precision Desce 1,00 / recall 0,15 — prevê "Desce" só 11×/177 (matriz degenerada)
2. acurácia 76,3% ≈ classe majoritária (~69%)
3. sem IC, 1 semente, 1 janela

## Cada experimento mata uma fuga
| "Mas pode ser..." | Refutação |
|---|---|
| baseline fraco | não: autoregressivo 0,658, IC [0,565; 0,744] já engloba 0,709 |
| dimensionalidade | não: 5 dims aleatórias → 0,509 |
| azar de semente | inverso: 0,709 foi **sorte** de semente (Transformer bimodal) |
| a janela | exato: fora dela inverte (CV 0,667 vs 0,509) |
| só VALE3 funcionava | deep-dive 880 runs → p = 0,194, não significativo |
| Transformer ruim | ablation usa XGBoost (std 0,012) → Δ +0,003 mesmo assim |

## Números na ponta da língua
| Número | O que é |
|---|---|
| **0,709** | AUC Transformer+FinBERT, janela única — o artefato |
| **0,658 [0,565; 0,744]** | baseline autoregressivo — IC já engloba 0,709 |
| **0,261 vs 0,012** | std multi-seed Transformer vs baseline (21×) |
| **0,667 vs 0,509** | AUC médio CV: baseline vs Transformer (a inversão) |
| **+0,003, p = 0,49** | ganho do sentimento (ablation, 225 runs) — veredito |
| **p = 0,194** | VALE3 deep-dive, 880 runs |
| **0,13–0,22** | MDE — sentimento está 44–74× abaixo do detectável |
| **~1.510** | total de execuções |
| **5.872** | artigos (2.572 ITUB4 / 1.775 PETR4 / 1.525 VALE3) |
| **61,4%** | variância retida PCA 32 comps (só treino) |

## Top 5 perguntas — resposta de 1 linha
1. **Baseline 0,70 contradiz EMH?** AUC ≠ lucro. Momentum/autocorrelação; backtest não virou retorno após custos.
2. **Forward-fill vaza futuro?** Não — propaga passado. Risco real é intradiário; viés favorece sentimento → nulo é limite superior otimista.
3. **Colapso bimodal = só Transformer ruim?** Conclusão não depende dele — ablation com XGBoost (mais estável) dá mesmo Δ +0,003.
4. **Subpotenciado (MDE)?** "Nenhum efeito detectável neste n" — mas mesmo desenho detecta preço (0,667 estável). Protocolo é sensível.
5. **3 ativos / 1 fonte generaliza?** Não reivindica. Limitações declaradas. Vale para representação adotada nesses 3 ativos.
6. **Não ia balancear as classes (50/50)?** *(o prof sugeriu)* Não reamostrei: quebraria a ordem temporal e a base rate real. Compensei com peso na perda (`pos_weight≈1,38`). Decisivo: Transformer colapsou MESMO com a compensação → desbalanceamento não era a causa raiz.

## Escopo — o que NÃO afirmo (decorar)
- NÃO: notícias nunca têm valor (outras representações = futuro)
- NÃO: generaliza além de ITUB4/PETR4/VALE3 + InfoMoney
- NÃO: 0,667 é lucrável (AUC ≠ retorno após custos)

## 6 protocolos (contribuição prática)
IC bootstrap · ≥10 sementes · expanding-window CV · baseline autoregressivo · monitorar distribuição de predições · auditar correlação val-teste.
Origem: López de Prado (2018). **Contribuição: mostrar a magnitude do dano de ignorá-los** (0,709 → ~0,51 em dados BR).

## Se travar
"O resultado nulo, obtido com rigor, vale mais que um falso positivo. A contribuição não é 'sentimento não funciona' — é mostrar **quão fácil é fabricar evidência aparente** com protocolos que a própria comunidade aceita."
