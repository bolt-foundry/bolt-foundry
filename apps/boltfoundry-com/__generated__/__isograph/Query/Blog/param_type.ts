import { type QueryBlogPostsConnection__BlogPostList__output_type } from '../../QueryBlogPostsConnection/BlogPostList/output_type.ts';

export type Query__Blog__param = {
  readonly data: {
    readonly blogPosts: ({
      readonly BlogPostList: QueryBlogPostsConnection__BlogPostList__output_type,
    } | null),
  },
  readonly parameters: Record<PropertyKey, never>,
};
