import {
  __DANGEROUS__BfCurrentViewerFromThinAir,
  BfCurrentViewer,
  type BfCurrentViewerAccessToken,
  IBfCurrentViewerInternalAdmin,
  IBfCurrentViewerInternalAdminOmni,
} from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfAccount } from "packages/bfDb/models/BfAccount.ts";
import type { BfAccountRequiredProps } from "packages/bfDb/models/BfAccount.ts";
import {
  ACCOUNT_ROLE,
  toBfGid,
  toBfOid,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { bfQueryItems } from "packages/bfDb/bfDb.ts";
import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfError } from "lib/BfError.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

type BfOrganizationRequiredProps = {
  name: string;
  domainName: string;
  youtubePlaylistUrl: string;
};

type GraphQLCreateArgs = BfOrganizationRequiredProps;

export class BfOrganization extends BfNode<BfOrganizationRequiredProps> {
  __typename = "BfOrganization" as const;
  protected static isSelfOwned = true;

  static async findByDomainName(currentViewer: BfCurrentViewer, hd: string) {
    const item = await bfQueryItems({ className: "BfOrganization" }, {
      domainName: hd,
    });
    return this.findX(currentViewer, item[0].metadata.bfGid);
  }

  static async createFromGraphQL(
    currentViewer: BfCurrentViewer,
    { name, domainName, youtubePlaylistUrl }: GraphQLCreateArgs,
  ) {
    const isCurrentViewerInternalAdmin = currentViewer instanceof
      IBfCurrentViewerInternalAdmin;
    if (!isCurrentViewerInternalAdmin) {
      throw new BfError("Not authorized");
    }

    // probably should be a transaction but the transaction code needs to be better, like a callback style
    const newOrg = await this.__DANGEROUS__createUnattached(currentViewer, {
      name,
      domainName,
      youtubePlaylistUrl,
    }, {
      bfGid: toBfGid(domainName),
      bfOid: toBfOid(domainName),
    });

    await newOrg.createTargetNode(
      BfAccount,
      { role: ACCOUNT_ROLE.OWNER },
      ACCOUNT_ROLE.OWNER,
    );
    return newOrg.toGraphql();
  }

  /**
   * I shouldn't have to explain how terrifying this is. Calling this lets anyone
   * add themselves as a member to an organization.
   */
  static async __DANGEROUS__addCurrentViewerFromGoogleToOrganization(
    importMeta: ImportMeta,
    currentViewer: BfCurrentViewerAccessToken,
    domainName: string,
  ) {
    logger.warn(
      `Creating an account for ${currentViewer.personBfGid} in ${domainName} from ${importMeta.url}`,
    );
    const ONLY_USE_THIS_VC_TO_FIND_THE_ORGANIZATION_YOU_WANT_TO_ADD_A_PERSON_TO =
      IBfCurrentViewerInternalAdminOmni.__DANGEROUS__create(import.meta);
    const _SCARY_ORG_WITH_OMNI_VC = await this.findByDomainName(
      ONLY_USE_THIS_VC_TO_FIND_THE_ORGANIZATION_YOU_WANT_TO_ADD_A_PERSON_TO,
      domainName,
    );
    const organizationBfGid = _SCARY_ORG_WITH_OMNI_VC.metadata.bfGid;
    const personBfGid = currentViewer.personBfGid;
    const role = ACCOUNT_ROLE.MEMBER;
    const props = { organizationBfGid, personBfGid, role };

    // we're going to generate a new vc with the org and the person, so the ownership
    // doesn't get messed up.

    const newViewer = __DANGEROUS__BfCurrentViewerFromThinAir
      .__DANGEROUS__create(import.meta, props);

    const org = await this.findX(newViewer, organizationBfGid);

    const DANGEROUSLY_CREATED_ACCOUNT = org.createTargetNode(
      BfAccount,
      props,
      ACCOUNT_ROLE.MEMBER,
    );
    logger.warn("Created account successfully.");
    return DANGEROUSLY_CREATED_ACCOUNT;
  }

  static findForCurrentViewer(currentViewer: BfCurrentViewer) {
    return this.findX(currentViewer, currentViewer.organizationBfGid)
  }
}
