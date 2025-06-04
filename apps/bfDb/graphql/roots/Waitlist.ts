import { getLogger } from "packages/logger/logger.ts";
import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { GraphQLObjectBase } from "apps/bfDb/graphql/GraphQLObjectBase.ts";

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
            .nonNull.string("company"),
        returns: (r) =>
          r
            .string("message")
            .nonNull.boolean("success"),
        async resolve(_src, { email, name, company }) {
          try {
            const apiKey = getConfigurationVariable("WAITLIST_API_KEY");
            if (!apiKey) {
              logger.error("WAITLIST_API_KEY environment variable is not set");
              return {
                success: false,
                message: "Server configuration error",
              };
            }

            const slug = getConfigurationVariable("REPL_SLUG");
            const baseUrl =
              getConfigurationVariable("NODE_ENV") === "production"
                ? `https://${slug}.replit.app`
                : "http://localhost:8000";

            // const joinWaitlistResponse = await fetch(
            //   `${baseUrl}/contacts-cms`,
            //   {
            //     method: "POST",
            //     headers: {
            //       "x-api-key": apiKey,
            //       "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({
            //       name: name,
            //       email: email,
            //       company: company,
            //     }),
            //   },
            // );

            // const responseData = await joinWaitlistResponse.json();
            const responseData = {
              success: true,
              message: "Joined waitlist (TEST)",
            }
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
