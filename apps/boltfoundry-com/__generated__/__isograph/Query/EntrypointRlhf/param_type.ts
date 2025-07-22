import { type CurrentViewer__LoginPage__output_type } from '../../CurrentViewer/LoginPage/output_type.ts';
import { type CurrentViewer__RlhfHome__output_type } from '../../CurrentViewer/RlhfHome/output_type.ts';

export type Query__EntrypointRlhf__param = {
  readonly data: {
    readonly currentViewer: ({
      readonly __typename: string,
      readonly LoginPage: CurrentViewer__LoginPage__output_type,
      readonly RlhfHome: CurrentViewer__RlhfHome__output_type,
    } | null),
  },
  readonly parameters: Record<PropertyKey, never>,
};
