// packages/graphql/types/BfGraphQLContactFormSubmission.ts

import {
  objectType,
  inputObjectType,
  mutationField,
  nonNull,
} from "packages/graphql/deps.ts";

export const ContactFormSubmission = objectType({
  name: "ContactFormSubmission",
  definition(t) {
    t.string("name");
    t.string("phone");
    t.string("company");
    t.string("email");
    t.string("message");
  },
});

export const ContactFormSubmissionInput = inputObjectType({
  name: "ContactFormSubmissionInput",
  definition(t) {
    t.nonNull.string("name");
    t.string("phone");
    t.string("company");
    t.nonNull.string("email");
    t.nonNull.string("message");
  },
});

export const createContactFormSubmission = mutationField(
  "createContactFormSubmission",
  {
    type: ContactFormSubmission,
    args: {
      input: nonNull(ContactFormSubmissionInput),
    },
    resolve: async (_root, { input } ) => {
      await submitContactForm(input);
      return input;
    },
  },
);


function submitContactForm(formInput: unknown) {
    return fetch("https://sheetdb.io/api/v1/j4zqewe3isc9r", {
      method: "POST",
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: [
          formInput
          ]
      }
   )
    });
}