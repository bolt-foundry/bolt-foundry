import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { getLogger } from "deps.ts";
import {
  BfSavedSearchResult,
  type BfSavedSearchResultProps,
} from "packages/bfDb/models/BfSavedSearchResult.ts";

const logger = getLogger(import.meta);

export enum SearchStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  ERRORED = "ERRORED",
}

type BfSavedSearchProps = {
  query: string;
  status: SearchStatus;
};

export class BfSavedSearch extends BfNode<BfSavedSearchProps> {
  protected beforeCreate(): Promise<void> | void {
    this.props.status = SearchStatus.PENDING;
  }

  async createResult(savedSearchResultProps: BfSavedSearchResultProps) {
    logger.debug(savedSearchResultProps);
    const result = await this.createTargetNode(
      BfSavedSearchResult,
      savedSearchResultProps,
    );
    return result;
  }
}
