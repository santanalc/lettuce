import { observacoesMercado } from "./seeds";
import type { Cultura, ObservacaoMercado, ResultadoMercado } from "./types";

const JANELA_DIAS = 14;
const DIA_MS = 24 * 60 * 60 * 1000;

/**
 * Referência de preço fail-closed: só entram observações com chave completa,
 * peso líquido conhecido e idade dentro da janela de 14 dias. Mediana de até 3.
 */
export function precoReferencia(cultura: Cultura, hojeISO = "2026-08-19", extras: ObservacaoMercado[] = []): ResultadoMercado {
  const hoje = new Date(`${hojeISO}T12:00:00`).getTime();
  const todas = [...observacoesMercado, ...extras].filter((o) => o.cultura === cultura);
  const descartes: { id: string; motivo: string }[] = [];
  const validas: ObservacaoMercado[] = [];

  for (const o of todas) {
    if (!o.classe || !o.embalagem) {
      descartes.push({ id: o.id, motivo: "chave incompleta (classe/embalagem ausente)" });
      continue;
    }
    if (o.netWeightKg === null || o.netWeightKg <= 0) {
      descartes.push({ id: o.id, motivo: "sem netWeightKg: conversão para R$/kg indisponível" });
      continue;
    }
    const idadeDias = Math.round((hoje - new Date(`${o.observedAt}T12:00:00`).getTime()) / DIA_MS);
    if (o.flag === "historical_only" || idadeDias > JANELA_DIAS) {
      descartes.push({ id: o.id, motivo: `fora da janela de ${JANELA_DIAS} dias (idade: ${idadeDias} dias)` });
      continue;
    }
    validas.push(o);
  }

  validas.sort((a, b) => (a.observedAt < b.observedAt ? 1 : a.observedAt > b.observedAt ? -1 : a.id.localeCompare(b.id)));
  const amostraSel = validas.slice(0, 3);

  if (amostraSel.length === 0) {
    return {
      status: "dados_insuficientes",
      medianaCentavosKg: null,
      amostra: 0,
      descartes,
      aviso: "Sem observação atacadista válida nos últimos 14 dias para essa chave. Informe um preço editável e trate-o como premissa sua.",
    };
  }
  const ordenados = amostraSel.map((o) => Math.round(o.precoCentavos / (o.netWeightKg ?? 1))).sort((a, b) => a - b);
  const mid = Math.floor(ordenados.length / 2);
  const mediana = ordenados.length % 2 ? ordenados[mid]! : Math.round((ordenados[mid - 1]! + ordenados[mid]!) / 2);
  return {
    status: "ok",
    medianaCentavosKg: mediana,
    amostra: amostraSel.length,
    descartes,
    aviso: "Referência atacadista. Não é preço na porteira nem promessa de venda.",
  };
}
