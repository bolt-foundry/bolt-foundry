import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";

type BfClipReviewProps = {
  title: string;
  awsprojectSlug: string;
};

export class BfClipReview extends BfNode<BfClipReviewProps> {
}
