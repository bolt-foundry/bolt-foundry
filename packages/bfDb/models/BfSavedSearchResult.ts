import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";

export type BfSavedSearchResultProps = {
  title: string;
  body: string;
  description: string;
  topics: string;
  rationale: string;
  confidence: number;
  verbatim: boolean;
};

export class BfSavedSearchResult extends BfNode<BfSavedSearchResultProps> {
}
