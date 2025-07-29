import type {IsographEntrypoint, NormalizationAst, RefetchQueryNormalizationArtifactWrapper} from '@isograph/react';
import {Query__EntrypointEval__param} from './param_type.ts';
import {Query__EntrypointEval__output_type} from './output_type.ts';
import readerResolver from './resolver_reader.ts';
import queryText from './query_text.ts';
import normalizationAst from './normalization_ast.ts';
const nestedRefetchQueries: RefetchQueryNormalizationArtifactWrapper[] = [];

const artifact: IsographEntrypoint<
  Query__EntrypointEval__param,
  Query__EntrypointEval__output_type,
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
