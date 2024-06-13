// Import necessary dependencies
import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfAssoc } from "packages/bfDb/coreModels/BfAssoc.ts";
import { BfCurrentViewer, BfCurrentViewerJobRunner } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { toBfPid, toBfTid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
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
};
// Define the BfNodeJob class
export class BfNodeJob extends BfNode<BfNodeJobRequiredProps> {
  // Use generics to ensure the method and args are correctly typed
  static async createJobForNode<
    T extends BfNode,
  >(
    currentViewer: BfCurrentViewer,
    bfNode: T,
    method: string, // #TECHDEBT could be stronger typed.
    args: Array<unknown> // #TECHDEBT could be stronger typed.
    ,
  ): Promise<BfNodeJob> {
    const job = await this.create(currentViewer, {
      status: BfNodeJobType.NOT_READY,
    });
    await BfAssoc.create(currentViewer, { className: bfNode.constructor.name, method, args }, {
      bfTid: toBfTid(job.bfGid),
      bfPid: toBfPid(bfNode.metadata.bfGid),
    });
    job.props.status = BfNodeJobType.PENDING;
    await job.save();
    return job;
  }

  static async findAvailableJobs(currentViewer: BfCurrentViewerJobRunner): Promise<Array<BfNodeJob>> {
    const isJobRunner = currentViewer instanceof BfCurrentViewerJobRunner;
    if (!isJobRunner) {
      throw new BfError("Not a job runner");
    }
    const jobs = this.query(currentViewer, {}, {status: BfNodeJobType.AVAILABLE});
    return [];
  }

  async executeJob() {
    logger.info("Executing job");
    this.props.status = BfNodeJobType.RUNNING;
    await this.save();
    try {
      const module = await import(`packages/bfDb/models/${this.props.className}.ts`);
      const JobClass: typeof BfNode = module[this.props.className];
      const assocs = await BfAssoc.findAllForTarget(this.currentViewer, toBfTid(this.metadata.bfGid));
      if (JobClass) {
        JobClass.find(this.currentViewer, assoc.metadata.bfPid)
      }
    } catch {
      logger.error("Error executing job");
      this.props.status = BfNodeJobType.FAILED;
      await this.save();
    }
  }
}


