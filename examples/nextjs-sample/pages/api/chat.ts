import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export default async function handler(req, res) {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: {
        message: "OpenAI API key not configured",
      },
    });
  }

  try {
    // In Next.js API routes, req.body is already parsed
    const { messages } = req.body;

    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      messages,
      onError: ({ error }) => {
        console.error(`Error with OpenAI API request: ${error.message}`);
      },
    });

    // Respond with the stream
    return result.pipeDataStreamToResponse(res);
  } catch (error) {
    console.error(`Error with OpenAI API request: ${error.message}`);
    return res.status(500).json({
      error: {
        message: "An error occurred during your request.",
      },
    });
  }
}
