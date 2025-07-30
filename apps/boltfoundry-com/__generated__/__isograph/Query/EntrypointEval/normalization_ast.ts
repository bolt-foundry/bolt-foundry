import type {NormalizationAst} from '@isograph/react';
const normalizationAst: NormalizationAst = {
  kind: "NormalizationAst",
  selections: [
    {
      kind: "Scalar",
      fieldName: "id",
      arguments: null,
    },
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
          fieldName: "orgBfOid",
          arguments: null,
        },
        {
          kind: "Scalar",
          fieldName: "personBfGid",
          arguments: null,
        },
      ],
    },
  ],
};
export default normalizationAst;
