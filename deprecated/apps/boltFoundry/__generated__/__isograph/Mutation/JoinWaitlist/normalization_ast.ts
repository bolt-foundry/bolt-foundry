import type {NormalizationAst} from '@isograph/react';
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
export default normalizationAst;
