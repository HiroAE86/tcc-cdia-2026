Esse aqui é um conjunto de problemas que meu professor encontrou no meu artigo do TCC.

---

## p.10 §1.3 — "sobre as armadilhas da avaliação"

- Flag: Quais são as armadilhas??
- **RESOLVIDO:** Texto agora enumera explicitamente: ausência de intervalos de confiança, uso de semente única, e avaliação por janela única em séries não-estacionárias.

---

## p.10 §1.4 — "AUC = 0,709"

- Precisamos definir as siglas antes de utilizar, nesse caso o AUC não foi definido
- **RESOLVIDO:** Primeira ocorrência no corpo do texto agora lê: "(\textit{Area Under the ROC Curve}, AUC = 0,709)". A lista de siglas no pré-textual também define AUC.
- **NOTA sobre "??":** Os "??" que o professor viu na p.11 são artefatos de compilação LaTeX (referências cruzadas não resolvidas quando pdflatex roda só uma vez). Recompilar com a sequência completa: `pdflatex tcc.tex && bibtex tcc && pdflatex tcc.tex && pdflatex tcc.tex` resolve o problema.

---

## p.11 §2.1 — parágrafo "A tensão entre eficiência teórica..."

- Isso ficou muito com cara de texto de IA, parece mal feito
- **RESOLVIDO:** Parágrafo reescrito para ser mais concreto e direto, conectando explicitamente a discussão teórica ao que os capítulos 4 e 5 testam empiricamente.

---

## p.11 §2.2 — "três gerações de representação textual" + Word2Vec/GloVe

- "três gerações de representação textual": Faltou a fonte disso
- "A segunda introduziu embeddings densos...": Faltou a fonte disso
- **RESOLVIDO:**
  - Geração 1 (léxicos): \cite{loughran2011} já estava
  - "Três gerações": citação de survey adicionada \cite{kellyxiu2023}
  - Word2Vec: \cite{mikolov2013} adicionado
  - GloVe: \cite{pennington2014} adicionado
  - Entradas adicionadas em referencias.bib

---

## p.12 §2.3 — "Este trabalho utiliza quatro famílias de modelos"

- Quais são os modelos? E quais são as outras opções?
- **RESOLVIDO:** Seção expandida com configurações específicas de cada modelo (camadas, unidades, hiperparâmetros) e parágrafo sobre alternativas consideradas mas não adotadas (Random Forest, Logistic Regression, GRU).

---

## p.14 §3.3 — "Os embeddings são reduzidos para 32 componentes via PCA"

- Não colocamos o resultado do PCA
- **RESOLVIDO:** Texto agora informa que os 32 componentes retêm **61,4%** da variância total (valor extraído de `3.model_traning/index.ipynb`, linha de log: "Variância explicada pelo PCA: 61.4%"). PCA fitado no treino para evitar data leakage.

---

## p.18 §5.3 — "exibe distribuição bimodal"

- Meu professor perguntou "Por que bimodal?"
- **RESOLVIDO:** Texto agora explica o mecanismo: o Transformer colapsa para um de dois estados degenerados (sempre prevê "Sobe" ou sempre prevê "Desce") dependendo da inicialização, pois o sinal preditivo é insuficiente para ancorar a otimização fora desses mínimos locais.

---

## p.21 §5.7 — parágrafo de síntese desalinhado

- Esse parágrafo está mais para a esquerda e o texto está quebrado
- **RESOLVIDO:** O recuo é o ambiente `\begin{citacao}` do abnTeX2 (padrão ABNT para citações longas). Adicionado parágrafo introdutório antes do bloco para deixar claro que é uma síntese destacada, não texto deslocado. Se o professor preferir sem recuo, pode trocar `\begin{citacao}` por parágrafo normal.

---

## p.22 §6.1 — "a demonstração mais detalhada deste fenômeno em dados brasileiros"

- Faltou citarmos artigos que fizeram algo parecido
- **RESOLVIDO:** Adicionado parágrafo citando: Ding et al. (2015), Hu et al. (2018), Shah et al. (2019) — todos com protocolos de janela única sem análise de variância, confirmando que o problema existe mas sem a quantificação que este TCC oferece. Entradas \cite{ding2015} e \cite{hu2018} adicionadas em referencias.bib.

---

## Ação necessária

Recompilar o PDF com:
```
cd V1/docs
pdflatex tcc.tex && bibtex tcc && pdflatex tcc.tex && pdflatex tcc.tex
```
