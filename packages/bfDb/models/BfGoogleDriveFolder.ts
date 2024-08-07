import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { BfPerson } from "packages/bfDb/models/BfPerson.ts";

type BfGoogleDriveFolderRequiredProps = {
  folderId: string;
  name: string;
};
export class BfGoogleDriveFolder
  extends BfNode<BfGoogleDriveFolderRequiredProps> {
  async afterCreate() {
    const currentViewerPerson = await BfPerson.findCurrentViewer(
      this.currentViewer,
    );
    const googleAuth = await currentViewerPerson?.getGoogleAuth();
    if (!googleAuth) {
      throw new Error("no google auth");
    }
    const orgEdgePromise = BfEdge.create(this.currentViewer, {}, {
      // @ts-expect-error typing is bad on bfEdge
      bfSid: this.currentViewer.organizationBfGid,
      bfSClassName: "BfOrganization",
      bfTid: this.metadata.bfGid,
      bfTClassName: this.constructor.name,
    });
    const googleAuthEdgePromise = BfEdge.create(this.currentViewer, {}, {
      // @ts-expect-error typing is bad on bfEdge
      bfSid: googleAuth.metadata.bfGid,
      bfSClassName: "BfGoogleAuth",
      bfTid: this.metadata.bfGid,
      bfTClassName: this.constructor.name,
    });
    await Promise.all([orgEdgePromise, googleAuthEdgePromise]);
  }
}
