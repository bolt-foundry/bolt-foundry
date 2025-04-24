import { BfNode } from "apps/bfDb/coreModels/BfNode.ts";
import { getLogger } from "packages/logger/logger.ts";
import { BfOrganization } from "apps/bfDb/models/BfOrganization.ts";
import { BfErrorOrganizationNotAllowed } from "apps/bfDb/classes/BfErrorNode.ts";
import type { BfCurrentViewer } from "apps/bfDb/classes/BfCurrentViewer.ts";

const _logger = getLogger(import.meta);

export type BfPersonProps = {
  /** Primary e‑mail address used for login */
  email: string;
  /** Display name */
  name: string;
};

export class BfPerson extends BfNode<BfPersonProps> {
  /* ---------------------------------------------------------------------- */
  /* GraphQL spec                                                            */
  /* ---------------------------------------------------------------------- */
  static override gqlSpec = this.defineGqlNode((field) => {
    field.string("email");
    field.string("name");
  });

  /* ---------------------------------------------------------------------- */
  /* Google‑login helper                                                     */
  /* ---------------------------------------------------------------------- */
  /**
   * Verifies a Google OAuth login attempt.
   *
   * 1. If a Person with the given e‑mail already exists, return it.
   * 2. If the domain is blocked (currently only `gmail.com`) reject sign‑in.
   * 3. Otherwise, create a new `BfPerson`, a fresh `BfOrganization`, and
   *    connect them with an OWNER edge.
   */
  static async verifyLogin(
    cv: BfCurrentViewer,
    email: string,
    googlePayload: {
      email: string;
      email_verified: boolean;
      hd?: string;
      given_name?: string;
      family_name?: string;
      picture?: string;
      sub?: string;
    },
  ): Promise<BfPerson> {
    const logger = getLogger(import.meta);
    logger.debug("verifyLogin called", { email, googlePayload });

    /* ------------------------------ guards ------------------------------ */
    if (email.toLowerCase() !== googlePayload.email.toLowerCase()) {
      throw new Error("Email mismatch between parameter and Google payload");
    }
    if (!googlePayload.email_verified) {
      throw new Error("Google e‑mail address is not verified");
    }

    const domain = email.split("@")[1]?.toLowerCase();
    const BLOCKED_DOMAINS = ["gmail.com"];

    if (domain && BLOCKED_DOMAINS.includes(domain)) {
      logger.debug("Blocked login – domain is disallowed", { domain });
      throw new BfErrorOrganizationNotAllowed();
    }

    /* ------------------------ existing user flow ------------------------ */
    const existing = await this.query(
      cv,
      { className: this.name },
      { email },
      undefined,
    );
    if (existing.length > 0) {
      logger.debug("Returning existing user", existing[0].metadata.bfGid);
      return existing[0];
    }

    /* ---------------------- first‑time user flow ------------------------ */
    const personName = googlePayload.given_name
      ? `${googlePayload.given_name} ${googlePayload.family_name ?? ""}`.trim()
      : email.split("@")[0];

    const person = await this.__DANGEROUS__createUnattached(cv, {
      email,
      name: personName,
    });
    logger.debug("Created new person", person.metadata.bfGid);

    // Create an Organization for the user and link it. Use domain or fallback.
    const orgName = domain ?? "personal";
    await person.createTargetNode(
      BfOrganization,
      { name: orgName, settings: {} },
      undefined,
      { role: "OWNER" },
    );
    logger.debug("Created organization and edge for new person");

    return person;
  }
}
