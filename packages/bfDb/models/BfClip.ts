import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfClipReview } from "packages/bfDb/models/BfClipReview.ts";
import { toBfPid, toBfTid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";

type BfClipProps = {
  title: string;
};

export class BfClip extends BfNode<BfClipProps> {
  afterCreate(): void | Promise<void> {
    this.createNewClipReview();
  }
  
  async createNewClipReview() {
    const clipReview = await BfClipReview.create(this.currentViewer, {
      title: `review of ${this.props.title}`,
      awsprojectSlug: "not real please fix",
    });
    await BfEdge.create(this.currentViewer, {}, {bfPid: toBfPid(this.metadata.bfGid), bfTid: toBfTid(clipReview.metadata.bfGid)})
  }
  
  async queryClipReviewEdges() {
    const edges = await BfEdge.query(this.currentViewer, {bfPid: toBfPid(this.metadata.bfGid)})
    return edges;
  }

  static async findReviewableClips(bfCurrentViewer: BfCurrentViewer) {
    // @nocommit this is not real
    const clips = await this.query(bfCurrentViewer, {bfOid: bfCurrentViewer.organizationBfGid});
    return clips.map(clip => clip.toGraphql())
  }
}
