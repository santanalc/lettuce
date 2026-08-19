# Clima e referência de preços para o Alto Tietê

Pesquisa concluída em 19/08/2026 para o mapa **Mapa Cinturão Verde Inteligente — MVP SaaS e agente Hermes**. O recorte é Mogi das Cruzes/Jundiapeba e o objetivo é decidir fontes, contratos e regras do MVP; não é uma recomendação agronômica para uma cultura específica.

## Resumo executivo

- Para chuva observada, a fonte programática mais apropriada para o MVP é o **MERGE/INPE**, porque oferece STAC público, dados horários e diários em grade de 0,1° (aproximadamente 10 km), arquivos GRIB2, histórico desde 2000 no produto diário e licença CC BY 4.0. A coleção diária estava atualizada até 17/08/2026 e a horária até 18/08/2026 16:00 UTC no momento desta pesquisa. ([MERGE diário](https://data.inpe.br/bdc/stac/v1/collections/prec_merge_daily-1), [MERGE horário](https://data.inpe.br/bdc/stac/v1/collections/prec_merge_hourly-1))
- Para temperatura histórica, o **SAMeT/INPE** entrega máximas, mínimas e médias diárias estimadas em grade de 5 km, em NetCDF, com histórico desde 2000 e licença CC BY 4.0. Em 19/08/2026 a coleção diária terminava em 20/07/2026, portanto serve para climatologia e calendário, não como monitoramento atual sem antes confirmar que a defasagem foi normalizada. ([descrição oficial](https://data.inpe.br/dados/samet/), [coleção STAC](https://data.inpe.br/bdc/stac/v1/collections/samet_daily-1))
- Para previsão, o **XML documentado do CPTEC/INPE** cobre todos os municípios e fornece até sete dias de condição, temperatura mínima, máxima e IUV. Mogi das Cruzes é o código CPTEC `3306`. É uma previsão municipal e diária, insuficiente sozinha para estimar volume de chuva ou necessidade de irrigação em um talhão. ([documentação XML](https://servicos.cptec.inpe.br/XML/), [busca oficial de Mogi](http://servicos.cptec.inpe.br/XML/listaCidades?city=mogi), [previsão de Mogi](http://servicos.cptec.inpe.br/XML/cidade/7dias/3306/previsao.xml))
- Os pluviômetros do **Cemaden** são a melhor confirmação pontual de chuva quando houver estação ativa próxima: enviam a cada 10 minutos durante precipitação e a cada 60 minutos sem chuva; o histórico pode ser baixado desde 2013, porém mês a mês e por formulário. O próprio órgão orienta verificar falhas, descontinuidades e valores espúrios. ([FAQ oficial do Cemaden](https://www.gov.br/cemaden/pt-br/paginas/historico-da-criacao-do-cemaden), [Mapa Interativo](https://www2.cemaden.gov.br/mapainterativo/))
- A cotação da **CEAGESP é preço de venda no atacado, não preço pago ao produtor**. A página publica menor, comum e maior normalmente às segundas, quartas e sextas, mas não documenta API nem licença aberta; a própria CEAGESP informa que não está no escopo da Política de Dados Abertos federal. Portanto, no MVP ela deve ser referência citada/assistida, não uma integração por scraping presumidamente autorizada. ([cotações](https://ceagesp.gov.br/cotacoes), [dados abertos](https://ceagesp.gov.br/acesso-a-informacao/dados-abertos/))
- O **Prohort/Conab** é o melhor benchmark normalizado: o preço diário é modal; as Ceasas devem convertê-lo para R$/kg, R$/unidade ou R$/dúzia; o painel publica em até seis horas após o lançamento; o SIMAB oferece preço médio ponderado, quantidade, valor e origem. Ainda assim é mercado atacadista e a cobertura/atualização depende do envio de cada Ceasa. ([Prohort](https://www.gov.br/conab/pt-br/atuacao/informacoes-agropecuarias/hortigranjeiros-prohort), [Norma Conab 30.305](https://www.gov.br/conab/pt-br/acesso-a-informacao/institucional/atos-normativos/normas-da-organizacao/operacoes/30-305_norma_captacao_divulgacao_dados_comercializacao_20_9_23.pdf))

## 1. Fontes climáticas oficiais

### 1.1 Matriz de fontes

| Fonte                 | Cobertura e acesso                                                                                                  | Resolução/cadência                                                                                           | Sinais úteis                                                                              | Limitações para o MVP                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| INPE MERGE            | América do Sul; API STAC e ativos GRIB2 públicos                                                                    | Grade 0,1°; horário em mm/h e diário em mm/dia; histórico diário desde 01/06/2000 e horário desde 04/12/2009 | Chuva observada por célula, acumulados 24 h/7 d/15 d, dias sem chuva                      | É estimativa em grade combinada com observações, não medição no lote; há latência e o valor da célula não captura microclima. A própria coleção traz a banda `nest`, número de observações de superfície incorporadas, que deve ser guardada como evidência de qualidade. ([diário](https://data.inpe.br/bdc/stac/v1/collections/prec_merge_daily-1), [horário](https://data.inpe.br/bdc/stac/v1/collections/prec_merge_hourly-1))                                                                                   |
| INPE SAMeT            | América do Sul; API STAC e ativos NetCDF públicos                                                                   | Grade de 5 km; máximo, mínimo e média diários; série desde 01/01/2000                                        | Climatologia térmica local, extremos históricos, graus-dia calculados depois              | Produto estimado que combina observações, ERA5 e correção de altitude; na data da pesquisa tinha quase um mês de defasagem. Não deve ser exibido como “temperatura de hoje”. ([descrição](https://data.inpe.br/dados/samet/), [STAC](https://data.inpe.br/bdc/stac/v1/collections/samet_daily-1))                                                                                                                                                                                                                    |
| CPTEC/INPE XML        | Todos os municípios; busca por nome, código ou latitude/longitude                                                   | Até sete dias, por dia; condição, Tmax, Tmin e IUV                                                           | Janela térmica e condição geral para plantio, pulverização e colheita                     | O XML municipal não fornece chuva em milímetros, probabilidade, umidade nem vento. O serviço DBWS anuncia previsões por período e probabilidade, mas devolveu “ACESSO NEGADO” em requisições externas durante esta pesquisa; não deve ser dependência do hackathon. ([XML](https://servicos.cptec.inpe.br/XML/), [DBWS](https://dbws.cptec.inpe.br/))                                                                                                                                                                |
| INMET estações/TEMPO  | Rede nacional de estações; catálogo, mapa e consulta web                                                            | Automáticas: dados de hora em hora e janela corrente de 90 dias; TEMPO limita consultas curtas a seis meses  | Temperatura, chuva, umidade, vento e extremos em estação                                  | Não há estação garantida em Jundiapeba; deve-se escolher a estação ativa mais próxima e registrar distância. Dados automáticos são brutos, podem conter `9999`, `Null` ou vazio e estão em UTC. ([serviço de automáticas](https://portal.inmet.gov.br/servicos/esta%C3%A7%C3%B5es-autom%C3%A1ticas), [orientações e qualidade](https://portal.inmet.gov.br/noticias/saiba-como-acessar-os-dados-meteorol%C3%B3gicos-dispon%C3%ADveis-no-site-do-inmet), [catálogo](https://portal.inmet.gov.br/paginas/catalogoaut)) |
| INMET BDMEP           | Estações automáticas e convencionais; CSV por solicitação e pacotes anuais das automáticas                          | Horário, diário e mensal; pacotes das automáticas a partir de 2000                                           | Normal histórica da estação, validação de MERGE/SAMeT, extremos                           | Fluxo por e-mail/fila para recortes e links expiram em 48 h; serviço de dados históricos informa atualização a cada 90 dias. É fonte de preparação/calibração, não de tempo real. ([BDMEP](https://bdmep.inmet.gov.br/), [carta de serviço](https://portal.inmet.gov.br/servicos/bdmep-dados-historicos))                                                                                                                                                                                                            |
| Cemaden pluviômetros  | Pontos no Mapa Interativo; inventário oficial de 2017 registrava ao menos a estação `353060701A` em Mogi das Cruzes | 10 min chovendo; 60 min sem chuva; histórico desde 2013, baixado mês a mês                                   | Confirmação pontual de chuva intensa, acumulado recente e falha local do produto em grade | Operação atual e distância a Jundiapeba precisam ser consultadas em cada execução; o download histórico exige formulário/CAPTCHA e não há API pública documentada. Dados podem conter falhas e valores espúrios. ([FAQ](https://www.gov.br/cemaden/pt-br/paginas/historico-da-criacao-do-cemaden), [inventário estadual de redes, p. 36](https://www.sigrh.sp.gov.br/public/uploads/deliberation/CBH-PS/13674/ugrhi_02_1854-r06-16-redes_de_monitoramento-full.pdf))                                                 |
| INMET/Defesa Civil SP | Avisos oficiais por área; INMET oferece mapa e RSS, Defesa Civil oferece Cell Broadcast/SMS por CEP e boletins      | Evento/alerta; monitoramento 24 h na Defesa Civil                                                            | Chuva severa, vento, granizo, calor/frio, alagamento e orientação operacional             | São alertas de proteção civil, não prescrição agronômica. Não foi localizada API pública documentada da Defesa Civil SP; integrar por link/alerta recebido, sem scraping. ([avisos INMET](https://alertas2.inmet.gov.br/), [RSS INMET](https://apiprevmet3.inmet.gov.br/avisos/rss), [Defesa Civil SP](https://www.defesacivil.sp.gov.br/sec_defesa_civil/institucional/sobre), [canais e georreferenciamento](https://www.agenciasp.sp.gov.br/de-onde-vem-os-alertas-da-defesa-civil/))                             |

O CIIAGRO/IAC é relevante para análise agronômica porque publica balanço hídrico, disponibilidade de água no solo, ETP, chuva e temperatura desde 2004, mas a interface oficial é HTML legado e não foi encontrada uma estação ativa de Mogi das Cruzes nem API documentada. Fica como fonte de validação humana, não como dependência do MVP. ([CIIAGRO Online](https://www.ciiagro.sp.gov.br/ciiagroonline/), [finalidade do CIIAGRO](https://www.ciiagro.sp.gov.br/index.html))

### 1.2 Cobertura real de Jundiapeba

1. O lote deve entrar no sistema como polígono ou ponto `latitude/longitude`; “Jundiapeba” ou apenas o CEP não tem precisão suficiente para cruzar grade e estações.
2. A previsão CPTEC pode usar o município Mogi das Cruzes (`3306`), mas deve ser rotulada **previsão municipal**, nunca “previsão do talhão”. ([endpoint de Mogi](http://servicos.cptec.inpe.br/XML/cidade/7dias/3306/previsao.xml))
3. MERGE e SAMeT usam a célula que contém o centroide do lote; em lotes que cruzam células, usar a média ponderada por área apenas numa versão posterior. Para o hackathon, centroide é suficiente e deve ser declarado na rastreabilidade.
4. Cemaden e INMET entram como estações pontuais: escolher a estação ativa mais próxima, exibir distância e descartar registros inválidos. O INMET afirma explicitamente que, quando não houver estação na localidade, deve-se procurar a mais próxima. ([orientação INMET](https://portal.inmet.gov.br/noticias/saiba-como-acessar-os-dados-meteorol%C3%B3gicos-dispon%C3%ADveis-no-site-do-inmet))
5. Nenhuma dessas fontes mede umidade do solo no lote. “Necessidade de irrigação” precisa ser uma estimativa com capacidade de água disponível do solo, cultura/fase, chuva e evapotranspiração; sem solo ou sensor local, o resultado deve dizer **estimativa de baixa confiança**, não “solo seco”.

### 1.3 Contrato proposto de risco climático

O contrato abaixo é uma decisão de produto, não uma escala oficial dos órgãos citados.

```ts
type RiskLevel = "unknown" | "low" | "watch" | "high" | "critical";
type Confidence = "low" | "medium" | "high";

type ClimateRisk = {
  plot: { lat: number; lon: number; municipality: "Mogi das Cruzes" };
  crop: { id: string; stage: string; plantedAt: string };
  irrigation: "none" | "manual" | "drip" | "sprinkler";
  generatedAt: string;
  overall: RiskLevel;
  confidence: Confidence;
  events: Array<{
    type:
      | "excess_rain"
      | "water_deficit"
      | "heat"
      | "cold"
      | "frost"
      | "wind"
      | "high_humidity"
      | "official_alert";
    level: Exclude<RiskLevel, "unknown">;
    window: { from: string; to: string };
    evidence: Array<{
      source: string;
      sourceUrl: string;
      observedAt: string;
      fetchedAt: string;
      value: number | string;
      unit: string;
      spatialSupport: "grid" | "station" | "municipality" | "warning-area";
      distanceKm?: number;
      qualityFlags: string[];
    }>;
    thresholds: Array<{
      level: "watch" | "high" | "critical";
      value: number;
      unit: string;
      direction: "above" | "below";
    }>;
    explanation: string;
  }>;
  missing: string[];
  limitations: string[];
};
```

Regras determinísticas:

1. Os limiares `watch`, `high` e `critical` vêm do perfil da cultura **e da fase fenológica**; não criar um limiar universal para todas as hortaliças.
2. Para cada evento, comparar o valor no mesmo período/unidade com seus limiares e escolher o maior nível excedido; nenhum limiar excedido = `low`. Para frio os comparadores são invertidos.
3. `overall` é o maior nível entre os eventos. Não usar média ponderada: ela poderia esconder um risco crítico com vários sinais baixos.
4. Um aviso oficial ativo que inclua o lote sempre aparece como evento separado e eleva `overall` no mínimo a `high`; o sistema nunca rebaixa um aviso de órgão público.
5. Ausência, `9999`, `Null`, vazio ou dado vencido é `missing`, nunca zero. Os avisos do INMET lembram que os dados automáticos são brutos e que o uso é responsabilidade do usuário. ([orientações INMET](https://portal.inmet.gov.br/noticias/saiba-como-acessar-os-dados-meteorol%C3%B3gicos-dispon%C3%ADveis-no-site-do-inmet))
6. Converter UTC para `America/Sao_Paulo` apenas na apresentação e guardar os dois horários. INMET e Cemaden publicam observações em UTC. ([INMET](https://portal.inmet.gov.br/noticias/saiba-como-acessar-os-dados-meteorol%C3%B3gicos-dispon%C3%ADveis-no-site-do-inmet), [Cemaden](https://www2.cemaden.gov.br/mapainterativo/))
7. Confiança `high`: fonte primária dentro da validade, correspondência espacial conhecida e nenhum campo essencial ausente; `medium`: apenas grade/município ou uma fonte secundária faltante; `low`: dado vencido, estação distante, conflito relevante ou estimativa de irrigação sem tipo de solo. Esses rótulos são de qualidade do dado, não probabilidade meteorológica.
8. Validade recomendada do MVP: MERGE horário até 36 h; CPTEC até mudança da data `atualizacao` + 36 h; estação até 2 h; aviso até seu término. Se vencer, manter histórico, mas não produzir orientação operacional como atual.

### 1.4 Rastreabilidade climática mínima

Guardar em toda execução: URL e identificador da coleção/item, versão, `observedAt`, `fetchedAt`, unidade original, célula/estação, distância, valor bruto, transformação aplicada, flags de qualidade e hash SHA-256 do payload obtido. A API STAC do INPE permite filtrar itens por `bbox` e `datetime` e fornece checksum nos itens; isso reduz a necessidade de inventar um protocolo próprio. ([documentação STAC do INPE](https://data.inpe.br/bdc/stac/v1/docs), [exemplo de item SAMeT](https://data.inpe.br/stac/browser/collections/samet_daily-1/items/samet_daily_20260128))

## 2. Fontes oficiais de preço

### 2.1 CEAGESP

A CEAGESP informa que suas cotações representam a média dos preços de **venda no atacado** do Entreposto Terminal São Paulo, ponderada pelas quantidades recebidas e pelos preços informados pelos comerciantes participantes. As colunas “Menor”, “Comum” (mais praticado) e “Maior” estão em reais; a publicação ocorre normalmente três vezes por semana. A mesma página adverte que esses valores não são os preços pagos ao produtor, pois a negociação depende de qualidade, classificação, quantidade, frequência de entrega e região de origem. ([metodologia e consulta](https://ceagesp.gov.br/cotacoes))

Produto, variedade, classificação e embalagem não são detalhes descartáveis. A CEAGESP mudou em 2022 várias verduras de cotação por maço para engradado e documenta, por exemplo, alface americana com 12 ou 16 unidades, crespa com 18 ou 24 e couve manteiga com 24 maços. Misturar séries antes/depois da mudança sem conversão gera preço falso. ([Nota Técnica SEDES 005/2022](https://ceagesp.gov.br/wp-content/uploads/2022/06/Nota-t%C3%A9cnica-005-mudan%C3%A7a-no-sistema-e-cota%C3%A7%C3%A3o-MLP-verduras-01_06_22-SEDES.pdf))

A própria CEAGESP mantém classificação comercial e o Hortipedia com variedade, peso/embalagem mais comum, classificação, sazonalidade e padrão mínimo. A “classe de valoração” diferencia tamanhos com valores distintos; por isso a junção de preço deve usar a chave completa e nunca apenas “tomate”, “alface” ou “cenoura”. ([classificação](https://ceagesp.gov.br/classificacao/), [tutorial Hortipedia](https://ceagesp.gov.br/hortiescolha/tutorial/), [padrão mínimo](https://ceagesp.gov.br/hortiescolha/padrao-minimo/))

Limite de integração: a CEAGESP declara que não está no escopo do Decreto 8.777/2016 de dados abertos e seu rodapé declara direitos reservados. Não foi localizada API oficial ou licença específica para redistribuição automatizada das cotações. Antes de scraping, cache em massa ou uso comercial, solicitar autorização à SEDES; até lá, usar valor informado manualmente/on-demand com link e data, sem republicar a base. ([posição sobre dados abertos](https://ceagesp.gov.br/acesso-a-informacao/dados-abertos/), [contato SEDES](https://ceagesp.gov.br/cotacoes))

### 2.2 Conab/Prohort

Como benchmark histórico concreto, o Boletim Hortigranjeiro de julho de 2026 publicou para a CEAGESP–São Paulo preço médio de **R$ 4,53/kg de alface em junho de 2026**. É uma média mensal atacadista e já está fora de uma janela operacional de 14 dias em 19/08/2026; serve para testar proveniência e o estado `historical_only`, não para afirmar preço atual. ([Conab, Boletim Hortigranjeiro julho/2026](https://www.gov.br/conab/pt-br/atuacao/informacoes-agropecuarias/hortigranjeiros-prohort/boletim-hortigranjeiro/boletim-hortigranjeiro-2026/boletim-hortigranjeiro_julho-2026-versao-final.pdf/@@download/file))

A Norma 30.305 define:

- **preço modal**: valor observado com maior frequência; **preço médio ponderado**: média ponderada pela quantidade comercializada em kg por variedade; **origem**: município extraído da nota fiscal. ([conceitos, pp. 3–4](https://www.gov.br/conab/pt-br/acesso-a-informacao/institucional/atos-normativos/normas-da-organizacao/operacoes/30-305_norma_captacao_divulgacao_dados_comercializacao_20_9_23.pdf))
- A coleta deve cobrir a variedade/classificação de maior volume, diariamente ou nos dias de maior comercialização, preferencialmente em três períodos e tanto no Mercado Livre do Produtor quanto nos boxes; o preço diário resultante é modal. A Ceasa revisa a série, sazonalidade e outliers antes do envio. ([metodologia, pp. 7–8](https://www.gov.br/conab/pt-br/acesso-a-informacao/institucional/atos-normativos/normas-da-organizacao/operacoes/30-305_norma_captacao_divulgacao_dados_comercializacao_20_9_23.pdf))
- Cada entreposto converte embalagens para R$/kg, R$/unidade ou R$/dúzia; preços diários aparecem na consulta em até seis horas após o lançamento. O painel guarda os últimos três meses e o cubo de preços consulta períodos anteriores. ([publicação, pp. 9 e 11](https://www.gov.br/conab/pt-br/acesso-a-informacao/institucional/atos-normativos/normas-da-organizacao/operacoes/30-305_norma_captacao_divulgacao_dados_comercializacao_20_9_23.pdf))
- O SIMAB oferece preço médio ponderado (R$/kg), quantidade (kg), valor (R$) e origem; atualiza durante a madrugada e mantém cinco anos no cubo, com dados anteriores solicitáveis por e-mail. ([SIMAB, pp. 12–13](https://www.gov.br/conab/pt-br/acesso-a-informacao/institucional/atos-normativos/normas-da-organizacao/operacoes/30-305_norma_captacao_divulgacao_dados_comercializacao_20_9_23.pdf))

Limitações: os dados são enviados pelas próprias Ceasas, corresponsáveis por integridade e fidelidade; o painel público é Power BI e não foi localizada API REST de exportação documentada. O site da Conab está sob CC BY-ND 3.0, mas não está explícito se essa licença se estende aos dados exportados pelos painéis ou permite gerar e redistribuir uma base derivada em SaaS. Confirmar por escrito com `prohort@conab.gov.br` antes de ingestão comercial em massa. ([responsabilidade na Norma 30.305, p. 16](https://www.gov.br/conab/pt-br/acesso-a-informacao/institucional/atos-normativos/normas-da-organizacao/operacoes/30-305_norma_captacao_divulgacao_dados_comercializacao_20_9_23.pdf), [página e contatos do Prohort](https://www.gov.br/conab/pt-br/atuacao/informacoes-agropecuarias/hortigranjeiros-prohort), [licença do site](https://www.gov.br/conab/pt-br/acesso-a-informacao/institucional/atos-normativos/normas-da-organizacao/institucional))

### 2.3 Contrato de observação de preço

```ts
type PriceObservation = {
  source: "ceagesp" | "prohort";
  sourceUrl: string;
  market: string;
  marketLevel: "wholesale";
  observedAt: string;
  fetchedAt: string;
  product: {
    cropId: string;
    name: string;
    variety: string;
    class: string;
    quality: string;
  };
  original: {
    package: string;
    amount: number;
    unit: "BRL/package" | "BRL/kg" | "BRL/unit" | "BRL/dozen";
    netWeightKg?: number;
    lower?: number;
    commonOrModal: number;
    upper?: number;
  };
  normalized?: {
    lower?: number;
    reference: number;
    upper?: number;
    unit: "BRL/kg";
  };
  conversion: { rule: string; sourceUrl?: string } | null;
  qualityFlags: string[];
  rawHash: string;
};
```

Uma observação sem peso líquido oficial não é convertida de caixa/unidade/dúzia para kg. Ela continua útil na unidade original, mas não participa de comparação por kg.

### 2.4 Método determinístico de referência

1. **Mercado primeiro:** o canal informado pelo agricultor define o mercado. ETSP usa CEAGESP capital; outro entreposto usa Prohort/mesmo entreposto. Se o canal for desconhecido, exibir mercados separados; nunca tirar média entre São Paulo e São José dos Campos como se fossem o mesmo preço.
2. **Chave exata:** selecionar mesma cultura, variedade/grupo, classe/tamanho, qualidade e embalagem. Uma equivalência só entra se houver regra oficial documentada; registrar o link da conversão.
3. **Normalização:** converter para R$/kg apenas com peso líquido oficial da embalagem. Prohort já oferece o padrão por produto; CEAGESP usa sua ficha/nota técnica.
4. **Janela:** pegar até as três observações válidas mais recentes dentro de 14 dias corridos. `preco_referencia` é a mediana dos valores `Comum` (CEAGESP) ou modais (Prohort). Com uma observação, retornar o valor com confiança baixa; sem observação em 14 dias, retornar `sem_referencia_atual`, não carregar silenciosamente preço antigo.
5. **Faixa de mercado:** CEAGESP = mediana de `Menor` a mediana de `Maior`; Prohort = mínimo e máximo das até três observações modais. Esta faixa mede dispersão observada, não intervalo estatístico nem garantia de venda.
6. **Fonte principal única:** não misturar CEAGESP e Prohort no número central, pois as metodologias e universos diferem. A outra fonte aparece apenas como benchmark identificado.
7. **Rastreabilidade:** retornar observações usadas, descartadas e motivo, data/hora, unidade original, conversão, fonte, mercado, correspondência de qualidade e fórmula.

### 2.5 Preço líquido ao produtor

O preço atacadista não pode ser rebatizado como preço líquido. O cálculo do MVP deve exigir ou assumir explicitamente os custos do canal:

```text
receita_bruta = quantidade_vendavel_kg × preco_referencia_atacado_kg

receita_liquida_canal = receita_bruta
  - receita_bruta × (comissao_pct + tributos_pct + desconto_intermediario_pct)
  - quantidade_embarcada_kg × (frete_brl_kg + embalagem_brl_kg + outras_taxas_brl_kg)

preco_liquido_por_kg_vendavel = receita_liquida_canal / quantidade_vendavel_kg
preco_liquido_por_kg_colhido = receita_liquida_canal / quantidade_colhida_kg
```

`quantidade_vendavel_kg = quantidade_colhida_kg × (1 - perda_pos_colheita_pct)`. O segundo preço incorpora a perda e é o mais honesto para comparar culturas. Investimento de produção (mudas/sementes, fertilização, defensivos, irrigação, mão de obra) não altera o preço líquido do canal; entra depois em `margem = receita_liquida_canal - investimento_producao`.

Se comissão, frete, embalagem, tributos, desconto do intermediário ou perda não forem informados, o MVP deve produzir três cenários configurados (`otimista`, `base`, `conservador`) e listar cada percentual como **hipótese**, nunca como dado oficial. A faixa líquida é a fórmula aplicada aos limites inferior e superior da referência e aos cenários de custo.

### 2.6 Confiança e incerteza de preço

| Confiança      | Condições mínimas                                                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Alta           | Mesmo mercado/canal, chave exata, unidade oficial convertida, pelo menos duas observações em 7 dias e todos os custos do canal informados pelo usuário |
| Média          | Chave exata, uma observação ou idade de 8–14 dias, ou um custo de canal baseado em hipótese explícita                                                  |
| Baixa          | Classe/variedade aproximada, outro mercado usado apenas como proxy, unidade não convertível ou maioria dos custos assumida                             |
| Sem referência | Nenhum dado em 14 dias, produto sem correspondência verificável ou licença/acesso impede obter o valor                                                 |

## 3. Decisões recomendadas para o MVP

1. **Automatizar somente integrações documentadas:** MERGE e SAMeT via STAC; CPTEC via XML. Não depender do DBWS, de endpoints internos do INMET, de Power BI reverso ou scraping da CEAGESP.
2. **Separar três papéis climáticos:** MERGE/Cemaden/INMET = observado; CPTEC = previsão; INMET/Defesa Civil = alerta oficial. A interface deve mostrar essas camadas separadas antes de sintetizar risco.
3. **Começar com regras, não IA probabilística:** o Hermes explica e conversa sobre o `ClimateRisk` calculado deterministicamente; ele não inventa limiares nem altera o nível. O motor fica no backend Next.js com perfis agronômicos versionados.
4. **Usar MERGE/SAMeT para o calendário histórico:** calcular chuva e temperatura do ponto nos anos disponíveis, mas exibir número de anos, datas ausentes e versão. SAMeT só entra no operacional quando a coleção estiver com defasagem aceitável.
5. **Cemaden como confirmação e link operacional:** consultar estação ativa/distância no mapa e, para o hackathon, permitir registro manual/importação pequena. Adiar integração automática até existir API/licença confirmadas.
6. **Preço primário escolhido pelo canal:** CEAGESP ETSP se o agricultor declarar venda nesse mercado; Prohort do entreposto escolhido nos demais casos. Sem canal, mostrar comparação, não um “preço local” fictício.
7. **Não automatizar CEAGESP sem autorização:** no demo, aceitar lançamento administrativo do valor e sempre apontar para a página/data; em paralelo solicitar permissão de uso e um formato oficial de exportação.
8. **Preço líquido só com premissas visíveis:** retornar preço atacadista, custos do canal, perdas, preço líquido por kg vendável/colhido e faixa. Nunca prometer rentabilidade com uma cotação isolada.
9. **Guardar proveniência em cada recomendação:** item STAC/URL, data de observação, coleta, unidade, conversão, flags, versão do perfil da cultura e hash. A resposta do Hermes deve citar esses mesmos registros.
10. **Fail closed:** se fonte estiver vencida, faltar peso de embalagem, qualidade não casar ou custo do canal estiver ausente, reduzir confiança ou declarar insuficiência; nunca completar lacunas com um número gerado pelo modelo.

## 4. Incertezas e validações pendentes

- Confirmar no Mapa Interativo do Cemaden quais estações de Mogi estão ativas em 2026, suas coordenadas e distância até cada lote de Jundiapeba; o inventário encontrado apenas comprova registro histórico da estação `353060701A`.
- Confirmar no catálogo atual do INMET qual estação automática ativa é a mais próxima de cada lote e medir a disponibilidade real das variáveis antes de decidir qualquer ingestão recorrente.
- Medir por sete dias a latência real de MERGE e SAMeT. A defasagem observada nesta pesquisa é um retrato, não um SLA oficial.
- Solicitar ao INPE/CPTEC SLA e política de uso do XML; o portal de dados abertos do INPE cobre conjuntos de tempo/clima, mas a página XML não exibe licença específica. ([dados abertos INPE](https://www.gov.br/inpe/pt-br/acesso-a-informacao/dados-abertos), [XML CPTEC](https://servicos.cptec.inpe.br/XML/))
- Solicitar ao Cemaden licença explícita para os arquivos de pluviômetros. O conteúdo do site gov.br está em CC BY-ND 3.0, mas isso não esclarece sozinho os direitos de redistribuição de uma base derivada dos downloads. ([FAQ/licença do site](https://www.gov.br/cemaden/pt-br/paginas/historico-da-criacao-do-cemaden))
- Solicitar à SEDES/CEAGESP autorização e, idealmente, exportação oficial estruturada das cotações; sua página de dados abertos não concede essa permissão.
- Confirmar com a Conab se dados exportados do Prohort/Power BI podem ser armazenados, transformados em preço líquido e redistribuídos comercialmente, e obter canal de exportação documentado.
- Os percentuais de perdas, frete, embalagem, comissão, intermediação e tributos precisam vir do agricultor, associação/cooperativa ou pesquisa de campo local. Nenhuma das bases de cotação pesquisadas fornece esses custos por produtor.
- O contrato climático depende de perfis de cultura/fase com limiares agronômicos versionados. Sem esse outro conjunto de pesquisa, as fontes climáticas informam condições, mas não decidem sozinhas se plantar.
