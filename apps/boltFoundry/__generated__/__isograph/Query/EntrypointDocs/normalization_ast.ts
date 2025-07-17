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
      fieldName: "documentsBySlug",
      arguments: [
        [
          "slug",
          { kind: "Variable", name: "slug" },
        ],
      ],
      concreteType: "PublishedDocument",
      selections: [
        {
          kind: "Scalar",
          fieldName: "id",
          arguments: null,
        },
        {
          kind: "Scalar",
          fieldName: "content",
          arguments: null,
        },
      ],
    },
  ],
};
export default normalizationAst;
