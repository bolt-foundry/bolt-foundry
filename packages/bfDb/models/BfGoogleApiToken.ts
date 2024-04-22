import { BfModel } from "packages/bfDb/classes/BfModel.ts";
import { exchangeRefreshTokenForAccessToken } from "lib/googleOauth.ts";

type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
};

export type BfGoogleApiTokenProps = {
  tokenPayload: GoogleTokenResponse;
  expiresAtISODate: string;
};

/*
 * @deprecated this doesn't follow normal BfModel graph idioms like assoc, etc.
 * do not use it as an example.
 */
export class BfGoogleApiToken extends BfModel<BfGoogleApiTokenProps> {
  __typename = "BfGoogleApiToken" as const;

  async getCurrentAccessToken() {
    const isExpired = new Date() > new Date(this.props.expiresAtISODate);
    // if the current access token is expired, refresh it
    if (isExpired) {
      const tokenPayload = await exchangeRefreshTokenForAccessToken(
        this.props.tokenPayload.refresh_token,
      );
      this.props.tokenPayload = tokenPayload;
      await this.save();
      return tokenPayload.access_token;
    }
    return this.props.tokenPayload.access_token;
  }
}
