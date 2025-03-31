import type {IsographEntrypoint, NormalizationAst, RefetchQueryNormalizationArtifactWrapper} from '@isograph/react';
import {Mutation__ReviseBlog__param} from './param_type.ts';
import {Mutation__ReviseBlog__output_type} from './output_type.ts';
import readerResolver from './resolver_reader.ts';
const nestedRefetchQueries: RefetchQueryNormalizationArtifactWrapper[] = [];

const queryText = 'mutation ReviseBlog ($blogPost: String!) {\
  reviseBlog____blogPost___v_blogPost: reviseBlog(blogPost: $blogPost) {\
    id,\
    creation {\
      revisions {\
        explanation,\
        instructions,\
        original,\
        revision,\
        revisionTitle,\
      },\
    },\
  },\
}';

const normalizationAst: NormalizationAst = {
  kind: "NormalizationAst",
  selections: [
    {
      kind: "Linked",
      fieldName: "reviseBlog",
      arguments: [
        [
          "blogPost",
          { kind: "Variable", name: "blogPost" },
        ],
      ],
      concreteType: "BfOrganization",
      selections: [
        {
          kind: "Scalar",
          fieldName: "id",
          arguments: null,
        },
        {
          kind: "Linked",
          fieldName: "creation",
          arguments: null,
          concreteType: "Creation",
          selections: [
            {
              kind: "Linked",
              fieldName: "revisions",
              arguments: null,
              concreteType: "Revisions",
              selections: [
                {
                  kind: "Scalar",
                  fieldName: "explanation",
                  arguments: null,
                },
                {
                  kind: "Scalar",
                  fieldName: "instructions",
                  arguments: null,
                },
                {
                  kind: "Scalar",
                  fieldName: "original",
                  arguments: null,
                },
                {
                  kind: "Scalar",
                  fieldName: "revision",
                  arguments: null,
                },
                {
                  kind: "Scalar",
                  fieldName: "revisionTitle",
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
  Mutation__ReviseBlog__param,
  Mutation__ReviseBlog__output_type,
  NormalizationAst
> = {
  kind: "Entrypoint",
  networkRequestInfo: {
    kind: "NetworkRequestInfo",
    queryText,
    normalizationAst,
  },
  concreteType: "Mutation",
  readerWithRefetchQueries: {
    kind: "ReaderWithRefetchQueries",
    nestedRefetchQueries,
    readerArtifact: readerResolver,
  },
};

export default artifact;
