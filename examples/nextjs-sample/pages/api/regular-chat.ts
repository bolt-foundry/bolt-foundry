import { NextApiRequest, NextApiResponse } from "next";
import { BfClient, connectBoltFoundry } from "@bolt-foundry/bolt-foundry-next";
import OpenAI from "openai";

const bfClient = BfClient.create();
const assistantCard = bfClient.createAssistantCard(
  "assistant",
  (b) =>
    b.spec("You are a pokemon master trainer.").context((c) =>
      c.string("userName", "What is the user's name?").number(
        "userAge",
        "What is the user's age?",
      ).object("preferences", "What are the user's preferences?")
    ),
);

const client = new OpenAI({
  fetch: connectBoltFoundry(
    `bf+${process.env.EXAMPLES_NEXTJS_SAMPLE_POSTHOG_NEXTJS_API_KEY}`,
  ),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;
    const renderedCard = assistantCard.render({
      model: "gpt-3.5-turbo",
      messages,
      context: { userName: "Alice" },
    });
    console.log(renderedCard);
    const response = await client.chat.completions.create(renderedCard);
    console.log(response);
    const assistantResponse = response.choices[0].message.content;
    console.log(assistantResponse);
    return res.status(200).json({ content: assistantResponse });
  } catch (error: any) {
    console.error("Error in chat API:", error);
    return res.status(500).json({
      error: error.message || "Failed to process request",
    });
  }
}
