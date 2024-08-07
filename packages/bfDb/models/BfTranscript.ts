import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";

export type BfTranscriptProps = {
  words: string;
  filename: string;
};

export class BfTranscript extends BfNode<BfTranscriptProps> {
  static async findTranscriptsByViewer(bfCurrentViewer: BfCurrentViewer) {
    const transcripts = await this.query(bfCurrentViewer, {
      bfOid: bfCurrentViewer.organizationBfGid,
      // TODO @randallb update query so you don't need to specify className
      className: "BfTranscript",
    });
    return transcripts;
  }
}
