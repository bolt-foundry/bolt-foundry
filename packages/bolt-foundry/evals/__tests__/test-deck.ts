import { makeDeckBuilder } from "../../builders/builders.ts";

export default makeDeckBuilder("test-evaluator")
  .spec("You are a helpful assistant that evaluates responses.")
  .card(
    "evaluation task",
    (c) => c.spec("Evaluate the AI assistant response based on the criteria"),
  )
  .card(
    "evaluation criteria",
    (c) =>
      c.spec("Check if the response is appropriate")
        .spec("Verify the response addresses the user's request"),
  )
  .card(
    "output format",
    (c) => c.spec("Return a JSON object with score (-3 to 3) and notes"),
  )
  .context((c) =>
    c.string("userMessage", "User's message")
      .string("assistantResponse", "Assistant's response")
  );
