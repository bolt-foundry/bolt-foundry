/**
 * Example showing how to expose BfNode relationships in GraphQL
 * using the standard object() and connection() methods.
 */

import { BfNode } from "@bfmono/apps/bfDb/classes/BfNode.ts";
import type { BfGid } from "@bfmono/lib/types.ts";

// Example node types
class BfAuthor extends BfNode<{ name: string; bio: string }> {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql.string("name").string("bio")
  );

  static override bfNodeSpec = this.defineBfNode((f) =>
    f.string("name").string("bio")
  );
}

class BfReviewer extends BfNode<{ name: string; rating: number }> {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql.string("name").int("rating")
  );

  static override bfNodeSpec = this.defineBfNode((f) =>
    f.string("name").number("rating")
  );
}

class BfTag extends BfNode<{ name: string }> {
  static override gqlSpec = this.defineGqlNode((gql) => gql.string("name"));

  static override bfNodeSpec = this.defineBfNode((f) => f.string("name"));
}

/**
 * Example: BfBook with relationships exposed in GraphQL
 */
class BfBook extends BfNode<{ title: string; isbn: string }> {
  // GraphQL schema - public API
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .string("title")
      .string("isbn")
      // One-to-one relationship: author
      // This will automatically use the edge relationship system
      .object("author", () => BfAuthor)
      // Many-to-many relationship: reviewers
      // Requires a custom resolver to use the generated methods
      .connection("reviewers", () => BfReviewer, {
        resolve: async (root, args, _ctx) => {
          // Type assertion to access generated methods
          const book = root as BfBook & {
            findAllReviewers: () => Promise<Array<BfReviewer>>;
          };
          const reviewers = await book.findAllReviewers();
          return BfReviewer.connection(reviewers, args);
        },
      })
      // Another many relationship with custom filtering
      .connection("tags", () => BfTag, {
        args: (a) => a.string("nameContains"),
        resolve: async (root, args, _ctx) => {
          const book = root as BfBook & {
            queryTags: (opts: {
              where?: { name?: string };
            }) => Promise<Array<BfTag>>;
          };

          // Use the generated query method with filtering
          const tags = await book.queryTags({
            where: args.nameContains
              ? { name: args.nameContains as string }
              : undefined,
          });

          return BfTag.connection(tags, args);
        },
      })
      // Custom field that uses relationship methods
      .int("reviewerCount", {
        resolve: async (root, _args, _ctx) => {
          const book = root as BfBook & {
            findAllReviewers: () => Promise<Array<BfReviewer>>;
          };
          const reviewers = await book.findAllReviewers();
          return reviewers.length;
        },
      })
      // Custom mutation that uses relationship methods
      .mutation("addReviewer", {
        args: (a) => a.nonNull.id("reviewerId"),
        returns: () => BfBook,
        resolve: async (root, args, ctx) => {
          const book = root as BfBook & {
            addReviewer: (reviewer: BfReviewer) => Promise<void>;
          };

          // Find the reviewer
          const reviewer = await BfReviewer.findX(
            ctx.getCurrentViewer(),
            args.reviewerId as BfGid,
          );

          // Use the generated add method
          await book.addReviewer(reviewer);

          return root;
        },
      })
  );

  // BfNode spec - internal API
  static override bfNodeSpec = this.defineBfNode((f) =>
    f
      .string("title")
      .string("isbn")
      .one("author", () => BfAuthor)
      .many("reviewers", () => BfReviewer)
      .many("tags", () => BfTag)
  );
}

/**
 * Example showing selective exposure of relationships
 */
class BfDocument extends BfNode<{ title: string; content: string }> {
  // Only expose some relationships in GraphQL
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .string("title")
      .string("content")
      // Only expose the owner relationship
      .object("owner", () => BfAuthor)
    // Note: NOT exposing internalReviewers or draft relationships
  );

  // Internal spec has more relationships
  static override bfNodeSpec = this.defineBfNode((f) =>
    f
      .string("title")
      .string("content")
      .one("owner", () => BfAuthor)
      .one("draft", () => BfDocument) // Internal only
      .many("internalReviewers", () => BfReviewer) // Internal only
  );
}

// The generated methods like findOwner(), findDraft(), findAllInternalReviewers()
// are still available on BfDocument instances for internal use, but only
// the owner relationship is exposed in the GraphQL API.
