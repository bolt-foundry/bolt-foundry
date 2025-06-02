import { getLogger } from "packages/logger/logger.ts";
import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { GraphQLObjectBase } from "apps/bfDb/graphql/GraphQLObjectBase.ts";

const logger = getLogger(import.meta);

export class Newsletter extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .id("id")
      .mutation("subscribeToNewsletter", {
        args: (a) =>
          a
            .nonNull.string("email"),
        returns: (r) =>
          r
            .string("message")
            .nonNull.boolean("success"),
        async resolve(_src, { email }) {
          try {
            const substackApiKey = getConfigurationVariable("SUBSTACK_API_KEY");
            const substackPublicationId = getConfigurationVariable(
              "SUBSTACK_PUBLICATION_ID",
            );

            if (!substackApiKey || !substackPublicationId) {
              logger.error(
                "Substack configuration missing: SUBSTACK_API_KEY or SUBSTACK_PUBLICATION_ID not set",
              );
              return {
                success: false,
                message: "Server configuration error",
              };
            }

            // Substack API endpoint for adding subscribers
            // Note: Substack's API might require different endpoints/authentication
            // This is a placeholder implementation - you'll need to update with actual Substack API details
            const substackApiUrl =
              `https://api.substack.com/publications/${substackPublicationId}/subscribers`;

            const response = await fetch(substackApiUrl, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${substackApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email,
                // Add any additional fields required by Substack API
              }),
            });

            if (!response.ok) {
              const errorText = await response.text();
              logger.error(
                `Substack API error: ${response.status} - ${errorText}`,
              );

              // Handle specific error cases
              if (response.status === 409) {
                return {
                  success: true, // Already subscribed is technically a success
                  message: "You're already subscribed to our newsletter!",
                };
              }

              return {
                success: false,
                message: "Failed to subscribe. Please try again later.",
              };
            }

            const responseData = await response.json();
            logger.debug("Substack subscription response", responseData);

            return {
              success: true,
              message: "Successfully subscribed to our newsletter!",
            };
          } catch (error) {
            logger.error("Error subscribing to newsletter", error);
            return {
              success: false,
              message: "An error occurred while subscribing. Please try again.",
            };
          }
        },
      })
  );
}
