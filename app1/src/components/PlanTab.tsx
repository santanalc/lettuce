import { useEffect, useMemo, useState } from "react";
import { avaliarClima } from "../engine/climate";
import { calcularCenario, calcularCustoVariavelCentavos, formatBRL } from "../engine/economics";
import { avaliarElegibilidade } from "../engine/eligibility";
import { precoReferencia } from "../engine/market";
import { calendarios, cenarioSimulado, custosReferencia, fonte } from "../engine/seeds";
import type { Candidato, Canal, Cultura, EntradaPlano, Irrigacao, ItemCusto, Modo } from "../engine/types";

const HOJE = "2026-08-19";

const PRODUTIVIDADE_KG_HA: Record<Cultura, [number, number, number]> = {
  alface: [18000, 24000, 30000],
  repolho: [30000, 45000, 60000],
  couve: [15000, 20000, 25000],
};

function addDias(iso: string, dias: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + dias);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function statusBadge(c: Candidato) {
  if (c.status === "elegivel") return <span className="badge badge-ok">elegível</span>;
  if (c.status === "condicional") return <span className="badge badge-cond">condicional</span>;
  return <span className="badge badge-no">não elegível</span>;
}

export function PlanTab({ onSummaryChange }: { onSummaryChange: (s: Record<string, unknown> | null) => void }) {
  const [modo, setModo] = useState<Modo>("explorar");
  const [cultura, setCultura] = useState<Cultura>("alface");
  const [areaValor, setAreaValor] = useState(1000);
  const [areaUnidade, setAreaUnidade] = useState<"m2" | "ha">("m2");
  const [dataPlantio, setDataPlantio] = useState(HOJE);
  const [irrigacao, setIrrigacao] = useState<Irrigacao>("aspersao");
  const [canal, setCanal] = useState<Canal>("cooperativa");
  const [gerado, setGerado] = useState(false);
  const [selecionada, setSelecionada] = useState<Cultura | null>(null);

  const [custos, setCustos] = useState<ItemCusto[]>([]);
  const [sim, setSim] = useState({ ...cenarioSimulado });
  const [oferta, setOferta] = useState({ precoCentavosKg: 400, quantidadeKg: 900, comissaoPct: 10, embalagemCentavos: 10000, freteCentavos: 20000, outrosCentavos: 0 });

  const entrada: EntradaPlano = useMemo(
    () => ({ modo, cultura: modo === "avaliar" ? cultura : null, areaValor, areaUnidade, dataPlantio, irrigacao, canal }),
    [modo, cultura, areaValor, areaUnidade, dataPlantio, irrigacao, canal],
  );

  const resultado = useMemo(() => (gerado ? avaliarElegibilidade(entrada) : null), [gerado, entrada]);
  const clima = useMemo(() => (gerado ? avaliarClima(dataPlantio, HOJE) : null), [gerado, dataPlantio]);
  const mercado = useMemo(() => (selecionada ? precoReferencia(selecionada, HOJE) : null), [selecionada]);

  useEffect(() => {
    if (selecionada) setCustos(custosReferencia[selecionada]!.itens.map((i) => ({ ...i })));
  }, [selecionada]);

  const areaM2 = resultado?.areaM2 ?? (areaUnidade === "ha" ? areaValor * 10000 : areaValor);
  const custoVariavel = useMemo(() => calcularCustoVariavelCentavos(custos, areaM2), [custos, areaM2]);
  const simResult = useMemo(() => calcularCenario(sim), [sim]);
  const ofertaResult = useMemo(
    () =>
      calcularCenario({
        areaM2,
        quantidadeColhidaKg: oferta.quantidadeKg,
        perdaPosColheitaPct: 0,
        precoAtacadoCentavosKg: oferta.precoCentavosKg,
        comissaoPct: oferta.comissaoPct,
        embalagemCentavos: oferta.embalagemCentavos,
        freteCentavos: oferta.freteCentavos,
        outrosCentavos: oferta.outrosCentavos,
        tributosCentavos: 0,
        investimentoCentavos: 0,
      }),
    [oferta, areaM2],
  );

  useEffect(() => {
    if (!resultado?.ok) {
      onSummaryChange(null);
      return;
    }
    onSummaryChange({
      modo,
      localidade: "Jundiapeba, Mogi das Cruzes — SP",
      areaM2,
      dataPlantio,
      irrigacao,
      canal,
      candidatos: resultado.candidatos.map((c) => ({ cultura: c.cultura, status: c.status, colheitaInicioDias: c.colheitaInicioDias })),
      destaque: resultado.destaque,
      culturaSelecionada: selecionada,
      investimentoVariavelCentavos: selecionada ? custoVariavel : null,
      cenarioSimulado: { ...cenarioSimulado.esperado, flag: "synthetic_demo" },
      clima: clima ? { regime: clima.regime, risco: clima.risco } : null,
    });
  }, [resultado, selecionada, custoVariavel, clima, modo, areaM2, dataPlantio, irrigacao, canal, onSummaryChange]);

  const selecionadaCand = resultado?.candidatos.find((c) => c.cultura === selecionada && c.status !== "nao_elegivel");

  return (
    <div className="grid-2">
      <section className="card" aria-label="Configurar o plano">
        <p className="eyebrow">Tela 1 · Configurar o plano</p>
        <h2>Comece pelo talhão</h2>
        <p className="card-sub">Entrada curta, pensada para o celular. Solo, água e cultivar entram como pendências, sem travar o primeiro resultado.</p>

        <div className="mode-toggle" role="group" aria-label="Modo de entrada">
          <button aria-pressed={modo === "explorar"} onClick={() => setModo("explorar")}>Explorar o talhão</button>
          <button aria-pressed={modo === "avaliar"} onClick={() => setModo("avaliar")}>Avaliar uma cultura</button>
        </div>

        {modo === "avaliar" && (
          <div className="field">
            <label htmlFor="cultura">Cultura</label>
            <select id="cultura" value={cultura} onChange={(e) => setCultura(e.target.value as Cultura)}>
              <option value="alface">Alface</option>
              <option value="repolho">Repolho</option>
              <option value="couve">Couve</option>
            </select>
          </div>
        )}

        <div className="field">
          <label>Localidade</label>
          <div className="field-static">Jundiapeba, Mogi das Cruzes — SP (recorte fixo da demo)</div>
        </div>

        <div className="field">
          <label htmlFor="area">Área cultivada</label>
          <div className="row-2">
            <input id="area" type="number" min={1} value={areaValor} onChange={(e) => setAreaValor(Number(e.target.value))} />
            <select aria-label="Unidade da área" value={areaUnidade} onChange={(e) => setAreaUnidade(e.target.value as "m2" | "ha")}>
              <option value="m2">m²</option>
              <option value="ha">ha</option>
            </select>
          </div>
          <p className="field-note">
            Equivale a {areaUnidade === "m2" ? `${(areaValor / 10000).toLocaleString("pt-BR")} ha` : `${(areaValor * 10000).toLocaleString("pt-BR")} m²`}.
          </p>
        </div>

        <div className="field">
          <label htmlFor="data">Data pretendida de plantio</label>
          <input id="data" type="date" value={dataPlantio} onChange={(e) => setDataPlantio(e.target.value)} />
          <p className="field-note">Na demo, “hoje” é 19/08/2026, a data dos snapshots.</p>
        </div>

        <div className="row-2">
          <div className="field">
            <label htmlFor="irrigacao">Irrigação</label>
            <select id="irrigacao" value={irrigacao} onChange={(e) => setIrrigacao(e.target.value as Irrigacao)}>
              <option value="aspersao">Aspersão</option>
              <option value="gotejamento">Gotejamento</option>
              <option value="sem">Sem irrigação</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="canal">Canal provável de venda</label>
            <select id="canal" value={canal} onChange={(e) => setCanal(e.target.value as Canal)}>
              <option value="cooperativa">Cooperativa</option>
              <option value="venda_direta">Venda direta / feira</option>
              <option value="atravessador">Atravessador</option>
              <option value="atacado">Atacado</option>
            </select>
          </div>
        </div>

        <button className="button-lime" onClick={() => { setGerado(true); setSelecionada(null); }}>
          Gerar plano preliminar
        </button>
        <p className="field-note">O cálculo é determinístico: a mesma entrada sempre produz os mesmos números.</p>
      </section>

      <section aria-label="Plano econômico de cultivo">
        {!resultado && (
          <div className="card">
            <p className="eyebrow">Tela 2 · Plano econômico</p>
            <h2>O plano aparece aqui</h2>
            <p className="card-sub">
              Preencha o talhão ao lado. O motor compara alface, repolho e couve por regras visíveis e monta calendário,
              risco, investimento e cenários com fonte e data.
            </p>
          </div>
        )}

        {resultado && (
          <>
            <div className="card">
              <p className="eyebrow">Culturas comparadas por regras visíveis</p>
              <h2>{resultado.ok ? "Opções para esse talhão" : "Sem opção compatível"}</h2>
              {resultado.erro && <div className="notice notice-danger">{resultado.erro}</div>}
              {resultado.pendenciasGerais.map((p) => (
                <div key={p} className="notice notice-warn">{p}</div>
              ))}
              {resultado.candidatos.map((c, idx) => (
                <button
                  key={c.cultura}
                  className="candidate"
                  aria-pressed={selecionada === c.cultura}
                  disabled={c.status === "nao_elegivel"}
                  onClick={() => setSelecionada(c.cultura)}
                >
                  <span className="candidate-top">
                    <strong>{c.nome}</strong>
                    {statusBadge(c)}
                    {resultado.destaque === c.cultura && idx === 0 && <span className="badge badge-first">colheita mais cedo</span>}
                    {c.colheitaInicioDias !== null && (
                      <span className="field-note">colheita em {c.colheitaInicioDias} a {c.colheitaFimDias} dias</span>
                    )}
                  </span>
                  <ul>
                    {c.motivos.map((m) => <li key={m}>{m}</li>)}
                    {c.pendencias.map((p) => <li key={p}>Pendência: {p}</li>)}
                  </ul>
                </button>
              ))}
              <p className="source-line">{resultado.avisoDestaque} Fontes: {fonte("embrapa-c47").titulo} · {fonte("fgv-cinturao").emissor}, consultadas em 19/08/2026.</p>
            </div>

            {clima && (
              <div className="card">
                <p className="eyebrow">Risco climático · contexto regional</p>
                <h2>{clima.regime === "previsao" ? "Previsão dos próximos 7 dias" : clima.regime === "climatologia" ? "Contexto histórico" : "Observações registradas"}</h2>
                <p className="card-sub">{clima.mensagem}</p>
                <div className={`notice ${clima.risco === "desconhecido" ? "notice-warn" : ""}`}>
                  Risco operacional: <strong>{clima.risco}</strong>.{clima.acaoPreventiva ? ` Ação preventiva: ${clima.acaoPreventiva}` : ""}
                </div>
                <p className="source-line">{clima.fonteLabel}. Alerta regional descreve a região, o diagnóstico do talhão continua sendo trabalho de campo.</p>
              </div>
            )}

            {selecionadaCand && (
              <>
                <div className="card">
                  <p className="eyebrow">Calendário de tratos · {selecionadaCand.nome}</p>
                  <h2>Cuidados organizados no tempo</h2>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr><th>Tarefa</th><th>Janela</th><th>Condição</th><th>Nível</th></tr>
                      </thead>
                      <tbody>
                        {calendarios[selecionadaCand.cultura]!.map((t) => (
                          <tr key={t.nome}>
                            <td>{t.nome}</td>
                            <td className="num">{addDias(dataPlantio, t.offsetMinDias)}{t.offsetMaxDias > t.offsetMinDias ? ` – ${addDias(dataPlantio, t.offsetMaxDias)}` : ""}</td>
                            <td>{t.condicao ?? "—"}</td>
                            <td>{t.nivel === "revisao_tecnica" ? <span className="badge badge-cond">revisão técnica</span> : "geral"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="source-line">Offsets relativos ao plantio de {new Date(`${dataPlantio}T12:00:00`).toLocaleDateString("pt-BR")}. Fonte: {fonte("embrapa-c47").titulo} (referência ampla para o Sudeste). Mudar a data recalcula tudo sem chamar modelo de linguagem.</p>
                </div>

                <div className="card">
                  <p className="eyebrow">Investimento estimado · custos editáveis</p>
                  <h2>Quantidades e valores que você pode conferir</h2>
                  <p className="card-sub">Estimativas de referência para {areaM2.toLocaleString("pt-BR")} m². Edite qualquer valor: o total recalcula na hora. Isso não é recomendação financeira.</p>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr><th>Item</th><th>Unidade</th><th>Qtd/ha</th><th>Custo unitário (R$)</th><th>Subtotal</th></tr>
                      </thead>
                      <tbody>
                        {custos.map((item, i) => (
                          <tr key={item.id}>
                            <td>{item.nome}</td>
                            <td>{item.unidade}</td>
                            <td>
                              <input
                                type="number" min={0} value={item.quantidadePorHa}
                                aria-label={`Quantidade por hectare de ${item.nome}`}
                                onChange={(e) => setCustos((prev) => prev.map((x, j) => (j === i ? { ...x, quantidadePorHa: Number(e.target.value) } : x)))}
                              />
                            </td>
                            <td>
                              <input
                                type="number" min={0} step="0.01" value={(item.custoUnitarioCentavos / 100).toString()}
                                aria-label={`Custo unitário de ${item.nome}`}
                                onChange={(e) => setCustos((prev) => prev.map((x, j) => (j === i ? { ...x, custoUnitarioCentavos: Math.round(Number(e.target.value) * 100) } : x)))}
                              />
                            </td>
                            <td className="num">{formatBRL(Math.round(item.quantidadePorHa * (areaM2 / 10000) * item.custoUnitarioCentavos))}</td>
                          </tr>
                        ))}
                        <tr className="total-row">
                          <td colSpan={4}>Investimento variável estimado (faixa base)</td>
                          <td className="num">{formatBRL(custoVariavel)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="notice">
                    Faixa baixa {formatBRL(Math.round(custoVariavel * 0.85))} · base {formatBRL(custoVariavel)} · alta {formatBRL(Math.round(custoVariavel * 1.15))}. A variação de ±15% é premissa editável da demo, não medição.
                  </div>
                  <div className="notice notice-warn">
                    Sem análise de solo, adubação e corretivo aparecem como categoria de custo. O sistema não calcula dose; isso fica com o responsável técnico.
                  </div>
                </div>

                <div className="card">
                  <p className="eyebrow">Preço de referência · {selecionadaCand.nome}</p>
                  <h2>{mercado?.status === "ok" ? "Mediana atacadista dos últimos 14 dias" : "Dados insuficientes para preço atual"}</h2>
                  <p className="card-sub">{mercado?.aviso}</p>
                  {mercado && mercado.descartes.length > 0 && (
                    <div className="notice">
                      Observações descartadas com motivo: {mercado.descartes.map((d) => `${d.id} (${d.motivo})`).join("; ")}.
                    </div>
                  )}
                  {selecionadaCand.cultura === "alface" && (
                    <p className="source-line">
                      Benchmark histórico disponível: alface crespa a R$ 4,53/kg na CEAGESP em jun/2026 ({fonte("conab-prohort").titulo}), rotulado historical_only. Serve de contexto, nunca de preço atual.
                    </p>
                  )}
                </div>

                <div className="card">
                  <p className="eyebrow">Prova da matemática <span className="badge badge-sim">dados simulados</span></p>
                  <h2>Cenário econômico reproduzível</h2>
                  <p className="card-sub">
                    Valores-semente do módulo {cenarioSimulado.version}. Edite qualquer campo e confira o recálculo determinístico. Nenhum número aqui é promessa de resultado.
                  </p>
                  <div className="table-wrap">
                    <table>
                      <tbody>
                        <tr><td>Quantidade colhida (kg)</td><td><input type="number" value={sim.quantidadeColhidaKg} onChange={(e) => setSim({ ...sim, quantidadeColhidaKg: Number(e.target.value) })} aria-label="Quantidade colhida em kg" /></td></tr>
                        <tr><td>Perda pós-colheita (%)</td><td><input type="number" value={sim.perdaPosColheitaPct} onChange={(e) => setSim({ ...sim, perdaPosColheitaPct: Number(e.target.value) })} aria-label="Perda pós-colheita em porcento" /></td></tr>
                        <tr><td>Preço atacado hipotético (R$/kg)</td><td><input type="number" step="0.01" value={(sim.precoAtacadoCentavosKg / 100).toString()} onChange={(e) => setSim({ ...sim, precoAtacadoCentavosKg: Math.round(Number(e.target.value) * 100) })} aria-label="Preço atacado hipotético" /></td></tr>
                        <tr><td>Comissão (%)</td><td><input type="number" value={sim.comissaoPct} onChange={(e) => setSim({ ...sim, comissaoPct: Number(e.target.value) })} aria-label="Comissão em porcento" /></td></tr>
                        <tr><td>Embalagem (R$)</td><td><input type="number" step="0.01" value={(sim.embalagemCentavos / 100).toString()} onChange={(e) => setSim({ ...sim, embalagemCentavos: Math.round(Number(e.target.value) * 100) })} aria-label="Custo de embalagem" /></td></tr>
                        <tr><td>Frete (R$)</td><td><input type="number" step="0.01" value={(sim.freteCentavos / 100).toString()} onChange={(e) => setSim({ ...sim, freteCentavos: Math.round(Number(e.target.value) * 100) })} aria-label="Custo de frete" /></td></tr>
                        <tr><td>Investimento de produção (R$)</td><td><input type="number" step="0.01" value={(sim.investimentoCentavos / 100).toString()} onChange={(e) => setSim({ ...sim, investimentoCentavos: Math.round(Number(e.target.value) * 100) })} aria-label="Investimento de produção" /></td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <tbody>
                        <tr><td>Vendável após perda</td><td className="num">{simResult.quantidadeVendavelKg.toLocaleString("pt-BR")} kg</td></tr>
                        <tr><td>Receita bruta</td><td className="num">{formatBRL(simResult.receitaBrutaCentavos)}</td></tr>
                        <tr><td>Deduções do canal</td><td className="num">− {formatBRL(simResult.deducoesCentavos)}</td></tr>
                        <tr><td>Receita líquida do canal</td><td className="num">{formatBRL(simResult.receitaLiquidaCentavos)}</td></tr>
                        <tr><td>Preço líquido por kg colhido</td><td className="num">{formatBRL(simResult.precoLiquidoPorKgColhidoCentavos)}</td></tr>
                        <tr className="total-row"><td>Resultado bruto do cenário</td><td className="num">{formatBRL(simResult.resultadoBrutoCentavos)}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card">
                  <p className="eyebrow">Comparar uma oferta</p>
                  <h2>Bruto e líquido lado a lado</h2>
                  <p className="card-sub">Informe a oferta recebida e os custos do canal. A referência atacadista fica separada do valor na sua mão.</p>
                  <div className="row-2">
                    <div className="field">
                      <label>Preço ofertado (R$/kg)</label>
                      <input type="number" step="0.01" value={(oferta.precoCentavosKg / 100).toString()} onChange={(e) => setOferta({ ...oferta, precoCentavosKg: Math.round(Number(e.target.value) * 100) })} />
                    </div>
                    <div className="field">
                      <label>Quantidade (kg)</label>
                      <input type="number" value={oferta.quantidadeKg} onChange={(e) => setOferta({ ...oferta, quantidadeKg: Number(e.target.value) })} />
                    </div>
                  </div>
                  <div className="row-2">
                    <div className="field">
                      <label>Comissão (%)</label>
                      <input type="number" value={oferta.comissaoPct} onChange={(e) => setOferta({ ...oferta, comissaoPct: Number(e.target.value) })} />
                    </div>
                    <div className="field">
                      <label>Embalagem + frete + outros (R$)</label>
                      <input
                        type="number" step="0.01"
                        value={((oferta.embalagemCentavos + oferta.freteCentavos + oferta.outrosCentavos) / 100).toString()}
                        onChange={(e) => setOferta({ ...oferta, embalagemCentavos: Math.round(Number(e.target.value) * 100), freteCentavos: 0, outrosCentavos: 0 })}
                      />
                    </div>
                  </div>
                  <div className="notice">
                    Bruto {formatBRL(ofertaResult.receitaBrutaCentavos)} · deduções {formatBRL(ofertaResult.deducoesCentavos)} · líquido{" "}
                    <strong>{formatBRL(ofertaResult.receitaLiquidaCentavos)}</strong> ({formatBRL(ofertaResult.precoLiquidoPorKgColhidoCentavos)}/kg).
                  </div>
                </div>

                <div className="card">
                  <p className="eyebrow">Cenários de receita · premissas visíveis</p>
                  <h2>Faixas, com as premissas ao lado</h2>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr><th>Cenário</th><th>Produtividade (kg/ha)</th><th>Receita estimada</th><th>Resultado ante investimento base</th></tr>
                      </thead>
                      <tbody>
                        {(["baixo", "base", "alto"] as const).map((label, i) => {
                          const prod = PRODUTIVIDADE_KG_HA[selecionadaCand.cultura][i]!;
                          const receita = Math.round(prod * (areaM2 / 10000) * sim.precoAtacadoCentavosKg * 0.9 * (1 - sim.comissaoPct / 100));
                          return (
                            <tr key={label}>
                              <td>{label}</td>
                              <td className="num">{prod.toLocaleString("pt-BR")}</td>
                              <td className="num">{formatBRL(receita)}</td>
                              <td className="num">{formatBRL(receita - custoVariavel)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="source-line">
                    Premissas: produtividade em faixa de referência ampla (confirmar com técnico), preço hipotético de {formatBRL(sim.precoAtacadoCentavosKg)}/kg
                    rotulado como dado simulado, perda de 10% e comissão de {sim.comissaoPct}%. O intervalo não é promessa de retorno.
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}
