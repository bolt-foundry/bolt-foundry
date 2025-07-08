import { type CurrentViewer__Home__output_type } from '../../CurrentViewer/Home/output_type.ts';

export type Query__HomePage__param = {
  readonly data: {
    readonly currentViewer: ({
      readonly Home: CurrentViewer__Home__output_type,
    } | null),
  },
  readonly parameters: Record<PropertyKey, never>,
};
