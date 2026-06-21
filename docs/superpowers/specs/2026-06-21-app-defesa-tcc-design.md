# App de defesa TCC — design

**Data:** 2026-06-21
**Objetivo:** App Next.js que serve os 7 documentos de estudo de `V1/docs/slides/` como sistema navegável de apoio à defesa do TCC — para estudar antes e consultar ao vivo na banca (defesa 12:00 do dia 22/06).

## Contexto

O TCC ("Predição de Direção de Preços de Ações Brasileiras com Sentimento de Notícias Financeiras") tem defesa oral com banca. O autor já produziu 7 documentos de estudo em `V1/docs/slides/`:

- `mapa_logico.md` — arco lógico do trabalho (com diagramas mermaid)
- `roteiro_por_slide.md` — guia slide-a-slide dos 20 slides do `apresentacao.tex`
- `discurso_para_decorar.md` — fala corrida, ~20 min, 1 bloco por slide (`## [Slide N — título]`)
- `glossario_flashcards.md` — termos em formato tabela (termo | resposta), com marcadores 🔴🟡⚪
- `ferramentas_explicadas.md` — cada ferramenta em 3 níveis
- `justificativas_decisoes.md` — defesa de cada decisão de design
- `perguntas_previstas.md` — objeções da banca + respostas

O app expõe esse material em 3 modos de uso.

## Decisões (confirmadas com o usuário)

| Decisão | Escolha |
|---|---|
| Uso | Estudo (ler/decorar) **e** apoio ao vivo na defesa |
| Fonte do conteúdo | Lê os `.md` existentes em build/server time — fonte única de verdade |
| Local | `V1/docs/app/` (subpasta, isolado dos slides) |
| Offline | Não obrigatório — pode deployar (Vercel) ou rodar `npm run dev` |
| Modo apresentador | Sim — tela dedicada com cronômetro |
| Parsing | Parsers dedicados (tabelas → cards, blocos de slide → telas) |

## Arquitetura

Next.js (App Router) + TypeScript + Tailwind CSS. Lê os arquivos `.md` em `../slides/` no servidor (Server Components) via `fs`. Sem banco de dados, sem autenticação, sem backend dinâmico.

```
V1/docs/app/
├── app/
│   ├── layout.tsx          # shell: sidebar + área de conteúdo
│   ├── page.tsx            # home — visão geral + atalhos para os 3 modos
│   ├── doc/[slug]/page.tsx # doc navegável (render de cada .md)
│   ├── apresentar/page.tsx # modo apresentador (discurso + cronômetro)
│   └── flashcards/page.tsx # treino de flashcards
├── components/
│   ├── Sidebar.tsx         # navegação entre docs + modos
│   ├── MarkdownView.tsx    # render de markdown (remark/rehype) + mermaid
│   ├── SearchPalette.tsx   # busca global Cmd+K (client)
│   ├── Presenter.tsx       # client: navegação por slide + cronômetro
│   └── Flashcards.tsx      # client: card flip + marcação sabia/não-sabia
├── lib/
│   ├── docs.ts             # lê + lista os .md, extrai títulos/slugs
│   ├── parse-discurso.ts   # quebra discurso_para_decorar em telas por slide
│   ├── parse-flashcards.ts # extrai linhas de tabela do glossário em cards
│   └── search-index.ts     # constrói índice de busca a partir dos docs
└── (config: package.json, tailwind, tsconfig, next.config)
```

### Unidades e responsabilidades

- **`lib/docs.ts`** — descobre os `.md` em `../slides/`, devolve `{slug, title, raw, html}`. Depende de `fs`, `gray-matter`, `remark`. É a única coisa que toca o filesystem.
- **`lib/parse-discurso.ts`** — recebe o markdown do discurso, devolve `Slide[] = {n, titulo, texto, tempoEstimado}` quebrando nos cabeçalhos `## [Slide N — título] ~Xmin`. Também extrai a seção "5 frases-âncora".
- **`lib/parse-flashcards.ts`** — recebe o markdown do glossário, devolve `Card[] = {termo, resposta, nivel}` extraindo as linhas das tabelas markdown e o marcador 🔴🟡⚪.
- **`MarkdownView`** — renderiza HTML de um doc, incluindo blocos mermaid (render client-side).
- **`Presenter`** — consome `Slide[]`, navega com ←/→, mostra cronômetro de 20 min com sinal visual de ritmo (verde/amarelo/vermelho conforme tempo vs. slide atual).
- **`Flashcards`** — consome `Card[]`, mostra termo, revela resposta com espaço/clique, botões "sabia"/"não sabia", filtro por nível, embaralhar.
- **`SearchPalette`** — índice client-side (filtro próprio sobre título + texto dos docs); Cmd+K abre, digita, Enter navega.

## Os 3 modos

### 1. Doc navegável (`/doc/[slug]`)
Sidebar lista os 7 docs. Clica → render do markdown (tabelas, listas, mermaid). Busca global (Cmd+K) acha qualquer termo/pergunta em todos os docs e leva direto. Uso: estudar antes, consultar na hora.

### 2. Modo apresentador (`/apresentar`)
Tela limpa, foco no `discurso_para_decorar`. Uma "tela" por slide (parseado dos blocos `## [Slide N]`). Navega ←/→. Cronômetro de 20 min no canto, com sinal de ritmo. Frases entre `[colchetes]` (deixas) mostradas em estilo diferenciado (não para ler em voz alta). Painel lateral opcional com as 5 frases-âncora sempre visível. Uso: ensaio realista + segurança na hora.

### 3. Flashcards (`/flashcards`)
Cards do `glossario_flashcards`. Mostra o termo → revela resposta. Marca "sabia"/"não sabia" (estado em memória/localStorage, não persiste em DB). Filtra por 🔴/🟡/⚪. Embaralha. Mini-drill "10 termos que mais caem" como deck pré-montado. Uso: treinar definições até automático.

## Fluxo de dados

```
.md em V1/docs/slides/  ──(fs, server)──>  lib/docs.ts  ──>  páginas (Server Components)
                                                │
                        parse-discurso.ts  <────┤
                        parse-flashcards.ts <────┘
                                │
                        Presenter / Flashcards (Client Components, recebem dados via props)
```

Conteúdo é lido em tempo de servidor (ou build). Editar um `.md` e recarregar atualiza o app. Nada de duplicação de conteúdo no código.

## Tratamento de erros

- **`.md` ausente ou renomeado:** `lib/docs.ts` ignora arquivos não encontrados e loga aviso; a sidebar só mostra o que existe. App não quebra se faltar um doc.
- **Formato de tabela/slide inesperado:** parsers são tolerantes — uma linha de tabela malformada é pulada (não derruba o deck de cards); um bloco de slide sem `~Xmin` usa tempo default. Degradação graciosa.
- **Mermaid inválido:** o bloco cai para code-block de texto em vez de quebrar a página.

## Testes

Projeto de apoio pessoal, prazo curto (defesa amanhã) → testes mínimos e focados no que pode quebrar silenciosamente:

- **`parse-discurso`**: dado o markdown real do discurso, retorna 20 slides com títulos não-vazios.
- **`parse-flashcards`**: dado o markdown real do glossário, retorna N cards com termo e resposta preenchidos e nível ∈ {🔴,🟡,⚪}.
- Verificação manual dos 3 modos rodando (`npm run dev`).

Não há teste de UI automatizado — escopo e prazo não justificam.

## Fora de escopo (YAGNI)

- Autenticação, banco de dados, multiusuário
- Edição de conteúdo dentro do app (edita-se o `.md`)
- Dark/light toggle elaborado — um tema só, legível
- Exportar PDF / imprimir (os `.md` e o LaTeX já cobrem)
- i18n — só pt-BR

## Critérios de sucesso

1. Os 7 docs aparecem navegáveis e legíveis (com mermaid renderizado).
2. Busca Cmd+K acha um termo/pergunta em todos os docs e navega até ele.
3. Modo apresentador percorre os 20 slides do discurso com cronômetro de 20 min funcionando.
4. Flashcards revelam resposta, filtram por nível e embaralham.
5. Roda com `npm run dev` sem erro; opcionalmente deploya na Vercel.
6. Editar um `.md` em `V1/docs/slides/` e recarregar reflete a mudança.
