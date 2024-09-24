import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfJob } from "packages/bfDb/models/BfJob.ts";
import { BfError } from "lib/BfError.ts";
import { getLogger } from "deps.ts";

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

  createResult(clipProps) {
    logger.setLevel(logger.levels.DEBUG);
    logger.debug("clip props", clipProps);
  }
}
