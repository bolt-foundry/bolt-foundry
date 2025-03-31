import { mutationField, objectType, stringArg } from "nexus";

import { getLogger } from "packages/logger.ts";
import { getConfigurationVariable } from "packages/getConfigurationVariable.ts";

const logger = getLogger(import.meta);

// Define a type for the waitlist response
export const joinWaitlistResponseType = objectType({
  name: "JoinWaitlistResponse",
  definition(t) {
    t.boolean("success");
    t.nullable.string("message");
  },
});

export const joinWaitlistMutation = mutationField("joinWaitlist", {
  args: {
    name: stringArg(),
    email: stringArg(),
    company: stringArg(),
  },
  type: "JoinWaitlistResponse",
  resolve: async (_, { name, email, company }) => {
    if (!name || !email || !company) {
      throw new Error("Missing info");
    }

    try {
      const apiKey = getConfigurationVariable("WAITLIST_API_KEY");
      if (!apiKey) {
        logger.error("WAITLIST_API_KEY environment variable is not set");
        return {
          success: false,
          message: "Server configuration error",
        };
      }

      const joinWaitlistResponse = await fetch(
        "https://bf-cms.replit.app/api/contacts",
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
});
