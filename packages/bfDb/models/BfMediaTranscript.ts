import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import type { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import type { BfMediaNodeAudio } from "packages/bfDb/models/BfMediaNodeAudio.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

enum BfMediaTranscriptStatus {
  CREATED = "CREATED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
}
export type BfMediaTranscriptProps = {
  id: string;
  words: string;
  filename: string;
  status: BfMediaTranscriptStatus;
};

export class BfMediaTranscript extends BfNode<BfMediaTranscriptProps> {
  /**
   * @deprecated don't use this.
   */
  static async findTranscriptsByViewer(bfCurrentViewer: BfCurrentViewer) {
    const transcripts = await this.query(bfCurrentViewer, {
      bfOid: bfCurrentViewer.organizationBfGid,
    });
    return transcripts;
  }

  static async createFromBfMediaAudio(bfMediaAudio: BfMediaNodeAudio) {
    const transcript = await this.create(bfMediaAudio.currentViewer, {
      status: BfMediaTranscriptStatus.CREATED,
    });
    await transcript.populateFromBfMediaAudio(bfMediaAudio);
    return transcript;
  }

  async populateFromBfMediaAudio(_bfMediaAudio: BfMediaNodeAudio) {
    await logger.error("Need to send to assembly ai probably");
  }
}
