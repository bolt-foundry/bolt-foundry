// Import necessary dependencies
import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import {
BfPid,
  BfTid,
  toBfGid,
  toBfPid,
  toBfTid,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { getLogger } from "deps.ts";
import { BfError } from "lib/BfError.ts";
import { CreationMetadata } from "packages/bfDb/classes/BfBaseModelMetadata.ts";
import { BfCurrentViewerJobRunner, BfCurrentViewerOmni } from "packages/bfDb/classes/BfCurrentViewer.ts";

const logger = getLogger(import.meta);
// Define possible job statuses
export enum BfNodeJobType {
  NOT_READY = "NOT_READY",
  AVAILABLE = "AVAILABLE",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

type BfNodeJobCreationMetadata = CreationMetadata & {
  bfPid: BfPid;
};


// Define the required properties for a node job
export type BfNodeJobRequiredProps = {
  status: BfNodeJobType;
  className: string;
  bfTid: BfTid;
  method: string;
  args: Array<unknown>;
};
// Define the BfNodeJob class
export class BfNodeJob extends BfNode<BfNodeJobRequiredProps, Record<string, never>, BfNodeJobCreationMetadata> {
  // Use generics to ensure the method and args are correctly typed
  static async createJobForNode<
    T extends BfNode,
  >(
    bfNode: T,
    method: keyof T,
    args: Array<unknown> = [], // #TECHDEBT could be stronger typed.
  ): Promise<BfNodeJob> {
    const currentViewer = bfNode.currentViewer;
    const jobProps: BfNodeJobRequiredProps = {
      status: BfNodeJobType.AVAILABLE,
      className: bfNode.metadata.className,
      bfTid: toBfTid(bfNode.metadata.bfGid),
      method: method as string,
      args,
    };
    // Ensure that the create method returns an instance of BfNodeJob
    const job = await this.create(currentViewer, jobProps, {
      bfOid: currentViewer.actorBfGid,
      bfPid: toBfPid(bfNode.metadata.bfGid),
    });
    return job;
  }

  static async findAvailableJobs(
    currentViewer: BfCurrentViewerOmni,
  ): Promise<Array<BfNodeJob>> {
    const isJobRunner = currentViewer instanceof BfCurrentViewerOmni;
    if (!isJobRunner) {
      throw new BfError("Not an omnicv");
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
    try {
      const module = await import(
        `packages/bfDb/models/${this.props.className}.ts`
      );
      const JobClass: typeof BfNode = module[this.props.className];

      if (JobClass) {
        const runnableCurrentViewer = await BfCurrentViewerJobRunner.create(import.meta, this);
        const target = await JobClass.findX(
          runnableCurrentViewer,
          this.props.bfTid,
        );
        // @ts-expect-error dynamic typing naughtiness
        await target[this.props.method](...this.props.args);
      }
    } catch (e) {
      logger.error("Error executing job", e);
      this.props.status = BfNodeJobType.FAILED;
      await this.save();
    }
  }
}
