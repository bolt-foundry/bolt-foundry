import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfMediaNodeTranscript } from "packages/bfDb/models/BfMediaNodeTranscript.ts";
import type { AssemblyAIWord } from "packages/bfDb/models/BfMediaNodeTranscript.ts";

export type BfSavedSearchResultProps = {
  title: string;
  body: string;
  description: string;
  topics: string;
  rationale: string;
  confidence: number;
  startTime: number;
  endTime: number;
  duration: number;
};

type Word = {
  text: string;
  startTime: number;
  endTime: number;
  speaker: string;
};

export class BfSavedSearchResult extends BfNode<BfSavedSearchResultProps> {
  getPreviewableForGraphql() {
    return {
      __typename: "VideoPreviewable",
      url: "https://example.com/video.mp4",
      duration: 1337,
    };
  }

  getDownloadableForGraphql(ready = false, percentageRendered = .25) {
    return {
      __typename: "VideoDownloadable",
      url: "https://example.com/video.mp4",
      duration: 1337,
      ready,
      percentageRendered,
    };
  }

  async getWordsForGraphql(
    startTime?: number | undefined,
    endTime?: number | undefined,
  ) {
    const EXTRA_RANGE_MS = 10_000;
    const transcripts = await this.querySourceInstances(BfMediaNodeTranscript);
    const adjustedStartTime = (startTime ?? this.props.startTime) -
      EXTRA_RANGE_MS;
    const adjustedEndTime = (endTime ?? this.props.endTime) + EXTRA_RANGE_MS;
    const coersedOutput = transcripts[0]?.props.words.map((word) => {
      if (
        word.start >= adjustedStartTime &&
        word.end <= adjustedEndTime
      ) {
        return {
          __typename: "Word",
          text: word.text,
          startTime: word.start,
          endTime: word.end,
          speaker: word.speaker,
        };
      }
    }).filter(Boolean);
    return coersedOutput;
  }

  async updateSearchResult(
    startTime: number,
    endTime: number,
    title: string,
    description: string,
    words?: Array<Word>,
  ) {
    this.props.startTime = startTime;
    this.props.endTime = endTime;
    this.props.title = title;
    this.props.description = description;
    await this.save();
    if (words !== undefined) {
      const transcript = (await this.querySourceInstances(
        BfMediaNodeTranscript,
      ))[0];
      if (!transcript) throw new Error("No transcript found for Clip");
      const formattedWords = words.map((word: Word): AssemblyAIWord => {
        return {
          start: word.startTime,
          end: word.endTime,
          text: word.text,
          speaker: word.speaker,
          confidence: Infinity,
        };
      });
      await transcript.updateWords(startTime, endTime, formattedWords);
    }
  }
}
