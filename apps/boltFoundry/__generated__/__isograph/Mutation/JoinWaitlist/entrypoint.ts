import type {
  IsographEntrypoint,
  NormalizationAst,
  RefetchQueryNormalizationArtifactWrapper,
} from "@isograph/react";
import { Mutation__JoinWaitlist__param } from "./param_type.ts";
import { Mutation__JoinWaitlist__output_type } from "./output_type.ts";
import readerResolver from "./resolver_reader.ts";
const nestedRefetchQueries: RefetchQueryNormalizationArtifactWrapper[] = [];

const queryText =
  "mutation JoinWaitlist ($name: String!, $email: String!, $company: String!) {\
  joinWaitlist____name___v_name____email___v_email____company___v_company: joinWaitlist(name: $name, email: $email, company: $company) {\
    message,\
    success,\
  },\
}";

const normalizationAst: NormalizationAst = {
  kind: "NormalizationAst",
  selections: [
    {
      kind: "Linked",
      fieldName: "joinWaitlist",
      arguments: [
        [
          "name",
          { kind: "Variable", name: "name" },
        ],

        [
          "email",
          { kind: "Variable", name: "email" },
        ],

        [
          "company",
          { kind: "Variable", name: "company" },
        ],
      ],
      concreteType: "JoinWaitlistPayload",
      selections: [
        {
          kind: "Scalar",
          fieldName: "message",
          arguments: null,
        },
        {
          kind: "Scalar",
          fieldName: "success",
          arguments: null,
        },
      ],
    },
  ],
};
const artifact: IsographEntrypoint<
  Mutation__JoinWaitlist__param,
  Mutation__JoinWaitlist__output_type,
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
