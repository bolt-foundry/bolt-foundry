import type {IsographEntrypoint, NormalizationAst, RefetchQueryNormalizationArtifactWrapper} from '@isograph/react';
import {Query__EntrypointBigLittleTechAi__param} from './param_type.ts';
import {Query__EntrypointBigLittleTechAi__output_type} from './output_type.ts';
import readerResolver from './resolver_reader.ts';
const nestedRefetchQueries: RefetchQueryNormalizationArtifactWrapper[] = [];

const queryText = 'query EntrypointBigLittleTechAi  {\
  me {\
    __typename,\
    id,\
    contentCollection____slug___s_bf____content_marketing: contentCollection(slug: "bf:///content/marketing") {\
      id,\
      item____id___s_bf____content_biglittletech_ai_page_md: item(id: "bf:///content/biglittletech.ai/page.md") {\
        id,\
        __typename,\
        body,\
        href,\
        title,\
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
                  { kind: "String", value: "bf:///content/biglittletech.ai/page.md" },
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
      ],
    },
  ],
};
const artifact: IsographEntrypoint<
  Query__EntrypointBigLittleTechAi__param,
  Query__EntrypointBigLittleTechAi__output_type,
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
