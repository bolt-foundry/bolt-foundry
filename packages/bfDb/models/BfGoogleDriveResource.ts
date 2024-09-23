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
  Deno.env.get("GOOGLE_DRIVE_CACHE_DIRECTORY") ?? Deno.env.get("REPL_HOME")
    ? `${Deno.env.get("REPL_HOME")}/tmp/google-drive-cache`
    : "/tmp/google-drive-cache";

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
      logger.debug(resources);
      throw new BfError("Resource already exists");
    }
    this.metadata.bfGid = toBfGid(this.props.resourceId);
  }

  async afterCreate() {
    const currentViewerPerson = await BfPerson.findCurrentViewer(
      this.currentViewer,
    );
    const googleAuth = await currentViewerPerson?.getGoogleAuth();
    if (!googleAuth) throw new Error("no google auth");

    await BfEdge.createBetweenNodes(this.currentViewer, googleAuth, this);
    const accessToken = await googleAuth.getAccessToken();
    if (!accessToken) {
      throw new BfError("Can't get Google Auth access token");
    }

    const metadata = await fetchMetadata(
      accessToken,
      this.props.resourceId,
    );
    this.props.googleDriveMetadata = metadata;
    this.props.mimeType = metadata.mimeType;
    await this.save();
  }

  private async getAccessToken(): Promise<string | void> {
    logger.debug(
      "getting access token for folder",
      this.props.resourceId,
      this.metadata.bfGid,
    );
    const googleAuth = await this.getGoogleAuth();
    logger.debug(`got googleAuth ${googleAuth}`);
    const token = await googleAuth?.getAccessToken();
    return token;
  }

  private async getGoogleAuth() {
    const bfGoogleAuths = await BfEdge.querySourceInstances(
      this.currentViewer,
      BfGoogleAuth,
      this.metadata.bfGid,
    );
    logger.debug(`got bfGoogleAuths ${bfGoogleAuths}`);
    const googleAuth = bfGoogleAuths[0];
    return googleAuth;
  }

  async getChildren() {
    logger.debug(`getting folder contents for folder ${this}`);
    const token = await this.getAccessToken();
    if (!token) {
      throw new BfError("Can't crawl children, no Google Auth access token");
    }
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
    return childrenProps;
  }

  isFolder() {
    const FOLDER_MIMETYPE = "application/vnd.google-apps.folder";
    return this.props.mimeType === FOLDER_MIMETYPE;
  }

  isVideo() {
    return this.props.mimeType.startsWith("video");
  }

  private ingestVideo() {
    logger.info(`Starting to ingest video ${this}`);
    
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
    if (!token) {
      throw new BfError("Can't download file, no Google Auth access token");
    }
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
