
export type BlogPostConnection__BlogList__param = {
  readonly data: {
    /**
https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types
    */
    readonly edges: (ReadonlyArray<({
      /**
https://facebook.github.io/relay/graphql/connections.htm#sec-Cursor
      */
      readonly cursor: string,
      /**
https://facebook.github.io/relay/graphql/connections.htm#sec-Node
      */
      readonly node: ({
        readonly id: string,
        readonly content: string,
        readonly author: (string | null),
        readonly publishedAt: (string | null),
        readonly excerpt: string,
        readonly tags: string,
        readonly title: string,
        readonly heroImage: (string | null),
      } | null),
    } | null)> | null),
    /**
https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo
    */
    readonly pageInfo: {
      /**
Used to indicate whether more edges exist following the set defined by the clients arguments.
      */
      readonly hasNextPage: boolean,
      /**
Used to indicate whether more edges exist prior to the set defined by the clients arguments.
      */
      readonly hasPreviousPage: boolean,
      /**
The cursor corresponding to the first nodes in edges. Null if the connection is empty.
      */
      readonly startCursor: (string | null),
      /**
The cursor corresponding to the last nodes in edges. Null if the connection is empty.
      */
      readonly endCursor: (string | null),
    },
  },
  readonly parameters: Record<PropertyKey, never>,
};
