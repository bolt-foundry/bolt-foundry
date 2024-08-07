import {
  ChatAnthropic,
  ChatOpenAI,
  ChatPromptTemplate,
  JsonOutputParser,
  StringOutputParser,
} from "packages/deps.ts";
import { DGWord } from "packages/types/transcript.ts";
import { AiModel } from "packages/client/components/clipsearch/Search.tsx";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY") ?? "";
const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY") ?? "";

type Document = {
  filename: string;
  transcript: string;
};

export const callAPI = async (
  userMessage: string,
  documents: Array<Document>,
  suggestedModel?: string | null | undefined,
  systemMessage?: string,
) => {
  let llmInterface;
  switch (suggestedModel) {
    case AiModel.CLAUDE_OPUS:
    case AiModel.CLAUDE_SONNET: {
      llmInterface = new ChatAnthropic({
        model: suggestedModel,
        apiKey: anthropicApiKey,
        temperature: 0,
      });
      break;
    }
    default: {
      llmInterface = new ChatOpenAI({
        model: suggestedModel,
        apiKey: openAIApiKey,
        temperature: 0,
        presencePenalty: 0,
        frequencyPenalty: 0,
      });
    }
  }

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `${createSystemMessage(documents)}`],
    ["user", "{input}"],
  ]);
  let outputParser = new JsonOutputParser();
  if (
    suggestedModel === AiModel.CLAUDE_OPUS ||
    suggestedModel === AiModel.CLAUDE_SONNET
  ) {
    outputParser = new StringOutputParser();
  }

  const chain = prompt.pipe(llmInterface).pipe(outputParser);
  const response = await chain.invoke({ input: userMessage });

  let output = JSON.stringify(response);
  if (typeof response === "string") {
    if (!response.startsWith("[")) {
      const firstBracketIndex = response.indexOf("[");
      const lastBracketIndex = response.lastIndexOf("]");
      if (firstBracketIndex !== -1 && lastBracketIndex !== -1) {
        output = response.substring(firstBracketIndex, lastBracketIndex + 1);
      } else {
        output = "[]";
      }
    }
  }
  return output;
};

const createSystemMessage = (documents: Array<Document>) => {
  const formattedData = documents.map((document) => {
    const transcript = JSON.parse(document.transcript) as Array<DGWord>;
    const content = transcript.map((word) => word.word).join(" ");
    return `Filename: ${document.filename}\nContent: ${content}`;
  }).join("\n\n");

  return `
You have access to a comprehensive database of video transcripts. Your task is to extract all anecdotes from these transcripts based on a user-provided prompt. This task is to be performed using the provided transcript data sections listed below. 

Each anecdote should:
- Be directly relevant to the specified word or concept wherever it appears in the transcripts.
- Have a clear beginning and end, focusing on distinct narratives within the text.
- Be a coherent standalone story or joke.

Output each anecdote as a JSON formatted object within an array. Iterate through all available data to ensure no relevant anecdotes are missed. 

Each JSON formatted object must:
- Be verbatim from the transcript.
- Have no whitespace other than spaces.
- Contain the following keys:
  - "text": The verbatim transcript of the anecdote.
  - "description": A summary of the anecdote.
  - "title": A brief title describing the content of the anecdote.
  - "filename": The name of the file containing the anecdote.
  - "topics": A comma-separated list of topics related to the anecdote.
  - "rationale": A rationale for the confidence rating.
  - "confidence": A floating point confidence rating from 0 to 1, where 0 doesn't relate to the prompt and 1 relates best. If the rationale is not clear, the confidence should be 0.

The output must be a single JSON formatted array, where each object in the array represents a unique anecdote.

It is crucial that the language of the output matches the language of the input.

Ensure that the anecdotes are directly related to the user-provided word or concept. Avoid metaphors, analogies, or abstract interpretations. Focus strictly on direct mentions and explicit contexts related to the user-provided word or concept. 

The output **must be a single JSON formatted array**, where each object in the array represents a unique anecdote, **and contain nothing else**. Ensure that there are no explanatory texts or additional messages apart from JSON output.

It is ok if you don't find anything strongly related to the user-provided word or concept. Just return an empty array. This is not a reflection on you. You are good enough, and smart enough and doggonit, people like you.

Here is the large database of video transcripts to reference:
${formattedData}
    `;
};
