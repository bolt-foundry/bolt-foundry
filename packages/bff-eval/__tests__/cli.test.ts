import { describe, it } from "node:test";
import assert from "node:assert";
import { spawn } from "node:child_process";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("bff-eval CLI", () => {
  it("should show help when called with --help", async () => {
    const result = await runCLI(["--help"]);
    assert.match(result.stdout, /Run LLM evaluation with grader decks/);
    assert.match(result.stdout, /--input/);
    assert.match(result.stdout, /--deck/);
    assert.match(result.stdout, /--model/);
    assert.equal(result.code, 0);
  });

  it("should show version when called with --version", async () => {
    const result = await runCLI(["--version"]);
    assert.match(result.stdout, /0\.1\.0/);
    assert.equal(result.code, 0);
  });

  it("should require input flag", async () => {
    const result = await runCLI(["--deck", "test.ts"]);
    assert.match(result.stderr, /Missing required argument: input/);
    assert.notEqual(result.code, 0);
  });

  it("should require deck flag", async () => {
    const result = await runCLI(["--input", "test.jsonl"]);
    assert.match(result.stderr, /Missing required argument: deck/);
    assert.notEqual(result.code, 0);
  });
});

function runCLI(
  args: string[],
): Promise<{ stdout: string; stderr: string; code: number | null }> {
  return new Promise((resolve) => {
    const binPath = path.join(__dirname, "..", "bin", "bff-eval.ts");
    const proc = spawn(
      "node",
      ["--experimental-strip-types", binPath, ...args],
      {
        env: { ...process.env, NODE_ENV: "test" },
      },
    );

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("close", (code) => {
      resolve({ stdout, stderr, code });
    });
  });
}
