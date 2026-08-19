import { useEffect, useRef, useState } from "react";
import type { ChatMessage, ChatTelemetry } from "../App";

const SUGESTOES = [
  "Por que a alface aparece antes do repolho?",
  "Compara as três culturas para o meu talhão",
  "Explica o investimento estimado",
  "Qual defensivo devo aplicar contra pulgão?",
];

const TIMEOUT_MS = 100_000;

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
  const [erro, setErro] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [history, pensando]);

  async function enviar(texto: string) {
    const pergunta = texto.trim();
    if (!pergunta || pensando) return;
    setErro(null);
    setInput("");
    setPensando(true);
    const novoHistorico: ChatMessage[] = [...history, { role: "user" as const, content: pergunta }];
    setHistory(() => novoHistorico);

    const inicio = performance.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ messages: novoHistorico.slice(-10), context: planSummary }),
      });
      const lat = Math.round(performance.now() - inicio);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { reply?: string };
      if (!data.reply) throw new Error("resposta vazia");
      setHistory((prev) => [...prev, { role: "assistant", content: data.reply! }]);
      onTelemetry({ ts: new Date().toISOString(), status: "ok", latenciaMs: lat, perguntaChars: pergunta.length, respostaChars: data.reply.length });
    } catch {
      const lat = Math.round(performance.now() - inicio);
      setErro("Assistente indisponível neste momento. O plano determinístico continua funcionando na aba Plano de cultivo.");
      onTelemetry({ ts: new Date().toISOString(), status: "erro", latenciaMs: lat, perguntaChars: pergunta.length, respostaChars: 0 });
    } finally {
      clearTimeout(timer);
      setPensando(false);
    }
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
        {erro && <p className="msg msg-ia">{erro}</p>}
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
          void enviar(input);
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
        A conexão é real: navegador → Worker (Cloudflare) → agente Hermes no servidor da equipe.
      </p>
    </div>
  );
}
