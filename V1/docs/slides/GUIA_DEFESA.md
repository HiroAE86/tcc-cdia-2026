# Guia de Defesa — leitura única antes de apresentar

> Gerado pelo loop noturno. Apresentação 12:30. Leia de cima a baixo uma vez; cada slide tem explicação simples + perguntas mapeadas com resposta de 1 linha. Ground truth: cola_defesa.md.
>
> **⚠️ COMO USAR:** este guia é MUNIÇÃO de Q&A, não roteiro falado. Para apresentar, decore só o parágrafo-tese + a tabela de 8 números abaixo. O resto é defesa, puxe só se perguntarem.

## A tese em um parágrafo (decorar — é isto que você fala)
"Eu comecei com um resultado aparentemente positivo: AUC 0,709. Mas ele vinha de janela única, semente única e sem intervalo de confiança. Ao aplicar 1.435 execuções de robustez, o ganho do sentimento caiu para Δ = +0,003, p = 0,49. Portanto a contribuição do trabalho não é provar que notícias preveem a B3, mas mostrar metodologicamente como um falso positivo convincente pode surgir e como evitá-lo."

## Os 8 números a decorar (resto é reserva)
| Número | Significado |
|---|---|
| **5.872** | artigos InfoMoney (total) |
| **3 ativos** | ITUB4, PETR4, VALE3 |
| **0,709** | AUC inicial — depois mostrado artefato |
| **1.435** | execuções centrais de robustez |
| **0,667 vs 0,509** | preço vence o sentimento na CV |
| **Δ = +0,003** | ganho médio do sentimento |
| **p = 0,49** | sem significância (ablation) |
| **p = 0,194** | VALE3 deep-dive, sem significância |

## Tom (dizer assim, NÃO assim)
- "não sobreviveu à avaliação robusta" — NÃO "morreu"
- "testar se o positivo é robusto" — NÃO "destruir o positivo"
- "demonstração quantificada em dados brasileiros" — NÃO "primeira demonstração"
- "esta representação de sentimento não adicionou ganho discriminativo detectável" — NÃO "notícias não adicionam nada"
- "métrica fixa, experimentos para testar" — NÃO "pré-registro a priori"

---

> **Glossário falado (definir UMA vez ao vivo, para banca mista) — fix dry-run #3:**
> - **bimodal** (S13/S15): "o modelo ou prevê sempre 'sobe' ou sempre 'desce', nunca no meio" — acumula nas duas pontas.
> - **ablation** (S16): "ligo e desligo o sentimento mantendo todo o resto igual, e meço a diferença".
> - **MDE** (S16): "o menor efeito que meu desenho conseguiria enxergar".
>
> **Reforços falados (fix dry-run #1 e #2) — já nos slides de reserva, dizer ao vivo se cobrarem:**
> - **S16 / subpotência:** "o ganho do sentimento (+0,003) está 44–74× ABAIXO do MDE por ativo — não é 'quase lá', é ordens de grandeza fora do detectável." (Reserva 22)
> - **S15 / VALE3:** "uma positiva em 6 células é o esperado por acaso; Bonferroni só reforça o nulo, e o deep-dive pós-seleção testa o melhor caso — joga A FAVOR do nulo." (Reserva 21)

---

## Slide 1 — Página de título: "Predição de Direção de Preços de Ações Brasileiras com Sentimento de Notícias Financeiras" (subtítulo: Pipeline, Evidência Aparente e Autocorreção Metodológica)
**Em uma frase:** É a capa que apresenta o tema (usar notícias para prever se ações da B3 sobem ou descem), o autor e o orientador, já sinalizando que o trabalho vira uma história de autocorreção.
**Como explicar (3 falas simples):** "Bom dia, sou André Takeo Fujiwara, orientado pelo Prof. Eric Bacconi Gonçalves." / "Investiguei se notícias financeiras brasileiras ajudam a prever a direção de preço de ações da B3." / "O subtítulo já entrega o arco: construí o pipeline, obtive uma evidência aparente de resultado positivo, e o trabalho é a autocorreção que a desmonta."
**Número(s) que importam:** —
**Perguntas prováveis (mais provável primeiro):**
1. *Por que "evidência aparente e autocorreção" no título?* → Porque o AUC 0,709 inicial era artefato de janela única; ao submeter o próprio resultado a 1.435 execuções nos 8 experimentos centrais, o ganho do sentimento caiu para Δ=+0,003 (p=0,49), sem efeito detectável.
2. *Qual é a pergunta de pesquisa central?* → Notícias financeiras brasileiras melhoram a predição de direção (sobe/desce) de ações da B3? Resposta do trabalho: não, neste tamanho amostral.
3. *Quais ações você estudou?* → ITUB4, PETR4 e VALE3, com 5.872 artigos do InfoMoney (2.572/1.775/1.525); não reivindico generalização além desses 3 ativos e dessa fonte.
4. *Qual a contribuição principal?* → Metodológica: demonstrar de forma quantificada o viés de janela única em dados brasileiros e propor 6 protocolos mínimos de avaliação.
**Armadilha:** Não prometer na abertura que "notícias preveem o mercado" nem citar o 0,709 como resultado — apresente o 0,709 desde já como o artefato que o trabalho derruba, para não soltar um overclaim que a banca cobrará depois.

## Slide 2 — Roteiro
**Em uma frase:** É o mapa da apresentação: cinco paradas que vão do contexto ao resultado inicial bom, à investigação que o derrubou, e à lição que ficou como contribuição.
**Como explicar (3 falas simples):** "Vou seguir cinco passos: contexto e pergunta, o pipeline de dados, o resultado inicial de AUC 0,709." / "Depois mostro a investigação metodológica com 1.435 execuções que ataquei meu próprio resultado." / "E fecho com a reversão da conclusão e os protocolos que proponho — a mensagem central é que um resultado positivo sob protocolo padrão não sobreviveu ao rigor, e documentar isso é a contribuição."
**Número(s) que importam:** 0,709 = AUC inicial (artefato de janela); 1.435 = execuções dos experimentos centrais.
**Perguntas prováveis (mais provável primeiro):**
1. *Qual é a sua contribuição principal, em uma frase?* → Documentar de forma quantificada que um resultado positivo (AUC 0,709) era artefato de janela única, e propor 6 protocolos mínimos — a contribuição é metodológica, não "sentimento funciona/não funciona".
2. *O resultado final foi positivo ou negativo para o sentimento?* → Negativo/nulo: o ganho do sentimento é Δ=+0,003 (p=0,49), nenhum efeito detectável neste n; o 0,709 caiu para ~0,51 sob avaliação rigorosa.
3. *1.435 execuções não é garimpar resultado (p-hacking)?* → Direção oposta: as execuções servem para testar a robustez de um resultado positivo, com métrica fixa e hiperparâmetros congelados — não para selecionar o melhor.
4. *Por que 1.435 e não os "mais de 1.500" que aparecem em outro lugar?* → 1.435 são os 8 experimentos centrais, cada um com p-valor; os ~80 restantes são sanity checks sem teste de hipótese (≈1.515 no total).
**Armadilha:** Não vender o 0,709 como conquista nem prometer "sentimento não funciona" — o roteiro deve anunciar desde já que o resultado foi revertido e que a contribuição é metodológica; superdimensionar o número inicial cria expectativa que você mesmo vai derrubar.

## Slide 3 — Contexto e motivação
**Em uma frase:** Há evidências positivas na literatura internacional, principalmente em mercados desenvolvidos, mas quase ninguém testou isso com rigor no mercado brasileiro, que é diferente — e essa é a lacuna que o trabalho ataca.
**Como explicar (3 falas simples):** "Usar notícias para prever preço de ação é uma linha de pesquisa ativa, mas os resultados positivos vêm quase todos de mercados desenvolvidos, como o S&P 500." "A B3 é estruturalmente diferente: menos liquidez, poucas fontes jornalísticas especializadas, menos players institucionais." "Para o Brasil há pouca evidência empírica, e quase nenhuma com avaliação metodologicamente rigorosa — é exatamente essa a lacuna que eu preencho."
**Número(s) que importam:** — (slide não traz números; FinBERT-PT-BR só existe desde 2022, gloss: ferramenta recente em português)
**Perguntas prováveis (mais provável primeiro):**
1. *Por que a B3 seria diferente do S&P 500?* → Menor liquidez, poucas fontes jornalísticas especializadas e menos investidores institucionais; por isso resultados de mercado desenvolvido não transferem direto, e o trabalho não reivindica generalização além de ITUB4/PETR4/VALE3 + InfoMoney.
2. *Qual é exatamente a lacuna que você preenche?* → Pouca evidência empírica para o Brasil e quase nenhuma com avaliação rigorosa; a contribuição real é metodológica: demonstrar quantificadamente o viés de janela única em dados brasileiros e propor 6 protocolos mínimos.
3. *Se há trabalhos positivos lá fora, você esperava que funcionasse aqui?* → Era a hipótese, mas o resultado não sobreviveu à avaliação robusta: o sentimento adiciona Δ=+0,003 (p=0,49), nenhum efeito detectável neste tamanho amostral; o AUC 0,709 inicial era artefato de janela única.
4. *Por que InfoMoney e só essas fontes?* → Cobertura desigual e viés editorial de varejo são limitação declarada; conclusão vale para a representação adotada nesses 3 ativos, com CVM/redes sociais como direção futura.
5. *FinBERT-PT-BR ser de 2022 limitou seu estudo?* → Não invalida; é justamente o que torna NLP financeiro em português recente e a evidência rara — reforça a lacuna, não a enfraquece.
**Armadilha:** Não vender a contribuição como "provei que notícias preveem a B3" nem como "notícias não têm valor". A contribuição é metodológica (documentar a reversão de um falso positivo); afirmar valor preditivo aqui seria overclaim — o veredito honesto é Δ=+0,003, p=0,49.

## Slide 4 — Pergunta de pesquisa
**Em uma frase:** A pergunta central do trabalho é se notícias financeiras brasileiras ajudam a prever se uma ação da B3 vai subir ou descer, testada em três ativos com duas sub-perguntas: qual representação do texto usar e se o resultado aguenta um teste estatístico rigoroso.
**Como explicar (3 falas simples):** "A pergunta é direta: notícias melhoram a previsão de direção de preço na B3?" / "Quebrei isso em duas frentes: que representação do texto usar — embeddings genéricos ou sentimento FinBERT — e se a avaliação aguenta CV, múltiplas sementes e teste formal." / "Estudo de caso em ITUB4, PETR4 e VALE3, com horizontes de 5 e 21 dias úteis."
**Número(s) que importam:** 1.024 dimensões (embedding genérico longo); 5 dimensões (sentimento FinBERT curto); h=5 e h=21 (horizontes em dias); 3 ativos (ITUB4, PETR4, VALE3).
**Perguntas prováveis (mais provável primeiro):**
1. *Por que só 3 ativos e uma fonte de notícias? Isso generaliza?* → Não generaliza e o trabalho não reivindica isso; a conclusão vale para a representação adotada nesses 3 ativos com InfoMoney (limitações declaradas).
2. *Por que dois horizontes, h=5 e h=21?* → Testar drift pós-notícia em janela semanal e mensal; o alvo binário é 1 se Close[t+h] > Close[t], e o resultado nulo se mantém nos dois.
3. *Por que comparar embeddings de 1.024 dims com só 5 features de sentimento — a diferença não é só dimensionalidade?* → Não: o controle com 5 dimensões aleatórias deu AUC 0,509, descartando que o ganho fosse efeito de dimensionalidade.
4. *A sub-pergunta (b) já não antecipa que o resultado vai cair?* → Sim, por desenho: a pergunta é justamente se o walk-forward único sobrevive — e não sobrevive (Δ do sentimento = +0,003, p = 0,49; o 0,709 é artefato de janela única).
5. *E na VALE3, que parece a exceção?* → Lidere pelo invariante: na VALE3 o ganho do sentimento nunca é estatisticamente significativo; o deep-dive de 880 execuções deu p = 0,194.
**Armadilha:** Não promenta aqui que a resposta é "sim, notícias funcionam" — este slide só faz a pergunta; a resposta honesta é nula (Δ=+0,003, p=0,49) e a contribuição é metodológica, não um ganho preditivo.

## Slide 5 — Dados: notícias + mercado
**Em uma frase:** Mostra de onde vieram os dados — 5.872 notícias do InfoMoney sobre três ações e os preços diários do Yahoo Finance — e como se define o alvo "a ação sobe ou desce".
**Como explicar (3 falas simples):** "Juntei duas fontes: notícias do InfoMoney sobre Itaú, Petrobras e Vale, e os preços diários dessas ações." / "Foram 5.872 notícias no total, mais 11 indicadores técnicos de preço como retorno, médias móveis e volatilidade." / "O que quero prever é simples: o preço daqui a h dias está acima de hoje? Sobe ou desce."
**Número(s) que importam:** 5.872 — total de artigos InfoMoney; 2.572 / 1.775 / 1.525 — ITUB4 / PETR4 / VALE3; 59/41 — Sobe/Desce no treino; 11 — features técnicas de preço.
**Perguntas prováveis (mais provável primeiro):**
1. *"Esse 59/41 não bate com os ~69% de classe majoritária do slide 10. Qual é o certo?"* → Os dois estão certos, são subconjuntos diferentes (split cronológico, sem embaralhar): treino é 59/41, a janela de teste calhou 69,5% Sobe (123/177) — por isso a acurácia de 76,3% mal supera o "chutar sempre Sobe".
2. *"Você não ia balancear as classes em 50/50?"* → Não reamostrei de propósito: quebraria a ordem temporal e a base rate real do mercado; compensei por peso (XGBoost `scale_pos_weight`, sklearn `class_weight`, neurais peso na perda) — e o colapso persiste mesmo assim, então desbalanceamento não era a causa raiz.
3. *"Por que só 3 ativos e uma fonte? Isso generaliza?"* → Não generaliza e o trabalho não reivindica isso; vale para a representação adotada nesses 3 ativos + InfoMoney (que tem viés editorial de varejo e cobertura desigual — 2.572 ITUB4 vs 1.525 VALE3).
4. *"A cobertura desigual de notícias (Itaú quase o dobro da Vale) não enviesa o resultado?"* → É limitação declarada; mas como a conclusão final é nula (sentimento Δ=+0,003, p=0,49), a cobertura desigual não fabrica um efeito positivo inexistente.
5. *"Por que prever direção (sobe/desce) e não o retorno em si?"* → Classificação binária é o alvo definido a priori; o foco do trabalho é direção do preço, e a métrica honesta é AUC, não acurácia, justamente por causa do desbalanceamento.
**Armadilha:** Não dizer "59% Sobe" como se fosse a taxa global — é só do treino; se a banca cruzar com o slide 10 (~69% no teste) e você não souber separar treino de teste, parece erro/contradição. Sempre diga "59/41 no treino, 69,5/30,5 no teste, split cronológico".

## Slide 6 — Pipeline
**Em uma frase:** Mostra o fluxo completo dos dados — das notícias e preços, passando pela junção por data e pelos modelos, até a avaliação por AUC.
**Como explicar (3 falas simples):** "Cada notícia vira números: ou embeddings de 1.024 dimensões, ou 5 features de sentimento." / "Junto isso aos 11 indicadores de preço por data, com left join e forward-fill, e gero janelas de 30 dias." / "Quatro modelos — BiLSTM, Transformer, XGBoost e TCN — preveem a direção, e avalio por AUC com split cronológico 70/15/15."
**Número(s) que importam:** 5.872 → artigos InfoMoney totais; 1.024d → embeddings genéricos por dia; 5d → features de sentimento FinBERT; 11 → features técnicas de preço; 70/15/15 → split cronológico treino/val/teste; 30 dias → janela sequencial; ~1.200 → dias úteis por ativo.
**Perguntas prováveis (mais provável primeiro):**
1. *O forward-fill não vaza informação do futuro?* → Não — ele propaga só o passado para dias sem notícia; o risco real é look-ahead intradiário (artigo pós-fechamento atribuído ao dia t), não auditado, mas o viés joga a favor do sentimento, então o nulo é limite superior otimista.
2. *Por que split cronológico 70/15/15 e não validação cruzada embaralhada?* → Série temporal não pode embaralhar; o walk-forward preserva a ordem e a base rate real (59/41 treino), e o expanding-window CV depois testa a robustez fora da janela única.
3. *Por que tantos modelos diferentes?* → Para medir robustez do resultado, não maximizar desempenho; a conclusão não depende de um modelo — a ablation usa o XGBoost, o mais estável (std 0,012), e mesmo assim o sentimento dá Δ=+0,003 (p=0,49).
4. *Por que duas representações textuais (1.024d vs 5d)?* → São duas etapas: embeddings genéricos ficaram perto do acaso, então testei sentimento específico FinBERT (5 features), que gerou o 0,709 — depois mostrado ser artefato de janela única.
5. *~1.200 dias por ativo é suficiente para treinar esses modelos?* → É a limitação central: o MDE por ativo (0,13–0,22) deixa o sentimento 44–74× abaixo do detectável; mas o mesmo desenho detecta o sinal de preço (0,667 estável), então o protocolo é sensível a efeito real quando existe.
**Armadilha:** Não vender o pipeline como prova de que o método "funciona" — ele é só a infraestrutura; o veredito honesto é que o ganho do sentimento é Δ=+0,003 (p=0,49) e o 0,709 é artefato de janela única. E ao falar de forward-fill, dizer "propaga o passado", nunca "preenche com o futuro".

## Slide 7 — Etapa 3: embeddings genéricos (perto do acaso)
**Em uma frase:** Minha primeira tentativa foi transformar cada notícia em 1.024 números genéricos (embeddings), e isso ficou perto do acaso — o que motivou trocar para sentimento específico.
**Como explicar (3 falas simples):** "Usei embeddings genéricos do Ollama: 1.024 dimensões por artigo, média diária, reduzidas por PCA a 32 componentes (61,4% da variância), ajustadas só no treino." / "O melhor modelo (XGBoost) deu só 0,610, e os demais ficaram perto ou abaixo de 0,50." / "A leitura: representação genérica de alta dimensão carrega muito ruído semântico irrelevante para finanças — por isso parti para o FinBERT no próximo slide."
**Número(s) que importam:** 1.024 dims (embedding genérico); 32 componentes PCA (61,4% variância, só treino); 0,610 (melhor, XGBoost); 0,568 / 0,505 / 0,443 (Transformer / BiLSTM red. / BiLSTM orig.) — perto do acaso.
**Perguntas prováveis (mais provável primeiro):**
1. *Por que os embeddings genéricos falharam?* → Alta dimensionalidade (1.024) carrega ruído semântico não-financeiro; o melhor (XGBoost) deu só 0,610 e os sequenciais ficaram ≤0,568.
2. *Por que reduzir com PCA só no treino?* → Para não vazar informação do teste; o PCA é ajustado apenas no treino e aplicado ao resto (mesma disciplina do scaler).
3. *Isso não prova que notícia não serve?* → Não — prova que ESTA representação (embedding genérico) não serve; por isso testei o sentimento específico FinBERT a seguir.
**Armadilha:** Não apresentar 0,610 como "quase bom" — é perto do acaso e o motivo de trocar de representação; não confundir com o 0,709 (que vem depois e também cai).

## Slide 8 — Etapa 4: sentimento específico (FinBERT-PT-BR)
**Em uma frase:** Em vez de usar 1.024 números genéricos por notícia, troquei por um modelo treinado em finanças em português que resume cada dia em 5 medidas de sentimento.
**Como explicar (3 falas simples):** "O FinBERT-PT-BR é um BERT ajustado em textos financeiros brasileiros, então entende 'guidance', 'rating', 'alavancagem'." / "Para cada artigo ele dá três notas — positivo, negativo, neutro — e eu agrego isso em 5 features por dia." / "A aposta era simples: uma representação compacta e específica do domínio deveria informar mais que 1.024 dimensões genéricas."
**Número(s) que importam:** 3 logits (por artigo: pos/neg/neu); 5 features (diárias por ativo); 1.024 dims (genéricas que estou substituindo)
**Perguntas prováveis (mais provável primeiro):**
1. *Por que 5 features agregadas em vez de jogar o texto num LLM moderno?* → A conclusão vale para a representação adotada, não para toda forma de usar texto; representações mais ricas são direção futura explícita (não é reivindicação de que notícia nunca tem valor).
2. *Por que confiar no FinBERT-PT-BR? É validado?* → É BERT com fine-tuning em corpora financeiros em pt-br (Souza et al., 2023), calibrado para o vocabulário do domínio; aqui ele é a fonte das 5 features diárias, não o classificador final.
3. *Essa troca melhorou de fato sobre os embeddings genéricos?* → No slide seguinte parece que sim (AUC 0,709 janela única), mas isso se revela artefato de janela única; o ganho real do sentimento é Δ = +0,003 (p = 0,49) na ablation com 225 runs.
4. *Como você passa de 3 logits por artigo para 5 features por dia?* → Agrego os artigos do dia: n_articles, mean_logit_pos/neg/neu e mean_sentiment — uma linha por dia e por ativo.
5. *Agregar por média não joga fora informação?* → Sim, é uma simplificação deliberada (representação compacta); a perda de granularidade é limitação declarada e motiva representações mais ricas no futuro.
**Armadilha:** Não vender este slide como "a melhoria que confirmou a hipótese". Aqui é só a hipótese e a representação; o ganho aparente vem no próximo slide e morre depois (sentimento Δ = +0,003, p = 0,49). Não afirmar que FinBERT "captura o sentimento do mercado" — só extrai 5 features cujo valor preditivo acabou sendo nulo neste n.

## Slide 9 — O resultado que "confirmou" a hipótese
**Em uma frase:** O modelo Transformer com sentimento FinBERT atingiu AUC 0,709 e pareceu confirmar a hipótese, mas esse número veio de uma única janela, uma única semente e sem intervalo de confiança — é a armadilha que o resto do trabalho desmonta.
**Como explicar (3 falas simples):**
- "Aqui o Transformer com sentimento dá AUC 0,709, e o sentimento parece superar os embeddings genéricos: narrativa bonita, coerente com a literatura."
- "Mas é estimativa pontual: uma janela, uma semente, sem intervalo de confiança."
- "Por isso a pergunta no rodapé — caso encerrado? Não. Os slides seguintes refutam esse número."
**Número(s) que importam:**
- **0,709** — AUC Transformer, artefato de janela
- **0,141** — ganho aparente, depois evapora
- **0,670** — XGBoost janela única, instável
- **0,060 / 0,057 / −0,028** — Δ E3→E4 dos outros modelos
- **76,3%** — acurácia engana, perto da majoritária
- **69,5%** — classe majoritária da janela teste
- **59/41** — prevalência sobe/desce no treino
**Perguntas prováveis (mais provável primeiro):**
1. *76,3% de acurácia não é bom?* → Engana: a janela de teste é 69,5% "Sobe", então o modelo só bate o "chutar sempre Sobe" por ~7 pontos; por isso uso AUC, não acurácia.
2. *Esse 0,709 não confirma sua hipótese?* → Não — é uma janela, uma semente, sem IC; refutado adiante: Δ do sentimento cai para +0,003 (p=0,49) e o 0,709 é artefato de janela única.
3. *O XGBoost dá 0,670 aqui, mas ~0,665 na ablation. Qual vale?* → São protocolos distintos: o 0,670 é janela única (sentimento bruto vs embeddings), o 0,665 é multi-seed; nenhum é sinal estável — a regra "janela única é artefato" vale também para o XGBoost.
4. *Por que 59/41 no treino mas 69,5% no teste?* → Split cronológico sem embaralhar: treino e teste são períodos distintos, e a janela de teste calhou de ter mais altas.
5. *Por que esse Δ +0,141 do Transformer e não os dos outros modelos?* → Justamente porque ele é o maior e mais sedutor; mas no multi-seed o Transformer é o mais instável (std 0,261) — esse +0,141 foi sorte de semente, não efeito real.
**Armadilha:** Não vender o 0,709 com orgulho nem deixá-lo no ar como conquista — apresentá-lo explicitamente como isca/artefato que será derrubado, senão a banca cobra a contradição com o veredito final (+0,003, p=0,49). Nunca chamar a acurácia de 76,3% de "boa".

## Slide 10 — Três sinais de alerta
**Em uma frase:** Antes de comemorar o AUC 0,709, três pistas mostraram que o resultado provavelmente era frágil: o modelo quase só dizia "Sobe", a acurácia mal batia o chute óbvio, e o número saiu de um único teste sem margem de erro.
**Como explicar (3 falas simples):**
- "O modelo acertou só 11 das 54 quedas reais — ele basicamente aprendeu a dizer 'Sobe' quase sempre."
- "A acurácia de 76% parece boa, mas chutar sempre 'Sobe' já acertaria 69,5%; ganhei só 7 pontos."
- "E pior: era uma estimativa única, uma semente, uma janela, sem intervalo de confiança. Então decidi atacar o resultado em vez de aceitá-lo."
**Número(s) que importam:** 11 de 54 quedas (recall Desce baixíssimo); precision Desce 1,00 (acerta mas quase nunca arrisca); 76,3% acurácia (mal supera majoritária); 69,5% classe majoritária do teste (123/177); 59/41 base rate do treino.
**Perguntas prováveis (mais provável primeiro):**
1. *O slide 5 diz 59% Sobe, mas aqui aparece 69,5%. Qual é o certo?* → Os dois, são subconjuntos diferentes do split cronológico: treino 59/41, janela de teste (177 amostras) 69,5% Sobe (123/177); períodos distintos, sem embaralhar.
2. *Se a acurácia é 76%, por que não confiar no modelo?* → Porque "sempre Sobe" já dá 69,5%; o ganho de ~7 pontos é raso, por isso uso AUC (invariante a threshold), não acurácia, com classe desbalanceada.
3. *Esse colapso não é só desbalanceamento de classe (devia balancear 50/50)?* → Não reamostrei (quebraria a ordem temporal e a base rate real); compensei por peso na perda (scale_pos_weight no XGBoost). Decisivo: o colapso persiste mesmo com a compensação → desbalanceamento não era a causa raiz.
4. *Por que não usar acurácia ou F1 como métrica principal?* → AUC é invariante a threshold e mais honesta com 59/41; a acurácia de 76,3% enganava porque o modelo previa quase só a majoritária (balanced accuracy/MCC ficam como trabalho futuro).
5. *Um único caso ruim de matriz não invalida nada — não pode ser azar pontual?* → Exatamente por isso não aceitei o número: submeti a protocolos mais rigorosos (IC, multi-seed, CV, ablation). O resultado não sobreviveu: sentimento Δ=+0,003, p=0,49.
**Armadilha:** Não defenda o 0,709 nem a acurácia de 76,3% como se fossem bons — eles são os sinais de alerta, não conquistas. Este slide é onde você desconfia do próprio resultado, não onde o vende. E nunca harmonize 59% com 69,5%: são subconjuntos distintos por design.

## Slide 11 — Bateria de investigação: 1.435 execuções (pergunta e métrica definidas a priori)
**Em uma frase:** Para checar se o resultado bom era real, rodei 8 experimentos somando 1.435 execuções, todos com o mesmo protocolo rígido feito para derrubar — não para favorecer — o resultado positivo.
**Como explicar (3 falas simples):** "Não confiei em uma única medida, então montei oito experimentos, somando 1.435 execuções." / "Todos usam o mesmo protocolo congelado: hiperparâmetros fixos, scaler só no treino, intervalo de confiança por bootstrap e teste de Wilcoxon." / "A direção é o oposto de garimpar resultado: cada experimento tem uma pergunta definida antes, e o protocolo serve para testar se o positivo é robusto, não para escolher o melhor caso."
**Número(s) que importam:** 1.435 (total das 8 baterias); 880 (VALE3 deep-dive, o maior); 225 (ablation do sentimento); 145 (expanding-window CV); 1.000 (resamples do bootstrap CI); |Δ|=0,255 ≈ 6× std (preço vence, passa Bonferroni).
**Perguntas prováveis (mais provável primeiro):**
1. *1.435 execuções não é garimpar resultado (p-hacking) / múltiplas comparações?* → Direção oposta: a métrica principal (AUC) foi mantida fixa e os experimentos de robustez foram desenhados para testar o resultado inicial, não para selecionar o melhor caso — hiperparâmetros congelados, nenhuma métrica trocada a posteriori. (Não dizer "pré-registro formal"; dizer "métrica fixa, experimentos para testar".)
2. *E a correção de Bonferroni nessas comparações?* → Nas 6 células ativo×horizonte, Bonferroni só reforça o nulo do sentimento; e o positivo "preço vence" (|Δ|=0,255 ≈ 6× std) passa com folga mesmo penalizado.
3. *Por que o protocolo é idêntico em todos?* → Exatamente para ser justo: hiperparâmetros congelados, StandardScaler só no treino, bootstrap CI de 1.000 resamples e Wilcoxon pareado em todos — variar o protocolo é que abriria espaço para fabricar resultado.
4. *O total é mesmo 1.435 ou mais de 1.500?* → 1.435 são os 8 experimentos centrais (cada um com pergunta/métrica a priori e p-valor); existem ~80 sanity checks adicionais (~1.515 no total) que não geram teste de hipótese nenhum.
5. *Por que o VALE3 deep-dive tem tantas (880) execuções?* → Foi o único ativo que parecia funcionar, então recebeu o escrutínio mais pesado — e mesmo assim deu p=0,194, não significativo. (Para VALE3, lidere sempre pelo invariante: o ganho do sentimento nunca é estatisticamente significativo.)
6. *Por que não otimizou hiperparâmetros por fold?* → Deliberado: o objetivo era medir robustez do resultado original sob variação de janela/semente, não maximizar desempenho — otimizar por fold adicionaria variância e confundiria a comparação.
**Armadilha:** Não diga "rodei 1.435 modelos para encontrar o melhor resultado" — isso soa exatamente como p-hacking. O enquadramento correto e invariável é o oposto: protocolo idêntico, com métrica fixa, feito para testar a robustez do positivo. E não cite "mais de 1.500" como se fosse o número do slide — o número do slide é 1.435; os ~80 sanity checks ficam para o Q&A.

## Slide 12 — Primeiro confronto: hierarquia de baselines
**Em uma frase:** Um modelo que só olha o preço passado (sem nenhuma notícia) já chega a AUC 0,658, e por isso qualquer modelo de sentimento precisa vencer essa régua antes de poder reivindicar mérito.
**Como explicar (3 falas simples):** "Antes de comparar com o sentimento, eu preciso de uma régua honesta: um modelo bobo que só usa preço passado." / "Esse baseline autoregressivo, com cinco features de preço, já dá 0,658 — perto do 0,709 que eu festejei." / "Nesta janela única o intervalo de confiança é tão largo que nem separa os dois; quem decide é o CV, e lá o preço vence (0,667 contra 0,509)."
**Número(s) que importam:** 0,658 [0,565; 0,744] = baseline preço, janela única; 0,500 = classe majoritária / coin flip; 0,474 = persistência h=21; 0,667 vs 0,509 = CV preço vence sentimento.
**Perguntas prováveis (mais provável primeiro):**
1. *Se o baseline de preço dá 0,66–0,70, isso não contradiz a eficiência de mercado?* → Não: AUC mede separabilidade, não lucro; é momentum/autocorrelação (Lo, 2004) e o backtest não virou retorno após custos.
2. *Por que o IC do baseline não separa do 0,709?* → Em janela única o IC [0,565; 0,744] é largo demais para distinguir; a separação só emerge no CV multi-seed — e esse é exatamente o ponto do trabalho.
3. *Por que esse baseline e não a classe majoritária só?* → Classe majoritária e coin flip ficam em 0,500 e persistência em 0,474; o autoregressivo é a régua forte e honesta que o sentimento tem que vencer — e não vence.
4. *0,658 aqui e 0,667 no CV: qual é o número?* → São protocolos distintos: 0,658 é janela única (IC largo), 0,667 é média de 5 folds CV; ambos estáveis, o preço vence o sentimento nos dois.
5. *Por que h=21 e janelas sobrepostas?* → A sobreposição infla a autocorrelação do alvo, o que favorece o baseline de preço — mas isso é reconhecido e não muda a direção da conclusão.
**Armadilha:** Não reivindicar lucratividade nem "o baseline funciona": AUC ≠ retorno após custos, o backtest é exploratório e frágil (existe, Sharpe −1,29, reforça o nulo — ver Reserva 23; nunca chamar de "descontinuado"). E nunca afirmar que a janela única já separa 0,709 do baseline — só o CV decide.

## Slide 13 — Multi-seed: o colapso bimodal
**Em uma frase:** Repetindo o teste com várias sementes aleatórias, meu modelo se espalha de 0,08 a 0,93 enquanto o baseline fica firme em ~0,65 — e o 0,709 cai bem na ponta direita, ou seja, foi semente sortuda.
**Como explicar (3 falas simples):** "Cada barra do gráfico é uma semente aleatória diferente." / "O baseline (vermelho) fica apertado em ~0,65; meu modelo (azul) se espalha de 0,08 a 0,93, e o 0,709 cai na ponta direita — sorte de sorteio." / "Trocando só a semente para 42, o AUC despenca para 0,442; o desvio do Transformer é 0,261, 21× o do baseline (0,012). A distribuição é bimodal: o modelo colapsa para 'sempre Sobe' ou 'sempre Desce'."
**Número(s) que importam:** 0,08–0,93 (espalhamento do meu modelo); ~0,65 (baseline, estável); 0,442 (semente 42 — o 0,709 vira isso); std 0,261 vs 0,012 (Transformer vs baseline, 21×); bimodal = colapso "sempre Sobe/Desce".
**Perguntas prováveis (mais provável primeiro):**
1. *Esse colapso não é só o Transformer ser um modelo ruim?* → A conclusão não depende dele: a ablation (slide 16) usa XGBoost, o mais estável (std 0,012), e mesmo assim o sentimento dá Δ=+0,003 (p=0,49).
2. *O 0,709 não continua sendo um resultado real, já que aconteceu?* → É reproduzível com aquela semente, mas é a ponta de uma distribuição enorme (0,08–0,93) — a média desmente; foi sorte, não sinal.
3. *Por que a distribuição é bimodal?* → O modelo colapsa: aposta quase tudo em "Sobe" ou quase tudo em "Desce", acumulando nas pontas (0 e 1) — instabilidade, não aprendizado de sinal.
4. *21× mais variância já não invalida o modelo por si só?* → Invalida o número único: um estimador com std 0,261 não permite ler 0,709 como efeito; é exatamente por isso que IC e multi-seed são protocolos obrigatórios.
**Armadilha:** Não tratar o 0,709 como "pico de desempenho" — é cauda de uma distribuição instável. E não dizer "o Transformer é ruim, logo descartei" sem lembrar que a ablation com XGBoost (estável) dá o MESMO nulo.

## Slide 14 — Expanding-window CV: a inversão
**Em uma frase:** Quando troco a janela única por validação em 5 dobras ao longo do tempo, o resultado se inverte — o baseline de preço passa a vencer meu modelo de sentimento, exceto na VALE3, onde o ganho aparente não é estatisticamente significativo.
**Como explicar (3 falas simples):** "Na janela única meu modelo parecia ganhar. Aqui eu repito o teste em cinco pedaços do tempo." / "Em ITUB4 e PETR4 o preço fica por cima: o vermelho vence o azul. A média cai de favorável para 0,667 do preço contra 0,509 do meu modelo." / "Só a VALE3 mostra ganho aparente, mas esse ganho não é significativo — eu confirmo isso no slide seguinte, com 880 execuções."
**Número(s) que importam:** ITUB4 Δ −0,255 (preço vence claro) · PETR4 Δ −0,255 (preço vence claro) · VALE3 0,599 vs 0,635 (ganho aparente, não significativo) · Média 0,667 vs 0,509 (a inversão central) · p=0,194 (VALE3 não significativo)
**Perguntas prováveis (mais provável primeiro):**
1. *"Na VALE3 dá +0,036 aqui mas +0,058 no slide 16. Qual é o número certo?"* → Na VALE3 o ganho do sentimento nunca é estatisticamente significativo; são experimentos distintos (aqui CV Transformer-vs-preço 5×5; lá ablation XGBoost preço-vs-preço+sent), o invariante é o p, e o deep-dive de 880 runs deu p=0,194.
2. *"Por que o Δ aqui é Transformer menos XGBoost-preço, e não ablation de sentimento?"* → É comparação modelo-vs-baseline, não isolamento de sentimento; serve para mostrar a inversão de janela; o ganho líquido do sentimento é medido na ablation (+0,003, p=0,49).
3. *"Por que a janela única e o CV dão resultados opostos?"* → Exatamente o ponto do trabalho: 0,709 era artefato de janela única; com 5 folds o preço estável (0,667) supera o modelo (0,509), a inversão é a evidência de que não havia sinal real.
4. *"Se o preço atinge 0,667, isso não viola a eficiência de mercado / não dá para operar?"* → AUC ≠ lucro; é momentum/autocorrelação de curto prazo e o backtest não virou retorno após custos.
5. *"Por que o Transformer despenca para 0,445 em ITUB4/PETR4?"* → Instabilidade/colapso bimodal do modelo (std multi-seed 0,261 vs 0,012 do baseline); por isso a conclusão se apoia na ablation com XGBoost, mais estável.
**Armadilha:** Não defender o número +0,036 da VALE3 nem tentar conciliá-lo com os +0,058/0,484<0,544 dos slides 15/16 — eles diferem por desenho, de propósito. Lidere SEMPRE pelo invariante (p=0,194, nunca significativo); harmonizar os números é a cilada.

## Slide 15 — E a exceção VALE3? Deep-dive com 880 execuções
**Em uma frase:** A VALE3 era o único caso que parecia melhorar com sentimento, então fiz um teste dedicado de 880 execuções só para ela, e o ganho desapareceu — não é estatisticamente significativo.
**Como explicar (3 falas simples):** "Na bateria de experimentos, dos seis casos (3 ativos × 2 horizontes) só a VALE3 mostrou ganho aparente — exatamente o que se espera por puro acaso." / "Então dei a ela um deep-dive dedicado: 880 execuções, folds expandidos, 10 sementes, 2 modelos." / "O resultado: a média do meu modelo (0,484) ficou abaixo do baseline (0,544) e o teste deu p = 0,194 — a exceção não sobreviveu ao escrutínio."
**Número(s) que importam:** 880 execuções (folds, 10 sementes, 2 modelos); p = 0,194 (Wilcoxon, não significativo); 0,484 < 0,544 (média azul abaixo da vermelha); 3×2 = 6 (células ativo×horizonte testadas).
**Perguntas prováveis (mais provável primeiro):**
1. *No slide 14 (CV) e no 16 (ablation) a VALE3 dava ganho positivo (+0,036 e +0,058); aqui dá negativo. Qual é o número certo?* → O invariante é que na VALE3 o ganho do sentimento NUNCA é estatisticamente significativo (deep-dive 880 runs, p = 0,194); os três são experimentos distintos — contrastes, modelos e n diferentes — não a mesma medida três vezes, e sinal que muda de magnitude/direção é justamente a evidência de que não é sinal real.
2. *Por que só a VALE3 ganhou um deep-dive e os outros não?* → Porque foi a única das 6 células (3 ativos × 2 horizontes) com ganho aparente — exatamente uma positiva é o esperado por acaso sob múltiplas comparações, então a investiguei a fundo para descartá-la.
3. *Se p = 0,194, não é só falta de poder estatístico?* → Aqui o invariante segura: o ganho da VALE3 nunca é significativo; e o mesmo desenho detecta com folga o sinal de preço (0,667 estável), logo o protocolo é sensível a efeito real quando existe.
4. *Como leio esse histograma?* → O azul (meu modelo) se acumula nas duas pontas, perto de 0 e de 1 — é o colapso bimodal; e a média azul (0,484) fica à esquerda da vermelha (0,544), ou seja, perde até no melhor caso.
5. *Wilcoxon com folds sobrepostos não viola independência?* → Sim, reconhecido no texto, mas o viés é conservador: sobreposição infla correlação e não gera significância espúria em resultado nulo — como a conclusão já é nula (p = 0,194), não a ameaça.
**Armadilha:** Não tentar reconciliar os números da VALE3 entre os slides 14/15/16 nem defender um valor específico — eles divergem por desenho. Liderar SEMPRE pelo invariante ("o ganho nunca é significativo, p = 0,194") e nunca afirmar que a VALE3 "funciona" ou que o sinal é real.

## Slide 16 — Ablation: o sentimento adiciona algo ao preço?
**Em uma frase:** Quando comparo um modelo que usa só preço contra o mesmo modelo com preço mais sentimento, somar sentimento praticamente não muda nada — o ganho médio é quase zero e não é estatisticamente significativo.
**Como explicar (3 falas simples):** "Aqui isolei a pergunta central: o sentimento acrescenta algo ao que o preço já diz?" / "Treinei o XGBoost 225 vezes comparando só preço contra preço mais sentimento; na média o ganho foi +0,003, com p de 0,49 — ou seja, nada detectável." / "Dois dos três ativos até pioram com sentimento; só a VALE3 parece ganhar, mas esse ganho não sobrevive ao escrutínio."
**Número(s) que importam:** +0,003 (ganho médio do sentimento) · p = 0,49 (não significativo, nulo) · IC95% [−0,012; +0,018] (zero dentro do intervalo) · 225 treinamentos (XGBoost, h=21) · ITUB4 −0,033 (pior com sentimento) · PETR4 −0,016 (pior com sentimento) · VALE3 +0,058 (ganho aparente, não significativo) · 0,662 (média PRICE, estável)
**Perguntas prováveis (mais provável primeiro):**
1. *Na VALE3 o Δ é +0,058 aqui, mas +0,036 no slide 14 — por quê?* → O invariante é que na VALE3 o ganho do sentimento nunca é significativo (deep-dive 880 runs, p=0,194); são experimentos diferentes (slide 14 = CV, Transformer vs preço; slide 16 = ablation, só XGBoost, preço vs preço+sent), modelos e contrastes distintos dão magnitudes distintas — não harmonizo, sinal instável é a própria prova de que não é sinal real.
2. *Se o IC do Δ é estreito [−0,012; +0,018], como concilia com MDE 0,13–0,22?* → Sem contradição: o IC é do Δ MÉDIO agregado (225 runs estreitam o IC), o MDE 0,13–0,22 é por ativo (n pequeno por célula); e o mesmo desenho detecta preço (0,667 estável), então o protocolo é sensível — o sentimento está 44–74× abaixo do detectável.
3. *Δ médio +0,003 não é só efeito do XGBoost/horizonte h=21?* → A ablation usa justamente o modelo mais estável (std 0,012), e com Δ +0,003 e IC [−0,012; +0,018] sobre 225 runs é improvável que trocar horizonte inverta a conclusão (limitação h=21 vs h=5 declarada).
4. *225 execuções não é garimpar resultado (p-hacking)?* → Direção oposta: as execuções servem para testar a robustez do positivo, não selecionar o melhor; métrica fixa, hiperparâmetros congelados, nenhuma métrica escolhida a posteriori.
5. *Se a VALE3 ganha, não há ali um efeito real?* → Na VALE3 o ganho nunca é significativo (p=0,194 no deep-dive de 880 runs); e ITUB4 (−0,033) e PETR4 (−0,016) pioram, puxando a média a +0,003 — dois de três ativos ficam piores com sentimento.
**Armadilha:** Não tente "reconciliar" o +0,058 da VALE3 com os números de outros slides nem apresentá-lo como ganho real — lidere sempre pelo invariante (p nunca significativo) e nunca diga que o sentimento "funciona na VALE3".

## Slide 17 — Síntese da investigação
**Em uma frase:** Depois de toda a bateria de testes, esta representação de sentimento (FinBERT, 5 features) não apresentou ganho discriminativo detectável sobre o preço em nenhum dos três ativos, e o AUC 0,709 foi só um artefato de uma única janela.
**Como explicar (3 falas simples):** "Avaliando direito — várias janelas, várias sementes, com intervalo de confiança e ablation — o sentimento não adiciona sinal preditivo mensurável." "Aquele 0,709 que parecia uma vitória era artefato de janela única: variância de semente, viés da janela de teste e ausência de IC." "Vale para a representação que adotei — 5 features diárias de FinBERT — não para toda forma de usar texto; a leitura honesta é 'nenhum efeito detectável neste tamanho amostral'."
**Número(s) que importam:** 0,709 = AUC artefato janela única; std 0,261 = variância de semente (colapso bimodal Transformer); 5 features = representação FinBERT diária.
**Perguntas prováveis (mais provável primeiro):**
1. *"Você está dizendo que notícia não tem valor nenhum?"* → Não: o invariante para VALE3 é que o ganho do sentimento nunca é estatisticamente significativo (deep-dive 880 runs, p = 0,194); afirmo só que esta representação (5 features FinBERT) não adiciona sinal nesses 3 ativos — outras representações ficam como futuro.
2. *"O resultado nulo não é só falta de poder amostral?"* → "Nenhum efeito detectável neste n", mas o mesmo desenho detecta preço (0,667 estável sob CV); o protocolo é sensível, o sentimento está 44–74× abaixo do detectável.
3. *"Como conclui 'em nenhum dos três ativos' se a VALE3 dava ganho?"* → Na VALE3 o ganho nunca é significativo (p = 0,194); na média dos 3 o sentimento dá só Δ = +0,003 (p = 0,49), porque ITUB4 (−0,033) e PETR4 (−0,016) pioram.
4. *"Por que o 0,709 era artefato e não um resultado real?"* → Três causas: variância de semente (std 0,261, colapso bimodal), viés da janela de teste específica e ausência de IC; fora daquela janela o sinal inverte (CV 0,667 baseline vs 0,509 Transformer).
5. *"Qual a contribuição então, se deu nulo?"* → Contribuição é metodológica: demonstração quantificada do viés de janela única em dados brasileiros e 6 protocolos mínimos; um nulo com rigor vale mais que um falso positivo.
**Armadilha:** Não transformar "não adiciona sinal mensurável nesses 3 ativos com esta representação" em "notícias não servem para prever ações" — overclaim; reafirme o escopo (5 features FinBERT, ITUB4/PETR4/VALE3) e, se citarem VALE3, lidere pelo invariante (p = 0,194), nunca pelos números que variam entre slides.

## Slide 18 — Contribuições e protocolos mínimos propostos
**Em uma frase:** O trabalho entrega três coisas — um pipeline replicável, uma demonstração quantificada (em dados brasileiros) de que avaliar em uma só janela engana, e uma lista de seis cuidados mínimos para quem faz aprendizado de máquina em finanças.
**Como explicar (3 falas simples):** "Minha contribuição não é dizer que notícia não serve; é mostrar, num caso concreto e brasileiro, como é fácil fabricar um resultado que parece bom." / "Documentei tudo de forma replicável — o README mantém a narrativa inicial de propósito, como registro do viés de confirmação, e a errata no topo já remete ao capítulo 5." / "E proponho seis práticas mínimas, alinhadas a López de Prado, que teriam revelado a fragilidade do 0,709 logo no começo."
**Número(s) que importam:** 1.435 execuções (demonstração quantificada do viés) · 6 práticas mínimas (a proposta prática) · López de Prado 2018 (origem das práticas).
**Perguntas prováveis (mais provável primeiro):**
1. *Essas seis práticas são suas ou já existiam?* → Já existem na literatura (López de Prado, 2018); minha contribuição é mostrar a magnitude do dano de ignorá-las — neste caso 0,709 vira ~0,51.
2. *Por que manter o README com a narrativa positiva do 0,709?* → De propósito, como artefato histórico do viés de confirmação que o trabalho desmonta; a errata no topo remete ao cap. 5 e é verificável em segundos.
3. *Qual é, afinal, a contribuição se o resultado deu nulo?* → O resultado nulo, obtido com rigor, vale mais que um falso positivo; o ganho do sentimento é só Δ=+0,003 (p=0,49) e o 0,709 era artefato de janela única — a contribuição é metodológica, não "sentimento não funciona".
4. *Aplicaria essas práticas e o resultado mudaria?* → Aplicadas desde o início elas teriam revelado que o 0,709 era artefato; o protocolo é sensível — o mesmo desenho detecta o sinal de preço (0,667 estável), só não detecta o sentimento.
5. *Você diz "primeira" demonstração no Brasil?* → Evitar "primeira" (difícil de provar): digo "uma demonstração quantificada, em dados brasileiros, do risco de viés de janela única", com 1.435 execuções; não reivindico generalização além de ITUB4/PETR4/VALE3 + InfoMoney.
**Armadilha:** Não transformar a contribuição em overclaim. Dizer "criei seis protocolos novos" (são da literatura — eu mostro o custo de ignorá-los) ou "provei que notícia não prevê ações" (não — provei que o ganho é indetectável neste n, com Δ=+0,003, p=0,49). A contribuição é metodológica e de escopo limitado.

## Slide 19 — Limitações e trabalhos futuros
**Em uma frase:** O trabalho lista honestamente o que ele NÃO prova — uma fonte só, três ações, dois prazos, um possível vazamento residual que ainda assim não salva o sentimento — e aponta o que ficaria para estudos futuros.
**Como explicar (3 falas simples):** "Aqui eu coloco na mesa, de propósito, tudo o que limita o estudo." / "O ponto mais importante é o forward-fill: mesmo no pior caso ele jogaria a favor do sentimento, e ainda assim o ganho é praticamente zero — então minha conclusão nula é um teto otimista, não um piso." / "E nada disso ameaça a tese, porque a contribuição é metodológica: mostrar como é fácil fabricar um resultado aparente."
**Número(s) que importam:** Δ=+0,003 — ganho nulo do sentimento; h=5 e h=21 — prazos testados, 5 e 21 dias; 5 features — sentimento agregado por dia.
**Perguntas prováveis (mais provável primeiro):**
1. *O forward-fill não vaza informação do futuro?* → Não — ele propaga só o passado para dias sem notícia; o risco real é intradiário (artigo após as 17h atribuído ao dia t), não auditado, mas sua direção favorece o sentimento, logo o nulo Δ=+0,003 já é um limite superior otimista.
2. *Só 3 ativos e uma fonte — isso generaliza?* → Não reivindico generalização; a conclusão vale para as 5 features FinBERT nesses 3 ativos (ITUB4/PETR4/VALE3) com InfoMoney, e diversificar fontes (CVM, redes sociais) é trabalho futuro.
3. *Com tantas limitações, a conclusão nula vale algo?* → Vale: o mesmo desenho detecta com folga o sinal de preço (0,667 estável no CV), então o protocolo é sensível quando há efeito real; o sentimento está 44–74× abaixo do detectável por ativo.
4. *A instabilidade do Transformer não invalida tudo?* → Não, porque a conclusão não depende dele — a ablation usa XGBoost, o modelo mais estável (std 0,012), e mesmo assim Δ=+0,003 (p=0,49).
5. *E a VALE3, que parecia funcionar?* → O invariante é que na VALE3 o ganho do sentimento NUNCA é estatisticamente significativo: o deep-dive de 880 execuções deu p=0,194; os números diferem entre slides 14/15/16 só porque são protocolos distintos, não a mesma medida.
6. *E o backtest / retorno?* → O backtest EXISTE, mas ficou fora do corpo principal por ser exploratório e metodologicamente frágil (filtro val-AUC≥0,5 deixou só 2 de 20 sementes, anticorrelacionadas). Com custo de 10 bps: ensemble Sharpe −1,29 vs buy-and-hold Sharpe 3,25 — ou seja, REFORÇA o nulo, mas não é forte o suficiente para virar contribuição econômica. (NÃO dizer "descontinuado".)
**Armadilha:** Não transformar o forward-fill numa confissão de vazamento de futuro — ele propaga só o passado; e nunca dizer que as limitações enfraquecem a tese, pois a contribuição é metodológica e a conclusão nula é robusta à direção do viés.

## Slide 20 — Mensagem final
**Em uma frase:** A verdadeira contribuição não é provar que o sentimento não funciona, mas mostrar quão fácil é produzir evidência aparente de que funciona usando protocolos comuns, mas insuficientes para séries financeiras.
**Como explicar (3 falas simples):** "A lição central deste trabalho não é 'sentimento não serve'. É algo mais incômodo: mostrar como é fácil produzir um falso positivo convincente." / "O 0,709 'fazia sentido', e por isso quase passou — viés de confirmação opera de forma invisível." / "Janela única, semente única e sem intervalo de confiança são a receita do falso positivo; uma autocorreção documentada vale mais que um resultado positivo frágil. Obrigado."
**Número(s) que importam:** 0,709 — artefato de janela única.
**Perguntas prováveis (mais provável primeiro):**
1. *Então qual é, em uma frase, a contribuição do TCC?* → É metodológica: demonstrar de forma quantificada (1.435 execuções nos 8 experimentos centrais) o dano do viés de janela única em dados brasileiros e propor 6 protocolos mínimos; não é "sentimento não funciona".
2. *Você não concluiu nada sobre notícias, então? Foi trabalho perdido?* → Concluí o veredito honesto: o sentimento adiciona Δ=+0,003 (p=0,49), nenhum efeito detectável neste tamanho amostral; resultado nulo obtido com rigor vale mais que um falso positivo.
3. *Mas o 0,709 não era um resultado real e bom?* → Não — é artefato de janela única; sob CV/multi-seed ele desaba (Transformer cai para 0,509 médio) enquanto o baseline de preço fica estável em 0,667.
4. *Se a contribuição é "cuidado com o método", isso já não é sabido (López de Prado)?* → Os protocolos vêm de López de Prado (2018); a contribuição é mostrar a magnitude do dano de ignorá-los em dados BR (0,709 → ~0,51) e operacionalizá-los em 6 passos mínimos.
5. *E sobre a VALE3, que parecia funcionar?* → O invariante é que na VALE3 o ganho do sentimento nunca é estatisticamente significativo (deep-dive de 880 execuções, p=0,194); ela é a exceção que não sobrevive ao escrutínio, e na média dos 3 ativos o efeito é só +0,003.
**Armadilha:** Não escorregue para "provei que notícias/sentimento não têm valor" — o escopo é a representação adotada (5 features FinBERT) nesses 3 ativos e InfoMoney; afirme contribuição metodológica e veredito nulo qualificado (+0,003, p=0,49), nunca uma conclusão universal.

---

# Slides de RESERVA (não apresentar; só se a banca cruzar números)

## Reserva 21 — VALE3 nos três experimentos
**Quando puxar:** se a banca cruzar os slides 14/15/16 e apontar que a VALE3 tem números diferentes.
**Como usar (1 fala):** "São três experimentos diferentes, não a mesma medida três vezes. O invariante é o p: na VALE3 o ganho do sentimento NUNCA é estatisticamente significativo — o deep-dive de 880 execuções deu p=0,194."
**Tabela de duelo (decorar a leitura, não os números):**
- Slide 14 — CV expanding (Transformer vs preço), n=5×5, AUC preço 0,599, Δ **+0,036**
- Slide 16 — Ablation (preço vs preço+sent), n=225, XGBoost, AUC preço 0,609, Δ **+0,058**
- Slide 15 — Deep-dive, n=880, 2 modelos, **negativo** (azul 0,484 < 0,544)
**Fecho:** "Contrastes, modelos e n diferentes ⇒ magnitudes diferentes; os níveis de preço também diferem (0,599 vs 0,609) porque o protocolo difere. O invariante é o p, não o nível. Sinal instável é a própria evidência de que não é sinal real."
**Armadilha:** Nunca defender um número específico da VALE3 nem tentar harmonizá-los — lidere SEMPRE pelo invariante (p nunca significativo).

## Reserva 22 — MDE vs IC do Δ agregado
**Quando puxar:** se perguntarem "como o IC do Δ é estreito [−0,012; +0,018] se o MDE é 0,13–0,22? Não é contradição?"
**Como usar (1 fala):** "Não há contradição: o MDE 0,13–0,22 é POR ATIVO (n pequeno por célula); o IC [−0,012; +0,018] é do Δ MÉDIO agregado, estreito porque agrega os 225 runs. O nulo TEM IC; o 0,709 não tinha."
**Reforço:** "O IC é empírico (bootstrap dos 225 runs), não suposição de independência; mesmo o teto +0,018 fica ~7× abaixo do efeito útil (MDE por ativo). E o mesmo desenho DETECTA preço (0,667) — nulo conclusivo no agregado, não por falta de poder."
**Armadilha:** Não confundir os dois níveis — sempre dizer "MDE por ativo, IC do Δ médio agregado".

## Reserva 23 — "Você só fala de AUC" (métrica + backtest) ⚠️ LER COM ATENÇÃO
**Quando puxar:** "por que só AUC?", "AUC não engana com classe desbalanceada?", "AUC≠lucro, então o que seria positivo?", "e backtest/retorno?".
**Por que AUC (1 fala):** "AUC mede separabilidade direcional — exatamente minha pergunta — e era a métrica do 0,709 que eu auditava, então mantive consistência. O nulo é robusto: o mesmo desenho move a AUC no preço (0,667) e não no sentimento."
**Concessão HONESTA (decorar — é buraco real, não blefar):** "Reconheço: a ablação decisiva (225 runs) mede só ΔAUC. Calibração (Brier/ECE) eu computei na fase diagnóstica, não nos 225 runs. Por isso restrinjo o claim a 'nenhum GANHO DISCRIMINATIVO detectável' — recomputar ΔBrier/ΔMCC é barato e fica como limitação."
**O backtest EXISTE — liderar pelo número (NÃO dizer "descontinuado/sem números"):** "Tenho o backtest. Com custo de 10 bps: ensemble Sharpe −1,29 (−0,10%) vs buy-and-hold Sharpe 3,25 (+50,30%). Confirma o nulo TAMBÉM economicamente. Saiu do slide principal por fragilidade — o filtro val-AUC≥0,5 deixou só 2 de 20 sementes, anticorrelacionadas — não por ser desfavorável. Não escondi um positivo; tenho um negativo que reforça a tese."
**O que seria POSITIVO (definir, senão a tese vira não-falsificável):** "Sentimento elevando a AUC acima do baseline de preço de forma estável sob multi-seed e CV — critério a priori, igual ao do 0,709. Economicamente: retorno long-short do sentimento líquido de custos com Sharpe positivo. Não atingiu nenhum dos dois."
**Armadilha CRÍTICA:** NUNCA chame o backtest de "descontinuado" ou "sem números" — o notebook `ensemble_backtest.executed.ipynb` está no repo com Sharpe −1,29. Se a banca abrir, "não medi utilidade" desaba. Lidere pelo número negativo como CONFIRMAÇÃO. E não diga "adiciona exatamente nada" (afirmação sobre TODA métrica) — diga "nenhum ganho discriminativo detectável".
