import type { Query__Docs__parameters } from './parameters_type.ts';

export type Query__Docs__param = {
  readonly data: {
    readonly documentsBySlug: ({
      readonly id: string,
      readonly content: string,
    } | null),
  },
  readonly parameters: Query__Docs__parameters,
};
