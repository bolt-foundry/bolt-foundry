import type {IsographEntrypoint, NormalizationAst, RefetchQueryNormalizationArtifactWrapper} from '@isograph/react';
import {Query__EntrypointHome__param} from './param_type.ts';
import {Query__EntrypointHome__output_type} from './output_type.ts';
import readerResolver from './resolver_reader.ts';
const nestedRefetchQueries: RefetchQueryNormalizationArtifactWrapper[] = [];

const queryText = 'query EntrypointHome  {\
  me {\
    __typename,\
    id,\
    __typename,\
    contentCollection____slug___s_bf____content_marketing: contentCollection(slug: "bf:///content/marketing") {\
      id,\
      item____id___s_bf____content_marketing_show_hn_md: item(id: "bf:///content/marketing/show-hn.md") {\
        id,\
        __typename,\
        body,\
        href,\
        title,\
      },\
    },\
    ... on BfCurrentViewerLoggedOut {\
      id,\
      __typename,\
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
          kind: "Scalar",
          fieldName: "__typename",
          arguments: null,
        },
        {
          kind: "Linked",
          fieldName: "contentCollection",
          arguments: [
            [
              "slug",
              { kind: "String", value: "bf:///content/marketing" },
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
              kind: "Linked",
              fieldName: "item",
              arguments: [
                [
                  "id",
                  { kind: "String", value: "bf:///content/marketing/show-hn.md" },
                ],
              ],
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
        {
          kind: "InlineFragment",
          type: "BfCurrentViewerLoggedOut",
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
          ],
        },
      ],
    },
  ],
};
const artifact: IsographEntrypoint<
  Query__EntrypointHome__param,
  Query__EntrypointHome__output_type,
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
