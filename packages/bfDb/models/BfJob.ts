import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";

// @ts-types="@types/pg"
import { Client } from "@neon/serverless";
import type { BfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { getLogger } from "deps.ts";
import { BfError } from "lib/BfError.ts";
import {
  BfCurrentViewerFromAccount,
  IBfCurrentViewerInternalAdminOmni,
} from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfAccount } from "packages/bfDb/models/BfAccount.ts";
import {
  BfEdge,
  type BfEdgeRequiredProps,
} from "packages/bfDb/coreModels/BfEdge.ts";

const logger = getLogger(import.meta);

const connectionString = Deno.env.get("BF_ENV") === "DEVELOPMENT"
  ? Deno.env.get("DATABASE_URL") ?? Deno.env.get("BFDB_URL")
  : Deno.env.get("BFDB_URL");

export enum BfJobType {
  NOT_READY = "NOT_READY",
  AVAILABLE = "AVAILABLE",
  CLAIMED = "CLAIMED",
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
    const job = await this.__DANGEROUS__createUnattached(
      currentViewer,
      jobProps,
    );
    const _jobEdge = await BfEdge.createBetweenNodes(
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

  static async executeNextJob(
    currentViewer: IBfCurrentViewerInternalAdminOmni,
  ) {
    const client = new Client({ connectionString });
    logger.debug("Connecting to postgres");
    await client.connect();

    const isJobRunner = currentViewer instanceof
      IBfCurrentViewerInternalAdminOmni;
    if (!isJobRunner) {
      throw new BfError("Not an omnicv");
    }
    await client.query("BEGIN");
    const { rows } = await client.query(
      `SELECT * from bfDb where class_name = 'BfJob' AND props->>'status' = 'AVAILABLE' FOR UPDATE SKIP LOCKED LIMIT 1`,
    );

    let jobId;
    if (rows.length > 0) {
      jobId = rows[0]?.bf_gid;
      logger.debug(`Found job ${jobId}, claiming`)
      await client.query(
        `UPDATE bfDb SET props = props || $1::jsonb WHERE bf_gid = $2`,
        [JSON.stringify({ status: BfJobType.CLAIMED }), jobId],
      );
      logger.debug(`Claimed job ${jobId}`)
    }

    await client.query("COMMIT");
    await client.end();
    if (jobId) {
      logger.debug(`finding job ${jobId}`)
      const job = await this.findX(currentViewer, jobId);
      logger.debug(`found ${job}, executing`)
      await job.executeJob();
      logger.debug(`Executed ${job}`)
      return job;
    }
  }

  private async executeJob() {
    logger.debug(`Starting job ${this} execution`);

    this.props.status = BfJobType.RUNNING;
    await this.save();
    const edges = await BfEdge.querySourceEdgesForNode(this);
    if (edges.length !== 1) {
      throw new BfError(
        `${this} has either too many or not enough source edges: ${edges.length}`,
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
          `executing ${this} as ${account}`,
        );
        const currentViewer = BfCurrentViewerFromAccount.create(
          import.meta,
          account,
        );
        const target = await JobClass.findX(
          currentViewer,
          edge.metadata.bfSid,
        );

        // @ts-expect-error dynamic typing naughtiness
        await target[this.props.method](...this.props.args);
        this.props.status = BfJobType.COMPLETED;
        await this.save();
        logger.info(`Completed job ${this}`);
      }
    } catch (e) {
      logger.error("Error executing job", e);
      this.props.status = BfJobType.FAILED;
      await this.save();
    }
  }
}
