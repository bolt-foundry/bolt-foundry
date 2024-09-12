import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";

type BfSearchResultProps = {
  query: string;
}
export class BfSearchResult extends BfNode<BfSearchResultProps> {}