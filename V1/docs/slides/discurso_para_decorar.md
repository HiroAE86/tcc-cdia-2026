# Discurso para decorar — fala corrida, ~20 min

> Como usar: decore o **esqueleto** (a ordem das ideias e os números em **negrito**), não as palavras exatas. Na hora, improvise com propriedade. Cada bloco = 1 slide. As frases entre [colchetes] são deixas/transições, não para ler em voz alta.
> Tom: confiante, honesto, narrativo. Tu não está defendendo um sucesso — está contando uma investigação. Isso é mais forte.

---

## [Slide 1 — Título] ~10s
Bom dia. Meu nome é André Takeo, e meu trabalho investiga se notícias financeiras em português ajudam a prever a direção dos preços de ações na bolsa brasileira. O subtítulo já entrega o enredo: pipeline, ilusão e autocorreção metodológica. Vou explicar o porquê desses três termos.

## [Slide 2 — Roteiro] ~40s
A apresentação tem cinco partes: o contexto e a pergunta de pesquisa, o pipeline de dados que construí, um resultado inicial muito promissor — um AUC de **0,709** —, a investigação metodológica que fiz em cima desse resultado, e a reversão da conclusão.

E já adianto a mensagem central do trabalho: eu obtive um resultado positivo usando os protocolos de avaliação que são padrão na literatura. Mas esse resultado **não sobreviveu** a uma avaliação mais rigorosa. E documentar essa reversão — mostrar como ela acontece — é a contribuição principal do trabalho. Não é um trabalho sobre um modelo que funciona. É um trabalho sobre como a gente se engana achando que funciona.

## [Slide 3 — Contexto] ~1min30
Usar notícias como variável preditiva é uma linha de pesquisa ativa em NLP aplicado a finanças. O problema é que quase todos os resultados positivos vêm de mercados desenvolvidos, principalmente o S&P 500 americano.

A bolsa brasileira é estruturalmente diferente: tem menor liquidez, especialmente em ações fora do índice principal; o fluxo de notícias é concentrado em poucas fontes especializadas; e há menos participantes institucionais do que nos Estados Unidos. Então não dá pra simplesmente assumir que um resultado que funciona lá funciona aqui.

Além disso, o ferramental de NLP financeiro em português é recente. O FinBERT-PT-BR, que é o modelo central do meu trabalho, só ficou disponível em 2022. Ou seja: existe uma lacuna de evidência empírica para o mercado brasileiro, e quase nenhuma com avaliação metodologicamente rigorosa. É exatamente nessa lacuna que eu entro.

## [Slide 4 — Pergunta de pesquisa] ~1min
A pergunta central é direta: **notícias financeiras brasileiras melhoram a predição de direção de preço — sobe ou desce — de ações da B3?**

Ela se desdobra em duas dimensões. A primeira é sobre **representação textual**: qual a melhor forma de codificar uma notícia? Um embedding genérico de 1.024 dimensões, ou um vetor de sentimento financeiro específico, de apenas 5 dimensões? A segunda é sobre **robustez metodológica**: um resultado obtido com uma única janela temporal sobrevive quando eu aplico validação cruzada, múltiplas sementes e testes estatísticos formais?

Como estudo de caso, escolhi três ações de grande capitalização — Itaú, Petrobras e Vale — em dois horizontes de previsão: 5 e 21 dias úteis.

## [Slide 5 — Dados] ~1min30
Os dados vêm de duas fontes. As notícias, do portal InfoMoney: coletei **5.872 artigos** no total, via a API pública do WordPress do portal, de 2009 a 2026. O Itaú concentra mais cobertura, com 2.572 artigos; a Vale, menos, com 1.525 — e essa cobertura desigual é uma limitação que eu reconheço.

Os dados de mercado vêm do Yahoo Finance: preços diários, dos quais eu calculo 11 features técnicas — retornos, médias móveis, volatilidade, valores defasados.

E o alvo é binário: vale 1 se o preço de fechamento daqui a h dias for maior que o de hoje. Uma observação importante: as classes são desbalanceadas, 59% "sobe" contra 41% "desce". Isso vai ser relevante mais à frente, porque é uma das coisas que mascara um resultado ruim.

## [Slide 6 — Pipeline] ~1min30
[Este é um slide onde a banca costuma perguntar — eu mesmo levanto o ponto sensível.]

O pipeline funciona assim: as notícias passam pela representação textual — embedding genérico ou sentimento. Em paralelo, os dados de preço viram as features técnicas. Aí os dois se juntam por data, com um left join na série de preço. E aqui está o ponto que eu quero levantar antes que me perguntem: nos dias sem notícia, eu uso **forward-fill** — propago o último sentimento conhecido.

Quero ser claro sobre isso porque é fácil confundir: forward-fill propaga o **passado**, não o futuro. Ele não vaza informação futura. O risco real, que existe, é outro — é o look-ahead intradiário: uma notícia publicada depois do fechamento do pregão, por volta das 17h, pode ser atribuída ao dia de hoje. Eu não auditei isso sistematicamente, e declaro como limitação. Mas — e isso é importante — a direção desse viés joga **a favor** do sentimento. Se há algum vazamento residual, ele só inflaria o ganho do sentimento. Como o ganho que eu encontro no fim é zero, na pior das hipóteses esse zero é um limite superior otimista. O viés não ameaça a conclusão.

Depois do merge, os dados viram janelas de 30 dias e alimentam os modelos.

## [Slide 7 — Etapa 3: embeddings genéricos] ~1min
Comecei pela representação genérica. Cada artigo virou um vetor de 1.024 dimensões usando o modelo qwen3, rodado localmente. Como 1.024 dimensões para cerca de 1.200 dias é dimensionalidade demais, reduzi para 32 componentes via PCA, retendo 61,4% da variância — e ajustando o PCA **só no conjunto de treino**, para não vazar dados.

O resultado foi desanimador: todos os modelos ficaram perto do acaso. O melhor, o XGBoost, deu **0,610**. A leitura é que o embedding genérico carrega muito ruído semântico que não tem nada a ver com o domínio financeiro. Isso me levou à hipótese seguinte: e se eu usar uma representação compacta e específica do domínio?

## [Slide 8 — Etapa 4: FinBERT-PT-BR] ~1min
Aí entra o FinBERT-PT-BR. É um BERT — um modelo de linguagem pré-treinado — que passou por fine-tuning em textos financeiros em português brasileiro. A vantagem é que ele foi calibrado para o vocabulário do domínio: ele entende que palavras como "alavancagem", "guidance" ou "rating" carregam uma polaridade que um modelo genérico não captura.

Para cada artigo, ele produz três logits: positivo, negativo e neutro. Eu agrego isso por dia em 5 features — o número de artigos, as médias dos três logits, e o sentimento médio. A hipótese era que essa representação compacta e específica fosse mais informativa do que as 1.024 dimensões genéricas.

## [Slide 9 — AUC 0,709] ~1min
E foi o que pareceu acontecer. Olhando a tabela, ao trocar embedding por sentimento FinBERT, o Transformer salta de 0,568 para **0,709**. Um ganho de 0,141. A acurácia foi de 76,3%.

A narrativa fechava perfeitamente: "o sentimento específico do domínio supera os embeddings genéricos". E o resultado era até compatível com a literatura internacional. Era a hora de comemorar, escrever a conclusão e encerrar.

[pausa]

Mas eu não encerrei. Por quê? [vira o slide]

## [Slide 10 — Três sinais de alerta] ~1min30
Três coisas me incomodaram.

Primeira: a matriz de confusão estava assimétrica de um jeito estranho. A precisão na classe "desce" era 1,00, mas o recall era só 0,15. Traduzindo: o modelo só arriscava prever "desce" 11 vezes em 177 amostras. Ele estava praticamente sempre apostando em "sobe".

Segunda: a acurácia de 76,3% estava perto demais da classe majoritária. Como 69% dos casos são "sobe", um modelo que sempre prevê "sobe" já acerta 69% de graça. Os 76% não eram tão impressionantes assim.

Terceira, e mais grave do ponto de vista metodológico: aquilo era uma estimativa pontual. Sem intervalo de confiança, com uma única semente aleatória, numa única janela temporal. Eu não tinha ideia da incerteza por trás daquele número.

Então tomei uma decisão: antes de aceitar o resultado, eu ia submetê-lo a protocolos progressivamente mais rigorosos. Se fosse real, sobreviveria.

## [Slide 11 — Investigação] ~1min
Isso virou a investigação central do trabalho: 8 experimentos principais, **1.435 execuções de modelo**. [Se perguntarem do número total: contando os experimentos diagnósticos auxiliares, passa de 1.500; os 1.435 são os 8 centrais da reversão.]

E impus regras fixas em todos eles, justamente para a comparação ser honesta: hiperparâmetros congelados — eu não otimizei nada por fold, porque o objetivo não era maximizar desempenho, era medir robustez. O scaler ajustado só no treino de cada fold. Bootstrap com mil reamostras para todo intervalo de confiança. E teste de Wilcoxon para as comparações.

[Se vier "isso não é p-hacking?": é o oposto. P-hacking é rodar muito e escolher o melhor resultado. Aqui eu rodo muito para tentar **destruir** um resultado positivo. Cada experimento responde uma pergunta definida de antemão.]

## [Slide 12 — Hierarquia de baselines] ~1min30
O primeiro confronto foi contra baselines. Montei uma hierarquia. Os triviais — sempre prever "sobe", ou jogar uma moeda — dão 0,500. A persistência, que assume que a direção se repete, dá 0,474, abaixo do acaso.

Mas o baseline que importa é o **autoregressivo**: um XGBoost usando só 5 features de preço — retorno, dois lags, volume e volatilidade. Esse atinge **0,658**, com intervalo de confiança de 0,565 a 0,744.

E aqui está o primeiro golpe: o intervalo de confiança desse baseline simples **já engloba o 0,709** do Transformer com FinBERT. Ou seja, dentro da incerteza, o ganho do sentimento podia ser zero — e o preço sozinho já explicava tudo. Confirmei ainda que a melhora do embedding para o FinBERT era real e não só efeito de dimensionalidade: 20 subconjuntos aleatórios de 5 dimensões do embedding davam 0,509.

## [Slide 13 — Multi-seed] ~1min30
O segundo experimento atacou a questão da semente. Eu simplesmente recompilei o modelo com a semente 42 — e o AUC despencou de 0,709 para **0,442**. Só de trocar a inicialização aleatória.

Aí rodei 20 sementes. O desvio-padrão do Transformer foi **0,261**. Isso é 21 vezes o desvio do baseline. O AUC variava de 0,08 a 0,93 dependendo da semente. E a distribuição não era espalhada de forma aleatória — era **bimodal**: o modelo colapsava para um de dois estados degenerados, ou previa quase sempre "sobe", ou quase sempre "desce". Não havia meio-termo discriminativo, porque não havia sinal real suficiente para ancorar o aprendizado.

Conclusão deste experimento: o 0,709 não era o desempenho do modelo. Era uma semente sortuda na ponta boa de uma distribuição bimodal.

## [Slide 14 — Expanding-window CV] ~1min30
O terceiro experimento foi o mais decisivo. Em vez de uma única janela temporal, usei validação cruzada expanding-window: o treino cresce no tempo, a janela de teste avança, e eu obtenho várias estimativas fora da amostra em vez de uma só. É a recomendação do López de Prado para séries temporais financeiras.

E o resultado **inverteu**. Na média dos três ativos, o baseline de preço deu **0,667** e o Transformer caiu para **0,509** — praticamente acaso. No Itaú e na Petrobras, o baseline ganhou por 0,255 de AUC, que é umas seis vezes a variabilidade dele entre folds.

Fora da janela específica em que dava 0,709, o sinal do sentimento simplesmente desaparecia. Sobrou uma única exceção: a Vale, com um ganho pequeno de 0,036. E eu fui atrás dela.

## [Slide 15 — VALE3 deep-dive] ~1min
A Vale era o único ativo onde o sentimento ainda parecia ajudar. Eu poderia ter deixado quieto e usado isso a favor da minha hipótese. Fiz o contrário: aprofundei deliberadamente para tentar derrubar até essa exceção.

Rodei 52 folds vezes 10 sementes — 880 execuções só na Vale. E o resultado foi **não significativo**: Wilcoxon com p de 0,194. O ganho aparente não resistiu. E a distribuição do Transformer mostrou o mesmo colapso bimodal, com picos em AUC abaixo de 0,05 e acima de 0,95 — a assinatura clássica de um classificador degenerado. Morreu a última exceção.

## [Slide 16 — Ablation] ~1min30
O experimento final foi o mais limpo de todos. Uma ablation: comparar só preço, só sentimento, e preço mais sentimento. E aqui eu usei o XGBoost de propósito, não o Transformer — porque o Transformer é instável demais, e eu não conseguiria separar o efeito das features do efeito do colapso da arquitetura. O XGBoost é o modelo mais estável que eu tenho, desvio de 0,012. Ele me permite isolar o efeito real do sentimento.

São 225 treinamentos. O resultado: só preço dá 0,662. Só sentimento dá 0,480 — **abaixo do acaso**. E preço mais sentimento dá 0,665. O ganho de adicionar o sentimento ao preço é de **0,003**. Com p de 0,49 e intervalo de confiança de menos 0,012 a mais 0,018 — cruzando o zero. Estatisticamente, zero.

E a análise de poder confirma: esse efeito está de 44 a 74 vezes abaixo do mínimo que o tamanho da minha amostra conseguiria detectar. Esse é o veredito final.

## [Slide 17 — Síntese] ~1min
Juntando tudo: sob avaliação metodologicamente correta — multi-fold, multi-semente, com intervalo de confiança e ablation —, as features de sentimento do FinBERT-PT-BR **não adicionam sinal preditivo mensurável** ao baseline de preço. Em nenhum dos três ativos.

O AUC de 0,709 era um artefato de janela única, produzido por três coisas combinadas: a variância de semente, com o colapso bimodal do Transformer; o viés de amostragem daquela janela de teste específica; e a ausência de intervalos de confiança, que teriam revelado a incerteza desde o começo.

Faço questão de delimitar o escopo: essa conclusão vale para a representação que eu adotei — 5 features diárias do FinBERT. Não estou dizendo que texto nenhum jamais funciona. E o resultado é "nenhum efeito detectável neste tamanho de amostra", uma afirmação honesta sobre os limites do estudo.

## [Slide 18 — Contribuições] ~1min
São três contribuições. Primeira, um pipeline replicável e versionado, do InfoMoney ao FinBERT ao Yahoo Finance. Segunda, a primeira demonstração quantificada do viés de janela única em dados brasileiros, com mais de 1.400 execuções. Terceira, a proposição de seis protocolos mínimos para pesquisa em ML financeiro: reportar intervalo de confiança bootstrap, treinar com pelo menos 10 sementes, usar validação cruzada expanding-window, comparar contra um baseline autoregressivo, monitorar a distribuição de predições, e auditar a correlação entre validação e teste.

E sou honesto sobre isso: esses protocolos não são invenção minha — são recomendações do López de Prado. Minha contribuição é mostrar, num caso concreto e brasileiro, a **magnitude do dano** de ignorá-los: uma métrica que cai de 0,709 para cerca de 0,51, virando uma conclusão positiva em negativa.

## [Slide 19 — Limitações] ~1min
As limitações, eu já antecipei várias: fonte única de notícias, com viés de varejo; apenas três ações de grande capitalização; horizontes restritos a 5 e 21 dias; uma representação textual específica; o look-ahead residual do forward-fill — que, lembrando, joga contra a conclusão nula, não a favor; e a instabilidade do Transformer.

E os trabalhos futuros saem direto dessas limitações: diversificar as fontes — comunicados da CVM, relatórios de analistas, redes sociais; testar arquiteturas menos propensas ao colapso bimodal; estender para outros mercados emergentes; e usar métricas mais robustas a desbalanceamento, como balanced accuracy e o coeficiente de Matthews.

## [Slide 20 — Mensagem final] ~1min
Para fechar. A contribuição central deste trabalho não é descobrir que o sentimento não funciona. É demonstrar **quão fácil é produzir evidência aparente de que ele funciona** — usando protocolos que a própria comunidade considera aceitáveis.

O viés de confirmação operou de forma invisível: o 0,709 "fazia sentido", batia com a literatura, então eu não questionei de início. Janela única, mais semente única, mais ausência de intervalo de confiança: é a receita para um falso positivo. E a lição que eu levo é que uma autocorreção documentada vale mais do que um resultado positivo frágil.

Obrigado. Estou à disposição para as perguntas.

---

## Tática para a sessão de perguntas
- **Respira. Ouve a pergunta inteira.** Não responda na metade.
- Se souber: responde direto, 2-3 frases, encaixa um número.
- Se não souber: "Essa análise específica eu não fiz; o que eu posso dizer é..." — nunca inventa.
- Se for objeção que já está no trabalho: "Sim, isso é uma limitação que eu declaro — e a razão de não ameaçar a conclusão é..." Declarar limitação é força, não fraqueza.
- Volta sempre pra âncora: **+0,003, p=0,49** é o veredito; o baseline de preço **0,667** estável é a prova de que o protocolo detecta sinal quando existe.

## As 5 frases-âncora (se decorar só 5 coisas, decora estas)
1. "O resultado positivo não sobreviveu à avaliação rigorosa — e documentar isso é a contribuição."
2. "O intervalo de confiança do baseline já englobava o 0,709."
3. "O 0,709 era uma semente sortuda numa distribuição bimodal — desvio 21 vezes o do baseline."
4. "Sob validação cruzada, o resultado inverte: baseline 0,667, Transformer 0,509."
5. "O sentimento adiciona 0,003, com p de 0,49 — estatisticamente zero."
