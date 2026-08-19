import type { CenarioEconomicoEntrada, CenarioEconomicoSaida, ItemCusto } from "./types";

/** Dinheiro sempre em centavos inteiros; arredondamento só na última etapa de cada linha. */

export function calcularCustoVariavelCentavos(itens: ItemCusto[], areaM2: number): number {
  const areaHa = areaM2 / 10_000;
  return itens.reduce((acc, i) => acc + Math.round(i.quantidadePorHa * areaHa * i.custoUnitarioCentavos), 0);
}

export function calcularCenario(e: CenarioEconomicoEntrada): CenarioEconomicoSaida {
  const quantidadeVendavelKg = e.quantidadeColhidaKg * (1 - e.perdaPosColheitaPct / 100);
  const receitaBrutaCentavos = Math.round(quantidadeVendavelKg * e.precoAtacadoCentavosKg);
  const comissaoCentavos = Math.round((receitaBrutaCentavos * e.comissaoPct) / 100);
  const deducoesCentavos =
    comissaoCentavos + e.tributosCentavos + e.embalagemCentavos + e.freteCentavos + e.outrosCentavos;
  const receitaLiquidaCentavos = receitaBrutaCentavos - deducoesCentavos;
  const precoLiquidoPorKgColhidoCentavos =
    e.quantidadeColhidaKg > 0 ? Math.round(receitaLiquidaCentavos / e.quantidadeColhidaKg) : 0;
  const resultadoBrutoCentavos = receitaLiquidaCentavos - e.investimentoCentavos;
  return {
    quantidadeVendavelKg,
    receitaBrutaCentavos,
    deducoesCentavos,
    receitaLiquidaCentavos,
    precoLiquidoPorKgColhidoCentavos,
    resultadoBrutoCentavos,
  };
}

export function formatBRL(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatKg(kg: number): string {
  return `${kg.toLocaleString("pt-BR")} kg`;
}
