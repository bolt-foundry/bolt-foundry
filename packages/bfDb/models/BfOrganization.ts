import { BfModel } from "packages/bfDb/classes/BfModel.ts";
import { BfPerson } from "packages/bfDb/models/BfPerson.ts";
import { BfCurrentViewerAccessToken } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfAccount } from "packages/bfDb/models/BfAccount.ts";
import { BfAccountRequiredProps } from "packages/bfDb/models/BfAccount.ts";
import {
  ACCOUNT_ROLE,
  toBfOid,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";

type BfOrganizationRequiredProps = {
  name: string;
};

export class BfOrganization extends BfModel<BfOrganizationRequiredProps> {
  __typename = "BfOrganization" as const;
  protected static isSelfOwned = true;

  static async createForCurrentViewer(
    currentViewer: BfCurrentViewerAccessToken,
  ) {
    const relatedPerson = await BfPerson.findX(
      currentViewer,
      currentViewer.personBfGid,
    );
    const orgProps: BfOrganizationRequiredProps = {
      name: `${relatedPerson?.props.name}'s Organization`,
    };
    const newOrg = await this.create(currentViewer, orgProps);
    await newOrg.addPerson(currentViewer);
    return newOrg;
  }

  async addPerson(
    currentViewer: BfCurrentViewerAccessToken,
  ) {
    const props: BfAccountRequiredProps = {
      organizationBfGid: this.metadata.bfGid,
      personBfGid: currentViewer.personBfGid,
      role: ACCOUNT_ROLE.OWNER,
      displayName: this.props.name,
    };
    const newAccount = await BfAccount.create(currentViewer, props, {
      bfOid: toBfOid(currentViewer.personBfGid),
    });
    return newAccount;
  }
}
