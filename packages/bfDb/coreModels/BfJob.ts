import { BfModel } from "packages/bfDb/classes/BfModel.ts";
import { CreationMetadata } from "packages/bfDb/classes/BfBaseModelMetadata.ts";

export type BfJobRequiredProps = {
  status: JobStatus;
  progress: number;
};

export type BfJobOptionalProps = {
  error?: string;
};

export type JobProgressEvent = {
  progress: number; // from 0 to 1.
};

export enum JobStatus {
  NOT_STARTED = "NOT_STARTED",
  INGESTING = "INGESTING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export abstract class BfJob<
  BfJobChildRequiredProps extends BfJobRequiredProps = BfJobRequiredProps,
  BfJobChildOptionalProps extends BfJobOptionalProps = BfJobOptionalProps,
  BfJobChildCreationMetadata extends CreationMetadata = CreationMetadata,
> extends BfModel<
  BfJobChildRequiredProps,
  BfJobChildOptionalProps,
  BfJobChildCreationMetadata
> {
  beforeStart(): Promise<void> | void {}
  start(): Promise<void> | void {}
  abstract onStart(): Promise<void> | void;
  afterStart(): Promise<void> | void {}
  abstract onCancel(): void;
  cancel(): Promise<void> | void {}
  async throwError(error: Error) {
    await this.onError(error);
  }
  abstract onError(error: Error): Promise<void> | void;
}
