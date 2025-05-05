import type {IsographEntrypoint, NormalizationAst, RefetchQueryNormalizationArtifactWrapper} from '@isograph/react';
import {Mutation__LoginWithGoogleCurrentViewer__param} from './param_type.ts';
import {Mutation__LoginWithGoogleCurrentViewer__output_type} from './output_type.ts';
import readerResolver from './resolver_reader.ts';
const nestedRefetchQueries: RefetchQueryNormalizationArtifactWrapper[] = [];

const queryText = 'mutation LoginWithGoogleCurrentViewer ($idToken: String!) {\
  loginWithGoogleCurrentViewer____idToken___v_idToken: loginWithGoogleCurrentViewer(idToken: $idToken) {\
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
      fieldName: "loginWithGoogleCurrentViewer",
      arguments: [
        [
          "idToken",
          { kind: "Variable", name: "idToken" },
        ],
      ],
      concreteType: "LoginWithGooglePayload",
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
  Mutation__LoginWithGoogleCurrentViewer__param,
  Mutation__LoginWithGoogleCurrentViewer__output_type,
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
