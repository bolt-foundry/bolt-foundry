import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { BfPerson } from "packages/bfDb/models/BfPerson.ts";
import { BfGoogleAuth } from "packages/bfDb/models/BfGoogleAuth.ts";
import { getLogger } from "deps.ts";
import { fetchFolderContents } from "lib/googleDriveApi.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfError } from "lib/BfError.ts";
import { toBfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";

const logger = getLogger(import.meta);


type BfGoogleDriveResourceRequiredProps = {
  resourceId: string;
  name: string;
};
export class BfGoogleDriveResource
  extends BfNode<BfGoogleDriveResourceRequiredProps> {

  async beforeCreate() {
    const resources = await (this.constructor as typeof BfGoogleDriveResource).query(this.currentViewer, {}, { resourceId: this.props.resourceId });
    if (resources.length > 0) {
      throw new BfError("Resource already exists");
    }
    this.metadata.bfGid = toBfGid(this.props.resourceId);
  }

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

  async getAccessToken() {
    logger.debug("getting access token for folder", this.props.resourceId, this.metadata.bfGid);
    const bfGoogleAuths = await BfEdge.querySources(this.currentViewer, BfGoogleAuth, this.metadata.bfGid);
    logger.debug("got bfGoogleAuths", bfGoogleAuths);
    const googleAuth = bfGoogleAuths[0];
    logger.debug("got googleAuth", googleAuth);
    const token = await googleAuth?.getAccessToken();
    return token
  }
}
