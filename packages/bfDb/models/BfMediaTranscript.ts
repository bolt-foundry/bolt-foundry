import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";

export type BfMediaTranscriptProps = {
  words: string;
  filename: string;
};

export class BfMediaTranscript extends BfNode<BfMediaTranscriptProps> {
  static async findTranscriptsByViewer(bfCurrentViewer: BfCurrentViewer) {
    const transcripts = await this.query(bfCurrentViewer, {
      bfOid: bfCurrentViewer.organizationBfGid,
      // TODO @randallb update query so you don't need to specify className
      className: "BfMediaTranscript",
    });
    return transcripts;
  }
}