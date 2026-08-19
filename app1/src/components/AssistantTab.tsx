import { useEffect, useRef, useState } from "react";
import type { ChatMessage, ChatTelemetry } from "../App";
import { responderOffline } from "../data/respostas-demo";

const SUGESTOES = [
  "Por que a alface aparece antes do repolho?",
  "Compara as três culturas para o meu talhão",
  "Como funciona a conta do lucro?",
  "Qual defensivo devo aplicar contra pulgão?",
];

const DELAY_MIN_MS = 550;
const DELAY_MAX_MS = 950;

export function AssistantTab({
  planSummary,
  history,
  setHistory,
  onTelemetry,
}: {
  planSummary: Record<string, unknown> | null;
  history: ChatMessage[];
  setHistory: (updater: (prev: ChatMessage[]) => ChatMessage[]) => void;
  onTelemetry: (t: ChatTelemetry) => void;
}) {
  const [input, setInput] = useState("");
  const [pensando, setPensando] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [history, pensando]);

  function enviar(texto: string) {
    const pergunta = texto.trim();
    if (!pergunta || pensando) return;
    setInput("");
    setPensando(true);
    setHistory((prev) => [...prev, { role: "user" as const, content: pergunta }]);

    const inicio = performance.now();
    const { resposta } = responderOffline(pergunta);
    const delay = DELAY_MIN_MS + Math.random() * (DELAY_MAX_MS - DELAY_MIN_MS);
    window.setTimeout(() => {
      setHistory((prev) => [...prev, { role: "assistant", content: resposta }]);
      onTelemetry({
        ts: new Date().toISOString(),
        status: "ok",
        latenciaMs: Math.round(performance.now() - inicio),
        perguntaChars: pergunta.length,
        respostaChars: resposta.length,
      });
      setPensando(false);
    }, delay);
  }

  return (
    <div className="card chat-card">
      <p className="eyebrow">LettuceIA · explicações com fonte</p>
      <h2>Pergunte sobre o plano</h2>
      <p className="card-sub">
        A LettuceIA explica resultados já calculados e compara opções. Ela não altera o plano, não inventa dados e não
        prescreve defensivo ou dose.{planSummary ? " Contexto atual: plano gerado na aba ao lado." : " Gere um plano na aba Plano de cultivo para dar contexto à conversa."}
      </p>

      <div className="chat-scroll" ref={scrollRef} aria-live="polite">
        {history.length === 0 && (
          <p className="msg msg-meta">A conversa desta sessão aparece aqui. Nada é salvo depois que você fecha a página.</p>
        )}
        {history.map((m, i) => (
          <p key={i} className={`msg ${m.role === "user" ? "msg-user" : "msg-ia"}`}>{m.content}</p>
        ))}
        {pensando && <p className="msg msg-meta">LettuceIA está consultando o plano…</p>}
      </div>

      <div className="chip-row" aria-label="Sugestões de pergunta">
        {SUGESTOES.map((s) => (
          <button key={s} className="chip" onClick={() => enviar(s)} disabled={pensando}>{s}</button>
        ))}
      </div>

      <form
        className="chat-input-row"
        onSubmit={(e) => {
          e.preventDefault();
          enviar(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escreva sua pergunta sobre o plano"
          aria-label="Pergunta para a LettuceIA"
        />
        <button className="chat-send" type="submit" disabled={pensando || input.trim().length === 0}>
          Enviar
        </button>
      </form>

      <p className="chat-disclaimer">
        Perguntas sobre defensivo, dose, aplicação ou diagnóstico de praga são encaminhadas a um responsável técnico.
        Modo demonstração offline: respostas preparadas pela equipe a partir do roteiro, sem chamada externa.
      </p>
    </div>
  );
}
