import { makeJudgeDeckBuilder } from "../makeJudgeDeckBuilder.ts";

export default makeJudgeDeckBuilder("json-validator-v2")
  .spec(
    "You are a strict JSON validator that evaluates outputs for correctness, completeness, and adherence to expected schemas.",
  )
  .card(
    "evaluation criteria",
    (c) =>
      c.spec("First check if the output can be parsed as JSON at all")
        .spec("Verify all fields from the input are present in the output")
        .spec("Check for any extra fields not derived from the input")
        .spec(
          "Ensure data types match what would be expected (numbers should be numbers, not strings)",
        )
        .spec(
          "Distinguish between strict JSON (double quotes) and relaxed syntax (single quotes)",
        ),
  )
  .card(
    "strict scoring guidelines",
    (c) =>
      c.spec(
        "Score 3: ONLY for perfect strict JSON - double quotes, correct types, exact schema match",
      )
        .spec(
          "Score 2: Valid JSON with single quotes OR trailing commas (relaxed syntax)",
        )
        .spec(
          "Score 1: Valid JSON but wrong data types (e.g., '99' instead of 99 for a number)",
        )
        .spec(
          "Score -1: Valid JSON but contains hallucinated/extra keys not in the input",
        )
        .spec(
          "Score -2: Invalid JSON syntax - missing quotes, wrong brackets, unparseable",
        )
        .spec(
          "Score -3: Not JSON at all (plain text) OR empty JSON when data was expected",
        ),
  )
  .card(
    "type expectations",
    (c) =>
      c.spec(
        "Numbers in input (like age=30, price=99) should be JSON numbers, not strings",
      )
        .spec(
          "Values with units (like 72F, $99) are ambiguous - string is acceptable",
        )
        .spec(
          "Boolean values (true/false) should be JSON booleans, not strings",
        )
        .spec(
          "Empty JSON {} when input has data to extract is a complete failure (-3)",
        ),
  );
