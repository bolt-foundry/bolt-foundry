import { GraphQLObjectBase } from "apps/bfDb/graphql/GraphQLObjectBase.ts";
import { claimsFromRequest } from "apps/bfDb/graphql/utils/graphqlContextUtils.ts";
import { getLogger } from "packages/logger/logger.ts";
import type { BfGid } from "lib/types.ts";
import type { GoogleTokenInfo } from "lib/types/googleTokenInfo.ts";
import { BfOrganization } from "apps/bfDb/nodeTypes/BfOrganization.ts";
import { BfError } from "lib/BfError.ts";
import { BfPerson } from "apps/bfDb/nodeTypes/BfPerson.ts";

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
  /* GraphQL -------------------------------------------------------------- */
  static override gqlSpec = this.defineGqlNode(
    (field, mutation) => {
      field.id("id"); // refresh‑token version
      field.string("personBfGid");
      field.string("orgBfOid");

      mutation.custom("loginWithGoogle", {
        args: (a) => a.nonNull.string("idToken"),
        returns: (r) => r.object(CurrentViewer, "currentViewer"),
        resolve: async (_src, { idToken }, ctx) => {
          const currentViewer = await ctx.loginWithGoogleToken(idToken);
          return { currentViewer };
        },
      });
    },
  );

  /* Properties ----------------------------------------------------------- */
  readonly orgBfOid: BfGid;
  readonly personBfGid: BfGid;

  constructor(personBfGid: BfGid, orgBfOid: BfGid, tokenVersion = 1) {
    super(String(tokenVersion)); // expose refresh‑token version as `id`
    this.orgBfOid = orgBfOid;
    this.personBfGid = personBfGid;
  }

  /* ------------------------------------------------------------------
   *  dev‑only helpers used by tests & seed scripts
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
   * Verifies the token, then creates or updates the user record
   */
  static async loginWithGoogleToken(
    idToken: string,
  ): Promise<CurrentViewerLoggedIn> {
    logger.debug("Verifying Google ID token");

    try {
      // Verify token with Google's tokeninfo endpoint
      const tokenInfoUrl = new URL("https://oauth2.googleapis.com/tokeninfo");
      tokenInfoUrl.searchParams.append("id_token", idToken);

      const response = await fetch(tokenInfoUrl.toString());

      if (!response.ok) {
        logger.warn("Google token verification failed", await response.text());
        throw new Error("Invalid Google token");
      }

      const tokenInfo: GoogleTokenInfo = await response.json();
      logger.debug("Google token verified successfully");

      // Check if email is verified
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

      // In a real implementation, we would:
      // 1. Find or create BfPerson with this email
      // 2. Find or create BfOrganization for this person
      // 3. Create JWT session tokens

      // For now, create a user with a deterministic ID based on email
      const personId = `google-person:${tokenInfo.sub}` as BfGid;
      const orgId = `google-org:${tokenInfo.hd}` as BfGid;

      logger.debug(`Created session for Google user: ${personId}`);
      const cv = new CurrentViewerLoggedIn(
        personId as BfGid,
        orgId as BfGid,
      );

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
        person = await BfPerson.__DANGEROUS__createUnattached(cv, {
          email: tokenInfo.email,
          name: tokenInfo.name ?? "",
        }, {
          bfOid: personId,
          bfCid: "GOOGLE_TOKEN" as BfGid,
          bfGid: personId,
        });
      }

      await org.addPersonIfNotMember(person);

      return cv;
    } catch (error) {
      logger.error("Google login failed", error);
      throw error;
    }
  }

  /* ------------------------------------------------------------------
   *  HTTP→Viewer extraction – delegates to utils.claimsFromRequest
   * ------------------------------------------------------------------ */
  static async createFromRequest(
    _meta: ImportMeta,
    req: Request,
    resHeaders?: Headers,
  ): Promise<CurrentViewer> {
    // --- existing JWT-based logic ---
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

  /**
   * Build a fully‑populated Logged‑in viewer.
   */
  static makeLoggedInCv(
    personBfGid: BfGid,
    orgBfOid: BfGid,
    tokenVersion = 1,
  ): CurrentViewerLoggedIn {
    return new CurrentViewerLoggedIn(personBfGid, orgBfOid, tokenVersion);
  }

  /**
   * Build a Logged‑out viewer (anonymous).  Uses deterministic placeholder
   * GIDs so equality checks in tests stay stable across runs.
   */
  static makeLoggedOutCv(tokenVersion = 1): CurrentViewerLoggedOut {
    return new CurrentViewerLoggedOut(
      "person:anonymous" as BfGid,
      "org:public" as BfGid,
      tokenVersion,
    );
  }

  /* ---------------------------------------------------------------------- */
  /*  GraphQL serialisation                                                 */
  /* ---------------------------------------------------------------------- */

  override toGraphql() {
    return {
      __typename: this.constructor.name as CurrentViewerTypenames,
      id: this.id,
      personBfGid: this.personBfGid,
      orgBfOid: this.orgBfOid,
    } as const;
  }
}

/* -------------------------------------------------------------------------- */
/*  Concrete subclasses                                                      */
/* -------------------------------------------------------------------------- */

export class CurrentViewerLoggedIn extends CurrentViewer {
  static override gqlSpec = this.defineGqlNode(() => {});
}

export class CurrentViewerLoggedOut extends CurrentViewer {
  static override gqlSpec = this.defineGqlNode(() => {});
}
