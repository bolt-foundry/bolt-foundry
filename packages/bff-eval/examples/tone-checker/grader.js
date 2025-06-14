const { makeGraderDeckBuilder } = require("@bolt-foundry/bolt-foundry");

// Create a grader that evaluates tone and communication style
module.exports = makeGraderDeckBuilder("tone-checker")
  .spec(
    "You are an expert at evaluating the tone and communication style of assistant responses.",
  )
  .card(
    "evaluation criteria",
    (c) =>
      c.spec("Check if the tone matches the context of the user's request")
        .spec("Verify the response is appropriately professional or casual")
        .spec("Ensure the response is respectful and helpful"),
  )
  .card(
    "scoring guidelines",
    (c) =>
      c.spec(
        "Score 3: Perfect - Tone perfectly matches context, highly professional and helpful",
      )
        .spec(
          "Score 2: Good - Appropriate tone with minor improvements possible",
        )
        .spec(
          "Score 1: Acceptable - Generally appropriate but somewhat mismatched",
        )
        .spec(
          "Score -1: Poor - Tone is noticeably inappropriate for the context",
        )
        .spec(
          "Score -3: Failure - Completely wrong tone, unprofessional or unhelpful",
        ),
  );
