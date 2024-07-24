import {
  BfCurrentViewer,
  BfCurrentViewerAccessToken,
} from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfAccount } from "packages/bfDb/models/BfAccount.ts";
import { BfAccountRequiredProps } from "packages/bfDb/models/BfAccount.ts";
import {
  ACCOUNT_ROLE,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { bfQueryItems } from "packages/bfDb/bfDb.ts";
import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";

type BfOrganizationRequiredProps = {
  name: string;
  domainName: string;
};

export class BfOrganization extends BfNode<BfOrganizationRequiredProps> {
  __typename = "BfOrganization" as const;
  protected static isSelfOwned = true;

  static async findByDomainName(currentViewer: BfCurrentViewer, hd: string) {
    const item = await bfQueryItems({ className: "BfOrganization" }, {
      domainName: hd,
    });
    return this.findX(currentViewer, item[0].metadata.bfGid);
  }

  async addCurrentViewer(
    currentViewer: BfCurrentViewerAccessToken,
  ) {
    const props: BfAccountRequiredProps = {
      organizationBfGid: this.metadata.bfGid,
      personBfGid: currentViewer.personBfGid,
      role: ACCOUNT_ROLE.OWNER,
      displayName: this.props.name,
    };
    const newAccount = await BfAccount.create(currentViewer, props, {
      bfOid: this.metadata.bfOid,
    });
    return newAccount;
  }
}
