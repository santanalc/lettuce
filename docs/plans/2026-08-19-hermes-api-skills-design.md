# Design — Skills Hermes para as APIs do Lettuce

- **Data:** 2026-08-19
- **Status:** desenho aprovado; implementação pendente de revisão desta especificação
- **Repositório:** `santanalc/lettuce`
- **Commit-base auditado:** `55140987030e297fdd3699323d2a48814e61271b`
- **Runtime-alvo inicial:** Hermes Agent v0.20.1 via GitHub Tap

## 1. Contexto

O diretório `docs/research/` reúne uma pesquisa ampla sobre clima, território,
solo, produção, taxonomia e preços agrícolas. O código atual do Lettuce ainda
não contém conectores para essas fontes. A demonstração também trata clima e
mercado como snapshots, e não como ingestão ao vivo.

Este documento define como transformar a pesquisa em skills pequenas e
auditáveis para o Hermes sem transformar instruções de LLM em fronteira de
segurança, diagnóstico agronômico ou motor de cálculo.

As referências internas que motivam o desenho são:

- [`docs/research/apis-publicas-auditoria.md`](../research/apis-publicas-auditoria.md)
- [`docs/research/clima-precos-alto-tiete.md`](../research/clima-precos-alto-tiete.md)
- [`docs/research/agronomia-fgv-protocolo-seguro.md`](../research/agronomia-fgv-protocolo-seguro.md)
- [`docs/research/arquitetura-hermes-lgpd.md`](../research/arquitetura-hermes-lgpd.md)
- [`docs/adr/0001-nextjs-como-verdade-hermes-como-interface.md`](../adr/0001-nextjs-como-verdade-hermes-como-interface.md)

## 2. Decisão

O próprio repositório Lettuce será a fonte canônica das skills. Elas ficarão
como filhos diretos de `skills/`, formato compatível com um GitHub Tap do
Hermes:

```text
skills/<slug>/SKILL.md
```

Serão criadas seis skills de backoffice. Uma sétima capacidade, voltada à
explicação de planos para o produtor, permanecerá apenas documentada e
desabilitada até que exista um runtime restrito e uma tool determinística
aprovada.

O Lettuce continua sendo a fonte de verdade. Skills coletam, normalizam,
auditam ou explicam evidências; não gravam planos, não substituem validadores e
não decidem manejo.

## 3. Alternativas avaliadas

### 3.1 GitHub Tap em `skills/` — escolhida

- Funciona com o Hermes v0.20.1 já instalado.
- Permite inspeção, instalação e atualização individual.
- Mantém código, documentação e testes no mesmo repositório.
- Evita depender de descoberta local de projeto.

### 3.2 Skills locais em `.hermes/skills/` — adiada

O fluxo depende de `hermes skills trust`, indisponível no runtime v0.20.1. A
funcionalidade existe em versões posteriores, mas a atualização do Hermes não
faz parte desta entrega.

### 3.3 Uma única mega-skill — rejeitada

Misturaria saúde de APIs, clima, mercado, território, segurança e síntese em um
único prompt. Isso aumentaria permissões, contexto, acoplamento e risco de uma
fonte ou regra contaminar as demais.

## 4. Princípios obrigatórios

1. **Evidência antes de recomendação.** A coleta descreve o que a fonte diz e
   suas limitações; não prescreve ação agrícola.
2. **Fail closed.** Dado ausente, vencido, incomparável ou sem licença não é
   convertido em zero nem completado pelo modelo.
3. **Cálculo fora do prompt.** Fórmulas, TTLs, conversões e gates relevantes
   ficam em helpers determinísticos ou no SaaS.
4. **Skill não é boundary.** Segurança depende de toolsets restritos, schemas,
   validação e policy gate executados fora do LLM.
5. **Proveniência por afirmação.** Número material precisa de fonte, data,
   unidade, natureza e transformação.
6. **Sem segredos no repositório.** Chaves são declaradas no frontmatter e
   lidas exclusivamente do ambiente ou de arquivo de credencial.
7. **Sem dados pessoais.** Prompt, log, fixture e memória não recebem telefone,
   nome, coordenada do lote, transcript ou negociação individual.
8. **Sem ação externa.** Nenhuma skill envia mensagem, cria oferta, negocia,
   compra, vende, paga ou escreve em sistema de terceiros.

## 5. Catálogo de skills

### 5.1 `lettuce-api-audit`

**Descrição:** `Audita fontes agro e seus contratos operacionais.`

Responsabilidade:

- verificar documentação, disponibilidade, autenticação, licença, formato,
  cadência, limites e alterações de contrato;
- registrar URL oficial e instante da verificação;
- classificar a fonte sem promover automaticamente seu uso no produto.

Entrada mínima:

- `sourceId` allowlisted;
- caso de uso;
- URL oficial esperada;
- data da última verificação conhecida.

Saída:

- `allow_snapshot`, `manual_only`, `needs_auth`, `degraded`, `blocked` ou
  `unknown`;
- evidências observadas, limitações, licença e validade da decisão.

Permissões iniciais: backoffice read-only, com egress do helper limitado aos
domínios oficiais allowlisted. Sem tool web genérica, browser interativo,
escrita, memória ou delegação.

### 5.2 `lettuce-climate-evidence`

**Descrição:** `Normaliza evidência climática com proveniência.`

Responsabilidade:

- normalizar payloads climáticos obtidos por adapters allowlisted;
- separar observação, previsão, climatologia e alerta;
- preservar unidade, horizonte, resolução espacial e dados ausentes.

Fontes candidatas: Open-Meteo, NASA POWER, CPTEC/INPE, INMET e
MERGE/SAMeT. A seleção é feita pelo papel temporal e pelas restrições de uso,
não por um ranking universal.

Proibições específicas:

- não receber coordenadas privadas de lote;
- não chamar grade, município ou estação de condição exata do talhão;
- não calcular risco fitossanitário, irrigação ou janela de pulverização;
- não preencher dias ausentes de uma previsão.

### 5.3 `lettuce-territory-evidence`

**Descrição:** `Normaliza contexto territorial e biofísico.`

Responsabilidade:

- resolver códigos oficiais de localidade;
- normalizar estatísticas públicas de produção;
- registrar contexto probabilístico de solo e taxonomia.

Fontes candidatas: IBGE Localidades, SIDRA, SoilGrids, GBIF, Wikidata e
catálogos autenticados da Embrapa.

Proibições específicas:

- SoilGrids não substitui laudo de solo;
- ocorrência taxonômica não prova presença no lote;
- ausência de cultura na PAM/SIDRA não significa produção zero;
- classificação global não vira diagnóstico ou recomendação agronômica.

### 5.4 `lettuce-market-evidence`

**Descrição:** `Valida observações comparáveis de mercado.`

Responsabilidade:

- receber observações manuais ou licenciadas;
- validar produto, variedade, classe, qualidade, embalagem, peso, mercado e
  data;
- normalizar unidades apenas quando os campos necessários estiverem presentes;
- distinguir cotação, cenário sintético, oferta e venda.

Inicialmente, CEAGESP, Prohort/Conab, CEASAs e CEPEA são `manual_only`. Não há
scraping, engenharia reversa de Pentaho/Power BI nem redistribuição presumida.

Uma observação sem peso líquido comparável, origem ou data não participa de
agregações.

### 5.5 `lettuce-provenance-check`

**Descrição:** `Valida claims, fontes, datas e unidades.`

Responsabilidade:

- invocar um validador determinístico contra um catálogo server-only;
- apresentar o relatório produzido pelo validador, sem alterar sua decisão;
- separar claims suportadas, citações e rejeições já calculadas.

Esta skill não decide se uma claim é válida. A rejeição de fonte inexistente,
número novo, aviso omitido ou transformação não declarada pertence ao helper e
é determinada por schema, código e exit status. O LLM não pode converter uma
rejeição em aprovação.

A skill não acessa rede. Ela consome somente o relatório estruturado, os
envelopes e o catálogo fornecidos pelo helper.

### 5.6 `lettuce-safety-evals`

**Descrição:** `Executa regressões de segurança agro.`

Responsabilidade:

- executar fixtures artificiais e regressões adversariais;
- registrar resposta, tools chamadas e violações;
- recomendar desativação do caminho Hermes diante de falha regulada.

Os testes rodam em CI ou ambiente de desenvolvimento isolado, sem dados reais,
credenciais ou rede por padrão. A skill não corrige, publica ou faz deploy.

### 5.7 `lettuce-plan-explainer` — futura e desabilitada

A capacidade futura explicará um plano já calculado pelo SaaS. Ela não será
instalável nesta fase.

Antes de habilitá-la, devem existir:

- policy gate regulado determinístico e anterior ao LLM;
- tool estrita para obter o resultado do plano;
- schema de saída validado;
- perfil sem terminal, web, arquivos, memória, session search ou delegação;
- evals de segurança aprovados.

## 6. O que não será implementado como skill

### 6.1 Policy gate regulado

Pedidos de diagnóstico, defensivo, ingrediente, produto, dose, mistura,
frequência, carência, reentrada, aplicação, fertilização personalizada sem
análise, receituário, ART/CREA, aprovação técnica, autorização para “pode
aplicar” ou outra decisão agronômica de alto risco devem ser bloqueados antes
do LLM e antes de qualquer tool. O comportamento é determinístico e retorna um
handoff fixo, sem produto, dose, faixa ou instrução operacional.

Esse gate é um componente obrigatório do backend/gateway do Lettuce, sob
ownership do time do SaaS, e não uma skill. A requisição regulada deve ser
classificada antes de ser enviada ao processo Hermes. Até existir esse ponto de
integração e um teste E2E que observe zero chamada ao Hermes/OpenAI e zero tool,
nenhuma destas skills pode ser ligada ao caminho do produtor.

### 6.2 Motor de planejamento

O cálculo de plano, os TTLs, a comparabilidade de mercado, a seleção de fontes
e a validação pós-modelo pertencem ao SaaS ou a uma tool customizada. O modelo
não cria, corrige nem completa esses números.

### 6.3 Validador pós-modelo

Nenhuma resposta livre do Hermes é exibida diretamente. Depois da síntese, um
validador determinístico do backend compara a saída com o relatório canônico e
rejeita status alterado, claim nova, warning omitido, fonte desconhecida ou
transformação não autorizada.

Em caso de divergência, o backend descarta integralmente o texto do modelo e
renderiza diretamente um template do relatório do helper. A skill nunca recebe
autoridade para aprovar uma rejeição. Ownership, implementação e testes deste
validador pertencem ao time do SaaS, e a ativação de qualquer resposta gerada
fica bloqueada até essa fronteira existir.

## 7. Layout do repositório

```text
skills/
├── lettuce-api-audit/
│   ├── SKILL.md
│   ├── references/
│   └── scripts/
├── lettuce-climate-evidence/
├── lettuce-territory-evidence/
├── lettuce-market-evidence/
├── lettuce-provenance-check/
└── lettuce-safety-evals/
docs/
└── skills/
    └── README.md
scripts/
└── validate_skills.py
tests/
└── skills/
    ├── fixtures/
    └── test_*.py
.github/
└── workflows/
    └── skills.yml
skills-manifest.json
skills.sh.json
```

O diretório `skills/` precisa ser plano: o instalador do Tap enumera apenas os
filhos diretos. Agrupamento visual será feito no catálogo, não por diretórios
intermediários.

## 8. Contrato de autoria Hermes

Cada `SKILL.md` deve conter:

- `name` idêntico ao diretório e com até 64 caracteres;
- `description` com até 60 caracteres, terminada por ponto;
- `version`, `author`, `license` e `platforms`;
- `metadata.hermes.tags`, `category` e relações entre skills;
- `requires_toolsets` e `requires_tools` mínimos;
- variáveis e credenciais requeridas, quando aplicável;
- instruções imperativas, exemplos de uso e comportamentos de erro.

O repositório não declara uma licença na data desta especificação. Até uma
decisão explícita do proprietário, as skills usarão `license: UNLICENSED`. Esta
entrega não adicionará MIT ou outra licença por inferência. Enquanto isso, o
repositório pode receber especificação e código para revisão, mas a publicação
de um release instalável fica bloqueada.

### 8.1 Arquivos auxiliares

O instalador do Hermes só inclui arquivos auxiliares encontrados como caminhos
literais no corpo do `SKILL.md`. Toda skill deverá manter uma seção semelhante
a esta:

```markdown
Support files:

- `scripts/query.py`
- `references/api-contract.md`
```

Usar apenas `${HERMES_SKILL_DIR}/scripts/query.py` no comando não é suficiente
para o downloader do GitHub Tap.

Independentemente do mecanismo de download, `skills-manifest.json` deve
inventariar todos os arquivos distribuídos, sua skill proprietária, SHA-256 e
classificação de licença. O CI falha diante de arquivo não inventariado, hash
divergente ou extensão não allowlisted.

### 8.2 Perfis de execução

`requires_toolsets` e `requires_tools` descrevem dependências e visibilidade;
não removem capacidades já disponíveis no processo Hermes. A restrição real
será aplicada pelo comando de inicialização e por isolamento externo.

| Skill | Toolsets do processo | Rede | Perfil |
|---|---|---|---|
| `lettuce-api-audit` | `skills,terminal` | somente domínios oficiais allowlisted | contêiner read-only de auditoria |
| `lettuce-climate-evidence` | `skills,terminal` | somente adapters oficiais allowlisted | contêiner read-only de evidência |
| `lettuce-territory-evidence` | `skills,terminal` | somente adapters oficiais allowlisted | contêiner read-only de evidência |
| `lettuce-market-evidence` | `skills,terminal` | nenhuma no modo inicial | contêiner read-only com input manual |
| `lettuce-provenance-check` | `skills,terminal` | nenhuma | contêiner read-only com validador local |
| `lettuce-safety-evals` | `skills,terminal` | nenhuma | runner efêmero de testes |

O `terminal` só pode existir dentro de contêiner efêmero, sem socket Docker,
sem diretório pessoal, sem credenciais do host, com filesystem read-only e um
diretório temporário limitado. Egress é aplicado por proxy/firewall, não por
prompt.

O helper aceita somente HTTPS e hosts previamente resolvidos no catálogo.
Rejeita IP literal, localhost, redes privadas, link-local e esquemas alternativos.
Redirect é desabilitado por padrão; quando inevitável, cada salto passa pela
mesma validação de host e DNS. URL encontrada no corpo de uma resposta nunca é
seguida automaticamente. Testes negativos cobrem redirect para host externo,
DNS rebinding, URL com credencial embutida e resposta que tenta indicar uma nova
URL.

Todos os perfis negam `web` genérica, `file`, `code_execution`, browser, MCP
não allowlisted, memória, `session_search`, delegação, cron, mensageria e
ferramentas de escrita. Nenhuma skill será habilitada no perfil Telegram ou no
caminho do produtor.

Antes da instalação, um teste deve capturar as tools realmente enumeradas pelo
processo e comparar seus nomes com um manifesto allowlisted. Ferramenta extra,
toolset ausente ou falha de enumeração bloqueia a execução.

## 9. Envelope de evidência

Adapters e helpers devem produzir um contrato equivalente a:

```json
{
  "schemaVersion": "1.0",
  "sourceId": "allowlisted-source",
  "sourceRole": "forecast",
  "status": "manual_only",
  "observedAt": "2026-08-19T12:00:00Z",
  "fetchedAt": "2026-08-19T12:05:00Z",
  "expiresAt": "2026-08-20T00:00:00Z",
  "spatialSupport": "municipality",
  "temporalSupport": "daily",
  "measurements": [],
  "transformations": [],
  "sourceUrl": "https://fonte-oficial.example/",
  "license": "unknown",
  "licenseStatus": "unknown",
  "claimsAllowed": false,
  "rawSha256": "sha256:...",
  "limitations": []
}
```

`status` admite, conforme a capacidade:

- `available`;
- `degraded`;
- `needs_auth`;
- `manual_only`;
- `historical_only`;
- `insufficient_evidence`;
- `blocked`;
- `unknown`.

Valores `null`, `9999`, `-999`, payload vazio, unidade incompatível ou período
fora do horizonte são ausência ou insuficiência; nunca zero.

`status: available` exige `licenseStatus: verified` e uma licença compatível
com o uso declarado. Licença desconhecida ou restrita força
`claimsAllowed: false` e um estado `manual_only`, `blocked` ou `unknown`. Essa
combinação é validada por schema e não pode ser relaxada pela skill.

## 10. Fluxo de dados

```text
Operador de backoffice
        │
        ▼
Skill especializada
        │
        ▼
Helper/adaptor determinístico read-only
        │
        ▼
EvidenceEnvelope + hash + limitações
        │
        ▼
lettuce-provenance-check
        │
        ▼
Rascunho explicativo do Hermes
        │
        ▼
Validador pós-modelo determinístico
        │
        ├── saída idêntica ao relatório → renderização
        └── divergência → descarta o rascunho e renderiza o relatório canônico
```

Skills não trocam dados por memória livre. Uma composição futura deve usar um
bundle do Hermes ou um orquestrador explícito com contratos estruturados.

## 11. Estado inicial das fontes

Esta matriz é um snapshot de decisão, verificado em 2026-08-19. Não substitui a
execução periódica de `lettuce-api-audit`.

| Fonte | Uso inicial | Estado inicial | Condição principal |
|---|---|---|---|
| Open-Meteo | previsão | condicional | plano/licença compatível com uso comercial e atribuição |
| NASA POWER | climatologia/contexto | permitido para snapshot | respeitar resolução, parâmetros e rate limit |
| INMET | estação/previsão | `needs_auth`/`degraded` | endpoint horário anônimo não é contrato confiável |
| CPTEC/INPE | previsão pública | condicional | termos de reprodução e uso comercial precisam ser respeitados |
| MERGE/SAMeT | pesquisa oficial | permitido para snapshot | pipeline geoespacial e atribuição explícitos |
| SoilGrids | contexto de solo | `degraded` | beta, valores nulos e sem substituição de laboratório |
| IBGE/SIDRA | território/produção | permitido | limite de consulta e lacuna de folhosas declarados |
| GBIF | taxonomia/ocorrência | permitido | licença preservada por dataset e rate limit |
| Wikidata | taxonomia complementar | permitido | User-Agent identificável e limites do SPARQL |
| Embrapa AgroAPI | módulos contratados | `needs_auth` | catálogo e plano verificados antes de habilitar |
| CEAGESP/Prohort/CEASAs | preço | `manual_only` | sem REST/licença de redistribuição presumida |
| OpenFarm/Trefle/dados.gov.br | pesquisa | `blocked`/`needs_auth` | não usar como dependência principal |

## 12. Tratamento de erros

Os helpers devem retornar erros estruturados, sem stack trace, segredo ou
payload bruto para o usuário:

- `SOURCE_UNAVAILABLE`;
- `NEEDS_AUTH`;
- `RATE_LIMITED`;
- `STALE_DATA`;
- `OUT_OF_HORIZON`;
- `LICENSE_UNKNOWN`;
- `NOT_COMPARABLE`;
- `INVALID_SOURCE`;
- `INVALID_MODEL_OUTPUT`.

Retry só é permitido para falhas transitórias, com timeout, jitter e limite
baixo. Erros de autenticação, schema, licença ou input não recebem retry cego.

## 13. Segurança e privacidade

- Todo conteúdo externo é dado não confiável, nunca instrução para o agente.
- O catálogo de fontes e domínios é allowlisted e versionado.
- Helpers usam `User-Agent` identificável sem incluir dados pessoais.
- Tokens nunca aparecem em URL, argumento, fixture, exemplo ou log.
- Cache não armazena prompt, transcript, nome, telefone ou coordenada privada.
- O toolset de terminal existe apenas no perfil isolado de backoffice; web
  genérica permanece desabilitada.
- O caminho do produtor permanece desconectado destas skills nesta fase.
- Nenhum resultado é aprovação técnica, laudo, diagnóstico, oferta ou venda.

### 13.1 Tratamento de dados

As skills iniciais não têm finalidade que justifique dados pessoais. Por isso,
aplica-se minimização por exclusão, sem depender de consentimento em prompt:

| Classe | Entrada | Persistência | Log | Descarte |
|---|---|---|---|---|
| Fonte pública, unidade e timestamp | permitida | somente artefato de auditoria aprovado | `sourceId`, status e duração | conforme política técnica aprovada |
| Localidade pública fixa do piloto | permitida server-side | catálogo controlado | identificador público | ao substituir o catálogo |
| Nome, telefone ou coordenada precisa | proibida | nenhuma | nenhuma | rejeição antes do helper |
| Histórico produtivo, custo ou Oferta individual | proibida nesta fase | nenhuma | nenhuma | rejeição antes do helper |
| Prompt e transcript | proibidos em cache/artefato | nenhuma | apenas código de evento | fim do processo |
| Segredo ou credencial | somente ambiente/arquivo dedicado | fora das skills | sempre redigido | conforme gestor de segredos |
| Payload externo bruto | memória efêmera | sem cache por padrão | hash e metadados, não conteúdo | fim do processo |

Persistência ou cache futuro exige decisão separada sobre finalidade, base
legal, prazo, acesso, descarte e atendimento ao titular. Até essa decisão, o
prazo padrão de conteúdo bruto é zero após o término do processo.

URLs de log nunca incluem query string. O logger registra domínio e rota
normalizada, remove headers de autenticação e aplica scan de PII/segredos ao
stdout, stderr e artefatos de CI. Fixtures são sintéticas.

## 14. Testes e validação

### 14.1 Validação estrutural

`scripts/validate_skills.py` verificará:

- frontmatter obrigatório e limites de nome/descrição;
- correspondência entre `name` e diretório;
- relações para skills existentes;
- caminhos auxiliares citados literalmente;
- ausência de segredos e caminhos locais;
- categorias, tags e toolsets permitidos.

### 14.2 Testes unitários

Os testes usarão fixtures sintéticas e rede mockada. Casos mínimos:

- INMET retorna HTTP 204;
- CPTEC entrega horizonte menor que o solicitado;
- SoilGrids retorna propriedade `null`;
- SIDRA não contém a cultura consultada;
- GBIF mistura licenças entre datasets;
- Wikidata rejeita requisição sem User-Agent;
- helper rejeita IP privado, redirect externo, DNS rebinding e URL retornada no
  payload;
- observações de mercado têm embalagem ou peso incompatível;
- fonte está vencida, fora do horizonte ou com unidade inválida;
- claim contém número ou `sourceId` inexistente;
- skill tenta transformar rejeição do validador determinístico em aprovação e
  o pós-validador força o relatório canônico;
- warning material foi removido ou suavizado;
- payload externo contém prompt injection;
- modelo tenta chamar tool inexistente ou `load_plan`;
- input contém coordenada precisa, PII, histórico produtivo, custo ou Oferta;
- pergunta pede “melhor cultura” sem evidência suficiente;
- falha da OpenAI tenta alterar o plano determinístico;
- pedido regulado tenta chegar ao modelo ou a uma tool.

Para pedido regulado, o assert é binário: zero chamada OpenAI, zero chamada de
tool e resposta fixa de handoff, sem produto, dose, faixa ou instrução. Os
testes também varrem resposta, stdout, stderr, cache e artefatos em busca de PII
e segredos.

### 14.3 CI e smoke tests

O CI padrão não acessará rede nem segredos. Smoke tests ao vivo serão manuais ou
agendados separadamente, tolerarão indisponibilidade e nunca bloquearão deploy
do produto por instabilidade de terceiro.

Para validar no Hermes em ambiente descartável:

```bash
hermes skills inspect santanalc/lettuce/skills/<slug>
hermes skills install santanalc/lettuce/skills/<slug> --yes
hermes skills audit <slug> --deep
```

Os testes não serão executados no VPS de produção, cujo ambiente atual não
contém as dependências de desenvolvimento completas.

## 15. Instalação pelo GitHub Tap

Esta etapa permanece bloqueada enquanto o repositório estiver `UNLICENSED`.
Depois da decisão de licença, implementação, revisão e merge, o release recebe
tag, manifesto de hashes e commit imutável registrado. A instalação aborta se o
SHA resolvido ou qualquer arquivo divergir do manifesto.

O Tap do Hermes resolve a branch padrão do repositório no momento da operação
e registra `source_revision`; o identificador do Tap não é um pin de release.
Por isso, o procedimento deve comparar o SHA remoto com o commit da tag
aprovada imediatamente antes de `inspect/install` e confirmar o mesmo
`source_revision` depois. Drift interrompe a instalação. Atualização posterior
exige nova revisão do commit e do manifesto; não haverá auto-update.

Com essas pré-condições atendidas:

```bash
hermes skills tap add santanalc/lettuce
hermes skills inspect santanalc/lettuce/skills/lettuce-api-audit
hermes skills install santanalc/lettuce/skills/lettuce-api-audit --yes
hermes skills audit lettuce-api-audit --deep
```

Sessões abertas precisarão de `/reload-skills`. Atualizar o próprio Hermes é uma
operação separada e não faz parte desta entrega.

## 16. Critérios de aceite da implementação

1. As seis skills existem como filhos diretos de `skills/`.
2. Cada skill passa pelo validador estrutural e pelos testes correspondentes.
3. O Tap consegue inspecionar e instalar todos os arquivos auxiliares.
4. Nenhuma skill contém segredo, caminho local ou texto copiado em massa das
   pesquisas.
5. Toda saída numérica contém fonte, data, unidade e natureza.
6. Dados ausentes ou vencidos falham fechados.
7. Licença desconhecida nunca produz `available` nem claim reutilizável.
8. Mercado começa em modo manual/licenciado, sem scraping.
9. Pedido regulado produz zero chamada OpenAI, zero tool e handoff fixo.
10. O manifesto de capabilities coincide com as tools observadas em runtime.
11. Egress rejeita host, redirect, DNS e URL fora da allowlist em cada salto.
12. O pós-validador impede que a skill altere decisão do helper e, diante de
    divergência, renderiza diretamente o relatório canônico.
13. O caminho atual do produtor não recebe terminal, web, arquivo, memória ou
   delegação.
14. Logs, caches, fixtures e artefatos passam no scan de PII e segredos.
15. Warning omitido, prompt injection, `load_plan`, coordenada precisa, “melhor
    cultura” e falha OpenAI possuem regressões binárias.
16. `lettuce-plan-explainer` continua desabilitada.
17. A documentação descreve instalação, uso, limitações e desinstalação.
18. Nenhum release instalável é publicado antes da decisão explícita de licença.

## 17. Sequência de entrega

1. Revisar e aceitar esta especificação.
2. Escrever um plano de implementação com tarefas e ownership por arquivo.
3. Criar validador, catálogo e fixtures.
4. Implementar as skills em lotes independentes.
5. Rodar testes locais e auditoria Hermes.
6. Abrir revisão técnica e de segurança.
7. Definir licença e produzir manifesto de direitos e hashes.
8. Fazer merge e criar release imutável no Lettuce.
9. Instalar primeiro em ambiente de backoffice isolado.
10. Observar logs sanitizados e regressões antes de qualquer ampliação.

## 18. Pendências explícitas

- proprietário escolher a licença do repositório e das skills;
- confirmar o nome de autor/publicador no frontmatter;
- aprovar os domínios oficiais allowlisted;
- definir quais smoke tests podem usar credenciais de staging;
- aprovar a política técnica de retenção de artefatos de auditoria;
- decidir, em entrega futura, se haverá perfil Hermes dedicado ao produtor.
