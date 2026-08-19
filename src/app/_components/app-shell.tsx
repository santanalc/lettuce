"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { authClient } from "~/server/better-auth/client";

export function AppShell({
  user,
  children,
}: {
  user: { name: string; email: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const result = await authClient.signOut();
    if (!result.error) {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <div className="saas-shell">
      <header className="saas-header">
        <Link className="saas-brand" href="/app">
          <span aria-hidden="true">✦</span> Lettuce
        </Link>
        <nav className="saas-nav" aria-label="Área do SaaS">
          <Link
            className={pathname.startsWith("/app/planos") ? "active" : ""}
            href="/app/planos"
          >
            Planos
          </Link>
          <Link
            className={pathname.startsWith("/app/agente") ? "active" : ""}
            href="/app/agente"
          >
            Agente
          </Link>
        </nav>
        <div className="saas-account">
          <span>{user.name}</span>
          <button type="button" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>
      <main className="saas-main">{children}</main>
    </div>
  );
}
