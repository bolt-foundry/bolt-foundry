import { makeDeckBuilder } from "../../../builders/builders.ts";

export default function createJsonValidator() {
  return makeDeckBuilder("json-validator")
    .spec(
      "You are an expert at evaluating JSON outputs for correctness and completeness.",
    )
    .card(
      "evaluation criteria",
      (c) =>
        c.spec("Check if the output is valid JSON syntax")
          .spec(
            "Verify all required fields are present according to the schema",
          )
          .spec("Ensure data types match the expected schema")
          .spec("Identify any extra fields not in the schema"),
    )
    .card(
      "evaluation approach",
      (c) =>
        c.spec("Be thorough but fair in your evaluation")
          .spec("Provide specific examples when noting issues")
          .spec("Consider both structural and semantic correctness"),
    )
    .context((c) =>
      c.string("prompt", "What was the original prompt?")
        .string("response", "What was the LLM response to evaluate?")
        .object("expectedSchema", "What is the expected JSON schema?")
        .object(
          "outputFormat",
          "What format should the evaluation output follow?",
        )
    );
}
