import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { exchangeRefreshTokenForAccessToken } from "lib/googleOauth.ts";

type BfGoogleAuthProps = {
  refreshToken: string;
};

export class BfGoogleAuth extends BfNode<BfGoogleAuthProps> {
  async afterCreate() {
    await BfEdge.create(this.currentViewer, {}, {
      // @ts-expect-error idk why the metadata types are messed up for bf edges.
      bfTClassName: this.metadata.className,
      bfTid: this.metadata.bfGid,
      bfSClassName: "BfPerson",
      bfSid: this.currentViewer.personBfGid,
    });
  }

  async getAccessToken() {
    const payload = await exchangeRefreshTokenForAccessToken(this.props.refreshToken);
    return payload.access_token;
  }
}
