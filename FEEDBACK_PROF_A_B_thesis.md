# Feedback do Professor — Correções na Tese (Blocos A + B)

**Origem:** `ressalvas do prof.md`
**Alvo único:** `V1/docs/tcc.tex` (614 linhas, fonte LaTeX da tese; capítulos 4 e 5 também existem em `V1/docs/capitulo_4.md` e `capitulo_5.md`, mas o PDF compila a partir do `.tex`).
**Estratégia de execução:** duas batches de subagents.
1. **Batch LOCALIZAR** — subagents read-only mapeiam linha-a-linha onde cada problema ocorre.
2. **Batch CORRIGIR** — nova batch, contexto limpo, recebe o mapa da Batch 1 e aplica correções padronizadas.

> Regra dura: subagent de localização **não edita**. Subagent de correção **não procura** — recebe linhas exatas. Separação evita drift.

---

## Mapa de capítulos do `tcc.tex` (confirmado)

| Cap | Título | `\label` | Linha início |
|-----|--------|----------|--------------|
| 1 | Introdução | `cap:introducao` | 160 |
| 2 | Revisão Bibliográfica | `cap:revisao` | 202 |
| 3 | Pipeline: Coleta, Engenharia de Features e Modelos Iniciais | `cap:pipeline` | 237 |
| 4 | Sentimento Financeiro via FinBERT-PT-BR | `cap:sentimento` | 289 |
| 5 | Investigação Metodológica / Viés de Janela Única | `cap:investigacao` | 329 |
| 6 | Conclusão | `cap:conclusao` | 502 |
| Ap. A | Funções utilitárias de avaliação | `ap:evalutils` | 545 |
| Ap. B | Arquitetura TCN | `ap:tcn` | 580 |

**Nota de numeração:** o professor cita "cap 6" e "seção 6.1.2". Na versão atual (`refactor/v2`) o cap 6 é a *Conclusão* e não há subseção 6.1.2. A numeração do prof provavelmente vem de um draft anterior. **O conteúdo descrito (comparação com artigos citados + "Figura 1") corresponde à discussão/comparação de resultados** — hoje espalhada entre Cap 5 (Síntese, L486) e Cap 6. A Batch LOCALIZAR deve confirmar onde a discussão comparativa vive de fato.

---

## BLOCO A — Fluidez e auto-referência (escopo: tese inteira)

### A1 — Forward-pointing excessivo para caps 4 e 5
**Problema:** o texto antecipa repetidamente "como será visto no capítulo 4/5" antes de chegar lá.
**Critério de correção:** remover antecipações desnecessárias. Manter no máximo **uma** menção em "Estrutura do trabalho" (L196) onde o roteiro é legítimo. Onde a antecipação for só ruído, cortar.
**Onde procurar:** todas as ocorrências de `\ref{cap:sentimento}`, `\ref{cap:investigacao}`, e texto literal "capítulo 4/5/quatro/cinco" fora da seção Estrutura.

### A2 — Auto-referência redundante ("neste capítulo X")
**Problema:** dentro do cap 3 o texto diz "no capítulo 3" — leitor já está nele. Idem caps 4 e 5.
**Ocorrências candidatas já localizadas:**
- L205 — "Este capítulo apresenta os fundamentos..." (Cap 2)
- L240 — "Este capítulo descreve as três primeiras etapas..." (Cap 3)
- L334 — "Este capítulo aplica protocolos..." (Cap 5)
**Critério de correção:** frases de abertura "Este capítulo apresenta/descreve X" são aceitáveis como *abertura* de capítulo. O que o prof reclama é menção ao **número/nome do próprio capítulo no meio do texto** ("como visto no capítulo 3", estando no cap 3). Distinguir:
- ABERTURA tópica → manter (reescrever para não citar o número).
- AUTO-REFERÊNCIA numérica no corpo → remover.
**Onde procurar:** texto "capítulo N" / `\ref{cap:X}` onde X == capítulo atual.

### A3 — Repetição do AUC = 0,709 (12 ocorrências)
**Problema:** o número se repete demais; já estabelecido cedo, não precisa martelar.
**Ocorrências confirmadas (12):** linhas **99, 111, 198, 211, 318, 325, 334, 490, 494, 512, 519, 521**.
- L99 / L111 = resumo (pt) / abstract (en) → manter (resumo é standalone).
- L198/211 = Introdução/Revisão → primeira aparição no corpo, manter 1.
- L318/325/334 = Cap 4/5 → onde o valor é o objeto de investigação, manter as mínimas necessárias.
- L490/494/512/519/521 = Síntese + Conclusão → **alta densidade de repetição, alvo principal de corte.**
**Critério de correção:** após a primeira definição plena no corpo, substituir repetições por referência anafórica ("o resultado inicial", "o AUC de janela única", "esse valor") em vez de reescrever "0,709". Meta: reduzir de 12 → ~4–5 menções do número literal. **Não** alterar resumo/abstract.

---

## BLOCO B — Capítulo de discussão/comparação (prof: "cap 6 / 6.1.2")

### B1 — Faltam os números dos artigos citados para comparação
**Problema:** o texto cita trabalhos relacionados mas **não traz os resultados numéricos deles** (AUC/acurácia/F1) para comparar com o nosso resultado. Leitor não tem baseline externo.
**Estado atual:** citações como `\citeonline{xu2018}` (L219), `fama1970` (L209), e outras em Cap 2, aparecem **sem métrica reportada**.
**Critério de correção:** na seção de discussão comparativa, para cada trabalho usado como comparação, incluir a métrica reportada pelo autor (ex.: "Xu e Cohen (2018) reportam acurácia de XX% em ...") e contrastar explicitamente com o nosso achado. Onde o número não estiver disponível na bibliografia atual, **marcar `% TODO-PROF-B1: buscar métrica de <autor>`** — NÃO inventar números.
**Onde procurar:** seção de comparação/discussão (confirmar localização: Cap 5 Síntese L486+ e/ou Cap 6). Listar todos os `\cite`/`\citeonline` usados como comparação direta.

### B2 — "Figura 1" citada longe da figura
**Problema:** o texto discute uma figura ("Figura 1") que ficou muito atrás; leitor esquece o que é.
**Estado atual confirmado:** 5 figuras, todas no Cap 5:
- L408–411 `multi_seed_histograms.png`
- L434–437 `expanding_cv_overtime.png`
- L442–445 `vale3_deepdive_hist.png`
- L468–471 `ablation_boxplot.png`
- L480–483 `tcn_validation_hist.png`

**Subproblema técnico detectado:** as figuras têm `\caption` mas é preciso confirmar se têm `\label{fig:...}` e se são referenciadas via `\ref` ou por número fixo "Figura 1". Referência por número fixo quebra se a ordem muda — **migrar toda menção a figura para `\ref{fig:...}`**.
**Critério de correção:**
1. Garantir `\label{fig:...}` em cada `figure`.
2. Trocar "Figura 1" literal por `\autoref{fig:...}` / `\ref{fig:...}`.
3. Onde a discussão de uma figura estiver longe dela, **reaproximar**: ou mover o parágrafo para perto da figura, ou inserir um lembrete curto do conteúdo da figura no ponto da discussão ("a distribuição bimodal do Transformer — \autoref{fig:...} — mostra que ...").
**Onde procurar:** toda string "Figura" literal + checar `\label`/`\ref` em cada bloco `figure`.

---

## BATCH 1 — LOCALIZAR (read-only, paralelo)

Dispatch N subagents, contexto limpo, **um por item**. Cada um devolve **só** uma tabela `arquivo:linha → trecho → problema → correção sugerida`. Proibido editar.

| Subagent | Escopo | Entrega |
|----------|--------|---------|
| LOC-A1 | forward-refs a caps 4/5 | linhas + se é "Estrutura" (manter) ou ruído (cortar) |
| LOC-A2 | auto-ref numérica do capítulo atual | linhas + classificar abertura-tópica vs auto-ref |
| LOC-A3 | as 12 linhas de "0,709" | classificar cada uma: manter / anaforizar |
| LOC-B1 | `\cite`/`\citeonline` usados como comparação + se têm métrica | lista autor → métrica presente? (S/N) |
| LOC-B2 | figuras: `\label` presente? menções "Figura" literais; distância discussão↔figura | mapa figura → label → menções → distância |

**Saída consolidada:** um arquivo `FEEDBACK_PROF_LOCATIONS.md` com as 5 tabelas. Esse arquivo é o **único input** da Batch 2.

## BATCH 2 — CORRIGIR (contexto limpo, lê só o LOCATIONS.md)

Dispatch subagents de edição **um por bloco** (ou por item se conflitarem em linhas próximas). Cada um:
1. Lê `FEEDBACK_PROF_LOCATIONS.md` (sua seção).
2. Aplica o **critério de correção** deste doc — padronizado, sem reinterpretar.
3. Edita só as linhas listadas. Não toca resumo/abstract (L97–135) exceto se explicitado.
4. Para B1 sem número disponível: insere `% TODO-PROF-B1`, não inventa.
5. Devolve diff resumido.

**Regra de serialização:** edições em linhas próximas (ex. A3 e B2 ambas no Cap 5) rodam **sequenciais**, não paralelas, para evitar conflito de offsets. A1/A2/B1 em capítulos diferentes podem ser paralelas.

## Verificação final
- `grep -c '0,709'` deve cair de 12 → ~4–5.
- Toda figura tem `\label` e é referenciada por `\ref`/`\autoref`.
- Nenhuma auto-referência numérica ao capítulo corrente no corpo.
- Compilar: `cd V1/docs && pdflatex tcc.tex && bibtex tcc && pdflatex tcc.tex && pdflatex tcc.tex` — sem erro novo, sem `??` de refs quebradas.
