import { env } from "~/env";

/**
 * The demo password is intentionally represented only by its Better Auth
 * hash. Keep DEMO_AUTH_ENABLED explicit in production.
 */
export const demoAuth = {
  enabled: env.DEMO_AUTH_ENABLED === "true",
  email: "joao@gmail.com",
  name: "João Produtor",
  passwordHash:
    "d75963090139d26def2e62eb87defe97:dc5794d848f3a4fb7b0612bbed08b744303f2c9a8bdc75bc3651e23d9002cf3b25bc9bc415dbb73225422f102e471ff5b63cd2bd724a7d98bcc823ff4085e1d1",
} as const;
