// @ts-nocheck langchain is dependency hell
import {
  ChatAnthropic,
  ChatOpenAI,
  ChatPromptTemplate,
} from "packages/deps.ts";
import type { DGWord } from "packages/types/transcript.ts";
import { AiModel } from "packages/client/contexts/ClipSearchContext.tsx";
import { getTimecodesForClips } from "packages/lib/timecodeUtils.ts";
import { getLogger } from "deps.ts";
import { z } from "zod";
const logger = getLogger(import.meta);
const openAIApiKey = Deno.env.get("OPENAI_API_KEY") ?? "";
const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY") ?? "";

type Document = {
  mediaId: string;
  transcriptId: string;
  filename: string;
  words: string;
};

function formatDocs(documents: Array<Document>) {
  return documents.map((document) => {
    const transcript = JSON.parse(document?.words ?? "[]") as Array<DGWord>;
    const content = transcript.map((word) => word.word).join(" ");
    return `
Filename: ${document.filename ?? "Untitled"}
Media ID: ${document.mediaId}
Transcript ID: ${document.transcriptId}
Content: ${content}
`;
  }).join("\n\n");
}

export const callAPI = async (
  userMessage: string,
  documents: Array<Document>,
  suggestedModel?: string | null | undefined,
) => {
  const anecdote = z.object({
    anecdotes: z.array(z.object({
      titleText: z.string().describe("The title of the anecdote."),
      text: z.string().describe("The verbatim transcript of the anecdote"),
      descriptionText: z.string().describe("A summary of the anecdote."),
      filename: z.string().describe(
        "The name of the file containing the anecdote.",
      ),
      mediaId: z.string().describe(
        "The Media ID of the file containing the anecdote.",
      ),
      transcriptId: z.string().describe(
        "The Transcript ID of the file containing the anecdote.",
      ),
      topics: z.string().describe(
        "A comma-separated list of topics related to the anecdote.",
      ),
      rationale: z.string().describe("A rationale for the confidence rating."),
      confidence: z.number().describe(
        "A floating point confidence rating from 0 to 1, where 0 doesn't relate to the prompt and 1 relates best.",
      ),
    })),
  });

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
      structuredLlm = llmInterface.withStructuredOutput(anecdote, {
        method: "json_mode",
        name: "anecdote",
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
      structuredLlm = llmInterface.withStructuredOutput(anecdote, {
        method: "json_mode",
        name: "anecdote",
      });
    }
  }

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `${createSystemMessage(documents)}`],
    ["user", "{input}"],
  ]);

  const chain = prompt.pipe(structuredLlm);
  const start = performance.now();
  const response = await chain.invoke({ input: userMessage });
  const end = performance.now();
  const duration = end - start;
  const results = {
    model: suggestedModel,
    duration: (duration / 1000),
    response: response,
    numOfDocuments: documents.length,
    prompt: userMessage,
  };

  logger.debug("prompt completed", results);

  const responseWithTimecode = getTimecodesForClips(response, documents);
  return JSON.stringify(responseWithTimecode);
};

const createSystemMessage = (documents: Array<Document>) => {
  const formattedData = formatDocs(documents);

  return `
  You have access to several video transcripts. Your task is to extract all anecdotes from these transcripts based on a user-provided prompt. This task is to be performed using the provided transcript data sections listed below. 

  Each anecdote should:
  - Be directly relevant to the specified word or concept wherever it appears in the transcripts.
  - Have a clear beginning and end, focusing on distinct narratives within the text.
  - Be a coherent standalone story or joke.
  - Be verbatim text from the transcript

  It is crucial that the language of the output matches the language of the input.

  Ensure that the anecdotes are directly related to the user-provided word or concept. Avoid metaphors, analogies, or abstract interpretations. Focus strictly on direct mentions and explicit contexts related to the user-provided word or concept. 


  Here are the video transcripts to reference:
  ${formattedData}
      `;
};
