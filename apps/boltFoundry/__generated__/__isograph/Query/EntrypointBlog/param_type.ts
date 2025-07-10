import { type Query__Blog__output_type } from '../../Query/Blog/output_type.ts';
import type { Query__EntrypointBlog__parameters } from './parameters_type.ts';

export type Query__EntrypointBlog__param = {
  readonly data: {
    readonly Blog: Query__Blog__output_type,
  },
  readonly parameters: Query__EntrypointBlog__parameters,
};
