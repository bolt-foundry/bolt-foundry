import type {NormalizationAst} from '@isograph/react';
const normalizationAst: NormalizationAst = {
  kind: "NormalizationAst",
  selections: [
    {
      kind: "Linked",
      fieldName: "blogPost",
      arguments: [
        [
          "slug",
          { kind: "Variable", name: "slug" },
        ],
      ],
      concreteType: "BlogPost",
      selections: [
        {
          kind: "Scalar",
          fieldName: "id",
          arguments: null,
        },
        {
          kind: "Scalar",
          fieldName: "author",
          arguments: null,
        },
        {
          kind: "Scalar",
          fieldName: "content",
          arguments: null,
        },
        {
          kind: "Scalar",
          fieldName: "heroImage",
          arguments: null,
        },
        {
          kind: "Scalar",
          fieldName: "publishedAt",
          arguments: null,
        },
        {
          kind: "Scalar",
          fieldName: "tags",
          arguments: null,
        },
        {
          kind: "Scalar",
          fieldName: "title",
          arguments: null,
        },
      ],
    },
    {
      kind: "Linked",
      fieldName: "blogPosts",
      arguments: [
        [
          "first",
          { kind: "Literal", value: 10 },
        ],

        [
          "sortDirection",
          { kind: "String", value: "DESC" },
        ],
      ],
      concreteType: "BlogPostConnection",
      selections: [
        {
          kind: "Linked",
          fieldName: "edges",
          arguments: null,
          concreteType: "BlogPostEdge",
          selections: [
            {
              kind: "Scalar",
              fieldName: "cursor",
              arguments: null,
            },
            {
              kind: "Linked",
              fieldName: "node",
              arguments: null,
              concreteType: "BlogPost",
              selections: [
                {
                  kind: "Scalar",
                  fieldName: "id",
                  arguments: null,
                },
                {
                  kind: "Scalar",
                  fieldName: "author",
                  arguments: null,
                },
                {
                  kind: "Scalar",
                  fieldName: "excerpt",
                  arguments: null,
                },
                {
                  kind: "Scalar",
                  fieldName: "heroImage",
                  arguments: null,
                },
                {
                  kind: "Scalar",
                  fieldName: "publishedAt",
                  arguments: null,
                },
                {
                  kind: "Scalar",
                  fieldName: "tags",
                  arguments: null,
                },
                {
                  kind: "Scalar",
                  fieldName: "title",
                  arguments: null,
                },
              ],
            },
          ],
        },
        {
          kind: "Linked",
          fieldName: "pageInfo",
          arguments: null,
          concreteType: "PageInfo",
          selections: [
            {
              kind: "Scalar",
              fieldName: "endCursor",
              arguments: null,
            },
            {
              kind: "Scalar",
              fieldName: "hasNextPage",
              arguments: null,
            },
            {
              kind: "Scalar",
              fieldName: "hasPreviousPage",
              arguments: null,
            },
            {
              kind: "Scalar",
              fieldName: "startCursor",
              arguments: null,
            },
          ],
        },
      ],
    },
  ],
};
export default normalizationAst;
