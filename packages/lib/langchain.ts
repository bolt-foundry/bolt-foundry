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
  words: string;
};

function formatDocs(documents: Array<Document>) {
  return documents.map((document) => {
    const transcript = JSON.parse(document.words) as Array<DGWord>;
    const content = transcript.map((word) => word.word).join(" ");
    return `Filename: ${document.filename}\nContent: ${content}`;
  }).join("\n\n");
}

export const callAPI = async (
  userMessage: string,
  documents: Array<Document>,
  suggestedModel?: string | null | undefined,
  systemMessage?: string,
) => {
  const properties = {
    anecdotes: {
      type: "array",
      items: {
        titleText: {
          type: "string",
          description: "The title of the anecdote.",
        },
        text: {
          type: "string",
          description: "The verbatim transcript of the anecdote",
        },
        descriptionText: {
          type: "string",
          description: "A summary of the anecdote.",
        },
        filename: {
          type: "string",
          description: "The name of the file containing the anecdote.",
        },
        topics: {
          type: "string",
          description:
            "A comma-separated list of topics related to the anecdote.",
        },
        rationale: {
          type: "string",
          description: "A rationale for the confidence rating.",
        },
        confidence: {
          type: "number",
          description:
            "A floating point confidence rating from 0 to 1, where 0 doesn't relate to the prompt and 1 relates best.",
        },
      },
    },
  };

  let llmInterface;
  let structuredLlm;
  switch (suggestedModel) {
    case AiModel.CLAUDE_OPUS:
    case AiModel.CLAUDE_SONNET: {
      llmInterface = new ChatAnthropic({
        model: suggestedModel,
        apiKey: anthropicApiKey,
        temperature: 0,
      });
      structuredLlm = llmInterface.withStructuredOutput({
        name: "anecdote",
        description: "an anecdote from the text relating to the user prompt.",
        input_schema: {
          type: "object",
          properties,
        },
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
      structuredLlm = llmInterface.withStructuredOutput({
        name: "anecdote",
        description: "an anecdote from the text relating to the user prompt.",
        parameters: {
          title: "Anecdote",
          type: "object",
          properties,
        },
      });
    }
  }

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `${createSystemMessage(documents)}`],
    ["user", "{input}"],
  ]);

  const chain = prompt.pipe(structuredLlm);
  const response = await chain.invoke({ input: userMessage });

  return JSON.stringify(response);
};

const createSystemMessage = (documents: Array<Document>) => {
  const formattedData = formatDocs(documents);

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
  - "titleText": A brief title describing the content of the anecdote.
  - "descriptionText": A summary of the anecdote.
  - "text": The verbatim transcript of the anecdote.
  - "filename": The name of the file containing the anecdote.
  - "topics": A comma-separated list of topics related to the anecdote.
  - "rationale": A rationale for the confidence rating.
  - "confidence": A floating point confidence rating from 0 to 1, where 0 doesn't relate to the prompt and 1 relates best. If the rationale is not clear, the confidence should be 0. This should reflect how well the anecdote fits into the prompt based on the rationale.

The output must be a single JSON object with an "anecdotes" key as the array, where each object in the array represents a unique anecdote.

It is crucial that the language of the output matches the language of the input.

Ensure that the anecdotes are directly related to the user-provided word or concept. Avoid metaphors, analogies, or abstract interpretations. Focus strictly on direct mentions and explicit contexts related to the user-provided word or concept. 

The output **must be a single JSON formatted object containing an "anecdotes" array**, where each object in the array represents a unique anecdote, **and contain nothing else**. Ensure that there are no explanatory texts or additional messages apart from the JSON output.

Here is the large database of video transcripts to reference:
${formattedData}
    `;
};
