// Previously named langchain.ts
import {
  LLMChain,
  OpenAI,
  PromptTemplate,
  RecursiveCharacterTextSplitter,
} from "infra/aiPlaygorund/deps.ts";
// import { ApiFactory, SSM } from "packages/lib/aws/deps.ts";
//import { createLogger, createMetricLogger } from "packages/logs/mod.ts";
import { createLogger } from "aws/logs/mod.ts";

import Project from "packages/graphql/models/Project.ts";
import { DGTranscript } from "packages/types/transcript.ts";
import { getTranscriptWords } from "packages/client/lib/transcriptRectifier.ts";
import { captureEvent } from "packages/events/mod.ts";
import getBfGraphId from "packages/lib/getBfGraphId.ts";
const log = createLogger("clip-finding", "info");
const logDebug = createLogger("clip-finding", "debug");
const logError = createLogger("clip-finding", "error");
const logMetric = createMetricLogger("clip-finding", "info");

const modelName = "gpt-3.5-turbo";
const paramStore = new ApiFactory().makeNew(SSM);
const openAIApiKey = Deno.env.get("OPENAI_API_KEY") ??
  (await paramStore.getParameter({
    Name: "/openai/api-key",
  })).Parameter?.Value;
if (!openAIApiKey) {
  throw new Error("OPENAI_API_KEY not set in environment variables or SSM");
}

const llm = new OpenAI({
  modelName,
  openAIApiKey,
  temperature: 0,
  presencePenalty: 0,
  frequencyPenalty: 0.01,
  streaming: true,
});

const reviewPromptTemplateString = `
Please split the following transcript into each individual anecdote or jokes from the given text 
and include them as separate stories. Each story should have a definite beginning and end, focusing on distinct narratives 
within the text. Ensure that each extracted story captures a coherent standalone anecdote or joke. Respond with each json object on its own line of text. IT IS IMPORTANT THAT EACH JSON OBJECT BE VERBATIM TO THE TRANSCRIPT AND EACH OBJECT ON ITS OWN LINE. OBJECTS SHOULD HAVE NO WHITESPACE OTHER THAN SPACES.
Each object has a 'text' key representing the verbatim transcript of the story, a "description" key representing a summary of the story, and a 'title' key describing 
the content of the story

MAKE SURE THE OUTPUT LANGUAGE MATCHES THE INPUT LANGUAGE.

  Input Transcript:
  {transcript}
  `;

const reviewPromptTemplate = new PromptTemplate({
  template: reviewPromptTemplateString,
  inputVariables: ["transcript"],
});

const jokesChain = new LLMChain({
  llm,
  prompt: reviewPromptTemplate,
});

export type ClipWithoutTimecodes = {
  title: string;
  description: string;
  text: string;
};

type Clip = ClipWithoutTimecodes & {
  start_index: number | null;
  end_index: number | null;
  start_time: number | null;
  end_time: number | null;
};

type JokeTextOutput = Array<ClipWithoutTimecodes>;

type JokesOutput = Array<Clip>;

type Transcript = {
  jobName: string;
  accountId: string;
  status: string;
  results: {
    transcripts: Array<{
      transcript: string;
    }>;
    items: Array<{
      start_time: string;
      end_time: string;
      alternatives: Array<{
        confidence: string;
        content: string;
      }>;
      type: string;
    }>;
  };
};

type WordWithTimecode = {
  start_time: number;
  end_time: number;
  text: string;
  true_index: number;
};

type WordsWithTimecodes = Array<WordWithTimecode>;

function findClipStartAndEndIndex(
  text: string,
  wordsWithTimecodes: WordsWithTimecodes,
) {
  const transcript = wordsWithTimecodes.map((word) => word.text).join(" ")
    .toLocaleLowerCase();
  const startIndexCharacter = transcript.indexOf(text.toLocaleLowerCase());
  if (startIndexCharacter === -1) {
    return {
      start_index: null,
      end_index: null,
      start_time: null,
      end_time: null,
      text,
    };
  }
  // copy the transcript but delete everything after startIndexCharacter
  const transcriptBeforeStartIndex = transcript.slice(0, startIndexCharacter);
  // find out how many words are in that
  const firstWordIndex = transcriptBeforeStartIndex.split(" ").length -
    1;
  const firstWord = wordsWithTimecodes[firstWordIndex];
  const lastWordIndex = firstWordIndex + text.split(" ").length - 1;
  const lastWord = wordsWithTimecodes[lastWordIndex];

  const firstWordstart_time = Number(firstWord.start_time);
  const lastWordend_time = Number(lastWord.end_time);

  return {
    start_index: firstWord.true_index,
    end_index: lastWord.true_index,
    start_time: firstWordstart_time,
    end_time: lastWordend_time,
    text,
  };
}

function getTimecodesFromJokeTextClips(wordsWithTimecodes: WordsWithTimecodes) {
  return (clip: ClipWithoutTimecodes) => {
    // find out if the clip text is contained within the wordsWithTimecodes
    const clipText = clip.text;
    // log(clipText);
    const clipsWithTimecodes = findClipStartAndEndIndex(
      clipText,
      wordsWithTimecodes,
    );
    return {
      ...clip,
      ...clipsWithTimecodes,
    };
  };
}

export async function getJokesFromTranscript(
  transcript: Transcript | DGTranscript,
): Promise<JokesOutput> {
  const items = getTranscriptWords(transcript);
  const wordsWithTimecodes = items.map(
    (item, index) => {
      if (item == null) {
        return {
          text: false,
        };
      }
      const start_time = item.start;
      const end_time = item.end;
      const text = item.punctuated_word;

      return {
        start_time,
        end_time,
        text,
        true_index: index,
      };
    },
  ).filter(({ text }) => Boolean(text)) as WordsWithTimecodes;

  const transcriptText = wordsWithTimecodes.map((word) => word.text).join(" ");

  const clipWithoutTimecodes = await getJokesFromText(transcriptText);

  const returnable = clipWithoutTimecodes.map(
    getTimecodesFromJokeTextClips(wordsWithTimecodes),
  );

  return returnable;
}

export async function getJokesFromText(
  inputText: string,
): Promise<JokeTextOutput> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 100,
  });
  const splitText = await splitter.createDocuments([inputText]);
  log("Documents sent to OpenAI: ", splitText.length);
  const promises = splitText.map(async (text) => {
    const startingTime = Date.now();
    const outputText = await jokesChain.run(text.pageContent);
    const endingTime = Date.now();
    const timeTaken = endingTime - startingTime;
    logMetric("jokeGenerationTime", {
      timeTaken,
    });
    return outputText;
  });
  let completedCount = 0;
  const badJsonEntries: Array<string> = [];
  let numberOfGoodJsonLines = 0;
  const results = promises.map(async (promise, _, arr) => {
    const outputText = await promise;
    completedCount++;
    log("completed documents: ", completedCount, "/", arr.length);
    return outputText.split("\n").map((line) => {
      if (line === "") return false;
      try {
        const lineWithoutTrailingComma = line.replace(/,$/, "");
        const jsonJoke = JSON.parse(lineWithoutTrailingComma);
        numberOfGoodJsonLines++;
        return jsonJoke;
      } catch (_e) {
        logMetric("badJson", {
          type: "error",
          line,
        });
        const lineWithoutTrailingComma = line.replace(/,$/, "");
        badJsonEntries.push(lineWithoutTrailingComma);
        return false;
      }
    }).filter(Boolean);
  });
  const outputs = await Promise.all(results);

  const numberOfBadJsonLines = badJsonEntries.length;
  const goodJsonRatio = numberOfGoodJsonLines /
    (numberOfGoodJsonLines + numberOfBadJsonLines);
  const badJsonRatio = numberOfBadJsonLines /
    (numberOfGoodJsonLines + numberOfBadJsonLines);
  logMetric("jsonParsingSuccess", {
    numberOfBadJsonLines,
    numberOfGoodJsonLines,
    goodJsonRatio,
    badJsonRatio,
    badJsonEntries,
  });
  log(
    "numberOfBadJsonJokes: ",
    numberOfBadJsonLines,
    "numberOfGoodJsonJokes: ",
    numberOfGoodJsonLines,
  );
  log(
    "Good json ratio: ",
    numberOfGoodJsonLines / (numberOfGoodJsonLines + numberOfBadJsonLines),
  );
  const flattenedOutputs = outputs.flat() as Array<Clip>;
  return flattenedOutputs;
}

export async function* genJokesFromTranscript(
  transcript: Transcript | DGTranscript,
  projectBFGraphId: string,
): AsyncGenerator<Clip, void, unknown> {
  const items = getTranscriptWords(transcript);
  const wordsWithTimecodes = items.map(
    (item, index) => {
      if (item == null) {
        return {
          text: false,
        };
      }
      const start_time = item.start;
      const end_time = item.end;
      const text = item.punctuated_word;

      return {
        start_time,
        end_time,
        text,
        true_index: index,
      };
    },
  ).filter(({ text }) => Boolean(text)) as WordsWithTimecodes;

  const transcriptText = wordsWithTimecodes.map((word) => word.text).join(" ");

  for await (const joke of genJokesFromText(transcriptText, projectBFGraphId)) {
    const timedJoke = getTimecodesFromJokeTextClips(wordsWithTimecodes)(joke);
    yield timedJoke;
  }
}

async function* genJokesFromText(
  inputText: string,
  projectBFGraphId: string,
): AsyncGenerator<ClipWithoutTimecodes, void, unknown> {
  const project = await Project.find__PRIVACY_UNSAFE__(projectBFGraphId);
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 100,
  });
  const splitText = await splitter.createDocuments([inputText]);
  if (!project) {
    logError("project not found");
    return;
  }
  project.props = { clipsPagesTotal: splitText.length };
  await project.save();
  log("Documents sent to OpenAI: ", splitText.length);

  let completedCount = 0;
  const badJsonEntries = [];
  let numberOfGoodJsonLines = 0;
  captureEvent("clipFinding", "started", {}, getBfGraphId(project.pk));

  for (const text of splitText) {
    const outputText = await jokesChain.run(text.pageContent);
    completedCount++;
    log("completed documents: ", completedCount, "/", splitText.length);
    // update project with progress
    project.props = { clipsPagesFinished: completedCount };
    await project.save();
    logDebug("project updated", project.props);

    const lines = outputText.split("\n");
    for (const line of lines) {
      if (line === "") continue;
      try {
        const lineWithoutTrailingComma = line.replace(/,$/, "");
        const jsonJoke = JSON.parse(lineWithoutTrailingComma);
        numberOfGoodJsonLines++;
        yield jsonJoke;
      } catch (_e) {
        badJsonEntries.push(line);
        continue;
      }
    }
  }

  const numberOfBadJsonLines = badJsonEntries.length;

  logMetric("badJson", {
    numberOfBadJsonLines,
    numberOfGoodJsonLines,
    badJsonEntries,
  });
}