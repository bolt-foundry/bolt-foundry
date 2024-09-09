import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { exchangeRefreshTokenForAccessToken } from "lib/googleOauth.ts";

type BfGoogleAuthProps = {
  refreshToken: string;
};

export class BfGoogleAuth extends BfNode<BfGoogleAuthProps> {
  async getAccessToken() {
    const payload = await exchangeRefreshTokenForAccessToken(
      this.props.refreshToken,
    );
    return payload.access_token;
  }
}
