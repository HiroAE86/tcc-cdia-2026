# Ferramentas explicadas — 3 níveis cada

> Banca de Ciência de Dados quer ver que tu **entende a ferramenta e a decisão**, não que decora teoria.
> Por ferramenta: **(1) 1 frase** (o que falar de cara) · **(2) defesa** (se pedirem detalhe) · **(3) se cavarem fundo** (último nível) · **por que escolhi**.
> 🔴 = vão perguntar, sabe a fundo · 🟡 = sabe a defesa · ⚪ = só saber que existe.

---

## 🔴 AUC / ROC — a métrica central
1. **1 frase:** AUC é a probabilidade de o modelo dar score maior a um "Sobe" aleatório do que a um "Desce" aleatório. 0,5 = acaso, 1,0 = perfeito.
2. **Defesa:** a curva ROC varre todos os thresholds de decisão e plota taxa de verdadeiro-positivo vs falso-positivo; a área sob ela resume a capacidade de **ordenar** positivos acima de negativos, sem fixar um corte. Por isso é invariante a threshold.
3. **Se cavarem:** equivale à estatística U de Mann-Whitney normalizada. Não depende de prevalência da forma que acurácia depende → robusta a desbalanceamento. Limitação: com test set pequeno (60–177 amostras aqui) é instável → por isso reporto bootstrap CI.
- **Por que escolhi:** acurácia engana com classe desbalanceada (Transformer tinha 76,3% prevendo quase só a majoritária). AUC desmascara isso.

## 🔴 Transformer / atenção
1. **1 frase:** rede que usa **atenção** — cada posição da sequência olha diretamente para todas as outras e pesa quais importam, sem depender de recorrência.
2. **Defesa:** o mecanismo multi-head attention calcula, para cada instante, um peso de relevância em relação a todos os demais instantes da janela de 30 dias, capturando dependências entre pontos arbitrários sem viés de localidade. Uso encoder de 2 camadas, 4 cabeças, d_model=64.
3. **Se cavarem:** atenção = softmax(QKᵀ/√d)·V — Query/Key/Value projetados da entrada; o produto Q·K mede similaridade, softmax normaliza em pesos, multiplica por V. "Multi-head" = vários desses em paralelo, capturando relações diferentes.
- **Por que escolhi:** representa a família estado-da-arte (Vaswani 2017). **Mas** sofreu colapso bimodal aqui → por isso a ablation final usa XGBoost, não ele.

## 🔴 BERT / FinBERT-PT-BR
1. **1 frase:** BERT é um modelo de linguagem pré-treinado que produz representações contextuais de texto; FinBERT-PT-BR é a versão ajustada (fine-tuned) para textos financeiros em português.
2. **Defesa:** BERT é pré-treinado por **masked language modeling** — prevê palavras ocultadas a partir do contexto nos dois sentidos. Esse pré-treino genérico é depois adaptado ao domínio via fine-tuning: adiciona uma camada de classificação e reajusta pesos em corpus rotulado menor. FinBERT-PT-BR gera 3 logits (POS/NEG/NEU) por artigo.
3. **Se cavarem:** "Bidirectional Encoder Representations from Transformers" — usa só a pilha de encoders do Transformer. Capta polaridade de termos do domínio ("alavancagem", "guidance", "rating") que um léxico genérico erra.
- **Por que escolhi:** único modelo de sentimento fine-tuned em PT financeiro (Souza 2023), disponível desde 2022. Determinístico e local — sem custo/latência de LLM via API.

## 🔴 Expanding-window CV — o coração do trabalho
1. **1 frase:** validação cruzada temporal onde o treino **cresce** cronologicamente a cada fold e a janela de teste avança no tempo, simulando decisão em tempo real.
2. **Defesa:** ao contrário do walk-forward único (1 estimativa), gera **múltiplas** estimativas fora da amostra → permite medir nível médio E variância do desempenho ao longo do tempo. Sem ela, não dá pra saber se 0,709 é típico ou sortudo.
3. **Se cavarem:** treino sempre = tudo até o ponto t; teste = janela seguinte; t avança. Nunca usa futuro para prever passado. Aqui: 600 dias mínimos, janelas de 90 dias, passo de 90. Recomendação de Prado (2018) para série não-estacionária.
- **Por que escolhi:** foi o experimento que **inverteu** o resultado (baseline 0,667 vs Transformer 0,509). Janela única escondia isso.

## 🔴 XGBoost
1. **1 frase:** gradient boosting de árvores — constrói árvores de decisão em sequência, cada uma corrigindo os erros residuais das anteriores.
2. **Defesa:** padrão de fato para dados tabulares. Aqui: 300 árvores, profundidade 4, learning rate 0,05. Serve como baseline autoregressivo (só preço) e como modelo da ablation por ser o **mais estável** (std 0,012 sob multi-seed).
3. **Se cavarem:** cada árvore é treinada no gradiente da função de perda em relação às predições atuais (boosting); regularização nativa (profundidade, learning rate) controla overfitting. Lida com não-linearidade que LogReg não pega.
- **Por que escolhi:** estabilidade. O Transformer era instável demais pra isolar o efeito das features — XGBoost permite atribuir o Δ=+0,003 às features, não à arquitetura.

## 🟡 Bootstrap CI
1. **1 frase:** reamostra o test set com reposição 1.000 vezes, recalcula a AUC em cada, e o IC 95% sai dos percentis 2,5 e 97,5 da distribuição.
2. **Defesa:** método não-paramétrico — não assume distribuição fechada da AUC. Alternativa ao erro-padrão analítico de Hanley-McNeil (1982). Revela a incerteza que uma estimativa pontual esconde.
- **Por que escolhi:** test set pequeno → AUC pontual instável. O IC do baseline [0,565; 0,744] já englobava 0,709 — primeiro sinal de alerta.

## 🟡 Wilcoxon signed-rank
1. **1 frase:** teste estatístico **não-paramétrico pareado** — compara dois modelos nos mesmos folds sem assumir normalidade.
2. **Defesa:** pareia AUC fold-a-fold (baseline vs sentimento), ordena as diferenças por magnitude e testa se a soma dos postos desvia de zero. Usei porque a distribuição de AUC entre folds não é garantidamente normal.
- **Por que escolhi:** comparação pareada robusta. Resultado p=0,49 (ablation) e p=0,194 (VALE3) → ganho do sentimento indistinguível do acaso.
- **Se pressionarem (folds sobrepostos):** viola independência estrita, reconhecido; efeito é conservador (não cria significância espúria em nulo).

## 🟡 PCA (Análise de Componentes Principais)
1. **1 frase:** reduz dimensionalidade projetando os dados nas direções de maior variância.
2. **Defesa:** reduzi os embeddings de 1.024 → 32 componentes, retendo 61,4% da variância. **Ajustado só no conjunto de treino** para evitar vazamento de dados.
- **Por que escolhi:** 1.024 dims com ~1.200 dias = maldição da dimensionalidade. 32 escolhido pela curva de variância acumulada, não arbitrário.

## 🟡 BiLSTM / LSTM
1. **1 frase:** rede recorrente que mantém memória ao longo da sequência via "gates" que decidem o que reter/descartar; Bi = processa nos dois sentidos temporais.
2. **Defesa:** os gates (input/forget/output) mitigam o gradiente que desaparece em sequências longas. BiLSTM concatena leitura para-frente e para-trás. Testei variantes 2 camadas/128 e 1 camada/32.
- **Por que escolhi:** família recorrente clássica em predição financeira (Fischer & Krauss 2018). Rejeitei GRU por redundância (sem ganho sistemático sobre LSTM).

## 🟡 TCN (Temporal Convolutional Network)
1. **1 frase:** rede convolucional com **convoluções causais dilatadas** — cada saída só depende de instantes passados, e as dilatações expandem o campo receptivo exponencialmente.
2. **Defesa:** "causal" = não vaza futuro; "dilatada" = pula instantes para cobrir mais histórico com menos camadas. Config [32,32], kernel 3, dilatações [1,2], blocos residuais. Foi o melhor sob janela única (0,643) mas caiu pra 0,556 sob CV.
- **Por que escolhi:** alternativa convolucional às recorrentes; valida que o colapso não é exclusivo do Transformer.

## ⚪ Ollama / qwen3-embedding:4b
1. **1 frase:** Ollama roda modelos localmente; qwen3-embedding gera vetores de 1.024 dims por artigo.
2. **Defesa:** local (custo zero, sem API externa), multilíngue (lida com PT). Usado só na Etapa 3 (embeddings genéricos).
- **Por que escolhi:** a escolha exata não é crítica — o controle de dimensionalidade (5 dims aleatórias → 0,509) mostra que o problema é a representação genérica, não o modelo.

## ⚪ SHAP
1. **1 frase:** método que atribui a contribuição de cada feature para uma predição, baseado em valores de Shapley da teoria dos jogos.
2. **Defesa:** usado só como diagnóstico de importância de features no Estágio 7, não no resultado principal.
- **Saber que existe.** Não central à reversão.

## 🟡 Forward-fill (não é "ferramenta", mas vão perguntar)
1. **1 frase:** preenche dias sem notícia propagando o **último** valor de sentimento conhecido.
2. **Defesa:** propaga o **passado** — não vaza futuro. Risco real é look-ahead intradiário (notícia pós-fechamento atribuída ao dia t).
- **Defesa decisiva:** direção do viés **favorece** o sentimento → o resultado nulo é, na pior hipótese, um **limite superior otimista** do ganho real.

---

## Regra de ouro se travar numa definição
Não invente fórmula. Diga o **propósito** ("serve para X") + a **decisão** ("escolhi porque Y"). Banca valoriza entender *por que* a ferramenta está ali mais do que recitar a matemática.

## Mapa ferramenta → slide (onde provavelmente perguntam)
| Ferramenta | Slide |
|---|---|
| Embeddings/Ollama/PCA | 7 |
| BERT/FinBERT | 8 |
| AUC | 9, 12 |
| Bootstrap CI | 12 |
| Multi-seed (variância) | 13 |
| Expanding-window CV | 14 |
| Wilcoxon | 14, 15 |
| XGBoost/ablation | 16 |
| Transformer | 9, 13, 16 |
| Forward-fill | 6 |
