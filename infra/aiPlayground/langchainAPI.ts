import { ChatOpenAI } from "https://esm.sh/@langchain/openai";
import { ChatPromptTemplate } from "https://esm.sh/@langchain/core/prompts";
import { StringOutputParser } from "https://esm.sh/@langchain/core/output_parsers";





// const modelName = "gpt-3.5-turbo";
const openAIApiKey = Deno.env.get("OPENAI_API_KEY") ?? "";

const model = new ChatOpenAI({model: "gpt-3.5-turbo", apiKey: openAIApiKey});

export const callAPI = async (userMessage: string, systemMessage: string) => {
  //const response = await model.invoke(humanMessage);

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `${systemMessage}`],
    ["user", "{input}"],
  ]);
  const outputParser = new StringOutputParser();

  const chain = prompt.pipe(model).pipe(outputParser);
  const response = await chain.invoke({input: userMessage});
  console.log(response);
  return response;
}