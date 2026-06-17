# Perguntas previstas — apresentação TCC

Respostas curtas para falar; detalhe entre parênteses se pedirem aprofundamento.

## Bloco A — As 5 mais prováveis (decorar)

**1. "Se o sentimento não funciona, por que o baseline de preço atinge AUC 0,70? Isso não contradiz a eficiência de mercado?"**
AUC ≠ lucro. O baseline captura momentum/autocorrelação de curto prazo (Lo, 2004 — adaptive markets), mas o experimento ensemble + backtest mostrou que isso não vira retorno após custos. Eficiência semi-forte fala de retorno ajustado a risco, não de AUC de classificação. (E h=21 com janelas sobrepostas infla autocorrelação do alvo.)

**2. "O forward-fill não vaza informação do futuro?"**
Não — forward-fill propaga o *passado* para dias sem notícia. O risco real é look-ahead intradiário: artigo publicado após o fechamento (~17h) atribuído ao dia t. Não foi auditado sistematicamente (limitação declarada), mas a direção do viés joga *a favor* do sentimento — então o resultado nulo é, na pior hipótese, um limite superior otimista do ganho real.

**3. "O colapso bimodal não é só um Transformer mal configurado? Outra arquitetura não resolveria?"**
Possível, e é limitação declarada (instabilidade impede atribuição causal limpa). Mas a conclusão não depende do Transformer: a ablation usa XGBoost — o modelo mais estável de todos (std 0,012) — e mesmo assim Δ = +0,003, p = 0,49. O colapso também não é artefato de early stopping: critério é loss de validação, paciência 10, e o colapso ocorre independentemente do critério.

**4. "Com MDE de 0,13–0,22, o estudo não está simplesmente subpotenciado? A conclusão nula vale alguma coisa?"**
A conclusão correta é "nenhum efeito detectável neste tamanho amostral", e ela está qualificada assim no texto. Mas não é só falta de poder: o mesmo desenho detecta com folga o sinal autoregressivo de preço (0,667 sob CV, estável). O protocolo é sensível a efeito real quando existe; o sentimento está 44–74× abaixo do detectável.

**5. "Só 3 ativos e uma fonte de notícias — isso generaliza?"**
Não generaliza, e o trabalho não reivindica isso. Limitações 1 e 2 declaradas: InfoMoney tem viés editorial de varejo e cobertura desigual (2.572 artigos ITUB4 vs 1.525 VALE3). A conclusão vale para a representação adotada (5 features diárias FinBERT) nesses 3 ativos. Direção futura: CVM, analyst reports, redes sociais (já explorado preliminarmente em 8.multi-source-news).

## Bloco B — Prováveis (ler 2x)

**6. "Por que não otimizou hiperparâmetros por fold?"**
Deliberado: objetivo era medir robustez do resultado original sob variação de janela/semente, não maximizar desempenho. Otimização por fold adicionaria outra fonte de variância e confundiria a comparação.

**7. "Wilcoxon com folds adjacentes/sobrepostos viola independência."**
Sim, reconhecido no texto. O efeito é conservador: sobreposição infla correlação entre folds, o que não produz significância espúria em resultados nulos. Como as conclusões são nulas (p = 0,49 e p = 0,194), o viés não as ameaça.

**8. "Por que AUC e não acurácia/F1/MCC?"**
AUC é invariante a threshold e mais informativa com classe desbalanceada (59/41). Acurácia engana: o Transformer tinha 76,3% de acurácia prevendo quase só a majoritária. Métricas robustas a desbalanceamento (balanced accuracy, MCC) estão nos trabalhos futuros.

**9. "Por que PCA com 32 componentes? Por que qwen3-embedding?"**
32 componentes retêm 61,4% da variância (curva de variância acumulada, ajustada só no treino — sem vazamento). qwen3-embedding:4b roda local via Ollama, multilíngue, custo zero. O controle de dimensionalidade (20 subconjuntos aleatórios de 5 dims → AUC 0,509) descarta que a diferença Etapa 3→4 fosse só dimensionalidade.

**10. "1.435 execuções não é garimpar resultado? Múltiplas comparações?"**
Direção oposta do p-hacking: as execuções servem para *destruir* um resultado positivo, não para selecionar o melhor. Cada experimento responde uma pergunta pré-definida; hiperparâmetros congelados; nenhuma métrica foi escolhida a posteriori.

**11. "Ablation foi com h=21, mas o TCN usa h=5. Isso não enfraquece a comparação?"**
Sim, limitação 5 declarada. Mas com Δ médio de +0,003 e IC [−0,012; +0,018] sobre 225 treinamentos, é improvável que trocar horizonte inverta a direção da conclusão.

**12. "Alguém deveria usar o baseline de 0,67 para operar?"**
Não. AUC ≠ retorno após custos de transação e slippage. O experimento ensemble + backtest não evidenciou ganho de trading e foi descontinuado.

## Bloco C — Possíveis (saber que existem)

**13. "Por que não usar o texto direto num LLM moderno em vez de 5 features agregadas?"**
Escopo: a conclusão se aplica à representação adotada, não a toda forma de usar texto. Representações mais ricas são direção futura explícita.

**14. "Notícia não é precificada em minutos? Por que esperaria sinal em h=5–21?"**
Argumento da EMH semi-forte — e o resultado nulo é consistente com ele. A hipótese testada era de drift pós-notícia em horizonte semanal/mensal, documentada em outros mercados; aqui, não detectada.

**15. "O que você faria diferente se começasse de novo?"**
Aplicar os 6 protocolos desde o dia 1: IC bootstrap, ≥10 sementes, expanding-window CV, baseline autoregressivo, monitorar distribuição de predições, auditar correlação val-teste. O custo de não fazer isso foi descobrir no fim que o 0,709 era artefato.

## Números para ter na ponta da língua

| Número | O que é |
|---|---|
| 0,709 | AUC Transformer+FinBERT, janela única (o artefato) |
| 0,658 [0,565; 0,744] | Baseline autoregressivo, janela única — IC já engloba 0,709 |
| 0,261 vs 0,012 | std multi-seed: Transformer vs baseline (21×) |
| 0,667 vs 0,509 | AUC médio CV: baseline vs Transformer (inversão) |
| +0,003, p=0,49 | Ganho do sentimento na ablation (225 runs) |
| p=0,194 | VALE3 deep-dive, 880 runs — não significativo |
| 1.435 | Total de execuções da investigação |
| 5.872 | Artigos InfoMoney (2.572 ITUB4 / 1.775 PETR4 / 1.525 VALE3) |
