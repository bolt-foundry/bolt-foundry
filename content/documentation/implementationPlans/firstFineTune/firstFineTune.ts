import { createFoundry } from "@bolt-foundry/bolt-foundry";
import OpenAi from "@openai/openai";
import { getLogger } from "packages/logger.ts";
const logger = getLogger(import.meta);

export const openai = new OpenAi({
  fetch: createFoundry(Deno.env.get("OPENAI_API_KEY")),
});

// Hello world completion function
export async function helloWorldCompletion() {
  try {
    const completion = await openai.chat.completions.create({
      model: "jupyter-nb",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: "Say hello world!",
        },
      ],
    });

    logger.info("Response:", completion.choices[0]?.message.content);
    return completion.choices[0]?.message.content;
  } catch (error) {
    logger.error("Error in completion:", error);
    throw error;
  }
}

// Example usage
if (import.meta.main) {
  helloWorldCompletion()
    .then((response) => logger.info("Function returned:", response))
    .catch((err) => logger.error("Function error:", err));
}

export function nb() {
  return helloWorldCompletion();
}
