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
export default normalizationAst;
