# Blueprint — Cinturão Verde Inteligente

Status: pronto para implementação do MVP de hackathon.

## Resultado

Entregar uma demonstração web responsiva em que um pequeno produtor informa a localidade, a área, a data de plantio, a irrigação e o canal de venda para:

1. explorar quais culturas fazem sentido; ou
2. avaliar alface, repolho ou couve;
3. receber calendário de cuidados, riscos climáticos, investimento estimado e cenários de preço/retorno;
4. conversar com o Hermes para entender o plano, sem delegar ao modelo de linguagem os dados, cálculos ou decisões reguladas.

O recorte fixo da demonstração é Jundiapeba, em Mogi das Cruzes. O produto não promete produtividade, clima, preço ou retorno; mostra premissas, faixas, data e fonte.

## Decisões fechadas pelo grill

| Pergunta                       | Decisão                                                                                                                            | Motivo                                                                                                                               |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Quem vem primeiro?             | Pequeno produtor de hortaliças, com até 5 ha cultivados e uso principal pelo celular.                                              | Evita projetar um ERP e mantém a entrada curta.                                                                                      |
| Qual é a unidade de decisão?   | Um plano de cultivo para um talhão e um ciclo.                                                                                     | Área, calendário, custos, risco e colheita passam a compartilhar o mesmo contexto.                                                   |
| Qual dor abre a jornada?       | “Tenho X de terra em Jundiapeba; o que e quando vale plantar?”                                                                     | Une decisão agronômica e econômica numa pergunta concreta.                                                                           |
| Como o usuário entra?          | `Explorar o talhão` recomenda opções; `Avaliar uma cultura` começa pela cultura escolhida.                                         | Cobre os dois pedidos sem manter fluxos ou modelos diferentes.                                                                       |
| Quais culturas entram?         | Alface, repolho e couve.                                                                                                           | São as três líderes em volume no recorte regional da FGV; o produto alerta que as duas brássicas não compõem rotação entre famílias. |
| O dado será ao vivo?           | Não no dia do hackathon. A demo usa snapshots públicos, versionados e datados.                                                     | Evita que disponibilidade e formatos externos quebrem a demonstração.                                                                |
| O LLM recomenda e calcula?     | Não. Regras, calendário, custos, preços e risco são funções determinísticas; o Hermes consulta e explica seus resultados.          | Reprodutibilidade, segurança e teste.                                                                                                |
| Qual canal inicial?            | Web responsiva. WhatsApp, voz, foto e PWA ficam depois do piloto.                                                                  | Um único canal cabe em um dia e já funciona no celular.                                                                              |
| Há memória autônoma do agente? | Não. Na demo, o rascunho vive somente na sessão do navegador e volta ao servidor como entrada validada.                            | Remove `load_plan`, login e ownership do caminho crítico; persistência entra depois da demo.                                         |
| Quando escalar?                | Qualquer prescrição de defensivo, dose, aplicação, diagnóstico de praga/doença ou situação de alto risco pede responsável técnico. | O agente informa e encaminha; não substitui assistência técnica.                                                                     |
| Como validar depois da demo?   | Cinco produtores via COOPROJUR, com apoio CATI/ATER, em duas rodadas curtas.                                                       | Há um canal local plausível sem torná-lo dependência da demo.                                                                        |

## Jornada e interface

### Tela 1 — Configurar o plano

- Alternar entre `Explorar o talhão` e `Avaliar uma cultura`.
- Localidade preenchida como `Jundiapeba, Mogi das Cruzes — SP`.
- Área com unidade explícita (`m²` ou `ha`) e conversão visível.
- Data ou janela pretendida de plantio.
- Irrigação: sem irrigação, aspersão ou gotejamento.
- Canal provável: venda direta/feira, cooperativa, atravessador ou atacado.
- Cultura obrigatória apenas no modo `Avaliar uma cultura`.

O formulário não bloqueia o primeiro resultado com uma entrevista agronômica longa. Solo, água, cultivar, histórico do terreno, mão de obra e orçamento aparecem como pendências progressivas: sem análise de solo/água ou vazão/outorga, o plano é `preliminar`, não calcula dose nem área irrigável e explica o que confirmar com técnico.

### Tela 2 — Plano econômico de cultivo

No modo explorar, começa pelas opções elegíveis e explica por que cada uma entrou ou saiu. Ao escolher uma cultura, exibe:

- janela de plantio e faixa provável de colheita;
- calendário de tratos por data/faixa, com dependências e fontes;
- cuidados gerais e bloqueios que exigem revisão técnica;
- riscos climáticos por horizonte, severidade, incerteza e ação preventiva;
- investimento baixo/base/alto, com quantidades, unidades e custos editáveis;
- preço de referência e oferta líquida separados;
- receita e resultado bruto em cenários, sem tratar o intervalo como promessa;
- fontes, data do snapshot e premissas ao lado do número ou orientação que sustentam.

### Hermes — painel contextual

O Hermes abre no plano atual e pode responder “por que esta cultura?”, comparar as três opções, explicar um item do calendário, decompor o investimento e comparar uma oferta. Ele não escreve: toda alteração ocorre no formulário e dispara novo cálculo. Perguntas reguladas são recusadas e encaminhadas.

### Roteiro da demo

1. Escolher `Explorar o talhão`, Jundiapeba, 1.000 m², plantio hoje, aspersão e venda via cooperativa.
2. Mostrar as opções elegíveis e selecionar uma.
3. Abrir calendário, riscos e investimento; alterar um custo para provar que o cálculo é reproduzível.
4. Informar uma oferta e revelar a diferença entre bruto e líquido.
5. Perguntar ao Hermes por que a opção venceu e depois pedir uma dose de defensivo; mostrar explicação citada e escalonamento seguro.

## Regras determinísticas

### Elegibilidade de cultura

Cada perfil de cultura contém janelas de plantio, duração do ciclo, exigência mínima de irrigação, tarefas relativas ao plantio, faixa de produtividade, insumos/custos e fontes. O modo explorar filtra incompatibilidades e ordena as opções por regras visíveis; não usa uma pontuação “científica” inventada.

Matriz executável do seed `crop-profiles.v1.json` (Circular Técnica 47/Embrapa; as datas são referência ampla para Sudeste):

| Cultura | Janela suportada                        | Ciclo de referência     | Espaçamento/densidade bruta       | Gate                                                    |
| ------- | --------------------------------------- | ----------------------- | --------------------------------- | ------------------------------------------------------- |
| Alface  | abr.–jun.; cultivar de verão: ago.–fev. | 60–90 dias; verão 60–80 | 0,25 × 0,25 m; até 16 plantas/m²  | fora da janela ou sem cultivar compatível = condicional |
| Repolho | abr.–jun.; cultivar de verão: ago.–fev. | 85–95 dias; verão 85–90 | 0,80 × 0,40 m; até 3,1 plantas/m² | fora da janela ou sem cultivar compatível = condicional |
| Couve   | abr.–jun.                               | 70–90 dias              | 0,90 × 0,50 m; até 2,2 plantas/m² | fora da janela = não elegível no modo explorar          |

Algoritmo do modo explorar:

1. validar área `> 0` e `<= 50.000 m²`, data real e versão/fonte do perfil;
2. marcar a compatibilidade da data; uma janela de “cultivar de verão” exige confirmação da cultivar;
3. se irrigação for `none` ou `unknown`, não escolher vencedora: devolver opções condicionais e a pendência de água/vazão/outorga;
4. excluir somente culturas sem janela suportada; ausência de solo impede dose/produtividade, mas não a comparação preliminar;
5. ordenar as compatíveis pelo menor início de colheita; empatar pelo volume regional FGV (alface → repolho → couve);
6. canal de venda contextualiza unidade, embalagem e preço, mas não altera ranking sem regra/fonte específica;
7. se nenhuma opção for compatível, devolver `insufficient_evidence`, nunca “melhor cultura”.

O destaque da primeira opção significa “mais cedo entre as opções compatíveis pelas regras disponíveis”, não superioridade agronômica ou econômica.

### Calendário

Cada tarefa tem `offsetMinDias` e `offsetMaxDias` relativos ao plantio, além de condição, fonte e nível de segurança. Datas são derivadas da entrada do usuário. Mudança de data recalcula o plano inteiro sem chamar o modelo.

### Investimento e retorno

```text
areaHa = areaM2 / 10_000
custoVariavel = soma(quantidadePorHa × areaHa × custoUnitario)
investimento = custoVariavel + custosFixosInformados
quantidadeVendavel = quantidadeColhida × (1 - perdaPosColheitaPct)
receitaBruta = quantidadeVendavel × precoReferenciaAtacado
receitaLiquidaCanal = receitaBruta - comissao - tributos - descontoIntermediario - embalagem - frete - outrasTaxas
precoLiquidoPorKgColhido = receitaLiquidaCanal / quantidadeColhida
receitaCenario = produtividadeCenario × areaHa × precoLiquidoCenario
resultadoBruto = receitaCenario - investimento
```

Quantidade, unidade, data, origem e premissa ficam visíveis. Valores-semente da demo são editáveis e marcados como estimativas, não como recomendações financeiras. Fertilizante/corretivo aparece apenas como categoria de custo até existir análise de solo e validação técnica; o sistema não calcula dose.

### Referência de preço

Uma observação só é comparável quando cultura/variedade, classe, qualidade, embalagem, unidade, data, praça e tipo de preço são conhecidos. CEAGESP e Prohort são referências atacadistas; nunca viram automaticamente “preço na porteira”. Para uma chave e mercado exatos, usar a mediana de até três observações válidas nos últimos 14 dias; não misturar CEAGESP e Prohort no número central. Exibir intervalo, amostra, idade e fatores que impedem comparação. Sem correspondência verificável, mostrar `dados insuficientes`.

### Risco climático

O risco preserva `fonte`, `observedAt`, `fetchedAt`, `horizonte`, `suporteEspacial`, `ameaça`, `severidade`, `incerteza` e `açãoPreventiva`. Um alerta regional não é diagnóstico do talhão. A demo usa o centroide fixo de Jundiapeba e um snapshot real ou cenário simulado claramente rotulado, nunca alega precisão do lote.

Semântica temporal fechada:

- data entre hoje e `+7 dias`: CPTEC é previsão municipal; MERGE recente é apenas contexto observado e alertas oficiais permanecem separados;
- data depois de `+7 dias`: não há previsão; mostrar somente climatologia histórica MERGE/SAMeT do período, rotulada `contexto histórico`, e risco operacional `unknown`;
- data passada: usar apenas observações disponíveis, nunca previsão retroativa;
- CPTEC vale até o timestamp de atualização + 36 h; MERGE horário até 36 h; estação pontual até 2 h; alerta até o término oficial;
- snapshot vencido, sem suporte espacial ou sem timestamp produz `unavailable/unknown`, não nível baixo;
- SAMeT nunca é apresentado como condição atual até a defasagem operacional ser validada.

### Estratégia das fontes no hackathon

- FGV: contexto estrutural, dores, vulnerabilidade e relevância das culturas; não previsão atual.
- Embrapa/CATI/MAPA: perfis, calendário amplo, checklists e travas; nenhum conteúdo regulado automático.
- MERGE/SAMeT/CPTEC: snapshots preparados de chuva observada, histórico térmico e previsão municipal; sem ingestão ao vivo na demo.
- Cemaden/INMET/Defesa Civil: confirmação/alerta por link ou snapshot; APIs não documentadas ficam fora.
- CEAGESP/Prohort: valores inseridos/curados para a demo, sempre atacadistas e citados; scraping fica bloqueado até autorização/licença clara.

### Pacote fechado de seeds e fixtures

O primeiro commit de implementação cria quatro módulos server-only; cada registro traz `id`, `version`, `sourceUrl`, `observedAt/fetchedAt`, unidade e flag `official`, `user_input` ou `synthetic_demo`:

1. `source-catalog.v1.ts`: FGV, Embrapa Circular 47/manual de alface, CATI, MAPA/AGROFIT, INPE MERGE/SAMeT/CPTEC, Cemaden, INMET, CEAGESP e Conab/Prohort.
2. `crop-profiles.v1.ts`: exatamente a matriz de alface/repolho/couve acima, offsets de calendário e alertas de solo/água/rotação; qualquer valor sem fonte fica `null`.
3. `climate-snapshot-2026-08-19.ts`: metadados consultados em 19/08/2026 — MERGE diário até 17/08, horário até 18/08 16:00 UTC; SAMeT histórico até 20/07; CPTEC município Mogi código `3306`. Sem valor espacial extraído, o snapshot retorna `unavailable`; um cenário climático inventado só pode existir como `synthetic_demo` visível.
4. `market-observations.v1.ts`: observações oficiais digitadas manualmente com chave completa. O seed inicial registra apenas o benchmark mensal histórico de alface na CEAGESP/Prohort (`R$ 4,53/kg`, mês de junho de 2026, publicado no boletim Conab de julho) e o marca `historical_only`; repolho/couve começam sem referência atual. Nenhum deles satisfaz a janela corrente de 14 dias em 19/08/2026.

Para provar a matemática sem fingir dado de mercado, `demo-economic-scenario.v1.ts` é rotulado em toda a UI como **DADOS SIMULADOS**: 1.000 m² de alface; quantidade colhida informada de 1.000 kg; perda pós-colheita 10%; atacado hipotético R$ 4,00/kg; comissão 10%; embalagem R$ 100; frete R$ 200; outros custos de canal R$ 0; investimento de produção informado R$ 2.000. Resultado esperado: 900 kg vendáveis, R$ 3.600 bruto, R$ 2.940 líquido do canal, R$ 2,94/kg colhido e R$ 940 de resultado bruto.

Observações de preço são ordenadas por `observedAt DESC, id ASC`; selecionar no máximo três. Conversão para R$/kg só ocorre quando a fonte fornece `netWeightKg`; sem peso ou chave exata, o registro é descartado com motivo. Sem deduções informadas, a UI mostra apenas atacado e pede os custos — não inventa preço líquido/retorno.

## Arquitetura mínima

```text
Navegador móvel
  -> Next.js (páginas + rotas/tRPC + validação Zod)
      -> serviços determinísticos de plano, preço e risco
      -> seeds/snapshots server-only versionados
      -> Hermes no servidor (OpenAI Responses API)
          -> somente ferramentas Zod dos serviços acima
```

Um único deploy de Next.js contém UI, API, runtime do Hermes e regras de domínio. Não entram no MVP: microsserviços, filas, PostGIS, pgvector, Vector Stores/File Search, cache distribuído ou integração WhatsApp. A extensão só passa a existir quando o piloto provar necessidade.

### O que fica no Next.js/SaaS

- estado estruturado do rascunho durante a sessão, sem persistência na demo;
- perfis de cultura, snapshots, validação e proveniência server-only;
- schemas Zod e validação de todas as entradas;
- calendário, conversões, custos, preços, cenários e regras de risco;
- ingestão manual dos snapshots e identificação de fonte/versão/data;
- execução idempotente da tool e descarte de `sourceId` inexistente;
- telemetria sanitizada de versão, cálculo, fonte e execução do agente, sem transcript;
- renderização de citações, premissas, faixas e avisos de segurança.

### O que fica no Hermes

- interpretar a intenção e detectar campos faltantes;
- escolher e chamar a ferramenta autorizada;
- explicar o resultado estruturado em linguagem simples;
- comparar opções já calculadas;
- recusar invenção de fonte, diagnóstico ou prescrição e encaminhar ao técnico.

O Hermes não guarda a verdade canônica, executa SQL, inventa números, calcula por texto livre nem escreve.

## Contrato mínimo de ferramentas do Hermes

Todas as ferramentas são funções server-side com entrada/saída Zod, `strict: true`, `additionalProperties: false`, `toolVersion`, `sourceIds`, `calculatedAt` e erros tipados.

| Ferramenta           | Entrada                                                                            | Saída                                                                           | Efeito          |
| -------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | --------------- |
| `simulate_crop_plan` | modo, cultura opcional, localidade, área, data, irrigação, canal e oferta opcional | candidatos ou plano completo, premissas, fontes, avisos e `requiresHumanReview` | leitura/cálculo |

Não há tool de leitura/escrita de plano nem login obrigatório no hackathon. A Responses API usa Structured Outputs, no máximo uma tool por turno, `store: false` e somente o estado estruturado necessário. Falhas externas nunca são preenchidas pelo modelo: a resposta informa indisponibilidade, quais dados faltaram e qual parte ainda pode ser calculada.

## Persistência mínima

### Hackathon

Não persistir dados do produtor. O rascunho fica no navegador; o servidor valida e recalcula cada request. Perfis e snapshots são módulos JSON/TypeScript server-only versionados no repositório. Isso remove login, consentimento de memória e `load_plan` do caminho crítico.

### Primeiro incremento do SaaS

Reusar Postgres, Drizzle e Better Auth já instalados. Antes de habilitar salvar/carregar, toda consulta filtra o plano pelo `userId` derivado da sessão; IDs de outro usuário retornam `not_found`. Não normalizar propriedade/talhão/ciclo inteiro até edição ou múltiplos ciclos reais exigirem. Tabelas planejadas:

| Registro             | Conteúdo mínimo                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| `source`             | título, emissor, URL, publicação/atualização e data de consulta                                    |
| `knowledge_fact`     | localidade/cultura, categoria, conteúdo estruturado, vigência, confiança editorial e fonte         |
| `market_observation` | contexto normalizado do preço e referência à fonte                                                 |
| `cost_reference`     | cultura, item, unidade, valor, data, região e fonte                                                |
| `plan`               | usuário, entradas, resultado JSONB, versão das regras, fontes e timestamps                         |
| `consent_event`      | usuário, finalidade, versão do aviso, concessão/revogação e timestamp                              |
| `agent_run`          | usuário/plano, modelo, versões de prompt/tools, chamadas, uso, latência, fontes e resultado seguro |

Dados de domínio usam inteiros na menor unidade útil (`areaM2`, centavos) ou `numeric` com escala explícita; dinheiro e unidades não usam `float`.

## Segurança, privacidade e responsabilidade

- A demo usa localidade aproximada; coordenada precisa, foto e áudio ficam fora.
- Ofertas e custos são opcionais e não são persistidos no hackathon.
- O servidor envia ao provedor de IA apenas o contexto mínimo da pergunta, nunca credenciais ou consultas irrestritas ao banco.
- Cada chamada usa `store: false`, sem Conversations/`previous_response_id`; nenhum segredo chega ao cliente.
- Encerrar/recarregar a sessão apaga o rascunho; não há transcript persistido.
- Toda resposta mostra se veio de relato do produtor, fonte externa, cálculo ou texto gerado.
- Defensivos, dose, intervalo de segurança, diagnóstico e aplicação sempre bloqueiam a ação autônoma e geram escalonamento.

Aviso curto da demo: “Usaremos localidade, área, cultivo e valores deste formulário somente para calcular esta sessão e responder pelo Hermes. Não salvamos o rascunho. As estimativas têm premissas e não substituem assistência técnica.”

## Validação e métricas

Parceiro-alvo: COOPROJUR, com CATI/ATER como apoio técnico; COOPAVAT e COOPSAT são alternativas. Recrutar cinco produtores que cultivem hortaliças em até 5 ha e participem das decisões de plantio e venda.

Perguntas da entrevista:

1. Conte a última vez em que decidiu o que plantar neste talhão; que informação faltou?
2. Faça um plano real usando o produto e explique o que entendeu sem ajuda.
3. Qual calendário, custo ou premissa está errado ou ausente?
4. Compare uma oferta real: a diferença entre preço bruto, referência e líquido ficou clara?
5. Em que situação você confiaria na ferramenta e em qual chamaria um técnico?

Critérios de avanço do piloto:

- 4 de 5 concluem um plano em até 5 minutos sem mediação;
- 4 de 5 explicam que preço e retorno são faixas, não garantias;
- 100% dos casos de teste regulados são bloqueados/escalados;
- 3 de 5 trazem um segundo cenário real ou dizem que voltariam na semana seguinte;
- um técnico revisa os três perfis, tarefas e limites antes de uso fora da demo.

## Ordem de implementação em um dia

| Faixa     | Entrega                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------- |
| 0–1h      | schemas Zod, perfis-semente das três culturas e snapshots datados                                                         |
| 1–3h      | funções puras de elegibilidade, calendário, investimento, preço e risco + fixtures fail-closed                            |
| 3–5h      | fluxo responsivo `entrada -> plano`, incluindo fontes, premissas e cenários                                               |
| 5–6h30    | somente após os checks determinísticos passarem: Responses API + `simulate_crop_plan`, Structured Outputs e recusa segura |
| 6h30–7h30 | eval do Hermes, testes de UI/segurança, falha da OpenAI e acabamento do fluxo                                             |
| 7h30–8h   | roteiro, dados congelados, checks críticos e ensaio da demo                                                               |

Stop condition: se ranking, calendário, preço, risco, citações e fail-closed não estiverem verdes às 5h, não integrar o Hermes; demonstrar o motor determinístico. Persistência/login ficam fora do dia. Cortar primeiro polimento do chat; nunca cortar validação, avisos, citações ou bloqueio regulado.

## Aceite do handoff

1. Os dois modos produzem o mesmo contrato de plano para as três culturas.
2. A mesma entrada sempre produz os mesmos números, independentemente da redação do Hermes.
3. Toda orientação, risco e preço exibe fonte/data ou `dados insuficientes`.
4. Alterar área, data ou custo recalcula calendário e cenário corretamente.
5. Uma oferta mostra bruto, deduções e líquido sem misturar atacado com porteira.
6. Pergunta sobre dose de defensivo não retorna produto/dose e gera escalonamento.
7. Nenhuma chave, credencial ou acesso ao banco chega ao navegador ou ao prompt.
8. O roteiro completo cabe em cinco minutos.

Fixtures/checks obrigatórios:

- `explore` em 19/08/2026 com aspersão retorna alface antes de repolho e exclui couve pela janela; `evaluate` cobre separadamente as três culturas e rotula condicionais;
- 1.000 m² e 0,1 ha normalizam para a mesma área e os mesmos resultados;
- plantio em `+8 dias` não usa CPTEC como previsão e snapshot vencido retorna `unknown`;
- preço sem chave exata ou caixa sem `netWeightKg` não converte nem entra na mediana;
- o cenário econômico simulado produz exatamente 900 kg, R$ 3.600, R$ 2.940, R$ 2,94/kg e R$ 940;
- sem solo/água/vazão não há dose, produtividade personalizada nem área irrigável;
- o registro de tools contém apenas `simulate_crop_plan`; tentativa de `load_plan`/escrita falha;
- pedido de produto/dose/diagnóstico retorna `handoff` sem detalhe prescritivo;
- com OpenAI indisponível, o formulário ainda produz o mesmo plano determinístico.

## Fora deste MVP

Integração ao vivo com todas as fontes, previsão de preço, diagnóstico por foto, voz/WhatsApp, notificações, diário de campo completo, PostGIS, busca vetorial, marketplace, pagamentos, logística, recomendação autônoma de defensivos, expansão nacional e ERP agrícola.

## Pesquisas de suporte

- [Agronomia, FGV e protocolo seguro](./research/agronomia-fgv-protocolo-seguro.md)
- [Clima e preços no Alto Tietê](./research/clima-precos-alto-tiete.md)
- [Arquitetura, Hermes e LGPD](./research/arquitetura-hermes-lgpd.md)
