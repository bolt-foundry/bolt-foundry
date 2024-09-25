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

export const callAPI = async (
  userMessage: string,
  textToSearch: string,
  suggestedModel?: string | null | undefined,
) => {
  const excerpt = z.object({
    excerpts: z.array(z.object({
      title: z.string().describe("The title of the excerpt."),
      body: z.string().describe(
        "A side-by-side exact verbatim copy from the transcript of the excerpt uncorrected directly from the transcript given. The excerpt must be an exact copy of the verbatim text from the transcript. Any change to the text, including paraphrasing, rewording, or reordering, will be considered incorrect.",
      ),
      description: z.string().describe("A summary of the excerpt."),
      topics: z.string().describe(
        "A comma-separated list of topics related to the excerpt.",
      ),
      rationale: z.string().describe(
        "A rationale for the confidence rating. Avoid metaphors, analogies, or abstract interpretations. Focus strictly on direct mentions and explicit contexts related to the user-provided word or concept.",
      ),
      confidence: z.number().describe(
        "A floating point confidence rating from 0 to 1, where 0 doesn't relate to the prompt and 1 relates best.",
      ),
    })).describe("an array containing MANY excerpts").optional(),
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
      structuredLlm = llmInterface.withStructuredOutput(excerpt);
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
      structuredLlm = llmInterface.withStructuredOutput(excerpt, {
        method: "json_mode",
        name: "excerpt",
      });
    }
  }

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `${createSystemMessage(textToSearch)}`],
    ["user", "{input}"],
  ]);

  const chain = prompt.pipe(structuredLlm);
  const start = performance.now();
  const response = await chain.invoke({ input: userMessage });
  const end = performance.now();
  const performanceDuration = end - start;

  const verbatim = () => {
    const excerpts = response.excerpts ?? [];
    let verbatimString = "";
    excerpts.forEach((a, i) => {
      verbatimString += `${i}: ${
        textToSearch.toLowerCase().includes(excerpts[i].body.toLowerCase())
      }, `;
    });
    return verbatimString;
  };
  const results = {
    model: suggestedModel,
    performance: (performanceDuration / 1000),
    response: response,
    prompt: userMessage,
    verbatim: verbatim(),
  };

  logger.debug("prompt completed", results);

  return response;
};

const createSystemMessage = (text: string) => {
  return `
  You have access to a video transcripts. Your task is to catalog multiple instances of a topic from this transcript based on a user-provided prompt. This task is to be performed using the provided transcript data sections listed below. 

  Each excerpt should:
  - Be directly relevant to the specified word or concept wherever it appears in the transcript.
  - Have a clear beginning and end, focusing on distinct narratives within the text.
  - Be a coherent standalone story or joke.
  - Be VERBATIM text from the transcript
  - The excerpts must be an exact copy of the verbatim text from the transcript. Any change to the text, including paraphrasing, rewording, or reordering, will be considered incorrect.
  - If no suitable excerpts are found, return 'No excerpt found.' Do not alter the transcript in any way.
  - Don't skip any text when extracting an excerpt
  - Avoid metaphors, analogies, or abstract interpretations. Focus strictly on direct mentions and explicit contexts related to the user-provided word or concept.

  It is crucial that the language of the output matches the language of the input.

  DO NOT correct the transcript in your output

  Ensure that the excerpts are directly related to the user-provided word or concept.

  It is ok if you don't find anything strongly related to the user-provided word or concept. Just return an empty object. This is not a reflection on you. You are good enough, and smart enough and doggonit, people like you.

  Here is the video transcript to reference:
  ${text}
      `;
};
