import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { BfClipReview } from "packages/bfDb/models/BfClipReview.ts";
import {
  BfGid,
  toBfSid,
  toBfTid,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";

type BfClipReviewCommentProps = {
  author: string;
  timecode: number;
  message: string;
};

export class BfClipReviewComment extends BfNode<BfClipReviewCommentProps> {
  async createComment(
    clipReview: BfClipReview,
    author: string,
    timecode: number,
    message: string,
  ) {
    const comment = await BfClipReviewComment.create(this.currentViewer, {
      author,
      timecode,
      message,
    });
    await BfEdge.create(this.currentViewer, {}, {
      bfSid: toBfSid(clipReview.metadata.bfGid),
      bfTid: toBfTid(comment.metadata.bfGid),
    });
    return comment;
  }

  static async queryCommentsForClipReview(
    clipReview: BfClipReview,
    currentViewer: BfCurrentViewer,
  ) {
    const edges = await BfEdge.query(currentViewer, {
      bfSid: toBfSid(clipReview.metadata.bfGid),
    });
    const comments = edges.map(async (edge) => {
      return await BfClipReviewComment.find(currentViewer, edge.target);
    });
    return Promise.all(comments);
  }
}
