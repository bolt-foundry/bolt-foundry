import { makeGraderDeckBuilder } from "packages/bolt-foundry/evals/makeGraderDeckBuilder.ts";

export default makeGraderDeckBuilder("fastpitch-grader")
  .spec(
    "Evaluate how well a baseball game article is summarized for casual sports fans who receive weekly text updates",
  )
  .card(
    "text message recipient persona",
    (c) =>
      c.spec("Name: Sarah, 32, marketing professional")
        .spec(
          "Sports knowledge: Knows basic rules of baseball but not deep strategy",
        )
        .spec(
          "Interest level: Enjoys following the local team casually, likes feeling connected to community",
        )
        .spec(
          "Reading context: Receives these summaries as Sunday morning texts while having coffee",
        )
        .spec(
          "Preferences: Appreciates human stories, exciting moments, and understanding why games matter",
        )
        .spec(
          "Dislikes: Too much jargon, overwhelming statistics, or assumed knowledge",
        ),
  )
  .card(
    "summary writer persona",
    (c) =>
      c.spec(
        "Role: Friendly sports enthusiast who explains games to casual fans",
      )
        .spec("Tone: Conversational, like texting a knowledgeable friend")
        .spec(
          "Focus: Highlights drama, key moments, and what makes games memorable",
        )
        .spec(
          "Teaching style: Explains baseball-specific concepts naturally in context",
        )
        .spec(
          "Length: Keeps summaries to 2-3 short paragraphs suitable for text message",
        ),
  )
  .card(
    "baseball-specific evaluation criteria",
    (c) =>
      c.spec(
        "Correctly uses baseball terminology (innings, strikes, RBIs, etc.) with brief explanations",
      )
        .spec(
          "Accurately describes the flow of the game (who was winning when, momentum shifts)",
        )
        .spec(
          "Highlights baseball-unique elements: pitching matchups, defensive plays, base running",
        )
        .spec(
          "Explains why certain moments matter (e.g., 'bases loaded with two outs' = high pressure)",
        )
        .spec(
          "Includes the final score and what it means for the team's season",
        ),
  )
  .card(
    "content evaluation criteria",
    (c) =>
      c.spec("Captures the most exciting or important moments from the game")
        .spec(
          "Includes human interest elements (player stories, crowd reactions, milestones)",
        )
        .spec("Appropriate length for a text message (150-250 words)")
        .spec("Accessible language that doesn't assume deep baseball knowledge")
        .spec(
          "Engaging narrative that makes recipient want to follow the team",
        ),
  )
  .card(
    "scoring guidelines",
    (c) =>
      c.spec(
        "Score 3: Perfect summary - Captures game excitement, explains baseball concepts naturally, perfect length, highly engaging",
      )
        .spec(
          "Score 2: Great summary - Hits most key points, minor issues with clarity or missing one memorable moment",
        )
        .spec(
          "Score 1: Good summary - Covers basics but either too technical or misses some drama, acceptable but not exciting",
        )
        .spec(
          "Score 0: Unable to be graded for whatever reason",
        )
        .spec(
          "Score -1: Poor summary - Confusing baseball terms, wrong emphasis, or way too long/short",
        )
        .spec(
          "Score -2: Bad summary - Multiple errors, assumes too much knowledge, or completely misses the point",
        )
        .spec(
          "Score -3: Terrible summary - Factually wrong, incomprehensible, or completely inappropriate tone",
        ),
  );
