// Import necessary dependencies
import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfAssoc } from "packages/bfDb/coreModels/BfAssoc.ts";
import {
  BfCurrentViewer,
  BfCurrentViewerJobRunner,
} from "packages/bfDb/classes/BfCurrentViewer.ts";
import {
  BfTid,
  toBfGid,
  toBfPid,
  toBfTid,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { getLogger } from "deps.ts";
import { BfError } from "lib/BfError.ts";

const logger = getLogger(import.meta);
// Define possible job statuses
export enum BfNodeJobType {
  NOT_READY = "NOT_READY",
  AVAILABLE = "AVAILABLE",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

// Define the required properties for a node job
export type BfNodeJobRequiredProps = {
  status: BfNodeJobType;
  className: string;
  bfTid: BfTid;
  method: string;
  args: Array<unknown>;
};
// Define the BfNodeJob class
export class BfNodeJob extends BfNode<BfNodeJobRequiredProps> {
  // Use generics to ensure the method and args are correctly typed
  static async createJobForNode<
    T extends BfNode,
  >(
    bfNode: T,
    method: keyof T,
    args: Array<unknown> = [], // #TECHDEBT could be stronger typed.
  ): Promise<BfNodeJob> {
    const currentViewer = bfNode.currentViewer;
    const job = await this.create(currentViewer, {
      status: BfNodeJobType.AVAILABLE,
      className: bfNode.metadata.className,
      bfTid: toBfTid(bfNode.metadata.bfGid),
      method: method as string,
      args,
    });
    return job;
  }

  static async findAvailableJobs(
    currentViewer: BfCurrentViewerJobRunner,
  ): Promise<Array<BfNodeJob>> {
    const isJobRunner = currentViewer instanceof BfCurrentViewerJobRunner;
    if (!isJobRunner) {
      throw new BfError("Not a job runner");
    }
    const jobs = await this.query(currentViewer, {}, {
      status: BfNodeJobType.AVAILABLE,
    });
    return jobs;
  }

  async executeJob() {
    logger.info("Executing job");
    this.props.status = BfNodeJobType.RUNNING;
    await this.save();
    console.log(this.props);
    // try {
    //   const module = await import(
    //     `packages/bfDb/models/${this.props.className}.ts`
    //   );
    //   const JobClass: typeof BfNode = module[this.props.className];

    //   if (JobClass) {
    //     const item = await JobClass.findX(
    //       this.currentViewer,
    //       toBfGid(this.props.bfTid),
    //     );
    //     await item[this.props.method](...this.props.args);
    //   }
    // } catch (e) {
    //   logger.error("Error executing job", e);
    //   this.props.status = BfNodeJobType.FAILED;
    //   await this.save();
    // }
  }
}
