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
    }
  }

  getDownloadableForGraphql(ready = false, percentageRendered = .25) {
    return {
      __typename: "VideoDownloadable",
      url: "https://example.com/video.mp4",
      duration: 1337,
      ready,
      percentageRendered,
    }
  }
}
