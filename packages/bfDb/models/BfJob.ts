// Import necessary dependencies
import type { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { getLogger } from "deps.ts";
import { BfError } from "lib/BfError.ts";
import {
  BfCurrentViewerFromAccount,
  IBfCurrentViewerInternalAdminOmni,
} from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfAccount } from "packages/bfDb/models/BfAccount.ts";
import { BfEdge, EdgeCreationMetadata } from "packages/bfDb/coreModels/BfEdge.ts";

const logger = getLogger(import.meta);
logger.setLevel(logger.levels.DEBUG)

export enum BfJobType {
  NOT_READY = "NOT_READY",
  AVAILABLE = "AVAILABLE",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

type ValidJSONValuesRaw = string | number | boolean | null | undefined;

type ValidJSONValues = ValidJSONValuesRaw | Array<ValidJSONValuesRaw>;

export type BfJobRequiredProps = {
  status: BfJobType;
  accountBfGid: BfGid;
  method: string;
  args: Array<ValidJSONValues>;
};

export class BfJob extends BfEdge<BfJobRequiredProps, Record<string, never>> {
  static async createJobForNode<
    T extends BfNode,
  >(
    bfNode: T,
    method: keyof T,
    args: Array<ValidJSONValues> = [],
  ): Promise<BfJob> {
    const currentViewer = bfNode.currentViewer;
    const jobProps: BfJobRequiredProps = {
      status: BfJobType.AVAILABLE,
      accountBfGid: currentViewer.accountBfGid,
      method: method as string,
      args,
    };
    const jobMetadata: EdgeCreationMetadata = {
      bfSid: bfNode.metadata.bfGid,
      bfSClassName: bfNode.constructor.name,
      bfOid: bfNode.metadata.bfOid,
      bfTid: bfNode.metadata.bfGid,
      bfTClassName: bfNode.constructor.name,
    }
    logger.info(jobMetadata);
    const job = await this.create(currentViewer, jobProps, jobMetadata);
    return job;
  }

  static async findAvailableJobs(
    currentViewer: IBfCurrentViewerInternalAdminOmni,
  ): Promise<Array<BfJob>> {
    const isJobRunner = currentViewer instanceof
      IBfCurrentViewerInternalAdminOmni;
    if (!isJobRunner) {
      throw new BfError("Not an omnicv");
    }
    const jobs = await this.query(currentViewer, {}, {
      status: BfJobType.AVAILABLE,
    });
    return jobs;
  }

  async executeJob() {
    logger.debug("Executing job");
    this.props.status = BfJobType.RUNNING;
    await this.save();
    try {
      const module = await import(
        `packages/bfDb/models/${this.metadata.bfTClassName}.ts`
      );
      const JobClass: typeof BfNode = module[this.metadata.bfTClassName];

      if (JobClass) {
        const account = await BfAccount.findX(
          this.currentViewer,
          this.props.accountBfGid,
        );

        logger.info(
          `running job as ${account.metadata.bfGid}`,
        );
        const currentViewer = BfCurrentViewerFromAccount.create(
          import.meta,
          account,
        );
        const target = await JobClass.findX(
          currentViewer,
          this.metadata.bfTid,
        );
        logger.debug("found", target, this.props.method, this.props.args);
        // @ts-expect-error dynamic typing naughtiness
        await target[this.props.method](...this.props.args);
      }
    } catch (e) {
      logger.error("Error executing job", e);
      this.props.status = BfJobType.FAILED;
      await this.save();
    }
  }
}
