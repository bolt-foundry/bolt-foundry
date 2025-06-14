import type {
  IsographEntrypoint,
  NormalizationAst,
  RefetchQueryNormalizationArtifactWrapper,
} from "@isograph/react";
import { Query__EntrypointHome__param } from "./param_type.ts";
import { Query__EntrypointHome__output_type } from "./output_type.ts";
import readerResolver from "./resolver_reader.ts";
const nestedRefetchQueries: RefetchQueryNormalizationArtifactWrapper[] = [];

const queryText = "query EntrypointHome  {\
  __typename,\
  githubRepoStats {\
    id,\
    stars,\
  },\
}";

const normalizationAst: NormalizationAst = {
  kind: "NormalizationAst",
  selections: [
    {
      kind: "Scalar",
      fieldName: "__typename",
      arguments: null,
    },
    {
      kind: "Linked",
      fieldName: "githubRepoStats",
      arguments: null,
      concreteType: "GithubRepoStats",
      selections: [
        {
          kind: "Scalar",
          fieldName: "id",
          arguments: null,
        },
        {
          kind: "Scalar",
          fieldName: "stars",
          arguments: null,
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
