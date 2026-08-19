export type Cultura = "alface" | "repolho" | "couve";
export type Irrigacao = "sem" | "aspersao" | "gotejamento";
export type Canal = "venda_direta" | "cooperativa" | "atravessador" | "atacado";
export type Modo = "explorar" | "avaliar";

export type Proveniencia = "official" | "user_input" | "synthetic_demo";

export interface Fonte {
  id: string;
  titulo: string;
  emissor: string;
  url: string;
  consultadoEm: string; // ISO date
  flag: Proveniencia;
}

export interface JanelaPlantio {
  label: string;
  meses: number[]; // 1-12
  exigeCultivarVerao: boolean;
}

export interface PerfilCultura {
  id: Cultura;
  nome: string;
  version: string;
  sourceIds: string[];
  janelas: JanelaPlantio[];
  cicloMinDias: number;
  cicloMaxDias: number;
  cicloVeraoMinDias: number | null;
  cicloVeraoMaxDias: number | null;
  espacamento: string;
  densidadePlantasM2: number;
  volumeFgvRank: number; // 1 = maior volume regional
}

export interface EntradaPlano {
  modo: Modo;
  cultura: Cultura | null;
  areaValor: number;
  areaUnidade: "m2" | "ha";
  dataPlantio: string; // ISO date
  irrigacao: Irrigacao | null;
  canal: Canal | null;
}

export type StatusCandidato = "elegivel" | "condicional" | "nao_elegivel";

export interface Candidato {
  cultura: Cultura;
  nome: string;
  status: StatusCandidato;
  motivos: string[];
  pendencias: string[];
  colheitaInicioDias: number | null;
  colheitaFimDias: number | null;
  sourceIds: string[];
}

export interface ResultadoElegibilidade {
  ok: boolean;
  erro: string | null;
  areaM2: number;
  candidatos: Candidato[];
  destaque: Cultura | null;
  avisoDestaque: string;
  pendenciasGerais: string[];
}

export interface TarefaCalendario {
  nome: string;
  offsetMinDias: number;
  offsetMaxDias: number;
  condicao: string | null;
  nivel: "geral" | "revisao_tecnica";
  sourceId: string;
}

export interface ItemCusto {
  id: string;
  nome: string;
  unidade: string;
  quantidadePorHa: number;
  custoUnitarioCentavos: number;
  categoriaSemDose: boolean;
}

export interface CenarioEconomicoEntrada {
  areaM2: number;
  quantidadeColhidaKg: number;
  perdaPosColheitaPct: number;
  precoAtacadoCentavosKg: number;
  comissaoPct: number;
  embalagemCentavos: number;
  freteCentavos: number;
  outrosCentavos: number;
  tributosCentavos: number;
  investimentoCentavos: number;
}

export interface CenarioEconomicoSaida {
  quantidadeVendavelKg: number;
  receitaBrutaCentavos: number;
  deducoesCentavos: number;
  receitaLiquidaCentavos: number;
  precoLiquidoPorKgColhidoCentavos: number;
  resultadoBrutoCentavos: number;
}

export type NivelRisco = "desconhecido" | "baixo" | "moderado" | "alto";

export interface AvaliacaoClima {
  regime: "previsao" | "climatologia" | "observado";
  fonteLabel: string;
  risco: NivelRisco;
  mensagem: string;
  acaoPreventiva: string | null;
  sourceIds: string[];
}

export interface ObservacaoMercado {
  id: string;
  cultura: Cultura;
  classe: string | null;
  embalagem: string | null;
  netWeightKg: number | null;
  precoCentavos: number;
  unidade: string;
  praca: string;
  tipoPreco: "atacado";
  observedAt: string;
  sourceId: string;
  flag: Proveniencia | "historical_only";
}

export interface ResultadoMercado {
  status: "ok" | "dados_insuficientes";
  medianaCentavosKg: number | null;
  amostra: number;
  descartes: { id: string; motivo: string }[];
  aviso: string;
}
