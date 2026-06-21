# Roteiro slide-a-slide — o que falar + o que pode cair

> 20 slides, **~15 min**. Por slide: **fala** (o que dizer) · **decisões em jogo** (o que justificar) · **perguntas prováveis aqui**.
> Cruza com `discurso_para_decorar.md` (a fala corrida para decorar), `glossario_flashcards.md` (cada termo na ponta da língua, formato treinável), `justificativas_decisoes.md` (o porquê), `perguntas_previstas.md` (respostas longas) e `ferramentas_explicadas.md` (o que é cada ferramenta em 3 níveis).

---

## Diretrizes da banca (Prof. Tanara) — aplicar antes de montar os slides

**Estética (corrigir nos slides):**
- **Fonte do corpo 22–24**; tabelas e gráficos **mínimo 18**. Se a tabela de validação (ex.: hierarquia de baselines, ablation) ficar densa, **quebra em dois slides** — não espreme.
- **Sem serifa**: Arial, Montserrat ou Calibri. Consistente em tudo.
- **Espaçamento ≥ 1,15** (evita o 1,0 que amontoa e tenta a gente a encher de texto).
- **Slide = guia, não teleprompter.** Tópicos curtos, não blocos. Nada de parágrafos sobre bibliotecas Python ou referencial financeiro — isso é fala, não slide.
- **Imagem só funcional.** Zero foto ilustrativa (bolsa, robô, gráfico genérico). Só o que carrega dado: **matriz de confusão, distribuição bimodal de AUC, curva de variância do PCA, esquema da pipeline, boxplot dos folds**.
- **Salva-vidas: leve em PDF no pen-drive.** Evita desconfigurar no PC da PUC.

**Distribuição de tempo (15 min) — onde o vídeo manda focar:**
- **Introdução/contexto: corre.** A banca já leu. Slides 3–4 ≤ 2 min somados. Não recita literatura.
- **Objetivo (slide 4): única parte que pode LER do slide** — pra cravar a pergunta de pesquisa nas palavras exatas. (No teu caso: *"o sentimento de notícias melhora a previsão de direção na B3?"* — não "validar que a IA funciona". A resposta acabou **nula**, e isso é o trabalho.)
- **Metodologia: o coração das perguntas.** É onde a banca de Ciência de Dados cava critério de treino/teste. Detalha pipeline, forward-fill, walk-forward vs expanding-window, baselines, bootstrap. Slides 5–6 + 11–14.
- **Resultados/investigação: a estrela.** Slides 10–16. **Não leia a tabela — interpreta:** "o Transformer só bate 0,709 numa janela e numa semente; sob CV ele *inverte* pra 0,509 < baseline 0,667, o que estatisticamente significa que o 0,709 era artefato." Letras das legendas ≥ 18.
- **Considerações finais: objetivo.** Slide 17–20. Responde a pergunta do slide 4 de frente: o sentimento **não** adiciona sinal detectável; a contribuição é a autocorreção documentada.

> ⚠️ Ajuste de narrativa vs vídeo: o vídeo é genérico e fala em "validar que a IA é segura/funciona". O **teu** trabalho conclui o oposto — resultado **nulo** + autocorreção. Mantém o foco em Metodologia/Resultados que o vídeo recomenda, mas **nunca** prometa que validou a eficácia. A força da tua defesa é o rigor que derrubou o próprio resultado positivo.

> ⚠️ **Discrepância de números:** o deck diz **1.435 execuções / 8 experimentos** (só os principais). O texto do TCC diz **~1.510 / 13 experimentos** (inclui dimensionality_control, naive_baselines, horizon_sweep, tcn_validation, power_analysis). Se perguntarem: "1.435 são os 8 experimentos centrais da reversão; o total com diagnósticos auxiliares passa de 1.500." Não te contradiz.

---

## Slide 1 — Título
**Fala:** nome, título, "sentimento de notícias para prever direção na B3, com uma reviravolta metodológica". 10s.

## Slide 2 — Roteiro
**Fala:** 5 blocos. Cravar a mensagem central: "resultado positivo sob protocolo padrão **não sobreviveu** ao rigor — documentar isso é a contribuição." Já planta a tese.

## Slide 3 — Contexto e motivação
**Fala:** notícias como feature preditiva é linha ativa, mas resultados vêm de mercado desenvolvido (S&P). B3 é estruturalmente diferente. FinBERT-PT-BR só existe desde 2022 → lacuna em PT.
**Perguntas aqui:**
- *Por que B3 é diferente do S&P?* → menor liquidez, poucas fontes, menos institucionais → não dá pra extrapolar resultado gringo.
- *Por que importa ser em português?* → léxico financeiro PT, modelo específico recente.

## Slide 4 — Pergunta de pesquisa
**Fala:** a pergunta + as 2 dimensões: (a) representação textual genérica vs específica; (b) robustez metodológica. Caso: 3 ativos, h=5 e 21.
**Decisões:** escolha dos 3 ativos; horizontes.
**Perguntas aqui:**
- *Por que só 3 ativos?* → large-caps líquidas, mais cobertura → melhor chance de achar sinal. Limitação declarada.
- *Por que h=5 e 21?* → drift pós-notícia semanal/mensal; curto demais = microestrutura.

## Slide 5 — Dados
**Fala:** 5.872 artigos InfoMoney (API WordPress), OHLCV Yahoo, 11 features de preço, alvo binário Close[t+h]>Close[t], desbalanceamento 59/41.
**Decisões:** InfoMoney, 11 features, alvo binário, tratamento de desbalanceamento.
**Perguntas aqui:**
- *Por que InfoMoney?* → maior fonte BR, API pública. Viés varejo = limitação #1.
- *Como tratou o 59/41?* → `pos_weight`/`class_weight` ≈1,38 em todos os modelos.
- *Cobertura desigual (2.572 vs 1.525)?* → reconhecido, viés de cobertura por ativo.

## Slide 6 — Pipeline
**Fala:** percorrer o fluxo: notícia → representação → merge (left join + forward-fill) → modelos → avaliação. Janela 30d. **Marcar o forward-fill como risco conhecido** antes que perguntem.
**Decisões:** forward-fill (QUENTE), janela 30d, left join.
**Perguntas aqui (a mais provável da defesa):**
- *Forward-fill vaza futuro?* → **Não, propaga passado.** Risco real é intradiário (notícia pós-17h no dia t). Viés **favorece** sentimento → nulo é limite superior otimista. (decorar esta)
- *Por que 30 dias?* → contexto vs nº amostras.

## Slide 7 — Etapa 3 (embeddings genéricos)
**Fala:** qwen3 1.024d → PCA 32 (61,4% variância, só treino). Todos perto do acaso (melhor XGBoost 0,610). Leitura: genérico carrega ruído irrelevante.
**Decisões:** qwen3, PCA 32.
**Perguntas aqui:**
- *Por que PCA 32?* → curva de variância acumulada, ajustado só no treino (sem vazamento).
- *Por que qwen3?* → local, custo zero, multilíngue. Escolha não-crítica (controle de dimensionalidade confirma).

## Slide 8 — Etapa 4 (FinBERT-PT-BR)
**Fala:** BERT fine-tuned em PT financeiro, 3 logits/artigo → 5 features diárias. Hipótese: compacto e específico > 1.024 genéricas.
**Decisões:** FinBERT-PT-BR, redução a 5 features.
**Perguntas aqui:**
- *Por que FinBERT e não GPT/LLM?* → específico ao domínio PT, determinístico, sem custo de API.
- *Por que só 5 features?* → compacto, interpretável, alinha por dia. Conclusão vale pra essa representação.

## Slide 9 — AUC 0,709 ("confirmou" a hipótese)
**Fala:** tabela E3 vs E4. Transformer salta pra **0,709**, Δ+0,141. Narrativa coerente, bate com a literatura. "Caso encerrado? **Não.**" — momento de tensão, é o gancho do trabalho.
**Perguntas aqui:**
- *Por que desconfiou se bateu com a literatura?* → exatamente porque "fazia sentido demais" + matriz degenerada + sem IC. Próximo slide.

## Slide 10 — Três sinais de alerta
**Fala:** (1) precision Desce 1,00 / recall 0,15 — prevê Desce só 11/177; (2) acurácia 76,3% ≈ majoritária 69%; (3) sem IC, 1 semente, 1 janela. Decisão: submeter a protocolos progressivos.
**Perguntas aqui:**
- *Por que acurácia alta é suspeita?* → prever sempre a majoritária dá ~69% de graça. AUC desmascara.
- *Matriz degenerada não é só desbalanceamento?* → contribui, mas `pos_weight` já compensava e mesmo assim colapsou → não é a causa principal.

## Slide 11 — Investigação (8 experimentos, 1.435 runs)
**Fala:** tabela de experimentos. Regras fixas: hiperparâmetros congelados, scaler só no treino, bootstrap 1.000, Wilcoxon. Cada experimento responde uma pergunta pré-definida.
**Decisões:** não otimizar por fold; congelar hiperparâmetros.
**Perguntas aqui (QUENTE):**
- *1.435 runs não é p-hacking?* → **direção oposta** — destruir um positivo, não selecionar o melhor. Perguntas pré-definidas. (decorar)
- *Por que não otimizar por fold?* → mediria robustez, não desempenho; otimizar adiciona variância e confunde.
- *1.435 ou 1.510?* → ver nota no topo.

## Slide 12 — Hierarquia de baselines
**Fala:** majoritária 0,500 < coin flip 0,500 < persistência 0,474 < autoregressivo **0,658 [0,565; 0,744]**. O IC do baseline **já engloba 0,709**. Controle de dimensionalidade: 0,509.
**Decisões:** baseline autoregressivo de 5 features de preço; bootstrap CI.
**Perguntas aqui:**
- *Por que baseline autoregressivo?* → referência mínima honesta; sentimento tem que superar o preço sozinho.
- *Baseline 0,658 não contradiz EMH?* → AUC ≠ lucro; momentum/autocorrelação; backtest não virou retorno.

## Slide 13 — Multi-seed (colapso bimodal)
**Fala:** semente 42 → AUC despenca pra 0,442. 20 sementes: std **0,261** (21× o baseline), min 0,080 max 0,931. Distribuição **bimodal** — colapsa pra "sempre Sobe" ou "sempre Desce". 0,709 foi semente sortuda.
**Decisões:** ≥10 sementes.
**Perguntas aqui:**
- *Bimodal não é só early stopping ruim?* → não; critério é loss de validação, paciência 10, colapso independe disso.
- *Por que bimodal e não só ruído?* → sinal preditivo insuficiente pra ancorar a otimização fora dos mínimos degenerados.

## Slide 14 — Expanding-window CV (a inversão)
**Fala:** trocar 1 janela por 5 folds → **inverte**. Baseline 0,667 vs Transformer 0,509. ITUB4 Δ−0,255 ≈ 6× o desvio do baseline. Exceção: VALE3 +0,036 (próximo slide).
**Decisões:** expanding-window em vez de walk-forward único (o coração).
**Perguntas aqui (QUENTE):**
- *Por que expanding-window e não walk-forward único?* → múltiplas estimativas fora da amostra, mede nível E variância (Prado 2018).
- *Folds sobrepostos violam independência (Wilcoxon)?* → reconhecido; efeito conservador, não cria significância espúria em nulo.

## Slide 15 — VALE3 deep-dive (880 runs)
**Fala:** único ativo com Δ>0. Pra não cherry-pickar, reforcei: 52 folds × 10 sementes. Resultado **p=0,194, não significativo**. Bimodal severo (picos <0,05 e >0,95).
**Perguntas aqui:**
- *Por que aprofundar só VALE3?* → era a única ameaça à conclusão; aprofundar contra a própria hipótese = honestidade.

## Slide 16 — Ablation (sentimento adiciona algo?)
**Fala:** XGBoost (mais estável), PRICE vs SENT vs PRICE+SENT, 225 runs. PRICE 0,662, SENT 0,480 (abaixo do acaso), P+S 0,665. **Δ=+0,003, p=0,49, IC [−0,012; +0,018]**. Efeito 44–74× abaixo do MDE. **Veredito final.**
**Decisões:** XGBoost na ablation (não Transformer); MDE.
**Perguntas aqui (QUENTE):**
- *Por que XGBoost e não o Transformer do 0,709?* → Transformer bimodal confunde feature vs arquitetura; XGBoost estável isola. Conclusão **não depende** do Transformer. (decorar)
- *SENT < 0,5 é bug?* → não, features não-informativas; AUC<0,5 dentro do ruído.
- *Estudo subpotenciado (MDE)?* → "nenhum efeito detectável neste n"; mas mesmo desenho detecta preço (0,667). Protocolo é sensível.

## Slide 17 — Síntese
**Fala:** conclusão unificada — sentimento não adiciona sinal mensurável em nenhum dos 3. 0,709 = artefato de (1) variância de semente, (2) viés de janela, (3) ausência de IC. **Escopo:** vale pra representação adotada, não pra todo texto.
**Perguntas aqui:**
- *Generaliza pra qualquer uso de texto?* → não, escopo declarado; representações ricas = futuro.

## Slide 18 — Contribuições e 6 protocolos
**Fala:** 3 contribuições (pipeline, demonstração quantificada BR, protocolos). 6 práticas mínimas. Honestidade: práticas são de Prado (2018) — a contribuição é mostrar a **magnitude do dano**.
**Perguntas aqui:**
- *Se os protocolos já existem, qual o ineditismo?* → primeira demonstração quantificada em dados BR da magnitude da reversão (0,709→~0,51).

## Slide 19 — Limitações e trabalhos futuros
**Fala:** 6 limitações (fonte única, 3 ativos, horizontes, representação, look-ahead residual — *contra* a conclusão, instabilidade Transformer). 5 direções futuras.
**Perguntas aqui:**
- Qualquer limitação vira pergunta. Já respondidas em `justificativas_decisoes.md`. Própria do trabalho declarar = força, não fraqueza.

## Slide 20 — Mensagem final
**Fala:** "a contribuição não é descobrir que sentimento não funciona — é mostrar **quão fácil é fabricar evidência de que funciona** com protocolos aceitos." Viés de confirmação invisível. Obrigado.
**Perguntas aqui:** geralmente começa o bloco de perguntas da banca → respira, ouve a pergunta inteira, busca no doc mental.

---

## Onde caem as perguntas QUENTES (prepare-se para parar nesses slides)
| Slide | Pergunta quente |
|---|---|
| 6 | forward-fill vaza futuro? |
| 11 | 1.435 runs = p-hacking? |
| 14 | por que expanding-window? folds sobrepostos? |
| 16 | por que XGBoost e não Transformer? subpotenciado? |
| 12 | baseline 0,70 contradiz EMH? |

## Ferramentas que podem cair em cada slide (detalhe em `ferramentas_explicadas.md`)
| Slide | Ferramentas | Profundidade esperada |
|---|---|---|
| 7 | Embeddings, Ollama/qwen3, PCA | 🟡 PCA · ⚪ Ollama |
| 8 | BERT, FinBERT-PT-BR | 🔴 a fundo |
| 9, 12 | AUC/ROC | 🔴 a fundo |
| 12 | Bootstrap CI | 🟡 defesa |
| 13 | Multi-seed, Transformer (colapso) | 🔴 Transformer |
| 14 | Expanding-window CV, Wilcoxon | 🔴 CV (coração) · 🟡 Wilcoxon |
| 16 | XGBoost, ablation | 🔴 XGBoost |
| 6 | Forward-fill | 🟡 quente |

🔴 = vão perguntar, sabe a fundo · 🟡 = sabe a defesa · ⚪ = só saber que existe.

## Ritmo (15 min — alinhado à Prof. Tanara)
| Bloco | Slides | Tempo | Postura |
|---|---|---|---|
| Abertura + contexto | 1–4 | ~2 min | **Corre.** Banca já leu. Só crava a pergunta (slide 4, pode ler). |
| Dados + pipeline (metodologia) | 5–6 | ~2,5 min | Detalha forward-fill e o fluxo. 1ª zona quente. |
| Resultado positivo | 7–9 | ~2 min | Monta a tensão do 0,709. |
| Investigação (a estrela) | 10–16 | ~6 min | **Núcleo, não corre.** Interpreta cada número, não lê tabela. |
| Conclusão | 17–20 | ~2,5 min | Responde a pergunta do slide 4. Objetivo, sem encher. |

- Margem de segurança: 15 min de fala deixa ~5 min de perguntas num slot de 20. Se o tempo apertar, **comprime 1–4 e 7–9**, nunca o bloco 10–16.
- Cronômetro do app (modo Apresentar) já está em **15 min**; o "ritmo" (verde/âmbar/coral) usa esse alvo.
