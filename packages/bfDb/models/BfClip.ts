import { ConnectionArguments } from "packages/graphql/deps.ts";
import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfGid, toBfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfCurrentViewerAccessToken } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { CreationMetadata } from "packages/bfDb/classes/BfBaseModelMetadata.ts";
import { BfClipReview } from "./BfClipReview.ts";
import {
  fakeClipReviews,
  fakeClips,
} from "packages/client/fakeData/internalQC.js";

export type BfClipRequiredProps = {
  id: BfGid;
  title: string;
  owner: string;
  client: string;
  oldClipId: BfGid;
};

export class BfClip extends BfNode<
  BfClipRequiredProps,
  Record<string, never>,
  CreationMetadata
> {
  __typename: "BfClip" = "BfClip";
  constructor({ props }: { props: BfClipRequiredProps }) {
    super({ props });
    this.props = props; // Ensures that props is defined on the instance
  }
  // Static method to find clips by an array of oldClipIds
  static findByOldClipIds(
    currentViewer: BfCurrentViewerAccessToken,
    oldClipIds: Array<BfGid>,
  ): Promise<Array<BfClip>> {
    return new Promise<Array<BfClip>>((resolve) => {
      const clips = fakeClips
        .filter((clip) => oldClipIds.includes(toBfGid(clip.oldClipId)))
        .map((clip) => {
          console.log("Instantiating BfClip with:", clip);
          const newClip = BfClip.findFakeData(currentViewer, clip, {
            bfGid: toBfGid(clip.id),
          });
          return newClip;
        });
      resolve(clips);
    });
  }

  // New method to extend from the fake data
  findRelatedAssocs<
    TAssocModel extends BfModel<unknown>,
  >(
    AssocClass: new (...args: any[]) => TAssocModel,
  ): Promise<
    Array<
      InstanceType<typeof AssocClass> & BfBaseModelMetadata<CreationMetadata>
    >
  > {
    console.log("assocclass name", AssocClass.name);
    if (AssocClass.name === "BfClipReview") {
      const reviews = fakeClipReviews.filter((review) => {
        console.log("this.props", this.props);
        console.log(review.clipId, this.props.id);
        console.log(review.oldClipId, this.props.oldClipId);
        return review.oldClipId === this.props.oldClipId;
      });
      return reviews.map((review) => new BfClipReview({ props: review }));
    }
    return [];
  }

  getReviews(
    currentViewer: BfCurrentViewerAccessToken,
  ): Array<BfClipReview> {
    return fakeClipReviews
      .filter((review) => review.clipId === this.props.id)
      .map((review) => new BfClipReview({ props: review }));
  }

  public async getReviewsConnection(
    currentViewer: BfCurrentViewerAccessToken,
    connectionArgs: ConnectionArguments,
  ) {
    return await this.getAssociatedConnection(
      BfClipReview,
      currentViewer,
      connectionArgs,
      (review) => review.oldClipId === this.props.oldClipId,
    );
  }
}
