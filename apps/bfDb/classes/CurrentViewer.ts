import { GraphQLObjectBase } from "@bfmono/apps/bfDb/graphql/GraphQLObjectBase.ts";
import { claimsFromRequest } from "@bfmono/apps/bfDb/graphql/utils/graphqlContextUtils.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type { BfGid } from "@bfmono/lib/types.ts";
import type { GoogleTokenInfo } from "@bfmono/lib/types/googleTokenInfo.ts";
import { BfOrganization } from "@bfmono/apps/bfDb/nodeTypes/BfOrganization.ts";
import { BfError } from "@bfmono/lib/BfError.ts";
import { BfPerson } from "@bfmono/apps/bfDb/nodeTypes/BfPerson.ts";

const logger = getLogger(import.meta);

/* -------------------------------------------------------------------------- */
/*  GraphQL typenames                                                         */
/* -------------------------------------------------------------------------- */

export type CurrentViewerTypenames =
  | "CurrentViewerLoggedIn"
  | "CurrentViewerLoggedOut";

/* -------------------------------------------------------------------------- */
/*  Core CurrentViewer model                                                  */
/* -------------------------------------------------------------------------- */

export class CurrentViewer extends GraphQLObjectBase {
  override toString() {
    return `${this.constructor.name}(${this.personBfGid}, ${this.orgBfOid})`;
  }

  /* ----------------------------------------------------------------------
   *  GraphQL spec
   * -------------------------------------------------------------------- */
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .id("id")
      .string("personBfGid")
      .string("orgBfOid")
      .mutation("loginWithGoogle", {
        args: (a) => a.nonNull.string("idToken"),
        returns: "CurrentViewer", // ← new API
        resolve: async (_src, args, ctx) => {
          const idToken = args.idToken as string;
          const currentViewer = await ctx.loginWithGoogleToken(idToken);
          return { currentViewer };
        },
      })
      .object("currentViewer", () => Promise.resolve(CurrentViewer)) // ← expose the payload object
  );

  /* ----------------------------------------------------------------------
   *  Properties
   * -------------------------------------------------------------------- */
  readonly orgBfOid: BfGid;
  readonly personBfGid: BfGid;

  protected constructor(personBfGid: BfGid, orgBfOid: BfGid, tokenVersion = 1) {
    super(String(tokenVersion)); // expose refresh-token version as `id`
    this.orgBfOid = orgBfOid;
    this.personBfGid = personBfGid;
  }

  /* ------------------------------------------------------------------
   *  dev-only helpers used by tests & seed scripts
   * ------------------------------------------------------------------ */
  static __DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
    _meta: ImportMeta,
    id = "dev@example.com",
    orgSlug = "dev-org",
    tokenVersion = 1,
  ): CurrentViewer {
    return new CurrentViewerLoggedIn(
      id as BfGid,
      orgSlug as BfGid,
      tokenVersion,
    );
  }

  /**
   * Authenticate user with Google ID token
   */
  static async loginWithGoogleToken(
    idToken: string,
  ): Promise<CurrentViewerLoggedIn> {
    logger.debug("Verifying Google ID token");

    try {
      const tokenInfoUrl = new URL("https://oauth2.googleapis.com/tokeninfo");
      tokenInfoUrl.searchParams.append("id_token", idToken);

      const response = await fetch(tokenInfoUrl.toString());
      if (!response.ok) {
        logger.warn("Google token verification failed", await response.text());
        throw new Error("Invalid Google token");
      }

      const tokenInfo: GoogleTokenInfo = await response.json();
      logger.debug("Google token verified successfully");

      if (!tokenInfo.email_verified) {
        logger.warn("Google account email not verified", tokenInfo.email);
        throw new BfError("Email not verified with Google");
      }
      if (!tokenInfo.hd) {
        logger.warn(
          "Google account not part of an organization",
          tokenInfo.email,
        );
        throw new BfError("Google account not part of an organization");
      }

      const personId = `google-person:${tokenInfo.sub}` as BfGid;
      const orgId = `google-org:${tokenInfo.hd}` as BfGid;

      const cv = new CurrentViewerLoggedIn(personId, orgId);

      let org = await BfOrganization.find(cv, orgId);
      if (!org) {
        logger.debug("Creating new organization for", orgId);
        org = await BfOrganization.__DANGEROUS__createUnattached(cv, {
          name: tokenInfo.hd,
          domain: tokenInfo.hd,
        });
      }

      let person = await BfPerson.find(cv, personId);
      if (!person) {
        logger.debug("Creating new person for", personId);
        person = await BfPerson.__DANGEROUS__createUnattached(
          cv,
          { email: tokenInfo.email, name: tokenInfo.name ?? "" },
          {
            bfOid: personId,
            bfCid: "GOOGLE_TOKEN" as BfGid,
            bfGid: personId,
          },
        );
      }

      // await org.addPersonIfNotMember(person);
      return cv;
    } catch (error) {
      logger.error("Google login failed", error);
      throw error;
    }
  }

  /* ------------------------------------------------------------------
   *  HTTP→Viewer extraction
   * ------------------------------------------------------------------ */
  static async createFromRequest(
    _meta: ImportMeta,
    req: Request,
    resHeaders?: Headers,
  ): Promise<CurrentViewer> {
    try {
      const claims = await claimsFromRequest(req, resHeaders);
      if (!claims) {
        logger.debug("No valid session cookies – returning LoggedOut viewer");
        return this.makeLoggedOutCv();
      }
      logger.debug(
        `Restored viewer ${claims.personGid} (org ${claims.orgOid})`,
      );
      return this.makeLoggedInCv(
        claims.personGid as BfGid,
        claims.orgOid as BfGid,
        claims.tokenVersion,
      );
    } catch (err) {
      logger.warn("createFromRequest failed, falling back to LoggedOut", err);
      return this.makeLoggedOutCv();
    }
  }

  /* ------------------------------------------------------------------
   *  Factory helpers
   * ------------------------------------------------------------------ */
  static makeLoggedInCv(
    personBfGid: BfGid,
    orgBfOid: BfGid,
    tokenVersion = 1,
  ): CurrentViewerLoggedIn {
    return new CurrentViewerLoggedIn(personBfGid, orgBfOid, tokenVersion);
  }

  static makeLoggedOutCv(tokenVersion = 1): CurrentViewerLoggedOut {
    return new CurrentViewerLoggedOut(
      "person:anonymous" as BfGid,
      "org:public" as BfGid,
      tokenVersion,
    );
  }

  /* ----------------------------------------------------------------------
   *  GraphQL serialisation
   * -------------------------------------------------------------------- */
  override toGraphql() {
    return {
      __typename: this.constructor.name as CurrentViewerTypenames,
      id: this.id,
      personBfGid: this.personBfGid,
      orgBfOid: this.orgBfOid,
    } as const;
  }
}

/* --------------------------------------------------------------------------
 *  Concrete subclasses
 * ------------------------------------------------------------------------ */
export class CurrentViewerLoggedIn extends CurrentViewer {
  static override gqlSpec = this.defineGqlNode((gql) => gql);
}
export class CurrentViewerLoggedOut extends CurrentViewer {
  static override gqlSpec = this.defineGqlNode((gql) => gql);
}
