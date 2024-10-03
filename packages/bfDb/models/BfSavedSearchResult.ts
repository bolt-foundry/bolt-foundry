import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";

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

  async getWordsForGraphql(startTime, endTime) {
    const outputFromAssembly = await import(
      "infra/aiPlayground/test_database/words/1da49b0955384e7aa51e110dbd25b736_words.json",
      {
        with: { type: "json" },
      }
    );
    const coersedOutput = outputFromAssembly?.default?.map((word) => {
      const wordStartTime = Math.floor(word.start * 1000);
      const wordEndTime = Math.floor(word.end * 1000);
      if (wordStartTime >= startTime && wordEndTime <= endTime) {
        return {
          __typename: "Word",
          text: word.punctuated_word,
          startTime: wordStartTime,
          endTime: wordEndTime,
          speaker: word.speaker,
        };
      }
    }).filter(Boolean);
    return coersedOutput;
  }
}
