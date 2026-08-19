import { auth } from ".";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

export function requireSession(
  session: Awaited<ReturnType<typeof getSession>>,
) {
  if (!session) redirect("/login");
  return session;
}
