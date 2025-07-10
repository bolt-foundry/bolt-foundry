import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { GraphQLObjectBase } from "@bfmono/apps/bfDb/graphql/GraphQLObjectBase.ts";

const logger = getLogger(import.meta);

export class Waitlist extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .id("id")
      .mutation("joinWaitlist", {
        args: (a) =>
          a
            .nonNull.string("email")
            .nonNull.string("name")
            .string("company"),
        returns: (r) =>
          r
            .string("message")
            .nonNull.boolean("success"),
        async resolve(_src, { email, name, company }) {
          try {
            const apiKey = getConfigurationVariable("WAITLIST_API_KEY") ??
              // deno-lint-ignore bolt-foundry/no-env-direct-access
              Deno.env.get("WAITLIST_API_KEY");
            if (!apiKey) {
              logger.error("WAITLIST_API_KEY environment variable is not set");
              return {
                success: false,
                message: "Server configuration error",
              };
            }

            const url = "https://bf-contacts.replit.app/api/contacts";

            const joinWaitlistResponse = await fetch(url, {
              method: "POST",
              headers: {
                "x-api-key": apiKey,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: name,
                email: email,
                company: company,
              }),
            });

            const responseData = await joinWaitlistResponse.json();

            logger.debug("Response", responseData);

            return {
              success: responseData.success !== false,
              message: responseData.message || undefined,
            };
          } catch (error) {
            logger.error("Error joining waitlist", error);
            return {
              success: false,
              message: "Failed to join waitlist",
            };
          }
        },
      })
  );
}
