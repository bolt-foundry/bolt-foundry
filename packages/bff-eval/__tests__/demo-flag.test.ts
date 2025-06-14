import { cli } from "../src/cli";
import * as path from "node:path";
import * as fs from "node:fs";

describe("--demo flag", () => {
  it("should resolve demo paths correctly", () => {
    const args = ["--demo", "json-validator"];
    const parsed = cli.parse(args);

    expect(parsed.input).toContain("examples/json-validator/samples.jsonl");
    expect(parsed.grader).toContain("examples/json-validator/grader.ts");
  });

  it("should error on non-existent demo", () => {
    const args = ["--demo", "non-existent"];

    expect(() => cli.parse(args)).toThrow("Demo 'non-existent' not found");
  });

  it("should be mutually exclusive with input/grader", () => {
    const args = ["--demo", "json-validator", "--input", "test.jsonl"];

    expect(() => cli.parse(args)).toThrow("mutually exclusive");
  });
});
