import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfCurrentViewerAccessToken } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { CreationMetadata } from "packages/bfDb/classes/BfBaseModelMetadata.ts";
import { fakeReviewComments } from "packages/client/fakeData/internalQC.js";

export type BfClipReviewCommentRequiredProps = {
  id: BfGid;
  reviewId: BfGid;
  text: string;
  timcode: number;
};

export class BfClipReviewComment extends BfNode<
  BfClipReviewCommentRequiredProps,
  Record<string, never>,
  CreationMetadata
> {
  __typename: "BfClipReviewComment" = "BfClipReviewComment";

  constructor({ props }: { props: BfClipReviewCommentRequiredProps }) {
    super({ props });
    this.props = props;
  }

  static async findByReviewId(
    currentViewer: BfCurrentViewerAccessToken,
    reviewId: BfGid,
  ): Promise<Array<BfClipReviewComment>> {
    return fakeReviewComments.filter((comment) => comment.reviewId === reviewId)
      .map((comment) => new BfClipReviewComment({ props: comment }));
    // const comments = await this.query(currentViewer, {}, { reviewId });
    // return comments;
  }
}
