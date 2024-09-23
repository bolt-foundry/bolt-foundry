import { BfMediaNodeVideo } from "packages/bfDb/models/BfMediaNodeVideo.ts";
import type { BfNodeRequiredProps } from "packages/bfDb/coreModels/BfNode.ts";
import { getLogger } from "deps.ts";
import {
  BfMediaNodeTranscript,
  BfMediaNodeTranscriptStatus,
} from "packages/bfDb/models/BfMediaNodeTranscript.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";

const logger = getLogger(import.meta);

type BfMediaNodeVideoGoogleDriveResourceProps = {
  googleDriveResourceId: string;
} & BfNodeRequiredProps;

export class BfMediaNodeVideoGoogleDriveResource
  extends BfMediaNodeVideo<BfMediaNodeVideoGoogleDriveResourceProps> {
  async createTranscript() {
    const bfmnTranscript = await this.createTargetNode(BfMediaNodeTranscript, {
      status: BfMediaNodeTranscriptStatus.NEW,
    });
    logger.info(`Creating transcript for ${this}`);
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
    logger.info(`Transcript created for ${this}`);
    return bfmnTranscript;
  }
}
