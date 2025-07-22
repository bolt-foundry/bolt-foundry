import type { Mutation__JoinWaitlist__parameters } from './parameters_type.ts';

export type Mutation__JoinWaitlist__param = {
  readonly data: {
    readonly joinWaitlist: ({
      readonly success: boolean,
      readonly message: (string | null),
    } | null),
  },
  readonly parameters: Mutation__JoinWaitlist__parameters,
};
