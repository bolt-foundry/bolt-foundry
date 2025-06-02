import type {IsographEntrypoint, NormalizationAst, RefetchQueryNormalizationArtifactWrapper} from '@isograph/react';
import {Query__EntrypointDocs__param} from './param_type.ts';
import {Query__EntrypointDocs__output_type} from './output_type.ts';
import readerResolver from './resolver_reader.ts';
const nestedRefetchQueries: RefetchQueryNormalizationArtifactWrapper[] = [];

const queryText = 'query EntrypointDocs ($slug: String!) {\
  documentsBySlug____slug___v_slug: documentsBySlug(slug: $slug),\
}';

const normalizationAst: NormalizationAst = {
  kind: "NormalizationAst",
  selections: [
    {
      kind: "Scalar",
      fieldName: "documentsBySlug",
      arguments: [
        [
          "slug",
          { kind: "Variable", name: "slug" },
        ],
      ],
    },
  ],
};
const artifact: IsographEntrypoint<
  Query__EntrypointDocs__param,
  Query__EntrypointDocs__output_type,
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
