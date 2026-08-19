import { redirect } from "next/navigation";
import Link from "next/link";

import { LoginForm } from "~/app/_components/login-form";
import { demoAuth } from "~/server/better-auth/demo";
import { getSession } from "~/server/better-auth/server";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/app");

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="login-title">
        <Link className="auth-brand" href="/" aria-label="Lettuce — início">
          <span aria-hidden="true">✦</span> Lettuce
        </Link>
        <p className="eyebrow">Acesso à demonstração</p>
        <h1 id="login-title">Entre para explorar o seu talhão.</h1>
        <p className="auth-copy">
          Use seu email e senha para acessar Planos e o Agente Hermes.
        </p>
        <LoginForm demoEnabled={demoAuth.enabled} />
        <Link className="auth-back" href="/">
          ← Voltar para a apresentação
        </Link>
      </section>
    </main>
  );
}
