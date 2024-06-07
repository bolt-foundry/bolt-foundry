// packages/graphql/types/BfGraphQLContactForm.ts

import {
  inputObjectType,
  mutationField,
  nonNull,
  objectType,
  stringArg,
} from "packages/graphql/deps.ts";
import { GraphQLContext } from "packages/graphql/graphql.ts";

// Define the input type for the contact form
export const SubmitContactFormInput = inputObjectType({
  name: "SubmitContactFormInput",
  definition(t) {
    t.nonNull.string("name");
    t.string("phone");
    t.string("company");
    t.nonNull.string("email");
    t.nonNull.string("message");
  },
});

// Define the output type for the mutation response
export const SubmitContactFormPayload = objectType({
  name: "SubmitContactFormPayload",
  definition(t) {
    t.nonNull.boolean("success");
    t.string("message");
  },
});

// Define the mutation field
export const submitContactFormMutation = mutationField("submitContactForm", {
  type: SubmitContactFormPayload,
  args: {
    input: nonNull(SubmitContactFormInput),
  },
  resolve: async (_root, { input }, { bfCurrentViewer }: GraphQLContext) => {
    try {
      await fetch("https://sheetdb.io/api/v1/j4zqewe3isc9r", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [
            input,
          ],
        }),
      });
      // Here, you would add logic to process the form submission
      // For demonstration purposes, we'll simulate a successful submission
      // Replace this with your actual implementation
      return {
        success: true,
        message: "Form submitted successfully.",
      };
    } catch (error) {
      console.error("Form submission error:", error);
      return {
        success: false,
        message: "Form submission failed.",
      };
    }
  },
});
