import { makeGraderDeckBuilder } from "../makeGraderDeckBuilder.ts";

export default makeGraderDeckBuilder("json-validator")
  .spec(
    "You are an expert at evaluating JSON outputs for correctness and completeness.",
  )
  .lead("Now let's talk about how you think")
  .card(
    "evaluation criteria",
    (c) =>
      c.spec("Check if the output is valid JSON syntax")
        .spec("Verify all required fields are present")
        .spec("Ensure data types match expected schema", { samples: []}),
  )
  .lead("Now let's talk about your scoring")
  .card(
    "scoring guidelines",
    (c) =>
      c.spec(
        "Score 3: Perfect - Strict valid JSON that exactly matches the expected schema",
      )
        .spec(
          "Score 2: Good - Valid JSON but uses relaxed syntax (single quotes, trailing commas, etc)",
        )
        .spec(
          "Score 1: Acceptable - Valid JSON but has missing optional fields",
        )
        .spec(
          "Score -1: Poor - Valid JSON but has hallucinated/extra keys not in the input",
        )
        .spec(
          "Score -3: Failure - Not JSON at all, plain text, or doesn't parse",
        ),
  );
