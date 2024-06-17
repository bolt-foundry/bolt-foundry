import { BfModel } from "packages/bfDb/classes/BfModel.ts";
import { decodeAndVerifyGoogleToken } from "packages/bfDb/classes/BfAuth.ts";
import {
  BfCurrentViewerAccessToken,
} from "packages/bfDb/classes/BfCurrentViewer.ts";
import { getLogger } from "deps.ts";
import {
toBfCid,
  toBfOid,
  toBfPid,
  toBfSkUnsorted,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";
import {
  BfGoogleApiToken,
  BfGoogleApiTokenProps,
} from "packages/bfDb/models/BfGoogleApiToken.ts";
import { exchangeCodeForToken } from "lib/googleOauth.ts";
import { bfFindItems } from "packages/bfDb/bfDb.ts";
import { BfAssoc } from "packages/bfDb/coreModels/BfAssoc.ts";
const logger = getLogger(import.meta);
const logVerbose = logger.trace;

type BfPersonRequiredProps = {
  name: string;
  email: string;
  lastLogout?: Date;
};

export class BfPerson extends BfModel<BfPersonRequiredProps> {
  __typename = "BfPerson" as const;
  static async clientLoginWithGoogle(
    credential: string,
  ) {
    const currentViewer = await BfCurrentViewerAccessToken.createFromGoogle(
      import.meta,
      credential,
    );
    const person = await this.find(currentViewer, currentViewer.personBfGid);
    if (person) {
      logVerbose("found person", person);
      return person;
    }
    logVerbose("creating new person");
    const newPerson = await this.createFromGoogle(credential);
    logVerbose("newPerson", newPerson);
    return newPerson;
  }

  static async createFromGoogle(credential: string) {
    const { email, name, hd } = await decodeAndVerifyGoogleToken(
      credential,
    );

    const currentViewer = await BfCurrentViewerAccessToken
      .createFromGoogle(
        import.meta,
        credential,
      );
    const newPerson = await this.create(currentViewer, { email, name }, {
      bfGid: currentViewer.personBfGid,
      bfCid: toBfCid(currentViewer.personBfGid),
    });

    if (hd) {
      const org = await BfOrganization.findByDomainName(
        currentViewer,
        hd,
      );
      if (org) {
        org.addCurrentViewer(currentViewer);
      }
    }

    

    logVerbose("newPerson", newPerson);
    return newPerson;
  }

  static async findGoogleApiTokenForCurrentViewer(
    currentViewer: BfCurrentViewerAccessToken,
  ) {
    const apiTokens = await bfFindItems<BfGoogleApiTokenProps>(
      toBfOid(currentViewer.personBfGid),
      toBfSkUnsorted("BfGoogleApiToken"),
    );

    const token =
      apiTokens.map(({ props, metadata }) =>
        new BfGoogleApiToken(currentViewer, props, {}, metadata, true)
      )[0];
    return token ?? null;
  }

  async logout() {
    this.props.lastLogout = new Date();
    await this.save();
  }

  async beforeLoad() {
    // the await is just to return a promise
    this.metadata.bfOid = await toBfOid(this.currentViewer.personBfGid);
  }

  async linkEnhancedGoogleAccount(code: string) {
    const tokenPayload = await exchangeCodeForToken(code);
    logVerbose("tokenPayload", tokenPayload);
    const expiresAtISODate = new Date(
      Date.now() + tokenPayload.expires_in * 1000,
    ).toISOString();
    const token = await BfGoogleApiToken.create(
      this.currentViewer,
      {
        tokenPayload,
        expiresAtISODate,
      },
      {
        bfOid: this.metadata.bfOid,
      },
    );
    const _googleApiTokenAssoc = await BfAssoc.create(this.currentViewer, {
      action: "authenticates",
    }, {
      bfPid: toBfPid(this.metadata.bfGid),
      bfTid: token.metadata.bfTid,
    });
  }
}
