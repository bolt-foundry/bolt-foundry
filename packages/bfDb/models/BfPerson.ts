import { decodeAndVerifyGoogleToken } from "packages/bfDb/classes/BfAuth.ts";
import {
  BfCurrentViewerAccessToken,
} from "packages/bfDb/classes/BfCurrentViewer.ts";
import { getLogger } from "deps.ts";
import {
  toBfOid,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";
import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
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

    const currentViewer = await BfCurrentViewerAccessToken
      .createFromGoogle(
        import.meta,
        credential,
      );
    const newPerson = await this.create(currentViewer, { email, name }, {
      bfGid: currentViewer.personBfGid,
      bfOid: toBfOid(currentViewer.personBfGid),
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

  async logout() {
    this.props.lastLogout = new Date();
    await this.save();
  }

  beforeLoad() {
    // people actually own themselves.
    this.metadata.bfOid = toBfOid(this.currentViewer.personBfGid);
  }

}
