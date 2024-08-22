// Import necessary dependencies
import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { getLogger } from "deps.ts";
import { BfError } from "lib/BfError.ts";
import {
  BfCurrentViewerFromAccount,
  IBfCurrentViewerInternalAdminOmni,
} from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfAccount } from "packages/bfDb/models/BfAccount.ts";
import {
  BfEdge,
  BfEdgeRequiredProps,
} from "packages/bfDb/coreModels/BfEdge.ts";

const logger = getLogger(import.meta);

export enum BfJobType {
  NOT_READY = "NOT_READY",
  AVAILABLE = "AVAILABLE",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

type ValidJSONValuesRaw = string | number | boolean | null | undefined;

type ValidJSONValues =
  | ValidJSONValuesRaw
  | Array<ValidJSONValuesRaw>
  | Record<string, ValidJSONValuesRaw>;

export type BfJobRequiredProps<T extends ValidJSONValues = ValidJSONValues> = {
  status: BfJobType;
  accountBfGid: BfGid;
  method: string;
  args: T;
} & BfEdgeRequiredProps;

export class BfJob extends BfNode<BfJobRequiredProps, Record<string, never>> {
  static async createJobForNode<
    T extends BfNode,
    K extends keyof T & (string | symbol),
  >(
    bfNode: T,
    method: K,
    args: unknown,
    // #bf-nocommit
    // runImmediately = Deno.env.get("BF_ENV") === "DEVELOPMENT",
    runImmediately = false,
    runInForeground = false,
  ): Promise<BfJob> {
    const currentViewer = bfNode.currentViewer;
    const jobProps = {
      status: BfJobType.AVAILABLE,
      accountBfGid: currentViewer.accountBfGid,
      method: method as string,
      args,
    };
    const job = await this.create(currentViewer, jobProps);
    const _jobEdge = await BfEdge.createEdgeBetweenNodes(
      currentViewer,
      bfNode,
      job,
    );
    if (runInForeground) {
      logger.warn(
        `${job} running in foreground (likely of current web request.) It's not reflective of actual behavior, best only to do for debugging sake.`,
      );
      await job.executeJob();
    } else if (runImmediately) {
      logger.warn(
        `${job} executing in next tick in background. Production runs should execute as an asynchronous job.`,
      );
      job.executeJob();
    }
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
    logger.debug(`Executing job ${this}`);
    this.props.status = BfJobType.RUNNING;
    await this.save();
    const edges = await BfEdge.queryAllSourceEdgesForNode(this);
    if (edges.length !== 1) {
      throw new BfError(
        `Job has either too many or not enough source edges: ${edges.length}`,
      );
    }
    const edge = edges[0];
    try {
      const module = await import(
        `packages/bfDb/models/${edge.metadata.bfSClassName}.ts`
      );
      const JobClass: typeof BfNode = module[edge.metadata.bfSClassName];

      if (JobClass) {
        const account = await BfAccount.findX(
          this.currentViewer,
          this.props.accountBfGid,
        );

        logger.info(
          `running ${this} as ${account}`,
        );
        const currentViewer = BfCurrentViewerFromAccount.create(
          import.meta,
          account,
        );
        const target = await JobClass.findX(
          currentViewer,
          edge.metadata.bfSid,
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
