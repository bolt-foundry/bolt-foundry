import { type CurrentViewer__LogInOrOutButton__output_type } from '../../CurrentViewer/LogInOrOutButton/output_type.ts';

export type Query__Home__param = {
  readonly data: {
    readonly __typename: string,
    readonly currentViewer: ({
      readonly LogInOrOutButton: CurrentViewer__LogInOrOutButton__output_type,
    } | null),
  },
  readonly parameters: Record<PropertyKey, never>,
};
