import type {IsographEntrypoint, NormalizationAst, RefetchQueryNormalizationArtifactWrapper} from '@isograph/react';
import {Mutation__LoginWithEmailDevCurrentViewer__param} from './param_type.ts';
import {Mutation__LoginWithEmailDevCurrentViewer__output_type} from './output_type.ts';
import readerResolver from './resolver_reader.ts';
const nestedRefetchQueries: RefetchQueryNormalizationArtifactWrapper[] = [];

const queryText = 'mutation LoginWithEmailDevCurrentViewer ($email: String!) {\
  loginWithEmailDevCurrentViewer____email___v_email: loginWithEmailDevCurrentViewer(email: $email) {\
    currentViewer {\
      __typename,\
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
      fieldName: "loginWithEmailDevCurrentViewer",
      arguments: [
        [
          "email",
          { kind: "Variable", name: "email" },
        ],
      ],
      concreteType: "LoginWithEmailDevPayload",
      selections: [
        {
          kind: "Linked",
          fieldName: "currentViewer",
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
          ],
        },
      ],
    },
  ],
};
const artifact: IsographEntrypoint<
  Mutation__LoginWithEmailDevCurrentViewer__param,
  Mutation__LoginWithEmailDevCurrentViewer__output_type,
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
