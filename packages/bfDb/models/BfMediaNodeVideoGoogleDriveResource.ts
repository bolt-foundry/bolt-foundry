import { BfMediaNodeVideo } from "packages/bfDb/models/BfMediaNodeVideo.ts";
import type { BfNodeRequiredProps } from "packages/bfDb/coreModels/BfNode.ts";
import { getLogger } from "deps.ts";
import {
  BfMediaNodeTranscript,
  BfMediaNodeTranscriptStatus,
} from "packages/bfDb/models/BfMediaNodeTranscript.ts";

const _logger = getLogger(import.meta);

type BfMediaNodeVideoGoogleDriveResourceProps = {
  googleDriveResourceId: string;
} & BfNodeRequiredProps;

export class BfMediaNodeVideoGoogleDriveResource
  extends BfMediaNodeVideo<BfMediaNodeVideoGoogleDriveResourceProps> {
  async createTranscript() {
    const bfmnTranscript = await this.createTargetNode(BfMediaNodeTranscript, {
      status: BfMediaNodeTranscriptStatus.NEW,
    });
    await bfmnTranscript.requestTranscriptionFromGoogleDriveResourceId(
      this.props.googleDriveResourceId,
    );
    return this;
  }
}