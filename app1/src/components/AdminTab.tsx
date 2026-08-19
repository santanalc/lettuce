import { useMemo, useState } from "react";
import type { ChatTelemetry } from "../App";
import { rodarChecks } from "../engine/checks";
import {
  CLIMATE_SNAPSHOT_VERSION,
  CROP_PROFILES_VERSION,
  DEMO_SCENARIO_VERSION,
  MARKET_OBSERVATIONS_VERSION,
  SOURCE_CATALOG_VERSION,
  climateSnapshot,
  fontes,
  observacoesMercado,
  perfis,
} from "../engine/seeds";

const CONTRIBUICOES = [
  "Motor determinístico de elegibilidade, calendário, investimento, preço e risco (src/engine), com dinheiro em centavos inteiros e regras fail-closed.",
  "Seeds versionados com proveniência: crop-profiles.v1, source-catalog.v1, market-observations.v1, climate-snapshot-2026-08-19 e demo-economic-scenario.v1.",
  "Interface responsiva das duas telas do fluxo (configurar o plano e plano econômico), com custos editáveis e recálculo imediato.",
  "Assistente LettuceIA em modo demonstração offline: matcher de intenção e respostas preparadas pela equipe, com recusa regulada e fontes citadas, rodando 100% no navegador.",
  "Esta tela de administração, com os fixtures do blueprint executados ao vivo no navegador e telemetria sanitizada da sessão.",
  "Landing lettucebr.com com a escrita refinada pela diretriz da equipe e o logo oficial.",
];

export function AdminTab({ telemetry }: { telemetry: ChatTelemetry[] }) {
  const [rodada, setRodada] = useState(0);
  const checks = useMemo(() => rodarChecks(), [rodada]);
  const falhas = checks.filter((c) => !c.passou).length;

  return (
    <div>
      <div className="card">
        <p className="eyebrow">Hackathon OpenAI · 19/08/2026</p>
        <h2>Construído neste hackathon</h2>
        <p className="card-sub">
          Contribuições originais da equipe durante o evento, para identificação clara pelos jurados. Snapshots públicos
          e referências técnicas citadas são insumos externos; todo o código e a experiência abaixo foram criados no dia.
        </p>
        <ul className="hack-list">
          {CONTRIBUICOES.map((c) => <li key={c}>{c}</li>)}
        </ul>
      </div>

      <div className="card">
        <p className="eyebrow">Verificação contínua</p>
        <h2>
          Checks fail-closed do blueprint{" "}
          <span className={`badge ${falhas === 0 ? "badge-ok" : "badge-no"}`}>{falhas === 0 ? "todos verdes" : `${falhas} falhando`}</span>
        </h2>
        <p className="card-sub">Os fixtures rodam agora, neste navegador, contra o mesmo motor usado na aba Plano de cultivo.</p>
        {checks.map((c) => (
          <div className="check-row" key={c.id}>
            <span className={`check-dot ${c.passou ? "pass" : "fail"}`} aria-hidden="true" />
            <div>
              <strong>{c.nome}</strong>
              <span className="detalhe">{c.detalhe}</span>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 14 }}>
          <button className="button-ghost" onClick={() => setRodada((r) => r + 1)}>Rodar os checks de novo</button>
        </div>
      </div>

      <div className="card">
        <p className="eyebrow">Seeds e snapshots</p>
        <h2>
          Perfis de cultura<span className="pill-version">{CROP_PROFILES_VERSION}</span>
        </h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Cultura</th><th>Janelas</th><th>Ciclo</th><th>Espaçamento</th><th>Rank FGV</th></tr>
            </thead>
            <tbody>
              {perfis.map((p) => (
                <tr key={p.id}>
                  <td>{p.nome}</td>
                  <td>{p.janelas.map((j) => j.label).join("; ")}</td>
                  <td className="num">{p.cicloMinDias}–{p.cicloMaxDias} dias{p.cicloVeraoMinDias ? ` (verão ${p.cicloVeraoMinDias}–${p.cicloVeraoMaxDias})` : ""}</td>
                  <td>{p.espacamento} · {p.densidadePlantasM2} pl/m²</td>
                  <td className="num">{p.volumeFgvRank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>
          Catálogo de fontes<span className="pill-version">{SOURCE_CATALOG_VERSION}</span>
        </h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Fonte</th><th>Emissor</th><th>Consultada em</th><th>Proveniência</th></tr>
            </thead>
            <tbody>
              {fontes.map((f) => (
                <tr key={f.id}>
                  <td><a href={f.url} target="_blank" rel="noreferrer">{f.titulo}</a></td>
                  <td>{f.emissor}</td>
                  <td className="num">{f.consultadoEm}</td>
                  <td>{f.flag}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>
          Observações de mercado<span className="pill-version">{MARKET_OBSERVATIONS_VERSION}</span>
        </h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Id</th><th>Cultura</th><th>Preço</th><th>Praça</th><th>Observada em</th><th>Flag</th></tr>
            </thead>
            <tbody>
              {observacoesMercado.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.cultura}</td>
                  <td className="num">R$ {(o.precoCentavos / 100).toFixed(2).replace(".", ",")} ({o.unidade})</td>
                  <td>{o.praca}</td>
                  <td className="num">{o.observedAt}</td>
                  <td>{o.flag}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={6}>Repolho e couve começam sem referência atual. Nenhuma observação satisfaz a janela de 14 dias em 19/08/2026.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>
          Snapshot climático<span className="pill-version">{CLIMATE_SNAPSHOT_VERSION}</span>
        </h3>
        <div className="table-wrap">
          <table>
            <tbody>
              <tr><td>Centroide</td><td>{climateSnapshot.centroide}</td></tr>
              <tr><td>MERGE diário até</td><td className="num">{climateSnapshot.mergeDiarioAte}</td></tr>
              <tr><td>MERGE horário até</td><td className="num">{climateSnapshot.mergeHorarioAte}</td></tr>
              <tr><td>SAMeT histórico até</td><td className="num">{climateSnapshot.sametHistoricoAte}</td></tr>
              <tr><td>CPTEC</td><td>{climateSnapshot.cptecMunicipio} · validade {climateSnapshot.cptecValidadeHoras}h</td></tr>
              <tr><td>Previsão 7 dias</td><td>rotulada {climateSnapshot.previsao7dias.flag}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="source-line">Cenário econômico de prova: <span className="pill-version">{DEMO_SCENARIO_VERSION}</span> rotulado synthetic_demo em toda a interface.</p>
      </div>

      <div className="card">
        <p className="eyebrow">Assistente · telemetria sanitizada</p>
        <h2>Execuções da LettuceIA nesta sessão</h2>
        <p className="card-sub">Sem transcript: hora, status, latência e tamanhos. A conversa em si morre com a sessão do navegador.</p>
        {telemetry.length === 0 ? (
          <p className="field-note">Nenhuma chamada ainda. Use a aba LettuceIA.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Hora</th><th>Status</th><th>Latência</th><th>Pergunta</th><th>Resposta</th></tr>
              </thead>
              <tbody>
                {telemetry.map((t, i) => (
                  <tr key={i}>
                    <td className="num">{new Date(t.ts).toLocaleTimeString("pt-BR")}</td>
                    <td>{t.status === "ok" ? <span className="badge badge-ok">ok</span> : <span className="badge badge-no">erro</span>}</td>
                    <td className="num">{t.latenciaMs} ms</td>
                    <td className="num">{t.perguntaChars} chars</td>
                    <td className="num">{t.respostaChars} chars</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
