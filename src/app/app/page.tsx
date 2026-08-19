import Link from "next/link";

export default function AppHomePage() {
  return (
    <section className="saas-intro" aria-labelledby="saas-title">
      <p className="eyebrow">Lettuce · demonstração</p>
      <h1 id="saas-title">Uma visão clara para cada decisão do ciclo.</h1>
      <p>
        Escolha uma área para continuar: acompanhe os planos de cultivo ou
        converse com o Agente Hermes sobre os resultados calculados.
      </p>
      <div className="saas-card-grid">
        <Link className="saas-card" href="/app/planos">
          <span>01</span>
          <h2>Planos</h2>
          <p>Compare culturas, calendário, custos e premissas do ciclo.</p>
          <strong>Ver planos →</strong>
        </Link>
        <Link className="saas-card saas-card-dark" href="/app/agente">
          <span>02</span>
          <h2>Agente Hermes</h2>
          <p>Entenda por que uma opção entrou ou saiu da análise.</p>
          <strong>Abrir agente →</strong>
        </Link>
      </div>
    </section>
  );
}
