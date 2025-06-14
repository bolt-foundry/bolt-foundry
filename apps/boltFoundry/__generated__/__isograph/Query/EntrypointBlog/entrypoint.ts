import type {
  IsographEntrypoint,
  NormalizationAst,
  RefetchQueryNormalizationArtifactWrapper,
} from "@isograph/react";
import { Query__EntrypointBlog__param } from "./param_type.ts";
import { Query__EntrypointBlog__output_type } from "./output_type.ts";
import readerResolver from "./resolver_reader.ts";
const nestedRefetchQueries: RefetchQueryNormalizationArtifactWrapper[] = [];

const queryText = 'query EntrypointBlog ($slug: String) {\
  blogPost____slug___v_slug: blogPost(slug: $slug) {\
    id,\
    content,\
  },\
  blogPosts____first___l_10____sortDirection___s_DESC: blogPosts(first: 10, sortDirection: "DESC") {\
    edges {\
      cursor,\
      node {\
        id,\
        content,\
      },\
    },\
    pageInfo {\
      endCursor,\
      hasNextPage,\
      hasPreviousPage,\
      startCursor,\
    },\
  },\
}';

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
          fieldName: "content",
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
                  fieldName: "content",
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
const artifact: IsographEntrypoint<
  Query__EntrypointBlog__param,
  Query__EntrypointBlog__output_type,
  NormalizationAst
> = {
  kind: "Entrypoint",
  networkRequestInfo: {
    kind: "NetworkRequestInfo",
    queryText,
    normalizationAst,
  },
  concreteType: "Query",
  readerWithRefetchQueries: {
    kind: "ReaderWithRefetchQueries",
    nestedRefetchQueries,
    readerArtifact: readerResolver,
  },
};

export default artifact;
