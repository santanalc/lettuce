import { perfis } from "./seeds";
import type { Candidato, EntradaPlano, ResultadoElegibilidade, StatusCandidato } from "./types";

export function normalizarAreaM2(valor: number, unidade: "m2" | "ha"): number {
  return unidade === "ha" ? Math.round(valor * 10_000) : Math.round(valor);
}

const AREA_MAX_M2 = 50_000;

/**
 * Modo explorar/avaliar do blueprint: filtra por janela, marca condicionais
 * e ordena pelo menor início de colheita; empate segue o volume regional FGV.
 * Fail-closed: sem opção compatível o resultado é insufficient_evidence.
 */
export function avaliarElegibilidade(entrada: EntradaPlano): ResultadoElegibilidade {
  const areaM2 = normalizarAreaM2(entrada.areaValor, entrada.areaUnidade);
  const base: ResultadoElegibilidade = {
    ok: false,
    erro: null,
    areaM2,
    candidatos: [],
    destaque: null,
    avisoDestaque: "",
    pendenciasGerais: [],
  };

  if (!Number.isFinite(areaM2) || areaM2 <= 0 || areaM2 > AREA_MAX_M2) {
    return { ...base, erro: `Área deve ser maior que zero e até ${AREA_MAX_M2.toLocaleString("pt-BR")} m².` };
  }
  const data = new Date(`${entrada.dataPlantio}T12:00:00`);
  if (Number.isNaN(data.getTime())) {
    return { ...base, erro: "Data de plantio inválida." };
  }
  const mes = data.getMonth() + 1;

  const semAgua = entrada.irrigacao === null || entrada.irrigacao === "sem";
  const pendenciasGerais: string[] = [];
  if (semAgua) {
    pendenciasGerais.push(
      "Sem irrigação definida o plano fica condicional: confirme disponibilidade de água, vazão e outorga antes de decidir.",
    );
  }
  pendenciasGerais.push(
    "Sem análise de solo e de água o plano é preliminar: compara culturas e organiza o calendário, sem calcular dose nem área irrigável.",
  );

  const alvo = entrada.modo === "avaliar" && entrada.cultura ? perfis.filter((p) => p.id === entrada.cultura) : perfis;

  const candidatos: Candidato[] = alvo.map((p) => {
    const janela = p.janelas.find((j) => j.meses.includes(mes));
    if (!janela) {
      return {
        cultura: p.id,
        nome: p.nome,
        status: "nao_elegivel" as StatusCandidato,
        motivos: [`Fora da janela de plantio suportada (${p.janelas.map((j) => j.label).join("; ")}).`],
        pendencias: [],
        colheitaInicioDias: null,
        colheitaFimDias: null,
        sourceIds: p.sourceIds,
      };
    }
    const verao = janela.exigeCultivarVerao;
    const ini = verao && p.cicloVeraoMinDias ? p.cicloVeraoMinDias : p.cicloMinDias;
    const fim = verao && p.cicloVeraoMaxDias ? p.cicloVeraoMaxDias : p.cicloMaxDias;
    const pendencias: string[] = [];
    const motivos: string[] = [`Dentro da janela ${janela.label}.`, `Ciclo de referência: ${ini} a ${fim} dias.`];
    let status: StatusCandidato = "elegivel";
    if (verao) {
      status = "condicional";
      pendencias.push("Janela de agosto a fevereiro exige cultivar de verão confirmada.");
    }
    if (semAgua) {
      status = "condicional";
      pendencias.push("Pendência de água: vazão e outorga sem confirmação.");
    }
    return {
      cultura: p.id,
      nome: p.nome,
      status,
      motivos,
      pendencias,
      colheitaInicioDias: ini,
      colheitaFimDias: fim,
      sourceIds: p.sourceIds,
    };
  });

  const compativeis = candidatos.filter((c) => c.status !== "nao_elegivel");
  compativeis.sort((a, b) => {
    const d = (a.colheitaInicioDias ?? 9999) - (b.colheitaInicioDias ?? 9999);
    if (d !== 0) return d;
    const ra = perfis.find((p) => p.id === a.cultura)?.volumeFgvRank ?? 99;
    const rb = perfis.find((p) => p.id === b.cultura)?.volumeFgvRank ?? 99;
    return ra - rb;
  });
  const naoElegiveis = candidatos.filter((c) => c.status === "nao_elegivel");
  const ordenados = [...compativeis, ...naoElegiveis];

  if (compativeis.length === 0) {
    return {
      ...base,
      ok: false,
      erro: "insufficient_evidence: nenhuma cultura do recorte é compatível com essa data pelas regras disponíveis.",
      candidatos: ordenados,
      pendenciasGerais,
    };
  }

  const podeDestacar = !semAgua;
  return {
    ...base,
    ok: true,
    candidatos: ordenados,
    destaque: podeDestacar ? compativeis[0]!.cultura : null,
    avisoDestaque: podeDestacar
      ? "Primeira opção significa colheita mais cedo entre as compatíveis pelas regras disponíveis. Não significa superioridade agronômica nem econômica."
      : "Sem irrigação confirmada não há opção vencedora: as culturas aparecem como condicionais.",
    pendenciasGerais,
  };
}
