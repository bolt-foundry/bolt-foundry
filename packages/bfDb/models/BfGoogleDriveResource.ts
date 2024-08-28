import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { BfPerson } from "packages/bfDb/models/BfPerson.ts";
import { BfGoogleAuth } from "packages/bfDb/models/BfGoogleAuth.ts";
import { getLogger } from "deps.ts";
import {
  fetchFile,
  fetchFolderContents,
  fetchMetadata,
  type GoogleDriveFileMetadata,
} from "lib/googleDriveApi.ts";
import { BfError } from "lib/BfError.ts";
import { toBfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfJob } from "packages/bfDb/models/BfJob.ts";
import { BfMedia } from "packages/bfDb/models/BfMedia.ts";

const GOOGLE_DRIVE_CACHE_DIRECTORY =
  Deno.env.get("GOOGLE_DRIVE_CACHE_DIRECTORY") ?? "/tmp/google-drive-cache";

const logger = getLogger(import.meta);

type BfGoogleDriveResourceRequiredProps = {
  resourceId: string;
  name: string;
  mimeType: string;
  googleDriveMetadata: GoogleDriveFileMetadata;
  ingestionProgress: number;
};
export class BfGoogleDriveResource
  extends BfNode<BfGoogleDriveResourceRequiredProps> {
  async beforeCreate() {
    const resources = await (this.constructor as typeof BfGoogleDriveResource)
      .query(this.currentViewer, {}, { resourceId: this.props.resourceId });
    if (resources.length > 0) {
      throw new BfError("Resource already exists");
    }
    this.metadata.bfGid = toBfGid(this.props.resourceId);
  }

  async afterCreate() {
    const accessToken = await this.getAccessToken();

    const googleDriveMetadataPromise = fetchMetadata(
      accessToken,
      this.props.resourceId,
    ).then(async (metadata) => {
      this.props.googleDriveMetadata = metadata;
      this.props.mimeType = metadata.mimeType;
      await this.save();
    });

    const currentViewerPerson = await BfPerson.findCurrentViewer(
      this.currentViewer,
    );
    const googleAuth = await currentViewerPerson?.getGoogleAuth();
    if (!googleAuth) {
      throw new Error("no google auth");
    }

    const googleAuthEdgePromise = BfEdge.__DANGEROUS__createUnattached(
      this.currentViewer,
      {},
      {
        // @ts-expect-error typing is bad on bfEdge
        bfSid: googleAuth.metadata.bfGid,
        bfSClassName: "BfGoogleAuth",
        bfTid: this.metadata.bfGid,
        bfTClassName: this.constructor.name,
      },
    );

    const jobPromise = BfJob.createJobForNode(
      this,
      "__JOB_ONLY__crawlChildren",
      [],
    );

    const _ingestPromise = BfJob.createJobForNode(
      this,
      "__JOB_ONLY__ingest",
      [],
    );

    await Promise.all([
      googleAuthEdgePromise,
      googleDriveMetadataPromise,
      ingestPromise,
      jobPromise,
    ]);
  }

  private async getAccessToken(): Promise<string> {
    logger.debug(
      "getting access token for folder",
      this.props.resourceId,
      this.metadata.bfGid,
    );
    const googleAuth = await this.getGoogleAuth();
    logger.debug("got googleAuth", googleAuth);
    const token = await googleAuth?.getAccessToken();
    return token;
  }

  private async getGoogleAuth() {
    const bfGoogleAuths = await BfEdge.querySources(
      this.currentViewer,
      BfGoogleAuth,
      this.metadata.bfGid,
    );
    logger.debug("got bfGoogleAuths", bfGoogleAuths);
    const googleAuth = bfGoogleAuths[0];
    return googleAuth;
  }

  __JOB_ONLY__crawlChildren() {
    return this.crawlChildren();
  }
  private async crawlChildren() {
    logger.debug(`getting folder contents for folder ${this}`);
    const token = await this.getAccessToken();
    const response = await fetchFolderContents(token, this.props.resourceId);
    logger.debug("folder contents", response);
    const childrenProps: Array<BfGoogleDriveResourceRequiredProps> =
      response.files?.map((resource) => {
        return {
          resourceId: resource.id,
          name: resource.name,
          googleDriveMetadata: resource,
          mimeType: resource.mimeType,
          ingestionProgress: 0,
        };
      }) ?? [];
    for (const childProps of childrenProps) {
      await BfJob.createJobForNode(this, "__JOB_ONLY__createChild", [
        childProps,
      ]);
    }
    return this;
  }

  __JOB_ONLY__createChild(childProps: BfGoogleDriveResourceRequiredProps) {
    return this.createChild(childProps);
  }
  private async createChild(childProps: BfGoogleDriveResourceRequiredProps) {
    logger.debug("creating child", childProps, this.metadata.bfGid);
    try {
      await this.transactionStart();
      const child = await (this.constructor as typeof BfGoogleDriveResource)
        .__DANGEROUS__createUnattached(this.currentViewer, childProps);
      const edge = await BfEdge.createEdgeBetweenNodes(
        this.currentViewer,
        this,
        child,
      );
      logger.debug("created child and edge", child, edge);
      await this.transactionCommit();
      logger.debug("committed transaction");
    } catch (e) {
      logger.debug("failed to create child and edge", e);
      await this.transactionRollback();
      logger.debug("rolled back transaction");
      throw e;
    }
  }

  __JOB_ONLY__ingest() {
    return this.ingest();
  }

  private async ingest() {
    if (this.props.mimeType.startsWith("video")) {
      await BfMedia.createFromGoogleDriveResource(this);
    }
    return this;
  }

  getFilePath() {
    return `${GOOGLE_DRIVE_CACHE_DIRECTORY}/${this.metadata.bfGid}`;
  }

  /**
   * Retrieves a file handle for the resource.
   *
   * We recommend the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/using using} keyword ensures that system resources are disposed of correctly.
   * Otherwise you'll need to dispose of the file handle yourself.
   *
   * @example
   * const fileHandle = await bfGoogleDriveResource.getFileHandle();
   *
   * @example
   * const fileHandle = await bfGoogleDriveResource.getFileHandle();
   * fileHandle.close();
   */
  async getFileHandle(): Promise<Deno.FsFile> {
    const existsOnDisk = await Deno.stat(this.getFilePath()).then(() => true)
      .catch(() => false);
    return existsOnDisk ? Deno.open(this.getFilePath()) : this.download();
  }

  private async download(targetPath = this.getFilePath()) {
    await Deno.mkdir(GOOGLE_DRIVE_CACHE_DIRECTORY, { recursive: true });
    const path = targetPath;
    const token = await this.getAccessToken();
    const response = await fetchFile(token, this.props.resourceId);
    logger.debug("downloading", this.props.resourceId, path);
    const file = await Deno.create(path);
    if (response.body) {
      const contentLength = parseInt(
        response.headers.get("content-length") ?? "0",
      );
      let totalWritten = 0;
      let lastReported = 0;
      for await (const chunk of response.body) {
        await file.write(chunk);
        totalWritten += chunk.length;
        if (contentLength != 0) {
          const progress = Math.round((totalWritten / contentLength) * 100);
          if (progress > lastReported) {
            lastReported = progress;
            this.reportProgress(totalWritten / contentLength);
          }
        }
      }
      logger.debug("downloaded", this.props.resourceId, path);
      this.reportProgress(1);
    }
    return file;
  }

  private async reportProgress(progress: number) {
    logger.debug("reporting progress", progress, this.metadata.bfGid);
    this.props.ingestionProgress = progress;
    await this.save();
    return this;
  }
}
