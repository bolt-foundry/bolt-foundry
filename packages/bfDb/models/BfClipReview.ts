import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfCurrentViewerAccessToken } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { CreationMetadata } from "packages/bfDb/classes/BfBaseModelMetadata.ts";
import { BfClipReviewComment } from "./BfClipReviewComment.ts";
import { BfClipReviewDecision } from "./BfClipReviewDecision.ts";
import { fakeClipReviews } from "packages/client/fakeData/internalQC.js";

export type BfClipReviewRequiredProps = {
  id: BfGid;
  clipId: BfGid;
  oldClipId: string;
};

export class BfClipReview extends BfNode<
  BfClipReviewRequiredProps,
  Record<string, never>,
  CreationMetadata
> {
  __typename: "BfClipReview" = "BfClipReview";

  constructor({ props }: { props: BfClipReviewRequiredProps }) {
    super({ props });
    this.props = props;
  }

  static async findByClipId(
    currentViewer: BfCurrentViewerAccessToken,
    clipId: BfGid,
  ): Promise<Array<BfClipReview>> {
    return fakeClipReviews.filter((review) => review.clipId === clipId)
      .map((review) => new BfClipReview({ props: review }));
    // const reviews = await this.query(currentViewer, {}, { clipId });
    // return reviews;
  }
  static async findByOldClipId(
    currentViewer: BfCurrentViewerAccessToken,
    oldClipId: string,
  ): Promise<Array<BfClipReview>> {
    return fakeClipReviews.filter((review) => review.oldClipId === oldClipId)
      .map((review) => new BfClipReview({ props: review }));
    // const reviews = await this.query(currentViewer, {}, { clipId });
    // return reviews;
  }

  public async getComments(
    currentViewer: BfCurrentViewerAccessToken,
  ): Promise<Array<BfClipReviewComment>> {
    return BfClipReviewComment.findByReviewId(currentViewer, this.props.id);
  }

  public async getDecisions(
    currentViewer: BfCurrentViewerAccessToken,
  ): Promise<Array<BfClipReviewDecision>> {
    return BfClipReviewDecision.findByReviewId(currentViewer, this.props.id);
  }
}
