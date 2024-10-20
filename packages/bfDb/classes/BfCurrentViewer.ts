import {
  ACCOUNT_ROLE,
  type BfGid,
  type BfOid,
  toBfGid,
  toBfOid,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import {
  type BfJwtPayload,
  decodeAndVerifyBfJwt,
  decodeAndVerifyGoogleToken,
} from "packages/bfDb/classes/BfAuth.ts";
import type { BfAccount } from "packages/bfDb/models/BfAccount.ts";
import { getLogger } from "packages/logger/logger.ts";
import { BF_INTERNAL_ORG_NAME } from "packages/bfDb/utils.ts";

const logger = getLogger(import.meta);

export class BfCurrentViewerCreationError extends Error {
  constructor(reason: string) {
    super(`BfCurrentViewer can't be created: ${reason}`);
  }
}

export abstract class BfCurrentViewer {
  __typename: string;

  protected constructor(
    readonly organizationBfGid: BfOid, // always an owner, used to determine access control
    readonly role: ACCOUNT_ROLE,
    readonly personBfGid: BfGid, // person for whom the access token was created
    readonly accountBfGid: BfGid, // the account from which the access token was created. If undefined, the person is acting as themselves
    readonly creator: string, // the import.meta.url of the module that created the current viewer
    readonly jwtPayload: BfJwtPayload | null = null,
  ) {
    this.__typename = this.constructor.name;
  }

  toString() {
    return `${this.constructor.name}(BfAccount#${this.accountBfGid}, role: ${this.role})`;
  }
}

export class BfCurrentViewerAnon extends BfCurrentViewer {
  static create(importMeta: ImportMeta) {
    const creator = importMeta.url;
    return new this(
      toBfOid("anon"),
      ACCOUNT_ROLE.ANON,
      toBfGid("anon"),
      toBfGid("anon"),
      creator,
    );
  }
}

export class BfCurrentViewerAccessToken extends BfCurrentViewer {
  static async create(
    importMeta: ImportMeta,
    accessToken?: string,
  ) {
    try {
      if (accessToken) {
        const jwtPayload = await decodeAndVerifyBfJwt(accessToken);
        const { organizationBfGid, role, personBfGid, accountBfGid } =
          jwtPayload;
        if (role && organizationBfGid && personBfGid) {
          return new this(
            toBfOid(organizationBfGid),
            role as ACCOUNT_ROLE,
            personBfGid,
            toBfGid(accountBfGid),
            importMeta.url,
            jwtPayload,
          );
        }
      }
    } catch {
      // ignore
    }

    return BfCurrentViewerAnon.create(importMeta);
  }

  static async createFromGoogle(
    importMeta: ImportMeta,
    credential: string,
  ) {
    const { sub } = await decodeAndVerifyGoogleToken(credential);
    const id = `google:${sub}`;

    return new this(
      toBfOid(id),
      ACCOUNT_ROLE.OWNER,
      toBfGid(id),
      toBfGid(id),
      importMeta.url,
    );
  }
}

export class BfCurrentViewerFromAccount extends BfCurrentViewer {
  static create(importMeta: ImportMeta, account: BfAccount) {
    return new this(
      account.props.organizationBfGid,
      account.props.role,
      account.props.personBfGid,
      account.metadata.bfGid,
      importMeta.url,
    );
  }
}

export class __DANGEROUS__BfCurrentViewerFromThinAir extends BfCurrentViewer {
  static __DANGEROUS__create(
    importMeta: ImportMeta,
    props: { organizationBfGid: BfGid; role: ACCOUNT_ROLE; personBfGid: BfGid },
  ) {
    logger.warn(`Creating a CV from thin air, this is dangerous.`, props);
    return new this(
      props.organizationBfGid,
      props.role,
      props.personBfGid,
      props.personBfGid,
      importMeta.url,
    );
  }
}

export class IBfCurrentViewerInternalAdmin extends BfCurrentViewerAccessToken {
  static override async create(
    importMeta: ImportMeta,
    accessToken?: string,
  ) {
    try {
      if (accessToken) {
        const jwtPayload = await decodeAndVerifyBfJwt(accessToken);
        const { organizationBfGid, role, personBfGid, accountBfGid } =
          jwtPayload;
        if (role && personBfGid && organizationBfGid === BF_INTERNAL_ORG_NAME) {
          return new this(
            toBfOid(organizationBfGid),
            role as ACCOUNT_ROLE,
            personBfGid,
            toBfGid(accountBfGid),
            importMeta.url,
            jwtPayload,
          );
        }
      }
    } catch {
      // ignore
    }

    return BfCurrentViewerAnon.create(importMeta);
  }
}

export class IBfCurrentViewerInternalAdminOmni
  extends IBfCurrentViewerInternalAdmin {
  static __DANGEROUS__create(importMeta: ImportMeta, orgId = "omni_person") {
    logger.warn("Creating omni cv, tread carefully. Created for: ", orgId);
    return new this(
      toBfOid(orgId),
      ACCOUNT_ROLE.OMNI,
      toBfGid("omni_person"),
      toBfGid("omni_person"),
      importMeta.url,
    );
  }
}
