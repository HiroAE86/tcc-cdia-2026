# App de defesa TCC

Sistema de apoio à defesa. Lê os `.md` de `../slides/` — fonte única de verdade.

## Rodar

```bash
npm install
npm run dev      # http://localhost:3000
```

Produção: `npm run build && npm run start`.

## Modos

- **/** — início, atalhos, tese em 1 frase
- **/doc/[slug]** — documentos navegáveis (diagramas mermaid renderizados)
- **/slides** — visualizador do deck (PDF) com fala e cronômetro ao lado
  - coloque o deck final em `public/slides.pdf` (ou `apresentacao.pdf`/`deck.pdf`)
  - `←` / `→` troca de página · `espaço` play/pause · "Abrir em tela cheia" projeta o PDF
  - se não houver PDF, a tela explica onde salvá-lo
- **/apresentar** — discurso slide-a-slide + cronômetro de 15 min
  - `←` / `→` navega · `espaço` dá play/pause no cronômetro
  - cor do cronômetro = ritmo (teal no prazo, amarelo atrasando, coral atrasado)
  - painel lateral com as 5 frases-âncora
- **/flashcards** — treino de termos do glossário
  - clique no card revela a resposta · "sabia" / "não sabia" avança
  - filtra por 🔴 🟡 ⚪ · embaralha
- **Cmd/Ctrl + K** — busca global em todos os docs, navega até o resultado

## Editar conteúdo

Edite os `.md` em `V1/docs/slides/` e recarregue. Nada de conteúdo no código.
Para adicionar um doc novo, inclua o slug em `lib/docs.ts` (`DOC_ORDER` + `TITLES`).

## Testes

```bash
npm test
```

Cobrem os dois parsers (`parse-discurso`, `parse-flashcards`) contra os `.md` reais.
