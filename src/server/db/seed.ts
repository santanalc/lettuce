import { createLocalAccountIssuer } from "@better-auth/core/db";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";

import { demoAuth } from "~/server/better-auth/demo";
import { db } from "~/server/db";
import { account, user } from "~/server/db/schema";

if (!demoAuth.enabled) {
  throw new Error(
    "Demo auth is disabled. Set DEMO_AUTH_ENABLED=true before running the seed.",
  );
}

const now = new Date();

await db
  .insert(user)
  .values({
    id: randomUUID(),
    name: demoAuth.name,
    email: demoAuth.email,
    emailVerified: true,
    createdAt: now,
    updatedAt: now,
  })
  .onConflictDoNothing({ target: user.email });

const seededUser = await db.query.user.findFirst({
  columns: { id: true },
  where: eq(user.email, demoAuth.email),
});

if (!seededUser) {
  throw new Error("Could not create the demo user.");
}

await db
  .insert(account)
  .values({
    id: randomUUID(),
    accountId: seededUser.id,
    issuer: createLocalAccountIssuer("credential"),
    providerId: "credential",
    userId: seededUser.id,
    password: demoAuth.passwordHash,
    createdAt: now,
    updatedAt: now,
  })
  .onConflictDoUpdate({
    target: [account.issuer, account.accountId],
    set: { password: demoAuth.passwordHash, updatedAt: now },
  });

console.log(`Demo account ready: ${demoAuth.email}`);
