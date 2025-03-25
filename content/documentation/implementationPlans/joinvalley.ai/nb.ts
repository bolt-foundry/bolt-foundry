import { Client } from "@replit/object-storage";
const client = new Client();

import OpenAI from "@openai/openai";

// Types for prospect data structure
export interface MessagePart {
  text?: string;
  [key: string]: unknown;
}

export interface Message {
  role: "user" | "model" | "system";
  parts: MessagePart[];
}

export interface ResponseSchemaProperty {
  type: string;
  description?: string;
  [key: string]: unknown;
}

export interface ResponseSchema {
  type: string;
  required: string[];
  properties: {
    [key: string]: ResponseSchemaProperty;
  };
}

export interface GenerationConfig {
  temperature: number;
  responseMimeType?: string;
  responseSchema?: ResponseSchema;
}

export interface SystemInstruction {
  parts: MessagePart[];
}

export interface RawSettings {
  generationConfig: GenerationConfig;
  systemInstruction?: SystemInstruction;
}

export interface Messages {
  rawPrompt: Message[];
  rawSettings: RawSettings;
}

export interface Followup {
  body: string;
  justification: string;
  score: number;
}

export interface OutputData {
  body: string;
  followups: Followup[];
  justification: string;
  score: number;
  hallucination?: string;
}

export interface ProspectData {
  prospect_id: string;
  campaign_id: string;
  lib: string;
  messages: Messages;
  output: OutputData;
}

// Type for the collection of examples grouped by prospect_id
export interface SampleCollection {
  [prospect_id: string]: ProspectData[];
}

export interface DpoExample {
  input: {
    messages: Array<{
      role: "user" | "assistant" | "system";
    }>;
    tools: Array<unknown>;
    parallel_tool_calls: boolean;
  };
  preferred_output: Array<{
    role: "assistant";
    content: string;
  }>;
  non_preferred_output: Array<{
    role: "assistant";
    content: string;
  }>;
}

const replitDevDomain = Deno.env.get("REPLIT_DEV_DOMAIN");

const openai = new OpenAI({
  baseURL: `https://${replitDevDomain}/api/v1`,
  apiKey: Deno.env.get("OPEN_ROUTER_API_KEY"),
});

async function getExample(path: string) {
  const targetDir = "/tmp/bolt-foundry";
  const targetPath = `${targetDir}/${path}`;

  try {
    try {
      await Deno.stat(targetDir);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        await Deno.mkdir(targetDir, { recursive: true });
      } else {
        throw error;
      }
    }

    try {
      const fileContent = await Deno.readTextFile(targetPath);
      return fileContent;
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }

      console.log(`Downloading file from object storage: ${path}`);
      try {
        const { value: fileContent } = await client.downloadAsText(path);
        if (!fileContent) {
          throw new Error("File not found");
        }

        // Write the file to local storage
        await Deno.writeTextFile(targetPath, fileContent);
        console.log(`Saved file to local cache: ${targetPath}`);

        return fileContent;
      } catch (storageError) {
        console.error(
          `Error downloading from object storage: ${
            (storageError as Error).message
          }`,
        );
        throw new Error(`File not found in object storage: ${path}`);
      }
    }
  } catch (error) {
    console.error(`Error in getExample: ${(error as Error).message}`);
    throw error;
  }
}

function cache() {
  return [
    getExample("badExamples.json"),
    getExample("goodExamples.json"),
  ];
}

function sampleToDpo(
  sample: ProspectData,
  isPreferred: boolean = true,
): DpoExample {
  const output: DpoExample = {
    input: {
      messages: [],
      tools: [],
      parallel_tool_calls: true,
    },
    preferred_output: [],
    non_preferred_output: [],
  };

  if (isPreferred) {
    output.preferred_output.push({
      role: "assistant",
      content: sample.output.body,
    });
  }
  if (!isPreferred) {
    output.non_preferred_output.push({
      role: "assistant",
      content: sample.output.body,
    });
  }

  return output;
}

async function main() {
  const [badSamplesPromise, goodSamplesPromise] = cache();
  const goodSamplesRaw = await goodSamplesPromise;
  const goodSamples = JSON.parse(goodSamplesRaw) as SampleCollection;

  const badSamplesRaw = await badSamplesPromise;
  const badSamples = JSON.parse(badSamplesRaw) as SampleCollection;

  const singleGoodSample = Object.values(goodSamples)[1][0];
  const singleBadSample = Object.values(badSamples)[1][0];

  const singleGoodDpo = sampleToDpo(singleGoodSample);
  const singleBadDpo = sampleToDpo(singleBadSample, false);

  return {
    singleGoodDpo,
    singleBadDpo,
    goodSamples,
    badSamples,
    singleGoodSample,
    singleBadSample,
  }

  // const completion = await openai.chat.completions.create({
  //   model: "openai/gpt-4o",
  //   messages: [
  //     {
  //       role: "user",
  //       content: "What is the meaning of life?",
  //     },
  //   ],
  // });
}

export { cache, client, main };
