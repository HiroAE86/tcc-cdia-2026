# Mapa lógico do TCC — para entender e explicar

> Tese em uma frase: **"Obtive AUC 0,709 usando sentimento de notícias, desconfiei, rodei ~1.510 execuções e provei que era artefato de janela única — o sentimento não adiciona valor detectável (Δ = +0,003, p = 0,49)."**

---

## 1. Visão geral — o arco completo

```mermaid
flowchart TD
    Q["PERGUNTA DE PESQUISA<br/>Notícias financeiras em português melhoram<br/>a predição de direção de preço<br/>de ITUB4, PETR4, VALE3?"]

    Q --> P["PIPELINE<br/>5.872 notícias InfoMoney +<br/>OHLCV Yahoo Finance"]

    P --> E3["ETAPA 3<br/>Embeddings genéricos<br/>qwen3 1024-dim + PCA 32<br/>Resultado: AUC ~0,50"]
    P --> E4["ETAPA 4<br/>FinBERT-PT-BR<br/>5 features de sentimento/dia<br/>Resultado: AUC 0,709"]

    E4 --> POS["RESULTADO POSITIVO<br/>Transformer + FinBERT = 0,709<br/>parece confirmar a hipótese"]

    POS --> ALERTA["3 SINAIS DE ALERTA<br/>1. precision Desce 1,00 / recall 0,15<br/>2. acurácia 76,3% perto da majoritária 69%<br/>3. sem IC, 1 semente, 1 janela"]

    ALERTA --> INV["INVESTIGAÇÃO<br/>13 experimentos<br/>~1.510 execuções"]

    INV --> NULO["RESULTADO REAL<br/>0,709 era artefato de janela única<br/>Sentimento: delta +0,003, p = 0,49<br/>Baseline de preço: 0,667 estável"]

    NULO --> CONTRIB["CONTRIBUIÇÕES<br/>1. Pipeline replicável<br/>2. Demonstração do viés de janela única em dados BR<br/>3. Seis protocolos mínimos"]

    style POS fill:#E4572E,color:#fff
    style NULO fill:#0B3142,color:#fff
    style CONTRIB fill:#1B7F79,color:#fff
```

**Como narrar:** pergunta → construí o pipeline → resultado positivo bonito → mas três coisas cheiravam mal → ataquei o próprio resultado → ele morreu → a lição metodológica é a contribuição.

---

## 2. Pipeline de dados — como o dado vira predição

```mermaid
flowchart LR
    N["Notícias InfoMoney<br/>API WordPress<br/>5.872 artigos"] --> S["FinBERT-PT-BR<br/>sentimento por artigo"]
    S --> A["Agregação diária<br/>5 features:<br/>média, std, % pos,<br/>% neg, contagem"]

    Y["Yahoo Finance<br/>OHLCV diário"] --> F["Features de preço<br/>retornos, volatilidade,<br/>médias móveis"]

    A --> M["Merge: left join no preço<br/>+ forward-fill em dias sem notícia"]
    F --> M

    M --> W["Janelas de 30 dias<br/>sequências para o modelo"]
    W --> T["Alvo binário<br/>Close em t+h maior que Close em t<br/>h = 5 ou 21 dias úteis"]
    T --> MOD["Modelos<br/>Transformer, BiLSTM,<br/>TCN, XGBoost"]
    MOD --> AUC["Métrica: AUC<br/>+ bootstrap CI 1.000 reamostras"]

    style M fill:#E4572E,color:#fff
```

**Ponto sensível (em coral): o merge.** Forward-fill propaga o *passado* — não vaza futuro. O risco real é intradiário: notícia publicada após fechamento atribuída ao dia t. Direção do viés favorece o sentimento → o resultado nulo é limite superior otimista.

---

## 3. A investigação — cada experimento mata uma explicação

```mermaid
flowchart TD
    H["0,709 é real?"] --> X1["BASELINES — 7 runs<br/>Autoregressivo só-preço:<br/>0,658 com IC 0,565 a 0,744"]
    X1 --> C1["IC do baseline JÁ ENGLOBA 0,709<br/>o ganho do sentimento pode ser zero"]

    H --> X2["CONTROLE DIMENSIONALIDADE — 20 runs<br/>20 subconjuntos aleatórios de 5 dims<br/>do embedding: AUC 0,509"]
    X2 --> C2["Etapa 3 vs 4 não era<br/>só questão de dimensionalidade"]

    H --> X3["MULTI-SEED — 160 runs<br/>10+ sementes por config"]
    X3 --> C3["Transformer: std 0,261 — BIMODAL<br/>picos perto de 0 e 1 = colapso<br/>Baseline: std 0,012 — 21x mais estável<br/>0,709 era UMA semente sortuda"]

    H --> X4["EXPANDING-WINDOW CV — 145 runs<br/>múltiplas janelas temporais"]
    X4 --> C4["INVERSÃO: baseline 0,667<br/>vs Transformer 0,509<br/>fora da janela original o sinal some"]

    H --> X5["VALE3 DEEP-DIVE — 880 runs<br/>o ativo onde sentimento parecia ajudar"]
    X5 --> C5["p = 0,194 — não significativo"]

    H --> X6["ABLATION — 225 runs<br/>XGBoost o modelo MAIS ESTÁVEL<br/>PRICE vs SENT vs PRICE+SENT"]
    X6 --> C6["delta = +0,003<br/>IC -0,012 a +0,018<br/>Wilcoxon p = 0,49<br/>VEREDITO FINAL"]

    C1 --> FIM["CONCLUSÃO<br/>0,709 = artefato de janela única.<br/>Sentimento na representação adotada<br/>não adiciona valor detectável."]
    C2 --> FIM
    C3 --> FIM
    C4 --> FIM
    C5 --> FIM
    C6 --> FIM

    style C6 fill:#E4572E,color:#fff
    style FIM fill:#0B3142,color:#fff
```

**Lógica da sequência:** cada experimento fecha uma porta de escape.
- "Mas o baseline pode ser fraco" → não, 0,658 com IC largo.
- "Mas pode ser dimensionalidade" → não, 5 dims aleatórias dão 0,509.
- "Mas pode ser azar de semente" → é o contrário: 0,709 foi *sorte* de semente (bimodal).
- "Mas pode ser a janela" → exato: fora dela, inverte.
- "Mas o Transformer é instável, não prova nada" → por isso ablation com XGBoost (std 0,012): Δ = +0,003.

---

## 4. Estrutura do argumento — por que a conclusão se sustenta

```mermaid
flowchart TD
    CLAIM["AFIRMAÇÃO CENTRAL<br/>O sentimento, na representação adotada,<br/>não adiciona valor preditivo detectável"]

    CLAIM --> E1["Evidência 1: ablation<br/>delta +0,003, p 0,49, 225 runs<br/>no modelo mais estável"]
    CLAIM --> E2["Evidência 2: CV temporal<br/>Transformer cai a 0,509<br/>fora da janela original"]
    CLAIM --> E3b["Evidência 3: multi-seed<br/>resultado original não reproduz<br/>colapso bimodal"]

    CLAIM --> Q1{"Objeção: estudo<br/>subpotenciado?<br/>MDE 0,13 a 0,22"}
    Q1 --> R1["Resposta: conclusão qualificada como<br/>'nenhum efeito detectável neste n'.<br/>E o MESMO desenho detecta o sinal<br/>de preço com folga: 0,667 estável.<br/>Protocolo é sensível quando efeito existe."]

    CLAIM --> Q2{"Objeção: 1.510 runs<br/>não é p-hacking?"}
    Q2 --> R2["Resposta: direção OPOSTA.<br/>Execuções destroem um positivo,<br/>não selecionam o melhor.<br/>Hiperparâmetros congelados,<br/>perguntas pré-definidas."]

    CLAIM --> Q3{"Objeção: e se for só<br/>o Transformer ruim?"}
    Q3 --> R3["Resposta: ablation usa XGBoost,<br/>std 0,012, e mesmo assim +0,003.<br/>Conclusão não depende do Transformer."]

    style CLAIM fill:#0B3142,color:#fff
    style R1 fill:#1B7F79,color:#fff
    style R2 fill:#1B7F79,color:#fff
    style R3 fill:#1B7F79,color:#fff
```

---

## 5. O que o trabalho NÃO afirma (escopo — decorar)

```mermaid
flowchart LR
    subgraph AFIRMA["O TRABALHO AFIRMA"]
        A1["5 features FinBERT agregadas/dia<br/>não ajudam nesses 3 ativos"]
        A2["Janela única + 1 semente<br/>produz falsos positivos"]
        A3["Preço tem sinal autoregressivo<br/>modesto: 0,667 sob CV"]
    end

    subgraph NAO["O TRABALHO NÃO AFIRMA"]
        N1["que notícias nunca têm valor<br/>(outras representações: futuro)"]
        N2["que generaliza além de<br/>ITUB4, PETR4, VALE3 + InfoMoney"]
        N3["que 0,667 é lucrável<br/>(AUC não é retorno após custos)"]
    end

    AFIRMA ~~~ NAO

    style AFIRMA fill:#1B7F79,color:#fff
    style NAO fill:#E4572E,color:#fff
```

---

## 6. Os 6 protocolos (a contribuição prática)

| # | Protocolo | Qual experimento o motiva |
|---|---|---|
| 1 | Reportar IC bootstrap | Baseline 0,658 [0,565; 0,744] já englobava 0,709 |
| 2 | ≥ 10 sementes | Multi-seed revelou std 0,261 e bimodalidade |
| 3 | Expanding-window CV | Inversão 0,667 vs 0,509 entre janelas |
| 4 | Baseline autoregressivo | Sem ele, 0,709 parecia bom em absoluto |
| 5 | Monitorar distribuição de predições | Bimodal = assinatura do colapso degenerado |
| 6 | Auditar correlação validação-teste | Janela única esconde anticorrelação val-teste |

Origem: López de Prado (2018). Contribuição do TCC: mostrar **a magnitude do dano** de ignorá-los em dados brasileiros (0,709 → ~0,51).

---

## 7. Números na ponta da língua

| Número | O que é | Onde usar |
|---|---|---|
| **0,709** | AUC Transformer+FinBERT, janela única — o artefato | Início da história |
| **0,658 [0,565; 0,744]** | Baseline autoregressivo, janela única | Primeiro sinal: IC engloba 0,709 |
| **0,261 vs 0,012** | std multi-seed: Transformer vs baseline (21×) | Instabilidade |
| **0,667 vs 0,509** | AUC médio sob CV: baseline vs Transformer | A inversão |
| **+0,003, p = 0,49** | Ganho do sentimento na ablation (225 runs) | Veredito final |
| **p = 0,194** | VALE3 deep-dive, 880 runs | Mata o "mas na VALE3 funcionava" |
| **~1.510** | Total de execuções | Credibilidade da investigação |
| **5.872** | Artigos (2.572 ITUB4 / 1.775 PETR4 / 1.525 VALE3) | Dados |
| **0,13–0,22** | MDE (efeito mínimo detectável) | Resposta à objeção de poder |
| **61,4%** | Variância retida por PCA 32 comps (só treino) | Defesa do embedding |

---

## 8. Roteiro de 60 segundos (elevator pitch)

1. **Pergunta:** sentimento de notícias melhora predição de direção na B3?
2. **Fiz:** pipeline completo — 5.872 notícias, FinBERT-PT-BR, 4 arquiteturas.
3. **Achei:** AUC 0,709, compatível com a literatura. Parecia sucesso.
4. **Desconfiei:** matriz de confusão degenerada, sem IC, uma semente, uma janela.
5. **Testei:** 13 experimentos, ~1.510 execuções, hiperparâmetros congelados.
6. **Descobri:** o resultado era artefato de janela única. Sentimento: Δ = +0,003, p = 0,49. O baseline de preço puro (0,667) vence tudo sob validação rigorosa.
7. **Contribuição:** demonstração quantificada do viés de janela única em dados brasileiros + 6 protocolos mínimos para ML financeiro.
