
import {connectToOpenAi} from "@bolt-foundry/bolt-foundry";
import OpenAi from "@openai/openai";

export const openai = new OpenAi({
  fetch: connectToOpenAi(Deno.env.get("OPENAI_API_KEY"))
});

// Hello world completion function
export async function helloWorldCompletion() {
  try {
    const completion = await openai.chat.completions.create({
      model: "jupyter-nb",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant."
        },
        {
          role: "user",
          content: "Say hello world!"
        }
      ],
    });
    
    console.log("Response:", completion.choices[0]?.message.content);
    return completion.choices[0]?.message.content;
  } catch (error) {
    console.error("Error in completion:", error);
    throw error;
  }
}

// Example usage
if (import.meta.main) {
  helloWorldCompletion()
    .then(response => console.log("Function returned:", response))
    .catch(err => console.error("Function error:", err));
}

export function nb() {
  return helloWorldCompletion();
}