import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfClipReview } from "packages/bfDb/models/BfClipReview.ts";
import { BfGid, toBfSid, toBfTid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";

type BfClipProps = {
  title: string;
  originalId: BfGid,
};

export class BfClip extends BfNode<BfClipProps> {

  async createNewClipReview(videoFile: File) {
    const priorReviews = await this.queryClipReviewEdges();
    const clipReview = await BfClipReview.create(this.currentViewer, {
      title: `${this.props.title} (V${priorReviews.length + 1})`,
    });
    clipReview.addFile(videoFile)
    await BfEdge.create(this.currentViewer, {}, {bfSid: toBfSid(this.metadata.bfGid), bfTid: toBfTid(clipReview.metadata.bfGid)})
  }

  async queryClipReviewEdges() {
    const edges = await BfEdge.query(this.currentViewer, {bfSid: toBfSid(this.metadata.bfGid)})
    return edges;
  }

  static async findReviewableClips(bfCurrentViewer: BfCurrentViewer) {
    // @nocommit this is not real
    const clips = await this.query(bfCurrentViewer, {
      bfOid: bfCurrentViewer.organizationBfGid,
    });
    return clips.map((clip) => clip.toGraphql());
  }
}
