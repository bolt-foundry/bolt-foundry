import { getLogger } from "packages/logger/logger.ts";
import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { GraphQLObjectBase } from "apps/bfDb/graphql/GraphQLObjectBase.ts";

const logger = getLogger(import.meta);

export class Waitlist extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql.mutation("join", {
      args: (a) =>
        a
          .string("email")
          .string("name")
          .string("company"),
      returns: "WaitlistJoinResult",
      resolve: async (_src, args) => {
        const { email, name, company } = args as {
          email: string;
          name: string;
          company: string;
        };
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
          const baseUrl = getConfigurationVariable("NODE_ENV") === "production"
            ? `https://${slug}.replit.app`
            : "http://localhost:8000";

          const joinWaitlistResponse = await fetch(
            `${baseUrl}/contacts-cms`,
            {
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
            },
          );

          const responseData = await joinWaitlistResponse.json();
          logger.debug("Response", responseData);

          return {
            success: responseData.success !== false,
            message: responseData.message || null,
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
