import {
  inputObjectType,
  mutationField,
  nonNull,
  objectType,
} from "packages/graphql/deps.ts";

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
const NOTION_API_KEY = Deno.env.get("NOTION_API_KEY");

const headers = {
  "Authorization": `Bearer ${NOTION_API_KEY}`,
  "Content-Type": "application/json",
  "Notion-Version": "2022-06-28",
};
// Define the mutation field
export const submitContactFormMutation = mutationField("submitContactForm", {
  type: SubmitContactFormPayload,
  args: {
    input: nonNull(SubmitContactFormInput),
  },

  resolve: async (_root, { input }) => {
    const response = await fetch(
      "https://api.notion.com/v1/pages",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          "parent": {
            "database_id": `7f2854339d854895bc967959c09c3f69`,
          },
          "properties": {
            "name": {
              "title": [
                {
                  "text": {
                    "content": input.name,
                  },
                },
              ],
            },
            "phone": {
              "rich_text": [
                {
                  "text": {
                    "content": input.phone,
                  },
                },
              ],
            },
            "company": {
              "rich_text": [
                {
                  "text": {
                    "content": input.company,
                  },
                },
              ],
            },
            "email": {
              "email": input.email,
            },
            "message": {
              "rich_text": [
                {
                  "text": {
                    "content": input.message,
                  },
                },
              ],
            },
          },
        }),
      },
    );
    const data = await response.json();
    if (data.message !== undefined) {
      throw new Error(data.message);
    }
    return {
      success: true,
      message: data.message,
    };
  },
});
