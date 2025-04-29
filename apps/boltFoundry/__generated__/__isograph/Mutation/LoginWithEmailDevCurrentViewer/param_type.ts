import type { Mutation__LoginWithEmailDevCurrentViewer__parameters } from './parameters_type.ts';

export type Mutation__LoginWithEmailDevCurrentViewer__param = {
  readonly data: {
    readonly loginWithEmailDevCurrentViewer: ({
      readonly currentViewer: {
        readonly __typename: string,
      },
    } | null),
  },
  readonly parameters: Mutation__LoginWithEmailDevCurrentViewer__parameters,
};
