import { makeGraderDeckBuilder } from "../../makeGraderDeckBuilder.ts";

export default makeGraderDeckBuilder("json-validator")
  .spec("Expert JSON extraction evaluator")
  .spec("Evaluates whether assistant correctly extracts information into valid JSON format")
  .card("evaluation criteria", (c) =>
    c.spec("Valid JSON: Response must contain valid, parseable JSON")
      .spec("Required fields: JSON must include all required fields from the request")
      .spec("Correct values: Extracted values must match the source information")
      .spec("Schema compliance: JSON must follow any specified schema requirements")
      .spec("Clean output: Response should contain only JSON without extra text")
  )
  .card("scoring guidelines", (c) =>
    c.spec("Score 3: Perfect extraction - valid JSON with all required fields and correct values")
      .spec("Score 2: Good extraction - valid JSON with minor issues (e.g., extra fields, minor formatting)")
      .spec("Score 1: Partial success - valid JSON but missing some fields or incorrect values")
      .spec("Score 0: Attempted JSON - malformed JSON or significant extraction errors")
      .spec("Score -1: Poor attempt - minimal JSON structure with major errors")
      .spec("Score -2: Failed extraction - no valid JSON or completely wrong format")
      .spec("Score -3: Complete failure - no attempt at JSON extraction")
  )
  .card("common issues to check", (c) =>
    c.spec("Invalid JSON syntax (missing quotes, commas, brackets)")
      .spec("Text mixed with JSON (explanations before/after JSON)")
      .spec("Missing required fields")
      .spec("Incorrect data types (string instead of number, etc.)")
      .spec("Nested structure errors")
      .spec("Array formatting issues")
  )
  .card("output format", (c) =>
    c.spec("Return JSON with 'score' (-3 to 3) and 'notes' explaining the evaluation")
      .spec("Include specific errors found in the notes")
      .spec("Mention which fields were missing or incorrect")
  );