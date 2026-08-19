import { useEffect, useState, type JSX } from "react";
import { AdminTab } from "./components/AdminTab";
import { AssistantTab } from "./components/AssistantTab";
import { PlanTab } from "./components/PlanTab";
import { IcoChat, IcoGauge, IcoSprout } from "./ui";

export type TabId = "plano" | "assistente" | "admin";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatTelemetry {
  ts: string;
  status: "ok" | "erro";
  latenciaMs: number;
  perguntaChars: number;
  respostaChars: number;
}

const TABS: { id: TabId; label: string; short: string; icon: () => JSX.Element }[] = [
  { id: "plano", label: "Plano de cultivo", short: "Plano", icon: IcoSprout },
  { id: "assistente", label: "LettuceIA", short: "LettuceIA", icon: IcoChat },
  { id: "admin", label: "Bastidores da demo", short: "Bastidores", icon: IcoGauge },
];

function tabFromHash(): TabId {
  const h = window.location.hash.replace("#", "");
  return h === "assistente" || h === "admin" ? h : "plano";
}

export function App() {
  const [tab, setTab] = useState<TabId>(tabFromHash);
  const [planSummary, setPlanSummary] = useState<Record<string, unknown> | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [telemetry, setTelemetry] = useState<ChatTelemetry[]>([]);

  useEffect(() => {
    const onHash = () => setTab(tabFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (t: TabId) => {
    window.location.hash = t;
    setTab(t);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container">
          <div className="header-row">
            <a className="brand" href="#plano" onClick={() => go("plano")}>
              <img src="/logo-mark.png" alt="" />
              <span className="brand-text">
                <strong>Lettuce</strong>
                <span>Plano de cultivo · Jundiapeba, Mogi das Cruzes</span>
              </span>
            </a>
            <span className="hack-badge">
              Hackathon OpenAI
              <br />
              construído em 19/08/2026
            </span>
          </div>

          <nav className="top-tabs" aria-label="Seções do app">
            {TABS.map((t) => (
              <button key={t.id} className="top-tab" aria-selected={tab === t.id} onClick={() => go(t.id)}>
                <t.icon />
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="tab-panel" key={tab}>
            {tab === "plano" && <PlanTab onSummaryChange={setPlanSummary} />}
            {tab === "assistente" && (
              <AssistantTab
                planSummary={planSummary}
                history={chatHistory}
                setHistory={setChatHistory}
                onTelemetry={(t) => setTelemetry((prev) => [...prev, t])}
              />
            )}
            {tab === "admin" && <AdminTab telemetry={telemetry} />}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>
            Usaremos localidade, área, cultivo e valores deste formulário somente para calcular esta sessão e
            responder pela LettuceIA. Não salvamos o rascunho. As estimativas têm premissas e não substituem
            assistência técnica.
          </p>
          <p>Demo de hackathon · recorte fixo de Jundiapeba, Mogi das Cruzes — SP · snapshots públicos de 19/08/2026.</p>
        </div>
      </footer>

      <nav className="tabbar" aria-label="Seções do app">
        {TABS.map((t) => (
          <button key={t.id} aria-selected={tab === t.id} onClick={() => go(t.id)}>
            <span className="tab-ico">
              <t.icon />
            </span>
            {t.short}
          </button>
        ))}
      </nav>
    </div>
  );
}
