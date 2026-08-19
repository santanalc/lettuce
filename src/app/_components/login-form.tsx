"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "~/server/better-auth/client";

export function LoginForm({ demoEnabled }: { demoEnabled: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await authClient.signIn.email({ email, password });

      if (result.error) {
        setError("Email ou senha inválidos.");
        return;
      }

      router.replace("/app");
      router.refresh();
    } catch {
      setError("Email ou senha inválidos.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <label htmlFor="password">Senha</label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}

      <button
        className="button button-lime auth-submit"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Entrando…" : "Entrar na demonstração"}
      </button>

      <p className="auth-mode">
        {demoEnabled
          ? "Modo demonstração · acesso autorizado pela equipe"
          : "Acesso restrito"}
      </p>
    </form>
  );
}
