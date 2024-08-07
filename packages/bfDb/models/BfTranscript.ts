import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfGid, toBfSid, toBfTid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";

type BfTranscriptProps = {
  transcript: string;
};

export class BfTranscript extends BfNode<BfTranscriptProps> {
  async createNewTranscript(text: string) {
    const newTranscript = await BfTranscript.create(this.currentViewer, {
      transcript: text,
    });
    return newTranscript;
  }

  static async findTranscriptsByViewer(bfCurrentViewer: BfCurrentViewer) {
    const transcripts = await this.query(bfCurrentViewer, {
      bfOid: bfCurrentViewer.organizationBfGid,
      className: 'BfTranscript',
    });
    return transcripts;
  }
}