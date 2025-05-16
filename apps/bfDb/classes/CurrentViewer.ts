import { GraphQLObjectBase } from "apps/bfDb/graphql/GraphQLObjectBase.ts";
import { getLogger } from "packages/logger/logger.ts";
import type { BfGid } from "lib/types.ts";
import type { GoogleTokenInfo } from "lib/types/googleTokenInfo.ts";
import { BfError } from "lib/BfError.ts";
import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";

// Import only the types we need but keep imports for future use
// deno-lint-ignore no-unused-vars
import type { BfOrganization } from "apps/bfDb/nodeTypes/BfOrganization.ts";
// deno-lint-ignore no-unused-vars
import type { BfPerson } from "apps/bfDb/nodeTypes/BfPerson.ts";

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
        returns: () => CurrentViewer,
        resolve: async (_src, args, ctx) => {
          const idToken = args.idToken as string;
          const currentViewer = await ctx.loginWithGoogleToken(idToken);
          return currentViewer;
        },
      })
      .object("person", "BfPerson", {
        // deno-lint-ignore require-await
        resolve: async (_root, _args, _ctx, _info) => {
          // TODO: Implement fetching person by personBfGid
          return null;
        },
      })
      .object("org", "BfOrganization", {
        // deno-lint-ignore require-await
        resolve: async (_root, _args, _ctx, _info) => {
          // TODO: Implement fetching org by orgBfOid
          return null;
        },
      })
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
      // Get the Google OAuth client ID from environment
      const googleClientId = getConfigurationVariable("GOOGLE_CLIENT_ID");
      if (!googleClientId) {
        throw new BfError("GOOGLE_CLIENT_ID not configured");
      }

      // Verify the ID token with Google's token verification endpoint
      const verifyUrl = new URL(
        "https://oauth2.googleapis.com/tokeninfo",
      );
      verifyUrl.searchParams.set("id_token", idToken);

      const response = await fetch(verifyUrl);
      if (!response.ok) {
        throw new BfError(`Invalid Google ID token: ${response.statusText}`);
      }

      const tokenInfo = await response.json() as GoogleTokenInfo;

      // Verify the audience matches our client ID
      if (tokenInfo.aud !== googleClientId) {
        throw new BfError("Token was not issued for this application");
      }

      // Get or create the user based on the email
      const email = tokenInfo.email;
      if (!email) {
        throw new BfError("No email found in token");
      }

      // For now, create a logged-in viewer with the email as the person ID
      // In a real implementation, this would look up or create the BfPerson
      const personBfGid = email as BfGid;
      const orgBfOid = "default-org" as BfGid; // Default org for demo

      logger.info(`User logged in: ${email}`);
      return new CurrentViewerLoggedIn(personBfGid, orgBfOid);
    } catch (error: unknown) {
      logger.error("Failed to verify Google ID token", error);
      if (error instanceof BfError) {
        throw error;
      }
      // Safely handle unknown error type
      throw new BfError(
        `Authentication failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  static fromRequest(_request: Request): CurrentViewer {
    // Return a logged out viewer for now
    // In production implementation, we would parse claims from the request
    return new CurrentViewerLoggedOut();
  }

  // Use a single type-guard method instead of two separate ones
  isLoggedIn(): this is CurrentViewerLoggedIn {
    return false;
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

/* -------------------------------------------------------------------------- */
/*  Logged In state                                                          */
/* -------------------------------------------------------------------------- */

export class CurrentViewerLoggedIn extends CurrentViewer {
  static override __typename = "CurrentViewerLoggedIn" as const;

  override isLoggedIn(): this is CurrentViewerLoggedIn {
    return true;
  }
}

/* -------------------------------------------------------------------------- */
/*  Logged Out state                                                         */
/* -------------------------------------------------------------------------- */

export class CurrentViewerLoggedOut extends CurrentViewer {
  static override __typename = "CurrentViewerLoggedOut" as const;

  constructor() {
    super("anonymous" as BfGid, "anonymous" as BfGid);
  }

  override isLoggedIn(): this is CurrentViewerLoggedIn {
    return false;
  }
}
