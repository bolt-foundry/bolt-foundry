import { ChatOpenAI } from "https://esm.sh/@langchain/openai";
import { ChatPromptTemplate } from "https://esm.sh/@langchain/core/prompts";
import { StringOutputParser } from "https://esm.sh/@langchain/core/output_parsers";
import sample from "infra/aiPlayground/test_database/words/1da49b0955384e7aa51e110dbd25b736_words.json" with { type: "json" };


let allowedModels = ["gpt-3.5-turbo"];
const openAIApiKey = Deno.env.get("OPENAI_API_KEY") ?? "";

export const callAPI = async (userMessage: string, systemMessage?: string, suggestedModel?: string) => {
  const modelName = allowedModels.includes(suggestedModel) ? suggestedModel : "gpt-3.5-turbo";
  const llmInterface = new ChatOpenAI({model: modelName, apiKey: openAIApiKey});
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `${createSystemMessage()}`],
    ["user", "{input}"],
  ]);
  const outputParser = new StringOutputParser();

  const chain = prompt.pipe(llmInterface).pipe(outputParser);
  const response = await chain.invoke({input: userMessage});
  console.log(response);
  return response;
}



const createSystemMessage = () => {

  const randomDataArray = sample.map((item) => {
    return item.punctuated_word;
  });
  const randomData = randomDataArray.join(" ");

  console.log(randomData);
  return `
  You have a large database of video trancripts to reference included. Choose anecdotes from the transcripts based on the user prompt to finding instances  relating to the word or concept. Each anecdote should have a definite beginning and end, focusing on distinct narratives 
  within the text. Ensure that each extracted anecdote captures a coherent standalone anecdote or joke. Respond with each json object on its own line of text. IT IS IMPORTANT THAT EACH JSON OBJECT BE VERBATIM TO THE TRANSCRIPT AND EACH OBJECT ON ITS OWN LINE. OBJECTS SHOULD HAVE NO WHITESPACE OTHER THAN SPACES.
  Each object has a 'text' key representing the verbatim transcript of the story, a "description" key representing a summary of the story, and a 'title' key describing 
  the content of the story

  MAKE SURE THE OUTPUT LANGUAGE MATCHES THE INPUT LANGUAGE.

    Here is the large database of video trancripts to reference: ${randomData}
    `;
}






