import type {IsographEntrypoint, NormalizationAst, RefetchQueryNormalizationArtifactWrapper} from '@isograph/react';
import {Mutation__CreateVoice__param} from './param_type.ts';
import {Mutation__CreateVoice__output_type} from './output_type.ts';
import readerResolver from './resolver_reader.ts';
const nestedRefetchQueries: RefetchQueryNormalizationArtifactWrapper[] = [];

const queryText = 'mutation CreateVoice ($handle: String!) {\
  createVoiceAgain____handle___v_handle: createVoiceAgain(handle: $handle) {\
    id,\
    identity {\
      voice {\
        voice,\
        voiceSummary,\
      },\
    },\
  },\
}';

const normalizationAst: NormalizationAst = {
  kind: "NormalizationAst",
  selections: [
    {
      kind: "Linked",
      fieldName: "createVoiceAgain",
      arguments: [
        [
          "handle",
          { kind: "Variable", name: "handle" },
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
          fieldName: "identity",
          arguments: null,
          concreteType: "BfOrganization_Identity",
          selections: [
            {
              kind: "Linked",
              fieldName: "voice",
              arguments: null,
              concreteType: "Voice",
              selections: [
                {
                  kind: "Scalar",
                  fieldName: "voice",
                  arguments: null,
                },
                {
                  kind: "Scalar",
                  fieldName: "voiceSummary",
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
  Mutation__CreateVoice__param,
  Mutation__CreateVoice__output_type,
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
