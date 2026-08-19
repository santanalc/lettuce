import { avaliarClima } from "./climate";
import { calcularCenario } from "./economics";
import { avaliarElegibilidade, normalizarAreaM2 } from "./eligibility";
import { precoReferencia } from "./market";
import { cenarioSimulado } from "./seeds";
import type { ObservacaoMercado } from "./types";

export interface CheckResult {
  id: string;
  nome: string;
  passou: boolean;
  detalhe: string;
}

/** Fixtures fail-closed do blueprint, executados ao vivo no navegador (aba Admin). */
export function rodarChecks(): CheckResult[] {
  const out: CheckResult[] = [];

  // 1. explore em 19/08/2026 com aspersão: alface antes de repolho; couve excluída pela janela.
  {
    const r = avaliarElegibilidade({
      modo: "explorar",
      cultura: null,
      areaValor: 1000,
      areaUnidade: "m2",
      dataPlantio: "2026-08-19",
      irrigacao: "aspersao",
      canal: "cooperativa",
    });
    const compat = r.candidatos.filter((c) => c.status !== "nao_elegivel").map((c) => c.cultura);
    const couve = r.candidatos.find((c) => c.cultura === "couve");
    const passou = compat[0] === "alface" && compat[1] === "repolho" && couve?.status === "nao_elegivel";
    out.push({
      id: "explore-1908",
      nome: "Explorar em 19/08: alface antes de repolho; couve fora da janela",
      passou,
      detalhe: `ordem=[${compat.join(", ")}] · couve=${couve?.status ?? "?"}`,
    });
  }

  // 2. 1.000 m² e 0,1 ha normalizam para a mesma área e o mesmo resultado.
  {
    const m2 = normalizarAreaM2(1000, "m2");
    const ha = normalizarAreaM2(0.1, "ha");
    const rA = avaliarElegibilidade({ modo: "explorar", cultura: null, areaValor: 1000, areaUnidade: "m2", dataPlantio: "2026-08-19", irrigacao: "aspersao", canal: null });
    const rB = avaliarElegibilidade({ modo: "explorar", cultura: null, areaValor: 0.1, areaUnidade: "ha", dataPlantio: "2026-08-19", irrigacao: "aspersao", canal: null });
    const passou = m2 === ha && m2 === 1000 && JSON.stringify(rA.candidatos) === JSON.stringify(rB.candidatos);
    out.push({ id: "area-normaliza", nome: "1.000 m² ≡ 0,1 ha (mesma área, mesmo resultado)", passou, detalhe: `m2=${m2} · ha=${ha}` });
  }

  // 3. Cenário econômico simulado bate exatamente os valores esperados.
  {
    const s = calcularCenario(cenarioSimulado);
    const e = cenarioSimulado.esperado;
    const passou =
      s.quantidadeVendavelKg === e.quantidadeVendavelKg &&
      s.receitaBrutaCentavos === e.receitaBrutaCentavos &&
      s.receitaLiquidaCentavos === e.receitaLiquidaCentavos &&
      s.precoLiquidoPorKgColhidoCentavos === e.precoLiquidoPorKgColhidoCentavos &&
      s.resultadoBrutoCentavos === e.resultadoBrutoCentavos;
    out.push({
      id: "cenario-simulado",
      nome: "Cenário simulado: 900 kg · R$ 3.600 · R$ 2.940 · R$ 2,94/kg · R$ 940",
      passou,
      detalhe: `obtido: ${s.quantidadeVendavelKg} kg · ${s.receitaBrutaCentavos} · ${s.receitaLiquidaCentavos} · ${s.precoLiquidoPorKgColhidoCentavos} · ${s.resultadoBrutoCentavos} (centavos)`,
    });
  }

  // 4. Plantio a +8 dias: sem CPTEC como previsão; risco operacional desconhecido.
  {
    const c = avaliarClima("2026-08-27", "2026-08-19");
    const passou = c.regime === "climatologia" && c.risco === "desconhecido" && !c.fonteLabel.includes("CPTEC");
    out.push({ id: "clima-8dias", nome: "Plantio a +8 dias usa climatologia e risco desconhecido (sem CPTEC)", passou, detalhe: `regime=${c.regime} · risco=${c.risco}` });
  }

  // 5. Observação sem chave exata ou sem netWeightKg é descartada com motivo; benchmark historical_only não vira preço atual.
  {
    const semPeso: ObservacaoMercado = {
      id: "obs-teste-sem-peso",
      cultura: "alface",
      classe: "crespa",
      embalagem: "caixa K",
      netWeightKg: null,
      precoCentavos: 2500,
      unidade: "R$/cx",
      praca: "CEAGESP — entreposto SP",
      tipoPreco: "atacado",
      observedAt: "2026-08-18",
      sourceId: "ceagesp",
      flag: "official",
    };
    const r = precoReferencia("alface", "2026-08-19", [semPeso]);
    const descartouSemPeso = r.descartes.some((d) => d.id === "obs-teste-sem-peso" && d.motivo.includes("netWeightKg"));
    const descartouHistorico = r.descartes.some((d) => d.id === "obs-alface-conab-jun26");
    const passou = r.status === "dados_insuficientes" && descartouSemPeso && descartouHistorico;
    out.push({
      id: "preco-fail-closed",
      nome: "Preço sem chave exata/peso é descartado; benchmark histórico não entra na mediana",
      passou,
      detalhe: `status=${r.status} · descartes=${r.descartes.length}`,
    });
  }

  return out;
}
