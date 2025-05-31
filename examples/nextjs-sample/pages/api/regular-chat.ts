import { NextApiRequest, NextApiResponse } from "next";
import { BfClient, connectBoltFoundry } from "@bolt-foundry/bolt-foundry-next";
import OpenAI from "openai";

Deno.Command;

const bfClient = BfClient.create();
const assistantDeck = bfClient.createAssistantDeck(
  "assistant",
  (b) =>
    b.spec("You are a pokemon master trainer.").context((c) =>
      c.string("userName", "What is the user's name?").number(
        "userAge",
        "What is the user's age?",
      ).object("preferences", "What are the user's preferences?")
    ),
);

// Note: This will be initialized per-request with the provided API key

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, apiKey } = req.body;
    
    // Use provided API key or fall back to environment variable
    const openAIApiKey = apiKey || process.env.OPENAI_API_KEY;
    
    if (!openAIApiKey) {
      return res.status(400).json({ 
        error: "OpenAI API key not configured",
        message: "Please provide an OpenAI API key to use this demo.",
        details: "You can either enter your API key in the form above, or set the OPENAI_API_KEY environment variable.",
        helpUrl: "https://platform.openai.com/api-keys"
      });
    }

    // Create client with the API key
    const client = new OpenAI({
      apiKey: openAIApiKey,
      fetch: connectBoltFoundry(
        `bf+${process.env.EXAMPLES_NEXTJS_SAMPLE_POSTHOG_NEXTJS_API_KEY}`,
      ),
    });

    const renderedDeck = assistantDeck.render({
      model: "gpt-3.5-turbo",
      messages,
      context: { userName: "Alice" },
    });
    console.log(renderedDeck);
    const response = await client.chat.completions.create(renderedDeck);
    console.log(response);

    // Type guard to ensure we have a non-streaming response
    // uncomment this once we have the api set up right.
    // if (!("choices" in response)) {
    //   throw new Error("Unexpected streaming response");
    // }

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
