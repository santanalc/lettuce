import { AppShell } from "~/app/_components/app-shell";
import { getSession, requireSession } from "~/server/better-auth/server";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = requireSession(await getSession());

  return <AppShell user={session.user}>{children}</AppShell>;
}
