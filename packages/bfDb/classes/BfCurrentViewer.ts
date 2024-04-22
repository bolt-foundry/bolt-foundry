import {
  ACCOUNT_ROLE,
  BfGid,
  BfOid,
  toBfGid,
  toBfOid,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import {
  BfJwtPayload,
  decodeAndVerifyBfJwt,
  decodeAndVerifyGoogleToken,
} from "packages/bfDb/classes/BfAuth.ts";

export class BfCurrentViewerCreationError extends Error {
  constructor(reason: string) {
    super(`BfCurrentViewer can't be created: ${reason}`);
  }
}
export abstract class BfCurrentViewer {
  __typename: string;

  protected constructor(
    readonly actorBfGid: BfOid, // always an owner, used to determine access control
    readonly role: ACCOUNT_ROLE,
    readonly personBfGid: BfGid, // person for whom the access token was created
    readonly creator: string, // the import.meta.url of the module that created the current viewer
    readonly jwtPayload: BfJwtPayload | null = null,
    readonly accountBfGid?: BfGid, // the account from which the access token was created. If undefined, the person is acting as themselves
  ) {
    this.__typename = this.constructor.name;
  }
}

export class BfCurrentViewerAnon extends BfCurrentViewer {
  static create(importMeta: ImportMeta) {
    const creator = importMeta.url;
    return new this(
      toBfOid("anon"),
      ACCOUNT_ROLE.ANON,
      toBfGid("anon"),
      creator,
      null,
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
        const { actorBfGid, role, personBfGid, iss } = jwtPayload;
        if (role && actorBfGid && personBfGid) {
          return new this(
            toBfOid(actorBfGid),
            role as ACCOUNT_ROLE,
            personBfGid,
            importMeta.url,
            jwtPayload,
            toBfGid(iss ?? ""),
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
      importMeta.url,
    );
  }
}

export class BfCurrentViewerServiceAccount extends BfCurrentViewer {
  static create(
    importMeta: ImportMeta,
    serviceAccountType: ACCOUNT_ROLE,
    bfOid: BfOid,
    bfGidForCreator: BfGid,
  ) {
    return new this(
      bfOid,
      serviceAccountType,
      bfGidForCreator,
      importMeta.url,
    );
  }
}
