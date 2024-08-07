import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";

type BfTranscriptProps = {
  transcript: string;
  filename: string;
};

export class BfTranscript extends BfNode<BfTranscriptProps> {
  static async findTranscriptsByViewer(bfCurrentViewer: BfCurrentViewer) {
    const transcripts = await this.query(bfCurrentViewer, {
      bfOid: bfCurrentViewer.organizationBfGid,
      className: "BfTranscript",
    });
    return transcripts;
  }
}
