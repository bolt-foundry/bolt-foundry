
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { createOpenAIFetch } from "@bolt-foundry/bolt-foundry"


const openai = createOpenAI({
  fetch: createOpenAIFetch({
    openAiApiKey: process.env.OPENAI_API_KEY,
    posthogApiKey: process.env.POSTHOG_NEXTJS_API_KEY,
  })
});

export default async function handler(req, res) {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: {
        message: "OpenAI API key not configured",
      }
    });
  }

  try {
    // In Next.js API routes, req.body is already parsed
    const { messages } = req.body;

    // Use generateText instead of streamText for non-streaming responses
    const result = await generateText({
      model: openai('gpt-3.5-turbo'),
      messages,
    });

    // Return the complete response
    return res.status(200).json({
      content: result.text,
    });
  } catch(error) {
    console.error(`Error with OpenAI API request: ${error.message}`);
    return res.status(500).json({
      error: {
        message: 'An error occurred during your request.',
      }
    });
  }
}
