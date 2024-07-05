import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfCurrentViewerAccessToken } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { CreationMetadata } from "packages/bfDb/classes/BfBaseModelMetadata.ts";
import { fakeReviewDecisions } from "packages/client/fakeData/internalQC.js";

export type BfClipReviewDecisionRequiredProps = {
  id: BfGid;
  reviewId: BfGid;
  decision: string;
};

export class BfClipReviewDecision extends BfNode<
  BfClipReviewDecisionRequiredProps,
  Record<string, never>,
  CreationMetadata
> {
  __typename: "BfClipReviewDecision" = "BfClipReviewDecision";

  constructor({ props }: { props: BfClipReviewDecisionRequiredProps }) {
    super({ props });
    this.props = props;
  }

  static async findByReviewId(
    currentViewer: BfCurrentViewerAccessToken,
    reviewId: BfGid,
  ): Promise<Array<BfClipReviewDecision>> {
    return fakeReviewDecisions.filter((decision) =>
      decision.reviewId === reviewId
    )
      .map((decision) => new BfClipReviewDecision({ props: decision }));
    // const decisions = await this.query(currentViewer, {}, { reviewId });
    // return decisions;
  }
}
