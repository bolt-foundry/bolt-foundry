import type { EvalResult } from "../../scratchpad.ts";
import { stripThinkingOutputs } from "../../scratchpad.ts";

export default function postProcessJsonEval(result: EvalResult): EvalResult {
  // Initialize validations
  result.validations = {};

  try {
    // First strip any thinking outputs from the response
    const cleanedOutput = stripThinkingOutputs(result.output || "");

    // Try to parse the output as JSON
    result.parsed = JSON.parse(cleanedOutput || "{}");

    // Validation 1: Check if output is valid JSON
    result.validations.validJson = {
      passed: true,
      message: "Output is valid JSON",
    };

    // Validation 2: Check required fields for evaluation output
    const required = ["valid", "issues", "score", "explanation"];
    const missing = required.filter((field) => !(field in result.parsed));
    result.validations.requiredFields = {
      passed: missing.length === 0,
      message: missing.length > 0
        ? `Missing required fields: ${missing.join(", ")}`
        : "All required fields present",
    };

    // Validation 3: Check score range
    const score = result.parsed.score;
    result.validations.scoreRange = {
      passed: typeof score === "number" && score >= 0 && score <= 100,
      message: typeof score === "number"
        ? (score >= 0 && score <= 100
          ? "Score in valid range"
          : `Score ${score} out of range`)
        : "Score is not a number",
    };

    // Validation 4: Check issues is array
    result.validations.issuesFormat = {
      passed: Array.isArray(result.parsed.issues),
      message: Array.isArray(result.parsed.issues)
        ? "Issues is valid array"
        : "Issues is not an array",
    };

    // Validation 5: Check valid is boolean
    result.validations.validFormat = {
      passed: typeof result.parsed.valid === "boolean",
      message: typeof result.parsed.valid === "boolean"
        ? "Valid field is boolean"
        : "Valid field is not a boolean",
    };
  } catch (e) {
    // If JSON parsing fails
    result.validations.validJson = {
      passed: false,
      message: `JSON parse error: ${
        e instanceof Error ? e.message : String(e)
      }`,
    };
  }

  return result;
}
