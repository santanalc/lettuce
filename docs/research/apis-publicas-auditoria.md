# Auditoria de APIs públicas — clima, solo, agro e produção

Complementa [`clima-precos-alto-tiete.md`](clima-precos-alto-tiete.md), que estabelece a matriz de fontes e os contratos de risco e preço. Este documento é a camada de baixo: **cada endpoint abaixo foi chamado em 19/08/2026 e o código de resposta registrado.** Nenhum foi copiado de documentação.

Serve para quem vai escrever o cliente HTTP — traz URL completa, parâmetros validados, armadilhas de encoding e cabeçalho, e as fontes que aparecem em toda lista da internet e **não funcionam mais**.

Coordenadas de referência: Jundiapeba, Mogi das Cruzes (`-23.54528, -46.26139`).

## Três achados que afetam o MVP

**1. Nenhuma previsão alcança a janela de colheita.** Alface plantada em 19/08/2026 colhe entre 18/10 e 07/11. A previsão mais longa disponível vai até 02/09. Todo o risco climático do ciclo é climatologia, nunca previsão — a tela de risco precisa refletir isso.

**2. O CPTEC entregou 4 dias de previsão, não 7.** Uma regra que assume horizonte de 7 dias fica sem cobertura nos dias 5 a 7.

**3. NASA POWER substitui MERGE/SAMeT.** MERGE e SAMeT do INPE são grades NetCDF em FTP/OPeNDAP — baixar e extrair ponto é dependência frágil para o dia do evento. A climatologia da NASA POWER cobre a mesma necessidade por REST JSON, sem chave, com perfil `community=AG`.

Confirmado também: o `cptecId` **3306** corresponde a Mogi das Cruzes.

## Custo

Tudo nas seções 1 a 8 é **gratuito, sem chave, sem cadastro e sem cartão**. O único custo externo do MVP é a chamada ao provedor de modelo de linguagem.

---

## 1. Open-Meteo

A mais completa. Sem chave, sem limite prático para uso não comercial. [Documentação](https://open-meteo.com/en/docs).

### Família completa — todos testados, HTTP 200

| Endpoint | Uso |
|---|---|
| `https://api.open-meteo.com/v1/forecast` | Previsão até 16 dias |
| `https://geocoding-api.open-meteo.com/v1/search` | Nome → lat/lon |
| `https://archive-api.open-meteo.com/v1/archive` | Histórico ERA5 desde 1940 |
| `https://ensemble-api.open-meteo.com/v1/ensemble` | Ensemble, para incerteza |
| `https://seasonal-api.open-meteo.com/v1/seasonal` | Previsão sazonal |
| `https://flood-api.open-meteo.com/v1/flood` | Vazão de rio |
| `https://air-quality-api.open-meteo.com/v1/air-quality` | PM10, poeira, índice UV |
| `https://marine-api.open-meteo.com/v1/marine` | Ondas |
| `https://climate-api.open-meteo.com/v1/climate` | Projeção climática |

### Exemplo básico

```bash
curl "https://api.open-meteo.com/v1/forecast?latitude=-23.545&longitude=-46.261&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&timezone=America%2FSao_Paulo"
```

### Exemplo agronômico completo

```bash
curl -G "https://api.open-meteo.com/v1/forecast" \
  --data-urlencode "latitude=-23.545" \
  --data-urlencode "longitude=-46.261" \
  --data-urlencode "hourly=temperature_2m,relative_humidity_2m,dew_point_2m,precipitation,vapour_pressure_deficit,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm,soil_moisture_27_to_81cm,evapotranspiration,et0_fao_evapotranspiration,shortwave_radiation,wind_speed_10m,cloud_cover" \
  --data-urlencode "daily=temperature_2m_max,temperature_2m_min,apparent_temperature_min,precipitation_sum,precipitation_hours,precipitation_probability_max,et0_fao_evapotranspiration,shortwave_radiation_sum,uv_index_max,wind_gusts_10m_max,daylight_duration,sunrise,sunset" \
  --data-urlencode "past_days=14" \
  --data-urlencode "forecast_days=16" \
  --data-urlencode "timezone=America/Sao_Paulo"
```

### Multi-ponto numa chamada só

Passe listas separadas por vírgula. A resposta vira um **array** de objetos, na mesma ordem das coordenadas.

```bash
curl "https://api.open-meteo.com/v1/forecast?latitude=-23.65,-23.52,-23.71&longitude=-47.22,-46.19,-47.43&daily=temperature_2m_max&timezone=America%2FSao_Paulo"
```

### Variáveis agronômicas confirmadas

| Grupo | Variáveis |
|---|---|
| Solo — temperatura (°C) | `soil_temperature_0cm` · `_6cm` · `_18cm` · `_54cm` |
| Solo — umidade (m³/m³) | `soil_moisture_0_to_1cm` · `_1_to_3cm` · `_3_to_9cm` · `_9_to_27cm` · `_27_to_81cm` |
| Água | `et0_fao_evapotranspiration` (mm, Penman-Monteith FAO-56) · `evapotranspiration` · `vapour_pressure_deficit` (kPa) |
| Atmosfera | `temperature_2m` · `relative_humidity_2m` · `dew_point_2m` · `precipitation` · `rain` · `showers` · `cloud_cover` · `surface_pressure` · `cape` · `is_day` |
| Radiação | `shortwave_radiation` · `direct_radiation` · `diffuse_radiation` |
| Vento | `wind_speed_10m` · `wind_direction_10m` · `wind_gusts_10m` |

Faixa útil de VPD para hortaliça: **0,4 a 1,2 kPa**.

### Parâmetros de controle

| Parâmetro | Valores |
|---|---|
| `past_days` | 1 a 92 — traz histórico recente junto da previsão |
| `forecast_days` | 1 a 16 |
| `timezone` | `America/Sao_Paulo` ou `auto` |
| `models` | `best_match` · `ecmwf_ifs04` · `icon_seamless` · `gfs_seamless` · `jma_seamless` |
| `cell_selection` | `land` força célula de terra, evita pegar mar |
| `format` | `csv` para saída tabular |

### Geocoding

```bash
curl "https://geocoding-api.open-meteo.com/v1/search?name=Jundiapeba&count=10&language=pt&country=BR"
```

Retorna `latitude`, `longitude`, `elevation`, `admin1` (UF), `admin2` (município), `timezone`, `population` e `feature_code`.

> Filtre `feature_code` que comece com `PPL` (povoado ou cidade) para não pegar aeroporto, fazenda ou estação de trem.

### Resolução espacial

De 1 a 11 km, conforme o modelo. **Não enxerga microclima de vale** — a diferença real entre o fundo do vale, onde o ar frio drena, e o meio da encosta pode passar de 4 °C numa noite de geada, dentro da mesma célula.

---

## 2. NASA POWER

Climatologia e série longa. Sem chave. [Documentação](https://power.larc.nasa.gov/docs/services/api/).

### Série diária, desde 1981

```bash
curl -G "https://power.larc.nasa.gov/api/temporal/daily/point" \
  --data-urlencode "parameters=T2M,T2M_MAX,T2M_MIN,PRECTOTCORR,ALLSKY_SFC_SW_DWN,RH2M,WS2M,T2MDEW" \
  --data-urlencode "community=AG" \
  --data-urlencode "longitude=-46.261" \
  --data-urlencode "latitude=-23.545" \
  --data-urlencode "start=20260101" \
  --data-urlencode "end=20260819" \
  --data-urlencode "format=JSON"
```

### Climatologia — média multianual por mês

O caminho REST para contexto histórico, sem baixar grade NetCDF.

```bash
curl -G "https://power.larc.nasa.gov/api/temporal/climatology/point" \
  --data-urlencode "parameters=T2M,T2M_MAX,T2M_MIN,PRECTOTCORR,RH2M" \
  --data-urlencode "community=AG" \
  --data-urlencode "longitude=-46.261" \
  --data-urlencode "latitude=-23.545" \
  --data-urlencode "format=JSON"
```

Também disponíveis: `/api/temporal/hourly/point` e `/api/temporal/monthly/point`.

### Parâmetros do perfil agrícola

| Parâmetro | Descrição |
|---|---|
| `T2M`, `T2M_MAX`, `T2M_MIN` | Temperatura a 2 m (°C) |
| `T2MDEW` | Ponto de orvalho |
| `T2M_RANGE` | Amplitude térmica |
| `PRECTOTCORR` | Precipitação corrigida (mm/dia) |
| `ALLSKY_SFC_SW_DWN` | Radiação solar incidente (MJ/m²/dia) |
| `CLRSKY_SFC_SW_DWN` | Radiação de céu claro |
| `ALLSKY_SFC_PAR_TOT` | Radiação fotossinteticamente ativa |
| `RH2M` | Umidade relativa (%) |
| `WS2M`, `WS10M` | Vento |
| `GWETTOP`, `GWETROOT`, `GWETPROF` | Umidade de solo: superfície, zona de raiz, perfil |
| `EVPTRNS` | Evapotranspiração |
| `FROST_DAYS` | Dias de geada |

Resolução: 0,5° (~50 km). É climatologia, não previsão de talhão.

### Valores obtidos para Jundiapeba

| Mês | T2M | Tmáx | Tmín | Chuva (mm/dia) | UR (%) |
|---|---|---|---|---|---|
| AGO | 17,7 | 33,2 | 4,1 | 1,18 | 75,4 |
| SET | 19,5 | 38,2 | 4,0 | 2,25 | 74,3 |
| OUT | 20,9 | 38,9 | 8,7 | 3,42 | 76,5 |
| NOV | 21,1 | 35,9 | 10,4 | 5,03 | 79,8 |

Outubro e novembro são exatamente a janela de colheita das três culturas do MVP.

---

## 3. INMET

Oficial brasileiro, medição real em solo. Sem chave.

> **Exige cabeçalho `User-Agent`.** Sem ele a conexão é recusada — e o erro é de *conexão*, não HTTP 4xx, o que confunde o diagnóstico.

### Lista de estações

```bash
curl -A "Mozilla/5.0" "https://apitempo.inmet.gov.br/estacoes/T"   # T = automáticas
curl -A "Mozilla/5.0" "https://apitempo.inmet.gov.br/estacoes/M"   # M = manuais
```

Campos: `CD_ESTACAO`, `DC_NOME`, `SG_ESTADO`, `VL_LATITUDE`, `VL_LONGITUDE`, `VL_ALTITUDE`, `CD_SITUACAO` (Operante / Pane), `DT_INICIO_OPERACAO`.

### Dados horários

```bash
# /estacao/{início}/{fim}/{código}
curl -A "Mozilla/5.0" "https://apitempo.inmet.gov.br/estacao/2026-08-18/2026-08-18/A713"

# todas as estações numa data
curl -A "Mozilla/5.0" "https://apitempo.inmet.gov.br/estacao/dados/2026-08-18"
```

### Previsão por município

```bash
curl -A "Mozilla/5.0" "https://apiprevmet3.inmet.gov.br/previsao/3530607"
```

Retorna manhã, tarde e noite com resumo, `temp_max`, `temp_min`, vento e umidade.

> Traz o ícone do tempo em base64 embutido, o que infla muito o payload. Descarte o campo.

O valor do INMET é ser **medição**, não modelo. Use como contraponto à previsão de grade.

---

## 4. CPTEC / INPE

Oficial brasileiro. Sem chave.

> **XML em ISO-8859-1.** Decodifique explicitamente ou os acentos são corrompidos silenciosamente.
> **Entregou 4 dias de previsão, não 7.** Não assuma horizonte fixo — registre o que veio.

### Buscar o código da cidade

```bash
curl "https://servicos.cptec.inpe.br/XML/listaCidades?city=Mogi" | iconv -f ISO-8859-1 -t UTF-8
```

Mogi das Cruzes = **3306**. Itu = 2644.

### Previsão

```bash
curl "https://servicos.cptec.inpe.br/XML/cidade/3306/previsao.xml" | iconv -f ISO-8859-1 -t UTF-8
```

Campos: `<atualizacao>`, `<dia>`, `<tempo>`, `<maxima>`, `<minima>`, `<iuv>`.

### Outros endpoints

| Caminho | Uso |
|---|---|
| `/XML/cidade/{id}/previsao/{n}dias.xml` | n = 4, 7 ou 14 |
| `/XML/cidade/7dias/{id}/previsaoExtendida.xml` | Estendida |
| `/XML/estacao/{icao}/condicoesAtuais.xml` | Aeroporto, ex. `SBMT` |
| `/XML/cidade/{id}/aguaocean.xml` | Temperatura do mar |
| `/XML/ondas/{id}/dia/{n}/ondas.xml` | Ondas |

### Códigos do campo `<tempo>`

| Código | Significado | Código | Significado |
|---|---|---|---|
| `ec` | Encoberto com chuva | `pc` | Possibilidade de chuva |
| `ci` | Chuvas isoladas | `ps` | Predomínio de sol |
| `c` | Chuva | `e` | Encoberto |
| `pn` | Parcialmente nublado | `n` | Nublado |
| `cm` | Chuva pela manhã | `np` | Nublado com pancadas |
| `pt` | Pancadas de chuva | `t` | Tempestade |
| `nd` | Não definido | | |

---

## 5. SoilGrids / ISRIC

Solo global. Sem chave. Rate limit oficial: 5 requisições por minuto.

### Classificação WRB — funciona

Retornou em 16 de 16 municípios testados.

```bash
curl "https://rest.isric.org/soilgrids/v2.0/classification/query?lon=-46.261&lat=-23.545&number_classes=3"
```

```json
{"wrb_class_name":"Ferralsols","wrb_class_probability":[["Ferralsols",23],["Acrisols",16],["Arenosols",11]]}
```

`Ferralsols` corresponde a **Latossolo** na classificação brasileira.

### Propriedades numéricas — degradado

```bash
curl -G "https://rest.isric.org/soilgrids/v2.0/properties/query" \
  --data-urlencode "lon=-46.261" --data-urlencode "lat=-23.545" \
  --data-urlencode "property=phh2o" --data-urlencode "property=clay" \
  --data-urlencode "property=sand" --data-urlencode "property=soc" \
  --data-urlencode "property=cec" --data-urlencode "property=nitrogen" \
  --data-urlencode "depth=0-5cm" --data-urlencode "depth=5-15cm" \
  --data-urlencode "value=mean"
```

> **Instável.** Testei 16 pontos sequencialmente, 4 tentativas cada com 20 s de intervalo: apenas 1 retornou. Os demais devolvem `"mean": null`. Não é limite de requisição — é o serviço.

| Campo | Valores |
|---|---|
| `property` | `bdod` (densidade) · `cec` (CTC) · `cfvo` (cascalho) · `clay` · `sand` · `silt` · `nitrogen` · `phh2o` · `soc` · `ocd` · `ocs` |
| `depth` | `0-5cm` · `5-15cm` · `15-30cm` · `30-60cm` · `60-100cm` · `100-200cm` |
| `value` | `mean` · `Q0.05` · `Q0.5` · `Q0.95` · `uncertainty` |

> Divida o valor pelo `d_factor` da resposta para obter a unidade real.

Resolução de 250 m, modelo global. Para o Brasil o dado bom está no levantamento pedológico do IAC e da Embrapa Solos. Nenhuma API substitui análise de laboratório.

---

## 6. IBGE

Oficial brasileiro. Sem chave.

> **Responde gzip mesmo sem `Accept-Encoding`.** Trate ou o decode quebra com `UnicodeDecodeError`. Detecte os magic bytes `\x1f\x8b`.

### Localidades — código IBGE canônico

```bash
curl "https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios"
curl "https://servicodados.ibge.gov.br/api/v1/localidades/municipios/3530607"
```

UF 35 = São Paulo. Resolva o código IBGE aqui antes de qualquer outra chamada — acento e grafia variam entre bases.

### SIDRA — Produção Agrícola Municipal

```bash
curl "https://apisidra.ibge.gov.br/values/t/5457/n6/3519709/v/8331,214,112/p/last%201/c782/all/f/n"
```

| Segmento | Significado |
|---|---|
| `t/5457` | Tabela PAM — área, produção e rendimento por cultura |
| `n6/{código}` | Nível município (`n1` Brasil, `n3` UF, `n6` município) |
| `v/8331` | Área plantada. `214` quantidade produzida. `112` rendimento |
| `p/last 1` | Último período, ou `p/2020-2024` |
| `c782/all` | Todas as culturas |
| `f/n` | Formato com nomes |

> Lote com muitos municípios estoura o tempo limite. Uma chamada por município é mais confiável.

### Tabelas SIDRA úteis

| Tabela | Conteúdo |
|---|---|
| `1618` | LSPA — Levantamento Sistemático da Produção Agrícola (mensal) |
| `5457` | PAM — Produção Agrícola Municipal (anual) |
| `1613` | PAM — lavouras permanentes |
| `6588` | Censo Agropecuário 2017 — estabelecimentos |
| `6955` | Censo Agropecuário — horticultura |
| `3939` | Pesquisa da Pecuária Municipal |

Explorar em [sidra.ibge.gov.br](https://sidra.ibge.gov.br/).

> **A PAM não cobre folhosas.** Alface, rúcula, couve e agrião — o carro-chefe do cinturão — não aparecem em nenhuma estatística pública anual do Brasil. O Censo Agropecuário trata horticultura em bloco, e só de dez em dez anos.

---

## 7. GBIF

Biodiversidade e taxonomia. Sem chave.

```bash
curl "https://api.gbif.org/v1/species/search?q=Lactuca%20sativa&limit=5"
curl "https://api.gbif.org/v1/species/match?name=Lactuca%20sativa"
curl "https://api.gbif.org/v1/occurrence/search?scientificName=Bremia%20lactucae&country=BR&limit=20"
```

Uso: identificar praga ou daninha por nome científico e ver ocorrência geográfica registrada.

---

## 8. Wikidata SPARQL

Sem chave. Exige `User-Agent` identificável, senão bloqueia.

```bash
curl -H "Accept: application/json" -A "meu-app/1.0 (contato@exemplo.com)" \
  -G "https://query.wikidata.org/sparql?format=json" \
  --data-urlencode 'query=SELECT ?x WHERE {?x wdt:P31 wd:Q11004} LIMIT 10'
```

Uso: dados estruturados de espécies, nomes vernaculares, taxonomia.

---

## 9. Exigem cadastro

### Embrapa AgroAPI

**A única base aberta em português que responde "o que plantar e como cultivar".** Não existe equivalente.

- Portal: <https://www.agroapi.cnptia.embrapa.br/>
- Token: `POST https://api.cnptia.embrapa.br/token` (OAuth2 — HTTP 405 no GET confirma que existe)

| Módulo | Conteúdo |
|---|---|
| **Agritec** | Época de plantio do ZARC por município e cultura, cultivares indicadas, espaçamento, densidade, recomendação de adubação e calagem |
| **SATVeg** | Série temporal de NDVI e EVI (MODIS) por talhão ou polígono |
| AgroTermos, Ainfo, Pragas | Vocabulário, acervo e fitossanidade |

### Outras

| Fonte | Estado | Uso |
|---|---|---|
| Pl@ntNet | 401 sem chave — está de pé. 500 identificações/dia grátis | Identificação de planta por foto — `https://my-api.plantnet.org/v2/identify/all` |
| Perenual | Freemium | Guias de rega e luz. Base de jardinagem em clima temperado, em inglês — **não serve para olericultura tropical de campo** |
| Plant.id / Kindwise | Pago, com trial | Diagnóstico de doença por foto |
| AgroMonitoring (OpenWeather) | Free tier | NDVI por polígono |
| Copernicus Data Space | Cadastro grátis | Imagem de satélite Sentinel |

---

## 10. Não use — testadas e mortas

Todas aparecem em listas de "APIs de agricultura" e nenhuma funciona.

| Fonte | Estado observado |
|---|---|
| **OpenFarm** (`openfarm.cc/api/v1/crops`) | Descontinuado. Redireciona para o repositório no GitHub. Era a base aberta de guias de cultivo mais citada |
| **Trefle** (`trefle.io/api/v1/plants`) | Responde 401, mas o cadastro de chaves está parado desde 2021 |
| **OpenEPI** (`api.openepi.io`) | `530 Origin DNS error` do Cloudflare em todos os endpoints |
| **dados.gov.br** (CKAN) | Passou a exigir chave — buscas anônimas retornam 401 |
| **Cemaden** | Portal responde, endpoints de dados não. Sem API documentada |
| **SoilGrids** `properties` | Degradado, ver seção 5 |

---

## 11. Sem API REST — portal web

Exigem scraping ou curadoria manual.

| Fonte | Endereço |
|---|---|
| CEAGESP cotações | <https://ceagesp.gov.br/cotacoes/> — POST por grupo e data |
| CEASA / DW | <https://dw.ceasa.gov.br/> |
| AGROFIT (MAPA) | <https://agrofit.agricultura.gov.br/agrofit_cons/principal_agrofit_cons> |
| CEPEA / ESALQ | <https://cepea.esalq.usp.br/> — CSV, sem API oficial |
| INPE MERGE / SAMeT | Grades NetCDF via FTP/OPeNDAP. Substitua por NASA POWER climatology |

### Conab / Prohort

Não é REST convencional. Usa a API CDA do Pentaho, com um único endpoint e seleção de consulta por `dataAccessId`.

```http
POST https://pentahoportaldeinformacoes.conab.gov.br/pentaho/plugin/cda/api/doQuery
Content-Type: application/x-www-form-urlencoded;charset=UTF-8
X-Requested-With: XMLHttpRequest

path=/home/SIAGRO/PrecoMedio.cda&dataAccessId=...&outputIndexId=1
```

`dataAccessId` úteis: `PRODUTO2`, `nivelComercializacao`, `Classificacao`, `Agrupamento`, `Grandeza`, `dataInicialCalendario`, `dataFinalCalendario`.

> Scraping de portal público pode ter restrição de licença ou termo de uso. Verifique antes de usar comercialmente.

---

## 12. Armadilhas — resumo

| Fonte | Comportamento | Efeito se ignorado |
|---|---|---|
| INMET | Recusa conexão sem `User-Agent` | Erro de conexão, não 4xx — confunde o diagnóstico |
| CPTEC | XML em ISO-8859-1 | Acentos corrompidos silenciosamente |
| CPTEC | Entregou 4 dias, não 7 | Regra de horizonte fixo fica descoberta |
| IBGE | Responde gzip sem pedir | `UnicodeDecodeError` na primeira leitura |
| SIDRA | Lote grande estoura o tempo limite | Uma chamada por município |
| SoilGrids | Rate limit de 5 req/min | Erro em coleta paralela |
| SoilGrids | Valor precisa de `d_factor` | Unidade errada por ordem de grandeza |
| Open-Meteo | Multi-ponto retorna array | `TypeError` ao tratar como objeto |
| Wikidata | Exige `User-Agent` identificável | Bloqueio |

---

## 13. Cliente que trata todas as armadilhas

```python
import json, gzip, urllib.request
import xml.etree.ElementTree as ET

UA = {
    "User-Agent": "lettuce/1.0 (contato@exemplo.com)",
    "Accept-Encoding": "identity",
    "Accept": "application/json",
}

def get(url, timeout=90, raw=False):
    """Resolve User-Agent obrigatório (INMET) e gzip não solicitado (IBGE)."""
    r = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout)
    b = r.read()
    if b[:2] == b"\x1f\x8b":            # gzip mesmo com identity
        b = gzip.decompress(b)
    s = b.decode("utf-8", "replace")
    return s if raw else json.loads(s)

def get_xml_cptec(url, timeout=40):
    """CPTEC é ISO-8859-1."""
    r = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout)
    return ET.fromstring(r.read().decode("iso-8859-1"))
```

---

## 14. Fórmulas que transformam o dado em decisão

### Graus-dia acumulados

```
gdd = max(0, (min(Tmax, 35) + max(Tmin, Tbase)) / 2 - Tbase)
```

| Tbase | Culturas |
|---|---|
| 4 °C | Alface, rúcula, brássicas |
| 5 °C | Cenoura, beterraba |
| 6 °C | Cebola |
| 7 °C | Batata |
| 10 °C | Tomate, pimentão, feijão |
| 12 °C | Pepino, abobrinha |

### Lâmina de irrigação

```
irrigacao_mm = ET0 * Kc - chuva
```

Kc na fase de maior demanda: alface 1,00 · tomate 1,15 · batata 1,15 · couve 1,05 · cenoura 1,05 · cebola 1,05 · pepino 1,00.

### Molhamento foliar

Conte as horas em que **UR ≥ 90%**, ou a depressão do ponto de orvalho `(T - Tdew) ≤ 1,5 °C`, ou houve chuva acima de 0,1 mm. Acima de 10 h/dia há pressão de fungo foliar.

### Requeima — DSV de Wallin (BLITECAST)

Severidade diária de *Phytophthora infestans*, pela temperatura média durante o molhamento e a duração dele.

| T média no molhamento | LWD → severidade |
|---|---|
| 7,2 – 11,6 °C | ≥16 h → 1 · ≥19 → 2 · ≥22 → 3 · ≥25 → 4 |
| 11,7 – 15,0 °C | ≥13 h → 1 · ≥16 → 2 · ≥19 → 3 · ≥22 → 4 |
| 15,1 – 26,6 °C | ≥11 h → 1 · ≥15 → 2 · ≥19 → 3 · ≥23 → 4 |

Acumule por dia. **18 pontos indicam início de fungicida.**

### Déficit de pressão de vapor

Faixa útil para hortaliça: 0,4 a 1,2 kPa.

- Acima de 1,6 kPa no período diurno: estresse, fechamento estomático, queima de bordo.
- Abaixo de 0,15 kPa no período noturno: risco de *tipburn* — o cálcio não migra para a borda da folha.

### Geada de relva

```
T_relva ≈ Tmin_abrigo - 4,5 °C   (noite radiativa: nuvem < 40% e vento < 6 km/h)
T_relva ≈ Tmin_abrigo - 1,5 °C   (demais casos)
```

### Janela de pulverização

Vento entre 3 e 10 km/h, UR ≥ 55%, VPD ≤ 1,5 kPa e sem chuva. Vento abaixo de 3 km/h indica inversão térmica e risco de deriva.

### Balanço hídrico

```
balanco = chuva_acumulada - ET0_acumulada    # negativo = irrigar
```

---

_Auditado em 19/08/2026. Seções 1 a 8 são gratuitas, sem chave e sem cadastro._
