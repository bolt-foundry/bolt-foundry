const { makeGraderDeckBuilder } = require("@bolt-foundry/bolt-foundry");

module.exports = makeGraderDeckBuilder("json-validator")
  .spec("Expert JSON extraction evaluator")
  .spec(
    "Evaluates whether assistant correctly extracts information into valid JSON format",
  )
  .card(
    "scoring",
    (c) =>
      c.spec(
        "Perfect (3): Valid JSON with exact structure and all data correctly extracted",
      )
        .spec(
          "Good (2): Valid JSON with minor issues (extra fields, slightly different structure)",
        )
        .spec(
          "Acceptable (1): Valid JSON but missing some data or has minor errors",
        )
        .spec("Poor (-1): Invalid JSON but attempted correct structure")
        .spec("Very Poor (-2): Invalid JSON with major structural problems")
        .spec("Failure (-3): No JSON attempt or completely wrong format"),
  )
  .card(
    "evaluation process",
    (c) =>
      c.spec("First check if the output is valid JSON")
        .spec("Then verify all requested data is present and correct")
        .spec("Finally assess the structure matches expectations"),
  );
