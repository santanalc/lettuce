import Image from "next/image";

const Arrow = () => (
  <svg aria-hidden="true" viewBox="0 0 18 18">
    <path d="M3 9h11M10 4l5 5-5 5" />
  </svg>
);

const LeafMark = () => (
  <svg aria-hidden="true" className="brand-mark" viewBox="0 0 44 44">
    <path d="M21.8 4.8C13.2 5.2 6.6 11.7 6.6 20.1c0 8.5 6.5 15.4 15 15.9 1.2-6.5 3.4-12.1 7.2-17-3.1 6.1-4.1 12.6-3.5 19.4 7.3-2 12.6-8.6 12.6-16.4 0-8.4-6.5-15.3-14.8-16.1-.1 5.1-1.7 9.8-4.5 13.9 1.8-5 2.9-10 3.2-15Z" />
  </svg>
);

const MiniIcon = ({
  name,
}: {
  name: "calendar" | "cloud" | "cost" | "market";
}) => {
  if (name === "calendar") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M7 3v4M17 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />
        <path d="m8 14 2 2 5-5" />
      </svg>
    );
  }

  if (name === "cloud") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M7 18h10a4 4 0 0 0 .7-7.9A6 6 0 0 0 6.1 9.5 4.3 4.3 0 0 0 7 18Z" />
        <path d="m8 21 1-2M13 21l1-2" />
      </svg>
    );
  }

  if (name === "cost") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 3v18M16.5 7.5c-.8-1-2.2-1.5-4-1.5-2.4 0-4 1.2-4 3s1.5 2.7 4 3c2.4.3 4 1.2 4 3s-1.8 3-4.4 3c-2 0-3.6-.7-4.6-2" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 19V9M10 19V5M16 19v-7M3 19h18" />
      <path d="m4 7 5-3 6 5 5-5" />
    </svg>
  );
};

const SectionHeading = ({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) => (
  <div className="section-heading">
    <p className="eyebrow">{eyebrow}</p>
    <h2>{title}</h2>
    {copy && <p className="section-copy">{copy}</p>}
  </div>
);

const processSteps = [
  {
    number: "01",
    title: "Conte sobre o talhão",
    copy: "Informe área, janela de plantio, irrigação e canal provável. Na demo, a localidade já é Jundiapeba.",
    meta: "Entrada curta, pensada para celular",
  },
  {
    number: "02",
    title: "Compare as culturas",
    copy: "Veja alface, repolho e couve pelas mesmas regras, com incompatibilidades e pendências expostas.",
    meta: "Sem ranking misterioso",
  },
  {
    number: "03",
    title: "Receba um plano preliminar",
    copy: "Calendário, riscos, custos editáveis e comparação de ofertas chegam junto de premissas, datas e fontes.",
    meta: "Faixas, não promessas",
  },
];

const faqs = [
  {
    question: "A Lettuce diz qual cultura vai dar mais lucro?",
    answer:
      "Não. A demo compara opções por regras visíveis e organiza cenários com premissas. Preço, produtividade, clima e retorno não são garantidos.",
  },
  {
    question: "Os dados são atualizados ao vivo?",
    answer:
      "Não nesta demonstração. Ela usa snapshots públicos versionados e datados, preparados para não depender da disponibilidade de serviços externos durante a apresentação.",
  },
  {
    question: "O Hermes cria ou altera meu plano?",
    answer:
      "Não. O Hermes explica resultados já calculados, compara opções e aponta fontes. Alterações acontecem nos campos do plano e disparam um novo cálculo determinístico.",
  },
  {
    question: "Posso pedir indicação ou dose de defensivo?",
    answer:
      "A Lettuce não prescreve defensivos, doses, aplicações nem diagnostica pragas ou doenças. Esses casos são encaminhados para um responsável técnico.",
  },
  {
    question: "Meus dados ficam salvos?",
    answer:
      "Não na demo. O rascunho existe apenas durante a sessão do navegador. Persistência e histórico só serão considerados após validação no piloto.",
  },
];

export default function Home() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <nav className="nav container" aria-label="Navegação principal">
          <a className="brand" href="#top" aria-label="Lettuce — início">
            <LeafMark />
            <span>Lettuce</span>
          </a>

          <div className="nav-links">
            <a href="#produto">Produto</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#hermes">Hermes</a>
            <a href="#faq">FAQ</a>
          </div>

          <a className="nav-cta" href="#como-funciona">
            Explorar o talhão <Arrow />
          </a>
        </nav>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-field-lines" aria-hidden="true" />
          <div className="hero-grid container">
            <div className="hero-copy">
              <p className="hero-kicker">
                <span className="pulse-dot" /> Demo · Jundiapeba, Mogi das
                Cruzes
              </p>
              <h1>
                Do talhão à decisão,
                <span> com clareza.</span>
              </h1>
              <p className="hero-lead">
                Uma leitura prática de cultivo, risco e mercado para o pequeno
                produtor de hortaliças planejar um ciclo sem esconder premissas.
              </p>
              <div className="hero-actions">
                <a className="button button-lime" href="#como-funciona">
                  Explorar o talhão <Arrow />
                </a>
                <a className="text-link" href="#produto">
                  Entender o produto <Arrow />
                </a>
              </div>
              <p className="hero-note">
                <span aria-hidden="true">✦</span> Recorte inicial: hortaliças,
                até 5 ha e uso pelo celular.
              </p>
            </div>

            <div className="hero-visual">
              <div className="hero-photo">
                <Image
                  src="/lettuce/hero-produtor-talhao.png"
                  alt="Produtor de hortaliças consulta o celular em um talhão de alface"
                  width={1537}
                  height={1023}
                  priority
                  sizes="(max-width: 900px) 100vw, 54vw"
                />
              </div>

              <aside
                className="plan-card"
                aria-label="Exemplo de resumo do plano"
              >
                <div className="plan-card-top">
                  <span>Plano preliminar</span>
                  <span className="plan-status">Demo</span>
                </div>
                <div className="plan-crop">
                  <span className="crop-symbol" aria-hidden="true">
                    ◉
                  </span>
                  <div>
                    <p>Cultura em análise</p>
                    <strong>Alface</strong>
                  </div>
                </div>
                <dl className="plan-stats">
                  <div>
                    <dt>Área</dt>
                    <dd>1.000 m²</dd>
                  </div>
                  <div>
                    <dt>Ciclo de referência</dt>
                    <dd>60–80 dias</dd>
                  </div>
                </dl>
                <p className="plan-disclaimer">
                  Faixa ampla para cultivar de verão. Confirmar cultivar, solo,
                  água e manejo.
                </p>
              </aside>
            </div>
          </div>
        </section>

        <section
          className="source-strip"
          aria-label="Recorte e fontes da demonstração"
        >
          <div className="source-strip-inner container">
            <div className="source-intro">
              <span className="source-live" aria-hidden="true" />
              <div>
                <strong>Demo com snapshots públicos</strong>
                <span>Consultados em 19 ago 2026</span>
              </div>
            </div>
            <ul className="source-list">
              <li>Jundiapeba</li>
              <li>Até 5 ha</li>
              <li>Embrapa / CATI</li>
              <li>CPTEC / INPE</li>
              <li>CEAGESP / Prohort</li>
            </ul>
          </div>
        </section>

        <section className="problem section-pad" id="produto">
          <div className="problem-grid container">
            <SectionHeading
              eyebrow="Uma decisão, muitas variáveis"
              title="Planejar o cultivo não deveria exigir cinco conversas separadas."
              copy="Janela de plantio, manejo, risco climático, investimento e mercado mudam a mesma decisão. A Lettuce reúne essas peças em um plano para um talhão e um ciclo."
            />

            <div
              className="decision-map"
              aria-label="Da pergunta ao plano e à decisão"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 600 290"
                preserveAspectRatio="none"
              >
                <path
                  className="field-path field-path-soft"
                  d="M16 52C142 52 137 145 260 145s112 92 324 92"
                />
                <path
                  className="field-path"
                  d="M16 38c146 0 129 91 254 91s119 92 314 92"
                />
              </svg>
              <article className="decision-node node-question">
                <span>Pergunta real</span>
                <p>“Tenho 1.000 m². O que e quando faz sentido plantar?”</p>
              </article>
              <article className="decision-node node-plan">
                <span>Plano legível</span>
                <p>
                  O que sabemos, o que falta e qual fonte sustenta cada ponto.
                </p>
              </article>
              <article className="decision-node node-decision">
                <span>Decisão informada</span>
                <p>
                  Compare caminhos antes de comprometer tempo e investimento.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="process section-pad" id="como-funciona">
          <div className="container">
            <div className="process-heading-row">
              <SectionHeading
                eyebrow="Como funciona"
                title="Da conversa no campo a um plano que dá para conferir."
              />
              <p className="process-sidecopy">
                O mesmo fluxo serve para explorar o talhão ou começar por uma
                cultura já escolhida.
              </p>
            </div>

            <div className="process-list">
              {processSteps.map((step) => (
                <article className="process-step" key={step.number}>
                  <span className="step-number">{step.number}</span>
                  <div className="step-body">
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </div>
                  <span className="step-meta">{step.meta}</span>
                </article>
              ))}
            </div>

            <div className="crop-row" aria-label="Culturas da demonstração">
              <span>Culturas no recorte</span>
              <div>
                <span>Alface</span>
                <span>Repolho</span>
                <span>Couve</span>
              </div>
              <p>Comparadas por janela e regras explícitas.</p>
            </div>
          </div>
        </section>

        <section className="capabilities section-pad">
          <div className="container">
            <SectionHeading
              eyebrow="Tudo no contexto do mesmo ciclo"
              title="Um plano para agir — e perguntas para não ignorar."
              copy="A Lettuce não preenche lacunas com confiança artificial. Quando falta evidência, mostra a pendência e preserva a incerteza."
            />

            <div className="capability-grid">
              <article className="capability-card calendar-card">
                <div className="icon-box">
                  <MiniIcon name="calendar" />
                </div>
                <p className="card-label">Calendário</p>
                <h3>Cuidados organizados no tempo</h3>
                <p>
                  Datas e faixas derivadas da janela de plantio, com
                  dependências e revisão técnica quando necessário.
                </p>
                <div className="mini-timeline" aria-hidden="true">
                  <div>
                    <span>Plantio</span>
                    <i />
                  </div>
                  <div>
                    <span>Cuidados</span>
                    <i />
                  </div>
                  <div>
                    <span>Colheita</span>
                    <i />
                  </div>
                </div>
              </article>

              <article className="capability-card photo-card">
                <Image
                  src="/lettuce/manejo-alface-celular.png"
                  alt="Produtor observa uma alface enquanto consulta informações no celular"
                  width={1448}
                  height={1086}
                  sizes="(max-width: 800px) 100vw, 50vw"
                />
                <div className="photo-card-copy">
                  <div className="icon-box icon-box-light">
                    <MiniIcon name="cloud" />
                  </div>
                  <p className="card-label">Risco climático</p>
                  <h3>Contexto regional, não diagnóstico do talhão</h3>
                  <p>
                    Horizonte, severidade, incerteza e ação preventiva aparecem
                    ao lado da origem do dado.
                  </p>
                </div>
              </article>

              <article className="capability-card photo-card photo-card-wide">
                <Image
                  src="/lettuce/colheita-hortalicas.png"
                  alt="Hortaliças colhidas são organizadas em caixas no campo"
                  width={1536}
                  height={1024}
                  sizes="(max-width: 800px) 100vw, 58vw"
                />
                <div className="photo-card-copy">
                  <div className="icon-box icon-box-light">
                    <MiniIcon name="market" />
                  </div>
                  <p className="card-label">Mercado</p>
                  <h3>Bruto e líquido não são a mesma oferta</h3>
                  <p>
                    Comissão, embalagem, frete e outros custos do canal ficam
                    separados da referência atacadista.
                  </p>
                </div>
              </article>

              <article className="capability-card cost-card">
                <div className="icon-box">
                  <MiniIcon name="cost" />
                </div>
                <p className="card-label">Investimento</p>
                <h3>Custos editáveis, premissas visíveis</h3>
                <p>
                  Quantidades, unidades e valores podem ser conferidos. Sem
                  análise de solo, fertilizante fica como categoria — nunca como
                  dose.
                </p>
                <div
                  className="cost-lines"
                  aria-label="Exemplo conceitual de composição de custos"
                >
                  <span>
                    <i style={{ width: "72%" }} /> Insumos
                  </span>
                  <span>
                    <i style={{ width: "54%" }} /> Operação
                  </span>
                  <span>
                    <i style={{ width: "36%" }} /> Canal
                  </span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="hermes section-pad" id="hermes">
          <div className="hermes-lines" aria-hidden="true" />
          <div className="hermes-grid container">
            <div className="hermes-copy">
              <p className="eyebrow eyebrow-lime">
                Hermes · explicador contextual
              </p>
              <h2>
                Entenda o porquê, sem entregar a decisão para uma caixa-preta.
              </h2>
              <p>
                O Hermes consulta o plano atual para explicar resultados
                calculados, comparar opções e apontar a fonte usada. Ele não
                inventa dados, não calcula por texto livre e não escreve no seu
                plano.
              </p>
              <ul className="hermes-points">
                <li>
                  <span>01</span> Explica por que uma opção entrou ou saiu.
                </li>
                <li>
                  <span>02</span> Decompõe calendário, custos e ofertas.
                </li>
                <li>
                  <span>03</span> Assume quando os dados são insuficientes.
                </li>
              </ul>
              <div className="safety-note">
                <span aria-hidden="true">!</span>
                <p>
                  <strong>Limite claro:</strong> defensivos, dose, aplicação e
                  diagnóstico exigem responsável técnico.
                </p>
              </div>
            </div>

            <div
              className="hermes-panel"
              aria-label="Exemplo de conversa com Hermes"
            >
              <div className="panel-header">
                <div className="hermes-avatar">
                  <LeafMark />
                </div>
                <div>
                  <strong>Hermes</strong>
                  <span>Explicando o plano de alface</span>
                </div>
                <span className="online-dot" aria-label="Disponível" />
              </div>
              <div className="chat-body">
                <p className="chat-question">
                  Por que a alface aparece antes do repolho?
                </p>
                <div className="chat-answer">
                  <p>
                    Neste exemplo, as duas opções estão na janela suportada, mas
                    a faixa inicial de colheita da alface é mais curta. Isso não
                    significa maior lucro nem menor risco.
                  </p>
                  <div className="citation-row">
                    <span>Embrapa · Circular 47</span>
                    <span>Perfil v1</span>
                  </div>
                </div>
              </div>
              <div className="chat-footer">
                <span>Resultado calculado</span>
                <span>Fonte exibida</span>
                <span>Sem escrita no plano</span>
              </div>
            </div>
          </div>
        </section>

        <section className="transparency section-pad">
          <div className="container">
            <SectionHeading
              eyebrow="Transparência desde a demo"
              title="O que existe hoje. O que só entra depois de provar valor."
            />

            <div className="transparency-grid">
              <article className="scope-card scope-now">
                <div className="scope-title">
                  <span>Agora</span>
                  <h3>Demo validável</h3>
                </div>
                <ul>
                  <li>Web responsiva, pensada para celular</li>
                  <li>Recorte fixo de Jundiapeba</li>
                  <li>Alface, repolho e couve</li>
                  <li>Snapshots públicos, versionados e datados</li>
                  <li>Rascunho apenas durante a sessão</li>
                </ul>
              </article>

              <article className="scope-card scope-later">
                <div className="scope-title">
                  <span>Após o piloto</span>
                  <h3>Hipóteses, não promessas</h3>
                </div>
                <ul>
                  <li>WhatsApp, voz ou foto, se o uso pedir</li>
                  <li>PWA, se a conectividade justificar</li>
                  <li>Histórico e persistência com consentimento</li>
                  <li>Outras regiões e culturas após validação técnica</li>
                  <li>Integrações só quando reduzirem trabalho real</li>
                </ul>
              </article>
            </div>

            <p className="promise-line">
              A Lettuce não promete cobertura, preço, produtividade, clima ou
              retorno. Mostra faixas, premissas, data e fonte.
            </p>
          </div>
        </section>

        <section className="faq section-pad" id="faq">
          <div className="faq-grid container">
            <div className="faq-intro">
              <p className="eyebrow">Perguntas frequentes</p>
              <h2>Clareza também é saber onde a ferramenta termina.</h2>
              <p>Respostas diretas sobre a demonstração e seus limites.</p>
            </div>
            <div className="faq-list">
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>
                    <span>{faq.question}</span>
                    <i aria-hidden="true" />
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="closing">
          <div className="closing-lines" aria-hidden="true" />
          <div className="closing-inner container">
            <p className="eyebrow eyebrow-lime">
              Um talhão. Um ciclo. Uma decisão melhor informada.
            </p>
            <h2>Comece pela pergunta que você já tem.</h2>
            <p>
              A Lettuce organiza o que o campo, o calendário e o mercado
              conseguem dizer — e deixa visível o que ainda precisa ser
              confirmado.
            </p>
            <a className="button button-lime" href="#como-funciona">
              Explorar o talhão <Arrow />
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top container">
          <a
            className="brand brand-footer"
            href="#top"
            aria-label="Lettuce — voltar ao início"
          >
            <LeafMark />
            <span>Lettuce</span>
          </a>
          <p>Inteligência prática para o cinturão verde.</p>
          <nav aria-label="Navegação do rodapé">
            <a href="#produto">Produto</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#hermes">Hermes</a>
            <a href="#faq">FAQ</a>
          </nav>
        </div>
        <div className="footer-bottom container">
          <span>Demo de hackathon · Jundiapeba, SP</span>
          <span>© 2026 Lettuce</span>
        </div>
      </footer>
    </div>
  );
}
