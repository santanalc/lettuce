// Pages Function: ponte navegador → Hermes no VPS. O token nunca chega ao cliente.

interface ChatBody {
  messages?: { role?: string; content?: string }[];
  context?: unknown;
}

const MAX_MESSAGES = 12;
const MAX_CONTENT_CHARS = 4000;
// O hermes-agent no VPS leva 25-40s quando o modelo raciocina; margem larga.
const UPSTREAM_TIMEOUT_MS = 95_000;

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export async function onRequestPost(ctx: {
  request: Request;
  env: { HERMES_URL?: string; HERMES_TOKEN?: string };
}): Promise<Response> {
  const { request, env } = ctx;
  if (!env.HERMES_URL || !env.HERMES_TOKEN) {
    return jsonResponse(502, { error: "assistente indisponível" });
  }

  let body: ChatBody;
  try {
    body = (await request.json()) as ChatBody;
  } catch {
    return jsonResponse(400, { error: "JSON inválido" });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const valid = messages
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: (m.content as string).slice(0, MAX_CONTENT_CHARS) }));

  if (valid.length === 0 || valid[valid.length - 1]!.role !== "user") {
    return jsonResponse(400, { error: "é preciso ao menos uma mensagem de usuário" });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const upstream = await fetch(`${env.HERMES_URL}/chat`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.HERMES_TOKEN}`,
      },
      body: JSON.stringify({ messages: valid, context: body.context ?? null }),
    });
    if (!upstream.ok) {
      return jsonResponse(502, { error: "assistente indisponível" });
    }
    const data = (await upstream.json()) as { reply?: string };
    if (typeof data.reply !== "string" || data.reply.length === 0) {
      return jsonResponse(502, { error: "assistente indisponível" });
    }
    return jsonResponse(200, { reply: data.reply });
  } catch {
    return jsonResponse(502, { error: "assistente indisponível" });
  } finally {
    clearTimeout(timer);
  }
}
