import type { Fonte, ObservacaoMercado, PerfilCultura, TarefaCalendario } from "./types";

/** source-catalog.v1 — catálogo de fontes da demo, consultadas em 19/08/2026. */
export const SOURCE_CATALOG_VERSION = "source-catalog.v1";
export const fontes: Fonte[] = [
  { id: "fgv-cinturao", titulo: "Cinturão Verde e diagnóstico do Alto Tietê", emissor: "FGV EAESP", url: "https://eaesp.fgv.br/sites/eaesp.fgv.br/files/u641/fgvces-cinturaoverde.pdf", consultadoEm: "2026-08-19", flag: "official" },
  { id: "embrapa-c47", titulo: "Circular Técnica 47 — produção de hortaliças folhosas", emissor: "Embrapa", url: "https://www.embrapa.br", consultadoEm: "2026-08-19", flag: "official" },
  { id: "cati", titulo: "Orientações técnicas de olericultura", emissor: "CATI/SP", url: "https://www.cati.sp.gov.br", consultadoEm: "2026-08-19", flag: "official" },
  { id: "mapa-agrofit", titulo: "AGROFIT — consulta de registro (uso restrito a responsável técnico)", emissor: "MAPA", url: "https://agrofit.agricultura.gov.br", consultadoEm: "2026-08-19", flag: "official" },
  { id: "inpe-merge", titulo: "MERGE — precipitação observada", emissor: "INPE", url: "https://ftp.cptec.inpe.br/modelos/tempo/MERGE/", consultadoEm: "2026-08-19", flag: "official" },
  { id: "inpe-samet", titulo: "SAMeT — temperatura histórica", emissor: "INPE", url: "https://ftp.cptec.inpe.br/modelos/tempo/SAMeT/", consultadoEm: "2026-08-19", flag: "official" },
  { id: "cptec", titulo: "Previsão municipal — Mogi das Cruzes (cód. 3306)", emissor: "CPTEC/INPE", url: "https://www.cptec.inpe.br", consultadoEm: "2026-08-19", flag: "official" },
  { id: "cemaden", titulo: "Alertas de risco geo-hidrológico", emissor: "Cemaden", url: "https://www.cemaden.gov.br", consultadoEm: "2026-08-19", flag: "official" },
  { id: "inmet", titulo: "Estações e normais climatológicas", emissor: "INMET", url: "https://portal.inmet.gov.br", consultadoEm: "2026-08-19", flag: "official" },
  { id: "ceagesp", titulo: "Cotações atacadistas — entreposto SP", emissor: "CEAGESP", url: "https://ceagesp.gov.br", consultadoEm: "2026-08-19", flag: "official" },
  { id: "conab-prohort", titulo: "Boletim Prohort — hortigranjeiros (jul/2026)", emissor: "Conab", url: "https://www.conab.gov.br", consultadoEm: "2026-08-19", flag: "official" },
];

export function fonte(id: string): Fonte {
  const f = fontes.find((x) => x.id === id);
  if (!f) throw new Error(`sourceId inexistente: ${id}`);
  return f;
}

/** crop-profiles.v1 — matriz executável (Circular Técnica 47/Embrapa; datas são referência ampla para o Sudeste). */
export const CROP_PROFILES_VERSION = "crop-profiles.v1";
export const perfis: PerfilCultura[] = [
  {
    id: "alface",
    nome: "Alface",
    version: CROP_PROFILES_VERSION,
    sourceIds: ["embrapa-c47", "fgv-cinturao"],
    janelas: [
      { label: "abr–jun", meses: [4, 5, 6], exigeCultivarVerao: false },
      { label: "ago–fev (cultivar de verão)", meses: [8, 9, 10, 11, 12, 1, 2], exigeCultivarVerao: true },
    ],
    cicloMinDias: 60,
    cicloMaxDias: 90,
    cicloVeraoMinDias: 60,
    cicloVeraoMaxDias: 80,
    espacamento: "0,25 × 0,25 m",
    densidadePlantasM2: 16,
    volumeFgvRank: 1,
  },
  {
    id: "repolho",
    nome: "Repolho",
    version: CROP_PROFILES_VERSION,
    sourceIds: ["embrapa-c47", "fgv-cinturao"],
    janelas: [
      { label: "abr–jun", meses: [4, 5, 6], exigeCultivarVerao: false },
      { label: "ago–fev (cultivar de verão)", meses: [8, 9, 10, 11, 12, 1, 2], exigeCultivarVerao: true },
    ],
    cicloMinDias: 85,
    cicloMaxDias: 95,
    cicloVeraoMinDias: 85,
    cicloVeraoMaxDias: 90,
    espacamento: "0,80 × 0,40 m",
    densidadePlantasM2: 3.1,
    volumeFgvRank: 2,
  },
  {
    id: "couve",
    nome: "Couve",
    version: CROP_PROFILES_VERSION,
    sourceIds: ["embrapa-c47", "fgv-cinturao"],
    janelas: [{ label: "abr–jun", meses: [4, 5, 6], exigeCultivarVerao: false }],
    cicloMinDias: 70,
    cicloMaxDias: 90,
    cicloVeraoMinDias: null,
    cicloVeraoMaxDias: null,
    espacamento: "0,90 × 0,50 m",
    densidadePlantasM2: 2.2,
    volumeFgvRank: 3,
  },
];

export function perfil(id: string): PerfilCultura {
  const p = perfis.find((x) => x.id === id);
  if (!p) throw new Error(`perfil inexistente: ${id}`);
  return p;
}

/** Calendário de tratos por cultura — offsets relativos ao plantio. */
export const calendarios: Record<string, TarefaCalendario[]> = {
  alface: [
    { nome: "Transplante das mudas", offsetMinDias: 0, offsetMaxDias: 0, condicao: null, nivel: "geral", sourceId: "embrapa-c47" },
    { nome: "Irrigação diária leve", offsetMinDias: 0, offsetMaxDias: 15, condicao: "ajustar pela chuva observada", nivel: "geral", sourceId: "embrapa-c47" },
    { nome: "Capina e amontoa", offsetMinDias: 15, offsetMaxDias: 25, condicao: null, nivel: "geral", sourceId: "embrapa-c47" },
    { nome: "Adubação de cobertura (categoria; dose depende de análise de solo)", offsetMinDias: 20, offsetMaxDias: 30, condicao: "exige análise de solo", nivel: "revisao_tecnica", sourceId: "embrapa-c47" },
    { nome: "Monitoramento de pragas (sem prescrição; acionar responsável técnico)", offsetMinDias: 10, offsetMaxDias: 55, condicao: null, nivel: "revisao_tecnica", sourceId: "mapa-agrofit" },
    { nome: "Colheita", offsetMinDias: 60, offsetMaxDias: 80, condicao: "cultivar de verão", nivel: "geral", sourceId: "embrapa-c47" },
  ],
  repolho: [
    { nome: "Transplante das mudas", offsetMinDias: 0, offsetMaxDias: 0, condicao: null, nivel: "geral", sourceId: "embrapa-c47" },
    { nome: "Irrigação por aspersão", offsetMinDias: 0, offsetMaxDias: 60, condicao: "ajustar pela chuva observada", nivel: "geral", sourceId: "embrapa-c47" },
    { nome: "Capina", offsetMinDias: 20, offsetMaxDias: 35, condicao: null, nivel: "geral", sourceId: "embrapa-c47" },
    { nome: "Adubação de cobertura (categoria; dose depende de análise de solo)", offsetMinDias: 25, offsetMaxDias: 40, condicao: "exige análise de solo", nivel: "revisao_tecnica", sourceId: "embrapa-c47" },
    { nome: "Monitoramento de pragas (sem prescrição; acionar responsável técnico)", offsetMinDias: 15, offsetMaxDias: 80, condicao: null, nivel: "revisao_tecnica", sourceId: "mapa-agrofit" },
    { nome: "Colheita", offsetMinDias: 85, offsetMaxDias: 90, condicao: "cultivar de verão", nivel: "geral", sourceId: "embrapa-c47" },
  ],
  couve: [
    { nome: "Transplante das mudas", offsetMinDias: 0, offsetMaxDias: 0, condicao: null, nivel: "geral", sourceId: "embrapa-c47" },
    { nome: "Irrigação regular", offsetMinDias: 0, offsetMaxDias: 60, condicao: "ajustar pela chuva observada", nivel: "geral", sourceId: "embrapa-c47" },
    { nome: "Capina", offsetMinDias: 20, offsetMaxDias: 30, condicao: null, nivel: "geral", sourceId: "embrapa-c47" },
    { nome: "Adubação de cobertura (categoria; dose depende de análise de solo)", offsetMinDias: 25, offsetMaxDias: 40, condicao: "exige análise de solo", nivel: "revisao_tecnica", sourceId: "embrapa-c47" },
    { nome: "Colheita escalonada", offsetMinDias: 70, offsetMaxDias: 90, condicao: null, nivel: "geral", sourceId: "embrapa-c47" },
  ],
};

/** climate-snapshot-2026-08-19 — metadados dos produtos INPE consultados em 19/08/2026. */
export const CLIMATE_SNAPSHOT_VERSION = "climate-snapshot-2026-08-19";
export const climateSnapshot = {
  version: CLIMATE_SNAPSHOT_VERSION,
  consultadoEm: "2026-08-19",
  centroide: "Jundiapeba, Mogi das Cruzes — SP (aproximado)",
  mergeDiarioAte: "2026-08-17",
  mergeHorarioAte: "2026-08-18T16:00:00Z",
  sametHistoricoAte: "2026-07-20",
  cptecMunicipio: "Mogi das Cruzes (cód. 3306)",
  cptecValidadeHoras: 36,
  previsao7dias: {
    resumo: "Predomínio de tempo seco com madrugadas frias; possibilidade de geada fraca em áreas baixas.",
    risco: "moderado" as const,
    acaoPreventiva: "Proteger mudas recém-transplantadas nas madrugadas mais frias e conferir os alertas oficiais antes do transplante.",
    flag: "synthetic_demo" as const,
  },
  climatologiaAgoSet: {
    resumo: "Climatologia MERGE/SAMeT do período indica baixa chuva acumulada e amplitude térmica alta em agosto e setembro.",
    flag: "official" as const,
  },
};

/** market-observations.v1 — observações curadas manualmente; nenhuma satisfaz a janela de 14 dias em 19/08/2026. */
export const MARKET_OBSERVATIONS_VERSION = "market-observations.v1";
export const observacoesMercado: ObservacaoMercado[] = [
  {
    id: "obs-alface-conab-jun26",
    cultura: "alface",
    classe: "crespa",
    embalagem: "caixa plástica",
    netWeightKg: 1,
    precoCentavos: 453,
    unidade: "R$/kg",
    praca: "CEAGESP — entreposto SP",
    tipoPreco: "atacado",
    observedAt: "2026-06-30",
    sourceId: "conab-prohort",
    flag: "historical_only",
  },
];

/** demo-economic-scenario.v1 — cenário SIMULADO para provar a matemática. Rotular sempre como DADOS SIMULADOS. */
export const DEMO_SCENARIO_VERSION = "demo-economic-scenario.v1";
export const cenarioSimulado = {
  version: DEMO_SCENARIO_VERSION,
  flag: "synthetic_demo" as const,
  areaM2: 1000,
  quantidadeColhidaKg: 1000,
  perdaPosColheitaPct: 10,
  precoAtacadoCentavosKg: 400,
  comissaoPct: 10,
  embalagemCentavos: 10000,
  freteCentavos: 20000,
  outrosCentavos: 0,
  tributosCentavos: 0,
  investimentoCentavos: 200000,
  esperado: {
    quantidadeVendavelKg: 900,
    receitaBrutaCentavos: 360000,
    receitaLiquidaCentavos: 294000,
    precoLiquidoPorKgColhidoCentavos: 294,
    resultadoBrutoCentavos: 94000,
  },
};

/** Itens de custo de referência por cultura (editáveis na UI; estimativas, não recomendação financeira). */
export const custosReferencia: Record<string, { itens: { id: string; nome: string; unidade: string; quantidadePorHa: number; custoUnitarioCentavos: number; categoriaSemDose: boolean }[] }> = {
  alface: {
    itens: [
      { id: "mudas", nome: "Mudas", unidade: "milheiro/ha", quantidadePorHa: 160, custoUnitarioCentavos: 8000, categoriaSemDose: false },
      { id: "adubacao", nome: "Adubação e corretivos (categoria; sem dose sem análise de solo)", unidade: "verba/ha", quantidadePorHa: 1, custoUnitarioCentavos: 450000, categoriaSemDose: true },
      { id: "maoDeObra", nome: "Mão de obra do ciclo", unidade: "diária/ha", quantidadePorHa: 60, custoUnitarioCentavos: 12000, categoriaSemDose: false },
      { id: "irrigacao", nome: "Água e energia de irrigação", unidade: "verba/ha", quantidadePorHa: 1, custoUnitarioCentavos: 120000, categoriaSemDose: false },
      { id: "embalagemCampo", nome: "Caixas e embalagem de campo", unidade: "verba/ha", quantidadePorHa: 1, custoUnitarioCentavos: 90000, categoriaSemDose: false },
    ],
  },
  repolho: {
    itens: [
      { id: "mudas", nome: "Mudas", unidade: "milheiro/ha", quantidadePorHa: 31, custoUnitarioCentavos: 9000, categoriaSemDose: false },
      { id: "adubacao", nome: "Adubação e corretivos (categoria; sem dose sem análise de solo)", unidade: "verba/ha", quantidadePorHa: 1, custoUnitarioCentavos: 500000, categoriaSemDose: true },
      { id: "maoDeObra", nome: "Mão de obra do ciclo", unidade: "diária/ha", quantidadePorHa: 70, custoUnitarioCentavos: 12000, categoriaSemDose: false },
      { id: "irrigacao", nome: "Água e energia de irrigação", unidade: "verba/ha", quantidadePorHa: 1, custoUnitarioCentavos: 150000, categoriaSemDose: false },
      { id: "embalagemCampo", nome: "Caixas e embalagem de campo", unidade: "verba/ha", quantidadePorHa: 1, custoUnitarioCentavos: 80000, categoriaSemDose: false },
    ],
  },
  couve: {
    itens: [
      { id: "mudas", nome: "Mudas", unidade: "milheiro/ha", quantidadePorHa: 22, custoUnitarioCentavos: 9500, categoriaSemDose: false },
      { id: "adubacao", nome: "Adubação e corretivos (categoria; sem dose sem análise de solo)", unidade: "verba/ha", quantidadePorHa: 1, custoUnitarioCentavos: 420000, categoriaSemDose: true },
      { id: "maoDeObra", nome: "Mão de obra do ciclo", unidade: "diária/ha", quantidadePorHa: 65, custoUnitarioCentavos: 12000, categoriaSemDose: false },
      { id: "irrigacao", nome: "Água e energia de irrigação", unidade: "verba/ha", quantidadePorHa: 1, custoUnitarioCentavos: 130000, categoriaSemDose: false },
      { id: "embalagemCampo", nome: "Caixas e embalagem de campo", unidade: "verba/ha", quantidadePorHa: 1, custoUnitarioCentavos: 70000, categoriaSemDose: false },
    ],
  },
};
