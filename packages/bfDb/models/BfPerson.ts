import { decodeAndVerifyGoogleToken } from "packages/bfDb/classes/BfAuth.ts";
import {
  type BfCurrentViewer,
  BfCurrentViewerAccessToken,
} from "packages/bfDb/classes/BfCurrentViewer.ts";
import { getLogger } from "packages/logger/logger.ts";
import { toBfOid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfError } from "lib/BfError.ts";
const logger = getLogger(import.meta);
const logVerbose = logger.trace;

type BfPersonRequiredProps = {
  name: string;
  email: string;
  lastLogout?: Date;
};

export class BfPerson extends BfNode<BfPersonRequiredProps> {
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

    if (!hd) {
      throw new BfError("Need a google workspace account");
    }

    const currentViewer = await BfCurrentViewerAccessToken
      .createFromGoogle(
        import.meta,
        credential,
      );
    const newPerson = await this.__DANGEROUS__createUnattached(currentViewer, {
      email,
      name,
    }, {
      bfGid: currentViewer.personBfGid,
      bfOid: toBfOid(currentViewer.personBfGid),
    });

    const { BfOrganization } = await import("packages/bfDb/models/BfOrganization.ts");

    await BfOrganization
      .__DANGEROUS__addCurrentViewerFromGoogleToOrganization(
        import.meta,
        currentViewer,
        hd,
      );

    logVerbose("newPerson", newPerson); 
    return newPerson;
  }

  static findCurrentViewer(bfCurrentViewer: BfCurrentViewer) {
    return this.findX(bfCurrentViewer, bfCurrentViewer.personBfGid);
  }

  async logout() {
    this.props.lastLogout = new Date();
    await this.save();
  }

  protected override beforeLoad() {
    // people actually own themselves.
    this.metadata.bfOid = toBfOid(this.currentViewer.personBfGid);
  }

  async getGoogleAuth() {
    const { BfEdge } = await import("packages/bfDb/coreModels/BfEdge.ts");
    const { BfGoogleAuth } = await import("packages/bfDb/models/BfGoogleAuth.ts");
    const auths = await BfEdge.queryTargetInstances(
      this.currentViewer,
      BfGoogleAuth,
      this.metadata.bfGid,
    );
    const bfGoogleAuth = auths[0];
    return bfGoogleAuth as unknown as InstanceType<typeof BfGoogleAuth> | void;
  }
}
