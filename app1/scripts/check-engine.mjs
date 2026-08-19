// Valida os fixtures fail-closed fora do navegador (mesmo código da aba Admin).
import { build } from "esbuild";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const dir = mkdtempSync(join(tmpdir(), "lettuce-engine-"));
const outfile = join(dir, "checks.mjs");
await build({
  entryPoints: [new URL("../src/engine/checks.ts", import.meta.url).pathname],
  bundle: true,
  format: "esm",
  platform: "neutral",
  outfile,
});
const { rodarChecks } = await import(pathToFileURL(outfile));
const results = rodarChecks();
let falhas = 0;
for (const r of results) {
  const tag = r.passou ? "PASS" : "FAIL";
  if (!r.passou) falhas += 1;
  console.log(`[${tag}] ${r.nome} — ${r.detalhe}`);
}
writeFileSync(join(dir, "done"), "1");
if (falhas > 0) {
  console.error(`${falhas} check(s) falharam`);
  process.exit(1);
}
console.log("todos os checks passaram");
