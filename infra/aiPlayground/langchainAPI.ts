import { ChatOpenAI } from "https://esm.sh/@langchain/openai";
import { ChatAnthropic } from "https://esm.sh/@langchain/anthropic";
import { ChatPromptTemplate } from "https://esm.sh/@langchain/core/prompts";
import {
  JsonOutputParser,
  StringOutputParser,
} from "https://esm.sh/@langchain/core/output_parsers";
const samples = [
  {
    name: "sample1",
    content: await import(
      "infra/aiPlayground/test_database/words/1da49b0955384e7aa51e110dbd25b736_words.json",
      {
        assert: { type: "json" },
      }
    ),
  },
  {
    name: "sample2",
    content: await import(
      "infra/aiPlayground/test_database/words/5c57973d4b2a43948a49b6d254906385_words.json",
      {
        assert: { type: "json" },
      }
    ),
  },
  {
    name: "sample3",
    content: await import(
      "infra/aiPlayground/test_database/words/50d21ed829774d1fb244bb22684b0ad5_words.json",
      {
        assert: { type: "json" },
      }
    ),
  },
  {
    name: "sample4",
    content: await import(
      "infra/aiPlayground/test_database/words/169dd504edff4bd7b4ebae59f0202885_words.json",
      {
        assert: { type: "json" },
      }
    ),
  },
  {
    name: "sample5",
    content: await import(
      "infra/aiPlayground/test_database/words/617e231f1c014e2785bf7627eb361c96_words.json",
      {
        assert: { type: "json" },
      }
    ),
  },
  {
    name: "sample6",
    content: await import(
      "infra/aiPlayground/test_database/words/17772c835ed14802aaac61bb79c2e5ed_words.json",
      {
        assert: { type: "json" },
      }
    ),
  },
  {
    name: "sample7",
    content: await import(
      "infra/aiPlayground/test_database/words/ca44d58db1ae47ba9c47f47ee11c11cf_words.json",
      {
        assert: { type: "json" },
      }
    ),
  },
  {
    name: "sample8",
    content: await import(
      "infra/aiPlayground/test_database/words/e9d658eb116f4d898d547ab8b276d9c1_words.json",
      {
        assert: { type: "json" },
      }
    ),
  },
  {
    name: "sample9",
    content: await import(
      "infra/aiPlayground/test_database/words/f4c8a47adbe64a32a9216a43ed6e3bfa_words.json",
      {
        assert: { type: "json" },
      }
    ),
  },
];

const openAIApiKey = Deno.env.get("OPENAI_API_KEY") ?? "";
const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY") ?? "";

export const callAPI = async (
  userMessage: string,
  systemMessage?: string,
  suggestedModel?: string | null | undefined,
) => {
  let llmInterface;
  switch (suggestedModel) {
    case "gpt-3.5-turbo":
    case "gpt-4o-mini": {
      llmInterface = new ChatOpenAI({
        model: suggestedModel,
        apiKey: openAIApiKey,
        temperature: 0,
        presencePenalty: 0,
        frequencyPenalty: 0,
      });
      break;
    }
    case "claude-3-opus-20240229":
    case "claude-3-5-sonnet-20240620": {
      llmInterface = new ChatAnthropic({
        model: suggestedModel,
        apiKey: anthropicApiKey,
        temperature: 0,
      });
    }
  }

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `${createSystemMessage()}`],
    ["user", "{input}"],
  ]);
  let outputParser = new JsonOutputParser();
  if (
    suggestedModel === "claude-3-5-sonnet-20240620" ||
    suggestedModel === "claude-3-opus-20240229"
  ) {
    outputParser = new StringOutputParser();
  }

  const chain = prompt.pipe(llmInterface).pipe(outputParser);
  const response = await chain.invoke({ input: userMessage });

  console.log("type", typeof response);
  console.log("response", response);

  let output = JSON.stringify(response);
  if (typeof response === "string") {
    if (!response.startsWith("[")) {
      const firstBracketIndex = response.indexOf("[");
      const lastBracketIndex = response.lastIndexOf("]");
      if (firstBracketIndex !== -1 && lastBracketIndex !== -1) {
        output = response.substring(firstBracketIndex, lastBracketIndex + 1);
      } else {
        output = response;
      }
    }
  }
  return output;
};

const createSystemMessage = () => {
  // make a string of all the samples that looks like this:
  // Filename: "sample1\nContent: "content of sample1"
  const formattedData = samples.map((sample) => {
    const content = sample.content.default.map((word) => word.word).join(" ");
    return `Filename: ${sample.name}\nContent: ${content}`;
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
