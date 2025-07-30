
export type QueryBlogPostsConnection__BlogPostList__param = {
  readonly data: {
    readonly edges: (ReadonlyArray<({
      readonly cursor: string,
      readonly node: ({
        readonly id: string,
        readonly author: (string | null),
        readonly publishedAt: (string | null),
        readonly excerpt: string,
        readonly tags: string,
        readonly title: string,
        readonly heroImage: (string | null),
      } | null),
    } | null)> | null),
    readonly pageInfo: {
      readonly hasNextPage: boolean,
      readonly hasPreviousPage: boolean,
      readonly startCursor: (string | null),
      readonly endCursor: (string | null),
    },
  },
  readonly parameters: Record<PropertyKey, never>,
};
