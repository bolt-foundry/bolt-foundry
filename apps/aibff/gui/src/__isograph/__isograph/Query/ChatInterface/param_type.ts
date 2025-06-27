import type { Query__ChatInterface__parameters } from './parameters_type';

export type Query__ChatInterface__param = {
  readonly data: {
    readonly conversation: ({
      readonly id: string,
      readonly messages: ReadonlyArray<{
        readonly id: string,
        readonly content: string,
        readonly role: string,
        readonly createdAt: string,
      }>,
    } | null),
  },
  readonly parameters: Query__ChatInterface__parameters,
};
