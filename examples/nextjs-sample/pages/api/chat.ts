import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { createOpenAiFetch } from "@bolt-foundry/bolt-foundry";

// Create OpenAI instance with custom fetch wrapper.  This assumes generateText handles the OpenAI interaction.
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  fetch: createOpenAiFetch(process.env.OPENAI_API_KEY),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const response = await generateText({
      model: openaiClient.models["gpt-3.5-turbo"], // Assuming generateText uses the model this way
      prompt: message,
      maxTokens: 500,
    });

    res.status(200).json({
      response: { text: response.text || response },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
