import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";

export type BfMediaTranscriptProps = {
  id: string;
  words: string;
  filename: string;
};

export class BfMediaTranscript extends BfNode<BfMediaTranscriptProps> {
  static async findTranscriptsByViewer(bfCurrentViewer: BfCurrentViewer) {
    const transcripts = await this.query(bfCurrentViewer, {
      bfOid: bfCurrentViewer.organizationBfGid,
    });
    return transcripts;
  }
}
