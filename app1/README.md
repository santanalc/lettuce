# Lettuce — Demo do Hackathon OpenAI (app1)

Demo funcional do **Cinturão Verde Inteligente**, construída em 19/08/2026 durante o hackathon.
Em produção: https://app1.lettucebr.com

## O que é

SPA (Vite + React + TypeScript) com três abas:

- **#plano** — motor determinístico client-side: elegibilidade de culturas (alface, repolho, couve) pela matriz da Embrapa Circular 47, calendário de tratos, risco climático com semântica temporal honesta, investimento com custos editáveis e cenário econômico rotulado como DADOS SIMULADOS.
- **#assistente** — chat LettuceIA em modo demonstração offline: matcher de intenção + respostas preparadas pela equipe (src/data/respostas-demo.ts), com recusa regulada de defensivo/dose e fontes citadas. Roda 100% no navegador, sem chamada externa.
- **#admin** — seeds versionados, checks fail-closed executados ao vivo no navegador e a seção "Construído neste hackathon" com as contribuições originais da equipe.

## Arquitetura

```
Navegador (SPA 100% estática, Cloudflare Pages)
  -> motor determinístico em src/engine (elegibilidade, calendário, economia, clima, mercado)
  -> LettuceIA offline em src/data/respostas-demo.ts (matcher + respostas preparadas)
```

Sem backend, sem segredo, sem chamada externa: tudo roda no navegador sobre snapshots versionados.

## Rodar local

```bash
npm install
npx vite                        # UI completa, incluindo o assistente offline
node scripts/check-engine.mjs   # 5 checks determinísticos do blueprint
npx vite build                  # gera dist/
```

## Deploy

```bash
# canônico: servido nativo em https://lettucebr.com/app (junto com a landing)
APP_BASE=/app/ npx vite build   # gera dist/ com base /app/
# copiar dist/ para out/app/ do build da landing e deployar o projeto "lettucebr"

# standalone (subdomínio legado, será removido):
npx vite build
npx wrangler pages deploy dist --project-name=lettucebr-app1
```

## Compliance

Sem promessa de produtividade, clima, preço ou retorno: faixas, premissas, data e fonte.
Defensivos, dose, aplicação e diagnóstico são recusados e encaminhados a responsável técnico (CATI/ATER).
Nenhum dado do produtor é persistido nesta demo.
