import { ChatOpenAI } from "https://esm.sh/@langchain/openai";
import { ChatPromptTemplate } from "https://esm.sh/@langchain/core/prompts";
import { StringOutputParser } from "https://esm.sh/@langchain/core/output_parsers";




let allowedModels = ["gpt-3.5-turbo"];
const openAIApiKey = Deno.env.get("OPENAI_API_KEY") ?? "";

export const callAPI = async (userMessage: string, systemMessage?: string, suggestedModel?: string) => {

  const modelName = allowedModels.includes(suggestedModel) ? suggestedModel : "gpt-3.5-turbo";
  const llmInterface = new ChatOpenAI({model: modelName, apiKey: openAIApiKey});
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `${systemMessage}`],
    ["user", "{input}"],
  ]);
  const outputParser = new StringOutputParser();

  const chain = prompt.pipe(llmInterface).pipe(outputParser);
  const response = await chain.invoke({input: userMessage});
  console.log(response);
  return response;
}