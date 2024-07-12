import {
  ACCOUNT_ROLE,
  BfGid,
  toBfGid,
  toBfOid,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfCurrentViewerAccessToken } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfPerson } from "packages/bfDb/models/BfPerson.ts";
import {
  BfJwtPayload,
  encodeBfAccessToken,
  encodeBfRefreshToken,
} from "packages/bfDb/classes/BfAuth.ts";
import {
  BfModelErrorNotFound,
} from "packages/bfDb/classes/BfModelError.ts";
import { bfQueryItems } from "packages/bfDb/bfDb.ts";
import { BfDbError } from "packages/bfDb/classes/BfDbError.ts";
import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";

export type BfAccountRequiredProps = {
  organizationBfGid: BfGid;
  personBfGid: BfGid;
  role: ACCOUNT_ROLE;
  displayName: string;
};

class BfAccountError extends BfDbError {}

class BfAccountErrorRefreshToken extends BfAccountError {
  constructor(message: string = "Refresh token error") {
    super(message);
  }
}

class BfAccountRefreshTokenExpiredError extends BfAccountErrorRefreshToken {
  constructor() {
    super("Refresh token expired");
  }
}

export class BfAccount extends BfNode<BfAccountRequiredProps> {
  __typename = "BfAccount" as const;

  static async findAllForCurrentViewer(
    currentViewer: BfCurrentViewerAccessToken,
  ) {
    const accounts = await bfQueryItems<BfAccountRequiredProps>(
      {className: this.name},
      {personBfGid: currentViewer.personBfGid}
    );

    return accounts.map(({ props, metadata }) =>
      new BfAccount(currentViewer, props, {}, metadata, true)
    );
  }

  static async findDefaultForCurrentViewer(
    currentViewer: BfCurrentViewerAccessToken,
  ) {
    const accounts = await this.findAllForCurrentViewer(currentViewer);
    const defaultAccount =
      accounts.find((account) => account.props.role === ACCOUNT_ROLE.OWNER) ??
        accounts[0];
    if (!defaultAccount) {
      throw new BfModelErrorNotFound("Default account not found");
    }
    return defaultAccount;
  }

  static async getRefreshedAccessToken(
    importMeta: ImportMeta,
    refreshToken: string,
  ) {
    const currentViewer = await BfCurrentViewerAccessToken.create(
      importMeta,
      refreshToken,
    );
    const person = await BfPerson.findX(
      currentViewer,
      currentViewer.personBfGid,
    );
    // last logout to unix seconds
    const lastLogout = person?.props.lastLogout
      ? Math.floor(person?.props.lastLogout.getTime() / 1000)
      : 0;
    const refreshTokenIssuedAt = currentViewer.jwtPayload?.iat ?? 0;
    if (lastLogout > refreshTokenIssuedAt) {
      throw new BfAccountRefreshTokenExpiredError();
    }
    if (
      toBfGid(currentViewer.organizationBfGid) !== currentViewer.personBfGid &&
      currentViewer.accountBfGid
    ) {
      const relatedAccount = await this.find(
        currentViewer,
        currentViewer.accountBfGid,
      );
      if (relatedAccount) {
        return await relatedAccount.generateAccessToken(importMeta);
      }
      throw new BfAccountErrorRefreshToken();
    }
  }

  async generateAccessToken(importMeta: ImportMeta) {
    return await encodeBfAccessToken(
      importMeta,
      this.toJwtPayload(),
    );
  }
  async generateRefreshToken(importMeta: ImportMeta) {
    const jwtPayload = this.toJwtPayload();
    const payload = {
      ...jwtPayload,
      role: ACCOUNT_ROLE.REFRESH_CREDENTIALS_ONLY as const,
    };
    return await encodeBfRefreshToken(
      importMeta,
      payload,
    );
  }

  toJwtPayload(): BfJwtPayload {
    return {
      role: this.props.role,
      organizationBfGid: this.props.organizationBfGid,
      personBfGid: this.props.personBfGid,
      accountBfGid: this.metadata.bfGid,
    };
  }
}
