# Lettuce — Demo do Hackathon OpenAI (app1)

Demo funcional do **Cinturão Verde Inteligente**, construída em 19/08/2026 durante o hackathon.
Em produção: https://app1.lettucebr.com

## O que é

SPA (Vite + React + TypeScript) com três abas:

- **#plano** — motor determinístico client-side: elegibilidade de culturas (alface, repolho, couve) pela matriz da Embrapa Circular 47, calendário de tratos, risco climático com semântica temporal honesta, investimento com custos editáveis e cenário econômico rotulado como DADOS SIMULADOS.
- **#assistente** — chat LettuceIA conectado de verdade ao hermes-agent que roda no VPS do hackathon. O modelo explica o plano calculado; nunca calcula, nunca inventa dado e recusa prescrição de defensivo/dose (gate no servidor).
- **#admin** — seeds versionados, checks fail-closed executados ao vivo no navegador e a seção "Construído neste hackathon" com as contribuições originais da equipe.

## Arquitetura

```
Navegador (SPA estática, Cloudflare Pages)
  -> Pages Function /api/chat        (functions/api/chat.ts; token só no servidor)
      -> VPS Hetzner do hackathon    (lettuceia-chat.service, porta 8080, Bearer)
          -> hermes-agent v0.20.4    (persona LettuceIA: SOUL.md + hooks de escopo)
```

Segredos ficam em variáveis do projeto Pages (`HERMES_URL`, `HERMES_TOKEN`) — nada no bundle.

## Rodar local

```bash
npm install
npx vite          # UI (o /api/chat exige o ambiente Pages; a UI degrada com aviso honesto)
node scripts/check-engine.mjs   # 5 checks determinísticos do blueprint
npx vite build    # gera dist/
```

## Deploy

```bash
npx vite build
npx wrangler pages deploy dist --project-name=lettucebr-app1
# rodar da raiz do projeto: o diretório functions/ vira a rota /api/chat
```

## Compliance

Sem promessa de produtividade, clima, preço ou retorno: faixas, premissas, data e fonte.
Defensivos, dose, aplicação e diagnóstico são recusados e encaminhados a responsável técnico (CATI/ATER).
Nenhum dado do produtor é persistido nesta demo.
