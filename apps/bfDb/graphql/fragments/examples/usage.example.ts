/**
 * Example usage of the Query Fragment system
 *
 * This file demonstrates how to use the fragment system to create modular,
 * reusable GraphQL query definitions that can be selectively composed.
 */

import { defineQueryFragment, simpleFragmentMerge } from "../index.ts";
import { GraphQLObjectBase } from "@bfmono/apps/bfDb/graphql/GraphQLObjectBase.ts";

// Mock types for the example (these would be real node types in practice)
class BlogPost {
  static name = "BlogPost";
  static connection = (
    items: Array<BlogPost>,
    _args: Record<string, unknown>,
  ) => ({
    edges: items.map((item) => ({ node: item, cursor: item.id })),
    pageInfo: { hasNextPage: false, hasPreviousPage: false },
  });
  static findBySlug = (_slug: string) => new BlogPost();
  static listAll = (_sortDirection?: string) => [new BlogPost()];
  id = "blog-post-1";
}

class User {
  static name = "User";
  static findById = (_id: string) => new User();
  id = "user-1";
}

class PublishedDocument {
  static name = "PublishedDocument";
  static findX = (_slug: string) => new PublishedDocument();
  id = "doc-1";
}

/**
 * Blog-related query fragment
 *
 * This fragment provides all blog-related queries and can be used
 * independently or combined with other fragments.
 */
export const blogQueries = defineQueryFragment(
  (gql) =>
    gql
      .object("blogPost", () => BlogPost, {
        args: (a) => a.string("slug"),
        resolve: async (_root, args, _ctx, _info) => {
          const slug = (args.slug as string) || "README";
          return await BlogPost.findBySlug(slug);
        },
      })
      .connection("blogPosts", () => BlogPost, {
        args: (a) =>
          a
            .string("sortDirection")
            .string("filterByYear"),
        resolve: async (_root, args, _ctx) => {
          const sortDir = (args.sortDirection as "ASC" | "DESC") || "DESC";
          const posts = await BlogPost.listAll(sortDir);

          const filtered = args.filterByYear
            ? posts.filter((p) => p.id.startsWith(args.filterByYear as string))
            : posts;

          return BlogPost.connection(filtered, args);
        },
      }),
  {
    name: "BlogQueries",
    description: "Blog post queries and connections",
  },
);

/**
 * User-related query fragment
 *
 * This fragment provides user authentication and profile queries.
 */
export const userQueries = defineQueryFragment(
  (gql) =>
    gql
      .object("currentUser", () => User, {
        resolve: async (_root, _args, _ctx) => {
          // In a real implementation, this would get the current user from context
          return await User.findById("current-user-id");
        },
      })
      .object("user", () => User, {
        args: (a) => a.nonNull.string("id"),
        resolve: async (_root, args) => {
          return await User.findById(args.id as string);
        },
      }),
  {
    name: "UserQueries",
    description: "User authentication and profile queries",
  },
);

/**
 * Documentation-related query fragment
 *
 * This fragment provides access to published documentation.
 */
export const documentationQueries = defineQueryFragment(
  (gql) =>
    gql
      .object("documentsBySlug", () => PublishedDocument, {
        args: (a) => a.string("slug"),
        resolve: async (_root, args, _ctx, _info) => {
          const slug = (args.slug as string) || "getting-started";
          return await PublishedDocument.findX(slug);
        },
      })
      .boolean("docsAvailable", {
        resolve: () => true,
      }),
  {
    name: "DocumentationQueries",
    description: "Published documentation access",
  },
);

/**
 * System status fragment
 *
 * Provides basic system health and status information.
 */
export const systemQueries = defineQueryFragment(
  (gql) =>
    gql
      .boolean("ok", {
        resolve: () => true,
      })
      .string("version", {
        resolve: () => "1.0.0",
      }),
  {
    name: "SystemQueries",
    description: "System status and health checks",
  },
);

/**
 * Example 1: Basic query using a single fragment
 */
export class BasicBlogQuery extends GraphQLObjectBase {
  static override gqlSpec = blogQueries.spec;

  override toGraphql() {
    return { __typename: "Query", id: "Query" };
  }
}

/**
 * Example 2: Combined query using multiple fragments
 */
export class FullQuery extends GraphQLObjectBase {
  static override gqlSpec = simpleFragmentMerge([
    blogQueries,
    userQueries,
    documentationQueries,
    systemQueries,
  ]);

  override toGraphql() {
    return { __typename: "Query", id: "Query" };
  }
}

/**
 * Example 3: Selective query for a specific feature set
 */
export class BlogAndUserQuery extends GraphQLObjectBase {
  static override gqlSpec = simpleFragmentMerge([
    blogQueries,
    userQueries,
    systemQueries, // Always include system queries for health checks
  ]);

  override toGraphql() {
    return { __typename: "Query", id: "Query" };
  }
}

/**
 * Example 4: Documentation-only query for a documentation site
 */
export class DocsOnlyQuery extends GraphQLObjectBase {
  static override gqlSpec = simpleFragmentMerge([
    documentationQueries,
    systemQueries,
  ]);

  override toGraphql() {
    return { __typename: "Query", id: "Query" };
  }
}

/**
 * Example 5: Fragments with dependencies
 *
 * This shows how to create fragments that depend on other fragments.
 */
export const advancedBlogQueries = defineQueryFragment(
  (gql) =>
    gql
      .object("myBlogPosts", () => BlogPost, {
        resolve: async (_root, _args, _ctx) => {
          // This query depends on the current user being available
          // In practice, this would require the userQueries fragment
          await User.findById("current-user");
          return await BlogPost.listAll();
        },
      }),
  {
    name: "AdvancedBlogQueries",
    description: "Blog queries that require user context",
    dependencies: ["UserQueries"], // Depends on user queries being available
  },
);

/**
 * Example 6: Query with dependencies resolved automatically
 */
export class AdvancedQuery extends GraphQLObjectBase {
  static override gqlSpec = simpleFragmentMerge([
    userQueries, // Must come first due to dependency
    advancedBlogQueries, // Depends on UserQueries
    systemQueries,
  ]);

  override toGraphql() {
    return { __typename: "Query", id: "Query" };
  }
}

/**
 * Usage patterns:
 *
 * 1. **Modular Development**: Each feature team can develop their own fragments
 *    independently, then combine them in the main application.
 *
 * 2. **Selective Imports**: Different applications can import only the GraphQL
 *    functionality they need, reducing bundle size and complexity.
 *
 * 3. **Testing**: Individual fragments can be tested in isolation before
 *    being composed into larger schemas.
 *
 * 4. **Progressive Enhancement**: Start with basic fragments and add more
 *    advanced features as needed.
 *
 * 5. **Environment-Specific Schemas**: Different environments (dev, staging, prod)
 *    can compose different sets of fragments based on available services.
 */
