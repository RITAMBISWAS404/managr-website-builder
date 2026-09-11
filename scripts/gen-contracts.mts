/* Regenerates WEBSITE-SECTION-CONTRACTS.md from the typed registry.
   Run: npm run contracts   (node strips the type-only import at load) */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { renderContractsMarkdown } from "../src/features/sections/contracts.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "WEBSITE-SECTION-CONTRACTS.md");
writeFileSync(out, renderContractsMarkdown(), "utf8");
console.log("wrote", out);
