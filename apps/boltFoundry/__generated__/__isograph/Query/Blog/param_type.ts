import type { Query__Blog__parameters } from './parameters_type.ts';

export type Query__Blog__param = {
  readonly data: {
    readonly blogPost: ({
      readonly id: string,
      readonly content: string,
    } | null),
  },
  readonly parameters: Query__Blog__parameters,
};
