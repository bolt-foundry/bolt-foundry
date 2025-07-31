import { type BlogPost__BlogPostView__output_type } from '../../BlogPost/BlogPostView/output_type.ts';
import { type BlogPostConnection__BlogList__output_type } from '../../BlogPostConnection/BlogList/output_type.ts';
import type { Query__Blog__parameters } from './parameters_type.ts';

export type Query__Blog__param = {
  readonly data: {
    readonly blogPost: ({
      readonly BlogPostView: BlogPost__BlogPostView__output_type,
    } | null),
    readonly blogPosts: ({
      readonly BlogList: BlogPostConnection__BlogList__output_type,
    } | null),
  },
  readonly parameters: Query__Blog__parameters,
};
