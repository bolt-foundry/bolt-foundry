import type {
  IsographEntrypoint,
  NormalizationAst,
  RefetchQueryNormalizationArtifactWrapper,
} from "@isograph/react";
import { Query__EntrypointFormatter__param } from "./param_type.ts";
import { Query__EntrypointFormatter__output_type } from "./output_type.ts";
import readerResolver from "./resolver_reader.ts";
const nestedRefetchQueries: RefetchQueryNormalizationArtifactWrapper[] = [];

const queryText = "query EntrypointFormatter  {\
  __typename,\
}";

const normalizationAst: NormalizationAst = {
  kind: "NormalizationAst",
  selections: [
    {
      kind: "Scalar",
      fieldName: "__typename",
      arguments: null,
    },
  ],
};
const artifact: IsographEntrypoint<
  Query__EntrypointFormatter__param,
  Query__EntrypointFormatter__output_type,
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
