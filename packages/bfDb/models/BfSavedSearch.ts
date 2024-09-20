import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfJob } from "packages/bfDb/models/BfJob.ts";
import { BfError } from "lib/BfError.ts";

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
  protected async afterCreate() {
    if (this.props.status === SearchStatus.PENDING) {
      await BfJob.createJobForNode(this, "startSearch", []);
    }
  }

  async startSearch() {
    // throw new BfError(`Search not implemented for ${this}`)
  }
}
