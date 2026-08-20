/**
 * Regenerates `aldiBaselineSnapshot.ts` from current behaviour.
 *
 *   npm run baseline:record
 *
 * Deliberately manual. Re-recording is how an intended behaviour change is
 * accepted, and the resulting Git diff is the review artefact: a slice that
 * did not mean to change planning must produce an empty diff here, and one
 * that did must explain the diff line by line.
 *
 * Emitted as a TypeScript module rather than JSON because the server
 * `tsconfig.json` does not enable `resolveJsonModule`, and because a `.ts`
 * snapshot is typechecked by `npm run typecheck:server` — a drift between the
 * response contract and the recorded evidence becomes a compile error rather
 * than a silent mismatch.
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { captureBaseline } from "./baselineCapture";

const HEADER = `/**
 * GENERATED FILE — do not edit by hand.
 *
 * Recorded by \`npm run baseline:record\` from the fixture Aldi catalogue in
 * \`server/testing/planningFixtures.ts\`. This is the Phase 0 regression oracle
 * for the multi-retailer migration: it is what "Aldi behaviour is preserved"
 * actually means, expressed as data.
 *
 * A diff in this file is a change in planning behaviour. There is no other
 * reading of it.
 */

import type { BaselineRecord } from "./baselineCapture";

export const ALDI_BASELINE: BaselineRecord = `;

async function main(): Promise<void> {
  const record = await captureBaseline();
  // `__dirname` rather than `import.meta`: the server tsconfig emits CommonJS,
  // where `import.meta` is a compile error.
  const target = join(__dirname, "aldiBaselineSnapshot.ts");

  // Two-space JSON keeps the diff readable line by line, which is the whole
  // point of committing it.
  writeFileSync(target, `${HEADER}${JSON.stringify(record, null, 2)};\n`, "utf8");

  console.log(
    `Recorded ${record.scenarios.length} scenarios and ${record.replacements.length} replacements ` +
      `for engine ${record.engineVersion} -> ${target}`,
  );
}

void main().catch((error: unknown) => {
  console.error("Baseline recording failed");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
