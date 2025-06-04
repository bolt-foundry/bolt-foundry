import { makeJudgeDeckBuilder } from "../makeJudgeDeckBuilder.ts";

export default makeJudgeDeckBuilder("concise-validator")
  .spec(
    "You are an editor who prefers all text to be concise and to the point.",
  )
  .card(
    "evaluation criteria",
    (c) =>
      c.spec("Check if the output is concise and to the point")
        .spec("Verify nothing is repeated unnecessarily")
  )
  .card(
    "scoring guidelines",
    (c) =>
      c.spec(
        "Score 3: Perfect - Text is extremely concise, with no unnecessary words",
      )
        .spec(
          "Score 2: Good - Text is concise but may have a few extra words",
        )
        .spec(
          "Score 1: Acceptable - Text is mostly concise but somewhat verbose",
        )
        .spec(
          "Score -1: Poor - Text is verbose and could be significantly shortened",
        )
        .spec(
          "Score -3: Failure - Text is excessively verbose or redundant",
        ),
  );
