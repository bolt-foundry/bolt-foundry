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

function artificialDelay() {
  return new Promise((resolve) => setTimeout(resolve, 5000));
}
export class BfSavedSearch extends BfNode<BfSavedSearchProps> {
  protected beforeCreate(): Promise<void> | void {
    this.props.status = SearchStatus.PENDING;
  }

  async createResult(savedSearchResultProps: BfSavedSearchResultProps) {
    logger.debug(savedSearchResultProps);
    await artificialDelay();
    const result = await this.createTargetNode(
      BfSavedSearchResult,
      savedSearchResultProps,
    );
    return result;
  }
}
