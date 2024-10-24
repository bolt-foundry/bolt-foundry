import { BfMediaNodeVideo } from "packages/bfDb/models/BfMediaNodeVideo.ts";
import type { BfNodeRequiredProps } from "packages/bfDb/coreModels/BfNode.ts";
import { getLogger } from "packages/logger/logger.ts";
import {
  BfMediaNodeTranscript,
  BfMediaNodeTranscriptStatus,
} from "packages/bfDb/models/BfMediaNodeTranscript.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { BfGoogleDriveResource } from "packages/bfDb/models/BfGoogleDriveResource.ts";
import { toBfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfJob } from "packages/bfDb/models/BfJob.ts";

const logger = getLogger(import.meta);

type BfMediaNodeVideoGoogleDriveResourceProps = {
  googleDriveResourceId: string;
} & BfNodeRequiredProps;

export class BfMediaNodeVideoGoogleDriveResource
  extends BfMediaNodeVideo<BfMediaNodeVideoGoogleDriveResourceProps> {
  async afterCreate() {
    logger.debug(`Creating preview video job for ${this}`);
    await BfJob.createJobForNode(
      this,
      "createPreview",
      [],
    );
  }

  async createTranscript() {
    const bfmnTranscript = await this.createTargetNode(BfMediaNodeTranscript, {
      status: BfMediaNodeTranscriptStatus.NEW,
    });
    logger.debug(`Creating transcript for ${this}`);
    const currentOrg = await BfOrganization.findForCurrentViewer(
      this.currentViewer,
    );
    await BfEdge.createBetweenNodes(
      this.currentViewer,
      currentOrg,
      bfmnTranscript,
    );
    await bfmnTranscript.requestTranscriptionFromGoogleDriveResourceId(
      this.props.googleDriveResourceId,
    );
    logger.debug(`Transcript created for ${this}`);
    return bfmnTranscript;
  }

  async getFile() {
    logger.debug(
      "getFile",
      "compressVideoFromGoogleDriveResourceId",
      this.props.googleDriveResourceId,
    );

    const bfGoogleDriveResource = await BfGoogleDriveResource.findX(
      this.currentViewer,
      toBfGid(this.props.googleDriveResourceId),
    );
    logger.debug(`Getting file handle for ${bfGoogleDriveResource}`);
    using _fileHandle = await bfGoogleDriveResource.download();
    return bfGoogleDriveResource.getFilePath();
  }
}
