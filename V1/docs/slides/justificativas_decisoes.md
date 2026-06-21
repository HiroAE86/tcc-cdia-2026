# Justificativas de cada decisão — defender o "por quê"

> Banca pergunta "por que X e não Y?". Cada bloco: **decisão · por quê · alternativa rejeitada · se pressionarem**.
> Ordem = ordem do pipeline. Decore os blocos marcados ⭐ (mais prováveis).

---

## DADOS E FONTE

### ⭐ Por que InfoMoney como fonte de notícias?
- **Por quê:** uma das maiores fontes de notícia financeira BR, API WordPress pública e paginável, cobre os 3 ativos no período 2009–2026.
- **Rejeitado:** Valor/Estadão (paywall, sem API limpa); Twitter/X (API paga desde 2023, ruído alto); CVM/Google News (explorado em `8.multi-source-news` como direção futura, não no escopo principal).
- **Se pressionarem:** viés editorial de varejo é **limitação #1 declarada**. Fonte única não generaliza — diversificar é trabalho futuro explícito.

### Por que só 3 ativos (ITUB4, PETR4, VALE3)?
- **Por quê:** large-caps mais líquidas e mais cobertas pela imprensa → maior densidade de notícias por dia → melhor chance de detectar sinal SE existir. Estudo de caso, não survey.
- **Rejeitado:** índice inteiro / small-caps — cobertura jornalística esparsa, baixa liquidez, ruído domina.
- **Se pressionarem:** validade externa limitada (limitação #2). Mas se o sinal não aparece nas ações *mais* favoráveis, dificilmente aparece nas piores.

### Por que período 2009–2026?
- **Por quê:** máximo de histórico disponível na API + Yahoo. Inclui ciclos diversos (crises, alta, lateralização) → testa estabilidade temporal.

---

## REPRESENTAÇÃO TEXTUAL

### ⭐ Por que comparar embeddings genéricos vs FinBERT (e não usar só um)?
- **Por quê:** é a **pergunta de pesquisa A** — qual codificação é mais informativa: vetor genérico de alta dimensão (1.024) ou sentimento específico de baixa dimensão (5)? As 3 gerações de NLP financeiro (léxico → embeddings densos → modelos fine-tuned) justificam testar genérico vs específico.
- **Resultado:** genérico ~0,50 (acaso); FinBERT subiu o AUC aparente — mas a Etapa 5 mostra que nem isso sobrevive ao rigor.

### Por que qwen3-embedding:4b para os embeddings genéricos?
- **Por quê:** roda local via Ollama (custo zero, sem API), multilíngue (lida com PT), 1.024 dims = representação densa contextual moderna.
- **Rejeitado:** OpenAI embeddings (custo + dependência externa); Word2Vec/GloVe (clássicos, não-contextuais, geração anterior).
- **Se pressionarem:** a escolha exata do embedding genérico não é crítica — o **controle de dimensionalidade** (20 subconjuntos aleatórios de 5 dims → 0,509) mostra que o problema é a representação genérica em si, não o modelo específico.

### ⭐ Por que FinBERT-PT-BR e não BERT genérico ou GPT?
- **Por quê:** fine-tuned em corpora financeiros em **português brasileiro** (Souza, Carvalho, Calado 2023). Captura polaridade de termos do domínio — "alavancagem", "guidance", "rating" — que léxico genérico erra. Disponível só desde 2022 → janela de pesquisa nova em PT.
- **Rejeitado:** FinBERT inglês (Araci 2019) — idioma errado; LLM via prompt (custo, latência, não-determinismo no período do trabalho).

### ⭐ Por que reduzir o sentimento a 5 features/dia?
- **Por quê:** 3 logits (POS/NEG/NEU) por artigo → agregação diária em 5 features (n_articles, mean_logit_pos/neg/neu, mean_sentiment). Representação **compacta e interpretável**, alinha por dia com o preço.
- **Se pressionarem:** a conclusão se aplica a **essa representação** — não a toda forma de usar texto (escopo declarado). Texto bruto em LLM = direção futura.

### Por que PCA 32 componentes nos embeddings?
- **Por quê:** 32 comps retêm **61,4%** da variância (inspeção da curva acumulada). PCA ajustado **só no treino** → sem vazamento. Reduz 1.024→32 para evitar maldição da dimensionalidade com poucos dias.
- **Se pressionarem:** número não é mágico — escolhido pela curva de variância. E o controle de dimensionalidade isola o efeito.

---

## FEATURES DE PREÇO E MERGE

### Por que 11 features técnicas de preço?
- **Por quê:** fechamento, volume, retorno, médias móveis 7/21d, volatilidade 21d, 5 lags → cobrem momentum, volume e volatilidade, os sinais clássicos de direção.

### ⭐ Por que forward-fill em dias sem notícia? (PERGUNTA QUENTE)
- **Por quê:** nem todo dia tem notícia; o modelo precisa de valor em todo dia útil. Forward-fill propaga o **último sentimento conhecido (passado)**.
- **NÃO vaza futuro:** propaga passado, não futuro. Confusão comum da banca.
- **Risco real:** look-ahead **intradiário** — artigo publicado após o fechamento (~17h BRT) atribuído ao dia t. Não auditado sistematicamente (limitação declarada).
- **Defesa decisiva:** a direção do viés **favorece o sentimento** — se há vazamento residual, ele só *infla* o ganho. Como o ganho deu **zero**, o nulo é um **limite superior otimista**. Vazamento não ameaça a conclusão.

### Por que janelas de 30 dias?
- **Por quê:** balanço entre contexto temporal suficiente e nº de amostras. Sequência que as redes (LSTM/Transformer/TCN) consomem.

### ⭐ Por que alvo binário Close[t+h] > Close[t]?
- **Por quê:** problema é **direção** (sobe/desce), não magnitude — classificação binária, métrica AUC limpa.
- **h = 5 e 21:** horizontes semanal e mensal, onde drift pós-notícia é documentado em outros mercados. Mais curto = ruído de microestrutura; mais longo = sinal de notícia dilui.
- **Desbalanceamento 59/41:** mercado sobe mais que cai no período → tratado com `pos_weight`/`class_weight`.

---

## MODELOS

### ⭐ Por que 4 arquiteturas (BiLSTM, Transformer, TCN, XGBoost)?
- **Por quê:** representam as famílias dominantes em ML financeiro. 3 redes processam sequência de 30d (recorrente, atenção, convolucional); XGBoost = padrão tabular + serve de baseline autoregressivo.
- **Cobertura:** se o sinal existisse, alguma das 4 o pegaria. Nenhuma pegou.

### Por que XGBoost para a ablation e não o Transformer (que deu 0,709)?
- **Por quê:** Transformer sofre **colapso bimodal** (std 0,261) → confunde efeito das *features* com efeito da *arquitetura*. XGBoost é o **mais estável** (std 0,012) → isola o efeito do sentimento limpo.
- **Defesa decisiva:** por isso a conclusão **não depende do Transformer**. No modelo mais estável, Δ = +0,003, p = 0,49.

### Por que NÃO otimizar hiperparâmetros por fold?
- **Por quê:** objetivo era medir **robustez do resultado original** sob variação de janela/semente, não maximizar desempenho. Otimizar por fold adicionaria outra fonte de variância e confundiria a comparação. Hiperparâmetros **congelados** em todos os experimentos.

### Por que rejeitou Random Forest / Regressão Logística / GRU como modelos principais?
- **RF:** usado no Estágio 7 só pra SHAP; XGBoost dá desempenho equivalente com mais regularização.
- **LogReg:** premissa de linearidade inadequada pra série financeira em janela 30d (só usado em baselines ingênuos).
- **GRU:** redundante com BiLSTM — ambos recorrentes com memória; literatura não mostra ganho sistemático de GRU sobre LSTM em série de baixa frequência.

---

## AVALIAÇÃO (o coração do TCC)

### ⭐ Por que AUC e não acurácia / F1?
- **Por quê:** AUC é **invariante a threshold** e robusta a desbalanceamento (59/41). Acurácia **engana**: Transformer tinha 76,3% acurácia prevendo quase só a majoritária (recall Desce = 0,15).
- **Se pressionarem:** com desbalanceamento severo, balanced accuracy / MCC seriam complementos → trabalho futuro declarado.

### ⭐ Por que bootstrap CI (1.000 reamostras)?
- **Por quê:** test set tem 60–177 amostras → AUC pontual é instável. Bootstrap dá IC sem assumir distribuição fechada. Hanley-McNeil (1982) dá o erro-padrão analítico; bootstrap é a alternativa não-paramétrica.
- **Achado-chave:** baseline 0,658 com **IC [0,565; 0,744]** já englobava o 0,709 → primeiro sinal de que o ganho podia ser zero.

### ⭐⭐ Por que expanding-window CV e não walk-forward único?
- **Por quê:** janela única = 1 estimativa, sem variância temporal. Expanding-window (Prado 2018) dá **múltiplas** estimativas fora da amostra → mede nível médio E variância. Simula decisão em tempo real, treino expande cronologicamente.
- **Achado-chave:** a **inversão** — baseline 0,667 vs Transformer 0,509. Fora da janela original, o sinal some.

### ⭐ Por que ≥10 sementes (multi-seed)?
- **Por quê:** 1 semente = 1 inicialização. Modelos neurais são sensíveis à inicialização. Multi-seed revela a **distribuição**.
- **Achado-chave:** Transformer **bimodal** (std 0,261, picos perto de 0 e 1) → 0,709 foi uma **semente sortuda**. Baseline std 0,012 (21× mais estável).

### Por que baseline autoregressivo de 5 features de preço?
- **Por quê:** referência mínima honesta. Se o preço sozinho já prevê direção, o sentimento tem que **superar** isso pra ter valor. As 5 (return, lag_1, lag_5, Volume, std21) = momentum + volume + volatilidade.
- **Hierarquia de baselines:** classe majoritária (0,500) < coin flip (0,500) < persistência (0,474) < autoregressivo (0,658). Cada um descarta uma explicação trivial.

### Por que Wilcoxon signed-rank?
- **Por quê:** teste **não-paramétrico** pareado (mesmos folds, dois modelos) — não assume normalidade do AUC entre folds.
- **Se pressionarem (folds sobrepostos violam independência):** reconhecido. Efeito é **conservador** — sobreposição infla correlação, o que **não** cria significância espúria em resultado nulo. Como p = 0,49 e 0,194 são nulos, o viés não os ameaça.

### Por que VALE3 deep-dive com 880 runs?
- **Por quê:** VALE3 foi o **único** ativo com Δ > 0 (+0,036) na análise de 5 folds. Pra não cherry-pickar a favor da hipótese nula, aprofundei deliberadamente: 52 folds × 10 sementes.
- **Resultado:** p = 0,194, não significativo. Mata o "mas na VALE3 funcionava".

### ⭐ Por que ~1.510 execuções não é p-hacking?
- **Por quê:** **direção oposta** do p-hacking. P-hacking roda muito e **seleciona** o melhor resultado. Aqui as execuções servem pra **destruir** um positivo. Cada experimento responde uma pergunta **pré-definida**, hiperparâmetros congelados, nenhuma métrica escolhida a posteriori.

### Por que reportar análise de poder (MDE)?
- **Por quê:** resultado nulo precisa de contexto — "nulo" pode ser "sem efeito" ou "sem poder". MDE (Hanley-McNeil) = 0,13–0,22 pra N de 60–177.
- **Defesa decisiva:** conclusão correta é "**nenhum efeito detectável neste n**" — mas o **mesmo desenho detecta o sinal de preço com folga** (0,667 estável). Logo o protocolo é sensível quando o efeito existe; o sentimento está 44–74× abaixo do detectável.

---

## META / FRAMING

### Por que apresentar um resultado nulo como TCC?
- **Por quê:** a contribuição **não** é "sentimento não funciona" — é a **demonstração quantificada** de como janela única + semente única + ausência de IC fabricam um falso positivo (0,709 → ~0,51) em dados BR reais. Valor pedagógico + os 6 protocolos.
- **Viés de publicação:** resultados nulos são sub-representados em NLP financeiro (Shah et al. 2019) → publicar o nulo combate isso.

### Por que os 6 protocolos se já existem em Prado (2018)?
- **Por quê:** os protocolos **não são originais** — declaro isso. A contribuição é mostrar **a magnitude do dano** de ignorá-los num caso concreto brasileiro: a métrica inverte de 0,709 pra ~0,51, virando conclusão positiva em negativa.

### Se a banca perguntar "o que faria diferente?"
Aplicar os 6 protocolos **desde o dia 1**. O custo de não fazer foi descobrir no fim que o 0,709 era artefato. Lição: rigor de avaliação antes de comemorar resultado.
