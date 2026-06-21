# Glossário-flashcards — cada termo na ponta da língua

> Como treinar: **tape a coluna direita.** Lê o termo, fala a resposta em voz alta, confere. Repete até sair automático sem pensar.
> Resposta = 1 frase que tu fala de cor. Se travar num termo, é aqui que tu volta.
> 🔴 = certeza que perguntam · 🟡 = provável · ⚪ = bom ter.

---

## BLOCO 1 — Métricas e avaliação 🔴

| Termo | Resposta na ponta da língua |
|---|---|
| 🔴 **AUC / ROC-AUC** | Probabilidade de o modelo dar score maior a um "sobe" do que a um "desce" sorteados ao acaso. 0,5 = acaso, 1,0 = perfeito. Invariante a threshold. |
| 🔴 **Por que AUC e não acurácia** | Acurácia engana com classe desbalanceada: prever sempre a majoritária já dá 69%. AUC não cai nessa armadilha. |
| 🔴 **Curva ROC** | Plota verdadeiro-positivo vs falso-positivo varrendo todos os thresholds; a área sob ela é o AUC. |
| 🔴 **Bootstrap CI** | Reamostro o test set com reposição 1.000 vezes, recalculo o AUC em cada, o IC 95% sai dos percentis. Não assume distribuição. |
| 🟡 **Intervalo de confiança (IC)** | Faixa onde o valor verdadeiro provavelmente está. Se o IC cruza zero (no Δ) ou engloba o baseline, o ganho pode ser nulo. |
| 🟡 **Wilcoxon signed-rank** | Teste não-paramétrico pareado: compara dois modelos nos mesmos folds sem assumir normalidade. |
| 🟡 **p-valor** | Probabilidade de ver esse resultado se não houvesse efeito real. p=0,49 → totalmente compatível com acaso. |
| 🟡 **MDE (mínimo efeito detectável)** | Menor efeito que a amostra consegue distinguir do ruído. Aqui 0,13–0,22; o sentimento (0,003) está 44–74× abaixo. |
| 🟡 **Análise de poder** | Verifica se o estudo tem amostra suficiente pra detectar um efeito. Confirma que o nulo não é só falta de poder — o mesmo desenho detecta o preço. |
| ⚪ **MCC (Matthews)** | Métrica robusta a desbalanceamento; citada como trabalho futuro, não usada. |
| ⚪ **Balanced accuracy** | Acurácia média por classe; corrige o desbalanceamento. Trabalho futuro. |

## BLOCO 2 — Validação e protocolo 🔴

| Termo | Resposta na ponta da língua |
|---|---|
| 🔴 **Walk-forward split** | Divide a série cronologicamente — 70% treino, 15% validação, 15% teste — sem embaralhar. **Uma** janela só. |
| 🔴 **Expanding-window CV** | Validação cruzada temporal: o treino cresce no tempo, a janela de teste avança, gerando **várias** estimativas fora da amostra. |
| 🔴 **Walk-forward vs expanding-window** | Walk-forward dá 1 número (esconde variância); expanding-window dá vários (revela nível médio E variância). Foi o que inverteu o resultado. |
| 🟡 **Fold** | Cada partição treino/teste numa validação cruzada. Múltiplos folds = múltiplas medições. |
| 🟡 **Multi-seed** | Treinar o mesmo modelo com várias sementes aleatórias pra ver a distribuição do desempenho, não um ponto. |
| 🟡 **Semente (seed)** | Número que fixa a aleatoriedade (inicialização de pesos). Trocar a semente trocava o AUC de 0,709 pra 0,442. |
| 🟡 **Vazamento de dados (data leakage)** | Usar info que não estaria disponível na hora da predição. Evitado ajustando PCA/scaler só no treino. |
| 🔴 **Look-ahead** | Vazamento temporal: usar info do futuro pra prever o presente. Risco aqui = notícia pós-fechamento atribuída ao dia t. |
| 🔴 **Forward-fill** | Preenche dias sem notícia com o último valor conhecido — propaga o **passado**, não o futuro. Viés favorece o sentimento → nulo é limite superior otimista. |
| 🟡 **Baseline autoregressivo** | Modelo de referência usando só preço passado (5 features). O sentimento tem que superar isso pra valer algo. AUC 0,658. |

## BLOCO 3 — Modelos 🔴

| Termo | Resposta na ponta da língua |
|---|---|
| 🔴 **Transformer** | Rede de atenção: cada ponto da sequência olha direto pra todos os outros e pesa quais importam. Sem recorrência. |
| 🔴 **Atenção (attention)** | Mecanismo que calcula, pra cada instante, o peso de relevância de todos os outros instantes. Captura dependências de longo alcance. |
| 🔴 **BERT** | Modelo de linguagem pré-treinado por prever palavras ocultas no contexto (masked language modeling). Gera representações contextuais. |
| 🔴 **FinBERT-PT-BR** | BERT com fine-tuning em texto financeiro em português. Capta polaridade de "alavancagem", "guidance", "rating". 3 logits/artigo. |
| 🔴 **XGBoost** | Gradient boosting: árvores de decisão em sequência, cada uma corrige o erro residual da anterior. Padrão tabular, o mais estável aqui. |
| 🟡 **Gradient boosting** | Treina cada árvore no gradiente da perda das predições atuais — vai corrigindo erro acumulado. |
| 🟡 **LSTM / BiLSTM** | Rede recorrente com gates que decidem o que reter/esquecer ao longo da sequência. Bi = lê nos dois sentidos. |
| 🟡 **TCN** | Rede convolucional causal dilatada: cada saída só depende do passado, dilatações ampliam o campo receptivo. |
| 🟡 **Fine-tuning** | Pegar um modelo pré-treinado e reajustar os pesos numa tarefa/domínio específico com dados rotulados menores. |
| ⚪ **GRU** | Variante recorrente mais simples que LSTM; rejeitada por redundância com BiLSTM. |
| ⚪ **Random Forest** | Conjunto de árvores independentes; usada só pra diagnóstico SHAP no Estágio 7. |

## BLOCO 4 — Representação textual 🟡

| Termo | Resposta na ponta da língua |
|---|---|
| 🔴 **Embedding** | Representação de um texto como vetor denso de números, onde proximidade geométrica reflete proximidade semântica. |
| 🟡 **PCA** | Reduz dimensionalidade projetando nas direções de maior variância. 1.024 → 32 dims, 61,4% da variância, só no treino. |
| 🟡 **Logit** | Saída bruta do modelo antes de virar probabilidade. FinBERT dá 3: positivo, negativo, neutro. |
| 🟡 **Dimensionalidade** | Nº de features. Alta demais com poucos dados = maldição da dimensionalidade (overfit). Por isso PCA. |
| ⚪ **Ollama / qwen3-embedding** | Ferramenta local que gera os embeddings genéricos de 1.024 dims. Escolha não-crítica. |
| ⚪ **Masked language modeling** | Tarefa de pré-treino do BERT: esconder palavras e prever pelo contexto bidirecional. |
| ⚪ **Token** | Unidade de texto que o modelo processa. FinBERT usa entrada de até 512 tokens (título + resumo). |

## BLOCO 5 — Conceitos do domínio financeiro 🟡

| Termo | Resposta na ponta da língua |
|---|---|
| 🔴 **Hipótese de eficiência de mercado (HEM)** | Fama (1970): preços já refletem toda info disponível. Forma semiforte: notícia pública já está no preço quando publicada. |
| 🟡 **HEM semiforte** | Versão que diz que info pública (incluindo notícias) já está precificada → não dá pra lucrar com ela sistematicamente. Meu nulo é consistente com isso. |
| 🟡 **Hipótese de mercados adaptativos (Lo, 2004)** | A eficiência varia no tempo; há previsibilidade parcial em horizontes curtos. Explica o baseline de preço dar 0,658. |
| 🟡 **AUC ≠ lucro** | AUC 0,70 não vira retorno: depois de custos de transação e slippage, o backtest não mostrou ganho. |
| 🟡 **Momentum / autocorrelação** | Tendência de a direção do preço persistir no curtíssimo prazo. É o que o baseline de preço captura. |
| 🟡 **Drift pós-notícia** | Hipótese de que o efeito de uma notícia se propaga por dias após a publicação. Testada em h=5 e 21; não detectada. |
| ⚪ **OHLCV** | Open, High, Low, Close, Volume — os dados brutos de preço do Yahoo Finance. |
| ⚪ **B3** | Brasil, Bolsa, Balcão — a bolsa brasileira. |

## BLOCO 6 — Os termos-chave da reversão 🔴 (decorar SEM falha)

| Termo | Resposta na ponta da língua |
|---|---|
| 🔴 **Colapso bimodal** | O Transformer cai em um de dois estados degenerados — prevê quase sempre "sobe" ou quase sempre "desce". A distribuição de AUC tem picos perto de 0 e 1, sem meio-termo. |
| 🔴 **Classificador degenerado** | Modelo que prevê quase uma classe só, ignorando a entrada. Assinatura: precision alta / recall baixíssimo numa classe. |
| 🔴 **Artefato de janela única** | Resultado que só existe por causa daquela divisão temporal específica + semente específica; some sob avaliação múltipla. |
| 🔴 **Variância de semente** | A instabilidade do desempenho ao trocar a inicialização aleatória. Transformer: std 0,261; baseline: 0,012 (21× menor). |
| 🔴 **Viés de confirmação** | Tendência de aceitar resultados que concordam com a hipótese. Operou invisível: o 0,709 "fazia sentido", então não questionei de início. |
| 🔴 **Autocorreção metodológica** | O próprio trabalho reverte sua conclusão inicial após avaliação rigorosa. É a contribuição central. |
| 🟡 **p-hacking (e por que NÃO é)** | Rodar muito e selecionar o melhor resultado. Aqui é o oposto: rodo muito pra **destruir** um positivo, com perguntas pré-definidas. |
| 🟡 **Ablation** | Remover/isolar um componente pra medir sua contribuição. PRICE vs SENT vs PRICE+SENT → sentimento adiciona +0,003. |

---

## Mini-drill: 10 termos que MAIS provavelmente caem (treina estes primeiro)
1. AUC — o que é
2. Por que AUC e não acurácia
3. Expanding-window CV — e por que ela inverteu
4. Forward-fill — e por que não vaza futuro
5. Colapso bimodal
6. Transformer / atenção
7. FinBERT-PT-BR
8. Baseline autoregressivo
9. Bootstrap CI
10. Por que 1.435 runs não é p-hacking

## Auto-teste (responde sem olhar; se travar, volta ao glossário)
- O que AUC mede, em uma frase?
- Por que o 0,709 não era confiável? (3 motivos)
- O que é expanding-window CV e por que importa aqui?
- Forward-fill vaza o futuro? Por quê não?
- O que é colapso bimodal e o que ele indica?
- Por que a ablation usa XGBoost e não o Transformer?
- O que significa Δ=+0,003 com p=0,49?
- O baseline de preço dar 0,667 não contradiz a eficiência de mercado?
