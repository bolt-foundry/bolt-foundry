import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(400).json({
      error: {
        message: "OpenAI API key not configured",
        details: "Please set the OPENAI_API_KEY environment variable to use this demo.",
        helpUrl: "https://platform.openai.com/api-keys"
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
        const errorMessage = error instanceof Error
          ? error.message
          : String(error);
        console.error(`Error with OpenAI API request: ${errorMessage}`);
      },
    });

    // Respond with the stream
    return result.pipeDataStreamToResponse(res);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error with OpenAI API request: ${errorMessage}`);
    return res.status(500).json({
      error: {
        message: "An error occurred during your request.",
      },
    });
  }
}
