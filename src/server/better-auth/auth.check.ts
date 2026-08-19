import assert from "node:assert/strict";
import { betterAuth } from "better-auth";
import { verifyPassword } from "better-auth/crypto";

import { auth } from ".";
import { demoAuth } from "./demo";
import { requireSession } from "./server";

const DEMO_PASSWORD = "123123";

async function createSeededAuth() {
  const testAuth = betterAuth({
    baseURL: "http://localhost:3000",
    secret: "test-secret-long-enough-for-demo-auth",
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      minPasswordLength: 6,
    },
  });
  const context = await testAuth.$context;
  const seededUser = await context.internalAdapter.createUser(
    {
      name: demoAuth.name,
      email: demoAuth.email,
      emailVerified: true,
    },
    { method: "email-password" },
  );

  await context.internalAdapter.linkAccount({
    userId: seededUser.id,
    providerId: "credential",
    issuer: "local:credential",
    accountId: seededUser.id,
    password: demoAuth.passwordHash,
  });

  return testAuth;
}

function cookieHeader(setCookie: string) {
  return setCookie
    .split(/, (?=[a-zA-Z_]+=)/)
    .map((cookie) => cookie.split(";", 1)[0])
    .join("; ");
}

async function main() {
  assert.equal(auth.options.emailAndPassword?.disableSignUp, true);
  assert.notEqual(demoAuth.passwordHash, DEMO_PASSWORD);
  assert.equal(
    await verifyPassword({
      hash: demoAuth.passwordHash,
      password: DEMO_PASSWORD,
    }),
    true,
  );

  const testAuth = await createSeededAuth();
  const loginResponse = await testAuth.handler(
    new Request("http://localhost:3000/api/auth/sign-in/email", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "http://localhost:3000",
      },
      body: JSON.stringify({ email: demoAuth.email, password: DEMO_PASSWORD }),
    }),
  );
  assert.equal(loginResponse.status, 200);
  const login = (await loginResponse.json()) as { token: string };
  assert.ok(login.token);
  const cookies = new Headers({
    cookie: cookieHeader(loginResponse.headers.get("set-cookie") ?? ""),
  });
  assert.ok(await testAuth.api.getSession({ headers: cookies }));

  await assert.rejects(
    testAuth.api.signInEmail({
      body: { email: demoAuth.email, password: "wrong-password" },
    }),
    /Invalid email or password/,
  );

  await assert.rejects(
    testAuth.api.signUpEmail({
      body: {
        name: "Outro usuário",
        email: "outro@example.com",
        password: DEMO_PASSWORD,
      },
    }),
    /Email and password sign up is not enabled/,
  );

  await testAuth.handler(
    new Request("http://localhost:3000/api/auth/sign-out", {
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
        cookie: cookies.get("cookie")!,
      },
    }),
  );
  assert.equal(await testAuth.api.getSession({ headers: cookies }), null);
  assert.throws(() => requireSession(null));

  console.log("Auth checks passed");
}

await main();
