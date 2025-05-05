import type { Mutation__LoginWithGoogleCurrentViewer__parameters } from './parameters_type.ts';

export type Mutation__LoginWithGoogleCurrentViewer__param = {
  readonly data: {
    readonly loginWithGoogleCurrentViewer: ({
      readonly currentViewer: {
        readonly __typename: string,
      },
    } | null),
  },
  readonly parameters: Mutation__LoginWithGoogleCurrentViewer__parameters,
};
