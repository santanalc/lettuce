import { climateSnapshot } from "./seeds";
import type { AvaliacaoClima } from "./types";

const DIA_MS = 24 * 60 * 60 * 1000;

/**
 * Semântica temporal fechada do blueprint:
 * até +7 dias → previsão CPTEC municipal; depois de +7 dias → somente
 * climatologia histórica com risco operacional "desconhecido"; passado → observado.
 */
export function avaliarClima(dataPlantioISO: string, hojeISO = "2026-08-19"): AvaliacaoClima {
  const hoje = new Date(`${hojeISO}T12:00:00`);
  const data = new Date(`${dataPlantioISO}T12:00:00`);
  const deltaDias = Math.round((data.getTime() - hoje.getTime()) / DIA_MS);

  if (deltaDias < 0) {
    return {
      regime: "observado",
      fonteLabel: `MERGE observado até ${climateSnapshot.mergeDiarioAte} · snapshot ${climateSnapshot.version}`,
      risco: "desconhecido",
      mensagem: "Data no passado: valem apenas observações registradas. Previsão retroativa não existe.",
      acaoPreventiva: null,
      sourceIds: ["inpe-merge"],
    };
  }
  if (deltaDias <= 7) {
    const p = climateSnapshot.previsao7dias;
    return {
      regime: "previsao",
      fonteLabel: `CPTEC — ${climateSnapshot.cptecMunicipio} · validade ${climateSnapshot.cptecValidadeHoras}h · cenário rotulado ${p.flag}`,
      risco: p.risco,
      mensagem: p.resumo,
      acaoPreventiva: p.acaoPreventiva,
      sourceIds: ["cptec", "cemaden"],
    };
  }
  return {
    regime: "climatologia",
    fonteLabel: `Climatologia MERGE/SAMeT do período · snapshot ${climateSnapshot.version}`,
    risco: "desconhecido",
    mensagem: `${climateSnapshot.climatologiaAgoSet.resumo} Não existe previsão para além de 7 dias; o risco operacional fica como desconhecido.`,
    acaoPreventiva: "Reavaliar a previsão quando a data estiver a menos de 7 dias.",
    sourceIds: ["inpe-merge", "inpe-samet"],
  };
}
