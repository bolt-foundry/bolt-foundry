import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { getLogger } from "deps.ts";
import { AssemblyAI } from "assemblyai";
import { toBfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfGoogleDriveResource } from "packages/bfDb/models/BfGoogleDriveResource.ts";
import { BfError } from "lib/BfError.ts";

/**
 * LAZY STUFF
 */

import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";

import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import type { Document } from "@langchain/core/documents";

/**
 * / LAZY STUFF
 */
const logger = getLogger(import.meta);

const BF_MEDIA_AUDIO_CACHE_DIRECTORY =
  Deno.env.get("BF_MEDIA_AUDIO_CACHE_DIRECTORY") ?? Deno.env.get("REPL_HOME")
    ? `${Deno.env.get("REPL_HOME")}/tmp/bf-media-audio-cache`
    : "/tmp/bf-media-audio-cache";

export enum BfMediaNodeTranscriptStatus {
  CREATED = "CREATED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  NEW = "NEW",
}
type AssemblyAIWord = {
  start: number;
  end: number;
  text: string;
  confidence: number; // in 0-1
  speaker: string; // label, like "A"
};
type AssemblyAIWords = Array<AssemblyAIWord>;

export type BfMediaNodeTranscriptProps = {
  words: AssemblyAIWords;
  status: BfMediaNodeTranscriptStatus;
};

export class BfMediaNodeTranscript extends BfNode<BfMediaNodeTranscriptProps> {
  private get filePath() {
    return `${BF_MEDIA_AUDIO_CACHE_DIRECTORY}/${this.metadata.bfGid}.aac`;
  }

  async requestTranscriptionFromGoogleDriveResourceId(
    googleDriveResourceId: string,
  ) {
    logger.setLevel(logger.levels.DEBUG);
    logger.info(`creating transcript from google drive resource id ${this}`)
    const bfGoogleDriveResource = await BfGoogleDriveResource.findX(
      this.currentViewer,
      toBfGid(googleDriveResourceId),
    );
    await Deno.mkdir(BF_MEDIA_AUDIO_CACHE_DIRECTORY, { recursive: true });
    logger.debug(`Getting file handle for ${bfGoogleDriveResource}`);
    const fileHandlePromise = bfGoogleDriveResource.getFileHandle();
    const ffmpegArgs = [
      "-i",
      "-",
      "-codec:a",
      "aac",
      "-b:a",
      "256k",
      "-y",
      "-progress",
      "pipe:2",
      "-stats_period",
      "0.2", // seconds
      "-v",
      "quiet",
      this.filePath,
    ];
    const ffmpegProcess = new Deno.Command("ffmpeg", {
      args: ffmpegArgs,
      stdin: "piped",
      stderr: "piped",
    });
    logger.info(`Starting ffmpeg transcript encode for ${this}`);
    const { stdin, stderr } = ffmpegProcess.spawn();
    const fileLoadingPromise = fileHandlePromise.then((fileHandle) => {
      logger.debug(`File handle ready from ${bfGoogleDriveResource}`);
      return fileHandle.readable.pipeTo(stdin);
    });
    const stderrReader = stderr.pipeThrough(new TextDecoderStream())
      .getReader();
    while (true) {
      const { done, value } = await stderrReader.read();
      if (done) break;
      const stats = value.split("\n").reduce((acc, line) => {
        const [key, value] = line.split("=");
        if (key) {
          acc[key] = value?.trim();
        }
        return acc;
      }, {} as Record<string, string>);
      logger.debug("ffmpeg stats", stats);
    }
    await fileLoadingPromise;
    logger.info(`File encoded to ${this.filePath}`);
    const apiKey = Deno.env.get("ASSEMBLY_AI_KEY");
    if (!apiKey) throw new BfError("No assembly AI key found");
    const assemblyAIClient = new AssemblyAI({ apiKey });
    logger.info(`Starting transcription for ${this}`);
    const transcript = await assemblyAIClient.transcripts.transcribe({
      audio: this.filePath,
      speaker_labels: true,
    }, {});
    logger.debug("Got transcript", transcript);
    const words = transcript.words as AssemblyAIWords;
    this.props.words = words;
    await this.save();
    logger.info(`Transcription complete for ${this}`);
    logger.info(`Removing ${this.filePath}`);
    await Deno.remove(this.filePath);
    await this.sendToVectorStore();
    return this;
  }

  private async sendToVectorStore() {
    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
    });

    const pinecone = new PineconeClient();
    const pineconeIndexName = Deno.env.get("PINECONE_INDEX_NAME") ?? "BF_DEV";
    logger.debug(pineconeIndexName);
    const pineconeIndex = pinecone.Index(pineconeIndexName);

    logger.debug("pinecone index", pineconeIndex);
    logger.info(`Sending to vector store for ${this}`);
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
      maxConcurrency: 5,
      namespace: this.metadata.bfOid,
    });

    const documents: Array<Document> = this.getTokenSafeText().map((text) => {
      logger.debug(text.length / 4)
      return {
        id: this.metadata.bfGid,
        metadata: this.metadata,
        pageContent: text,
      };
    });
    logger.debug("langchainDocument to send", documents);
    try {
      const results = await vectorStore.addDocuments(documents);
      logger.info("Sent", results);
    } catch (e) {
      logger.error(e);
      throw e;
    }
    logger.info(`Sent to vector store for ${this}`);
    return this;
  }

  get text() {
    return this.props.words.map((word) => word.text).join(" ");
  }

  getTokenSafeText(length = 8192) {
    const text = this.text;
    const texts = [];
    const charactersPerToken = 3;
    let nextWritableString = "";
    for (const char of text) {
      if ((nextWritableString.length / charactersPerToken) > length) {
        texts.push(nextWritableString);
        nextWritableString = "";
      }
      nextWritableString += char;
    }

    return texts;
  }
}
