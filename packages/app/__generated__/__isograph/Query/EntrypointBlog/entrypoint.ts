import type {IsographEntrypoint, NormalizationAst, RefetchQueryNormalizationArtifactWrapper} from '@isograph/react';
import {Query__EntrypointBlog__param} from './param_type.ts';
import {Query__EntrypointBlog__output_type} from './output_type.ts';
import readerResolver from './resolver_reader.ts';
const nestedRefetchQueries: RefetchQueryNormalizationArtifactWrapper[] = [];

const queryText = 'query EntrypointBlog  {\
  me {\
    __typename,\
    id,\
    contentCollection____slug___s_blog: contentCollection(slug: "blog") {\
      id,\
      __typename,\
      items {\
        nodes {\
          id,\
          __typename,\
          body,\
          href,\
          title,\
        },\
      },\
    },\
  },\
}';

const normalizationAst: NormalizationAst = {
  kind: "NormalizationAst",
  selections: [
    {
      kind: "Linked",
      fieldName: "me",
      arguments: null,
      concreteType: null,
      selections: [
        {
          kind: "Scalar",
          fieldName: "__typename",
          arguments: null,
        },
        {
          kind: "Scalar",
          fieldName: "id",
          arguments: null,
        },
        {
          kind: "Linked",
          fieldName: "contentCollection",
          arguments: [
            [
              "slug",
              { kind: "String", value: "blog" },
            ],
          ],
          concreteType: "BfContentCollection",
          selections: [
            {
              kind: "Scalar",
              fieldName: "id",
              arguments: null,
            },
            {
              kind: "Scalar",
              fieldName: "__typename",
              arguments: null,
            },
            {
              kind: "Linked",
              fieldName: "items",
              arguments: null,
              concreteType: "BfContentItemConnection",
              selections: [
                {
                  kind: "Linked",
                  fieldName: "nodes",
                  arguments: null,
                  concreteType: "BfContentItem",
                  selections: [
                    {
                      kind: "Scalar",
                      fieldName: "id",
                      arguments: null,
                    },
                    {
                      kind: "Scalar",
                      fieldName: "__typename",
                      arguments: null,
                    },
                    {
                      kind: "Scalar",
                      fieldName: "body",
                      arguments: null,
                    },
                    {
                      kind: "Scalar",
                      fieldName: "href",
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
