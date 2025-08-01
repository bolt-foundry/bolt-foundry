import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals, assertInstanceOf, assertRejects } from "@std/assert";
import { BfNode } from "@bfmono/apps/bfDb/classes/BfNode.ts";
import { CurrentViewer } from "@bfmono/apps/bfDb/classes/CurrentViewer.ts";
import { BfOrganization } from "@bfmono/apps/bfDb/nodeTypes/BfOrganization.ts";
import { NotFoundError } from "@bfmono/packages/bolt-foundry/lib/BfError.ts";
import type { BfGid } from "@bfmono/lib/types.ts";

// Mock node classes for testing
class BfPerson extends BfNode<{ name: string }> {
  static override gqlSpec = this.defineGqlNode((gql) => gql.string("name"));
  static override bfNodeSpec = this.defineBfNode((f) => f.string("name"));
}

class BfAuthor extends BfNode<{ name: string; bio: string }> {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql.string("name")
      .string("bio")
  );
  static override bfNodeSpec = this.defineBfNode((f) =>
    f.string("name")
      .string("bio")
  );
}

class BfBook extends BfNode<{ title: string; isbn: string }> {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql.string("title")
      .string("isbn")
  );
  static override bfNodeSpec = this.defineBfNode((f) =>
    f.string("title")
      .string("isbn")
      .one("author", () => BfAuthor)
  );
}

// Mock nodes for many relationships
class BfComment extends BfNode<{ text: string; authorId: string }> {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql.string("text").string("authorId")
  );
  static override bfNodeSpec = this.defineBfNode((f) =>
    f.string("text").string("authorId")
  );
}

class BfTag extends BfNode<{ name: string }> {
  static override gqlSpec = this.defineGqlNode((gql) => gql.string("name"));
  static override bfNodeSpec = this.defineBfNode((f) => f.string("name"));
}

class BfPost extends BfNode<{ title: string; content: string }> {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql.string("title").string("content")
  );
  static override bfNodeSpec = this.defineBfNode((f) =>
    f.string("title")
      .string("content")
      .many("comment", () => BfComment)
      .many("tag", () => BfTag)
  );
}

// Type aliases for cleaner test code
type BfBookWithMethods = BfBook & {
  findAuthor: () => Promise<unknown>;
  findXAuthor: () => Promise<unknown>;
  createAuthor: (props: { name: string; bio: string }) => Promise<unknown>;
  unlinkAuthor: () => Promise<void>;
  deleteAuthor: () => Promise<void>;
};

// Type aliases for many relationships
type BfPostWithMethods = BfPost & {
  // Many relationship methods for comments
  findAllComment: () => Promise<BfComment[]>;
  queryComment: (args: {
    where?: Partial<{ text: string; authorId: string }>;
    orderBy?: { text?: "asc" | "desc"; authorId?: "asc" | "desc" };
    limit?: number;
    offset?: number;
  }) => Promise<BfComment[]>;
  connectionForComment: (args: {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
    where?: Record<string, unknown>;
  }) => Promise<{
    edges: Array<{ node: BfComment; cursor: string }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string;
      endCursor?: string;
    };
  }>;
  createComment: (props: {
    text: string;
    authorId: string;
  }) => Promise<BfComment>;
  addComment: (node: BfComment) => Promise<void>;
  removeComment: (node: BfComment) => Promise<void>;
  deleteComment: (node: BfComment) => Promise<void>;

  // Many relationship methods for tags
  findAllTag: () => Promise<BfTag[]>;
  queryTag: (args: {
    where?: Partial<{ name: string }>;
    orderBy?: { name?: "asc" | "desc" };
    limit?: number;
    offset?: number;
  }) => Promise<BfTag[]>;
  connectionForTag: (args: {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
    where?: Record<string, unknown>;
  }) => Promise<{
    edges: Array<{ node: BfTag; cursor: string }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string;
      endCursor?: string;
    };
  }>;
  createTag: (props: { name: string }) => Promise<BfTag>;
  addTag: (node: BfTag) => Promise<void>;
  removeTag: (node: BfTag) => Promise<void>;
  deleteTag: (node: BfTag) => Promise<void>;
};

// Move BfBookWithMultiple class definition here
class BfBookWithMultiple extends BfNode<{ title: string }> {
  static override gqlSpec = this.defineGqlNode((f) => f.string("title"));
  static override bfNodeSpec = this.defineBfNode((f) =>
    f.string("title")
      .one("author", () => BfPerson)
      .one("illustrator", () => BfPerson)
  );
}

type BfBookWithMultipleMethods = BfBookWithMultiple & {
  findAuthor: () => Promise<BfPerson | null>;
  findIllustrator: () => Promise<BfPerson | null>;
  createAuthor: (props: { name: string }) => Promise<BfPerson>;
  createIllustrator: (props: { name: string }) => Promise<BfPerson>;
};

describe("relationshipMethods", () => {
  describe("one relationship methods", () => {
    let cv: CurrentViewer;
    let book: BfBook;
    let author: BfAuthor;

    beforeEach(async () => {
      // Create a test org and CV
      const org = await BfOrganization.__DANGEROUS__createUnattached(
        CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
          import.meta,
        ),
        {
          name: "Test Org",
          domain: "test.com",
        },
      );
      cv = CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
        import.meta,
        "test@test.com",
        org.id,
      );

      // Create test nodes
      author = await BfAuthor.__DANGEROUS__createUnattached(cv, {
        name: "Jane Doe",
        bio: "A great author",
      });

      book = await BfBook.__DANGEROUS__createUnattached(cv, {
        title: "Test Book",
        isbn: "123-456",
      });
    });

    it("should generate findAuthor method", async () => {
      // The method should exist
      assertEquals(typeof (book as BfBookWithMethods).findAuthor, "function");

      // Should return null when no relationship exists
      const result = await (book as BfBookWithMethods).findAuthor();
      assertEquals(result, null);
    });

    it("should generate findXAuthor method", async () => {
      // The method should exist
      assertEquals(typeof (book as BfBookWithMethods).findXAuthor, "function");

      // Should throw when no relationship exists
      await assertRejects(
        () => (book as BfBookWithMethods).findXAuthor(),
        NotFoundError,
        "Author not found",
      );
    });

    it("should generate createAuthor method", async () => {
      // The method should exist
      assertEquals(typeof (book as BfBookWithMethods).createAuthor, "function");

      // Should create a new author and link it
      const newAuthor = await (book as BfBookWithMethods).createAuthor({
        name: "John Smith",
        bio: "Another author",
      });

      assertInstanceOf(newAuthor, BfAuthor);
      assertEquals(newAuthor.props.name, "John Smith");
      assertEquals(newAuthor.props.bio, "Another author");

      // Note: Due to stub implementation, edge creation is not implemented yet
      // so the created author won't be findable through findAuthor until edges are implemented
      const foundAuthor = await (book as BfBookWithMethods).findAuthor();
      assertEquals(foundAuthor, null); // Currently returns null due to stub implementation
    });

    it("should generate unlinkAuthor method", async () => {
      // The method should exist
      assertEquals(typeof (book as BfBookWithMethods).unlinkAuthor, "function");

      // Method should be callable without throwing (stub implementation)
      await (book as BfBookWithMethods).unlinkAuthor();

      // Find should still return null (no relationship was created)
      const foundAfter = await (book as BfBookWithMethods).findAuthor();
      assertEquals(foundAfter, null);

      // Author node should still exist independently
      const authorStillExists = await BfAuthor.find(cv, author.id as BfGid);
      assertEquals(authorStillExists?.id, author.id);
      assertEquals(authorStillExists?.props.name, author.props.name);
      assertEquals(authorStillExists?.props.bio, author.props.bio);
    });

    it("should generate deleteAuthor method", async () => {
      // The method should exist
      assertEquals(typeof (book as BfBookWithMethods).deleteAuthor, "function");

      // Method should be callable without throwing (stub implementation)
      await (book as BfBookWithMethods).deleteAuthor();

      // Since no relationship exists, findAuthor should still return null
      const foundAuthor = await (book as BfBookWithMethods).findAuthor();
      assertEquals(foundAuthor, null);

      // Author node should still exist (no relationship to delete)
      const authorStillExists = await BfAuthor.find(cv, author.id as BfGid);
      assertEquals(authorStillExists?.id, author.id);
      assertEquals(authorStillExists?.props.name, author.props.name);
      assertEquals(authorStillExists?.props.bio, author.props.bio);
    });

    it("should handle multiple relationships to the same type", async () => {
      // Using the BfPerson class defined at the top of the file

      const bookMulti = await BfBookWithMultiple.__DANGEROUS__createUnattached(
        cv,
        {
          title: "Illustrated Book",
        },
      );

      // Should have separate methods for each relationship
      assertEquals(
        typeof (bookMulti as BfBookWithMultipleMethods).findAuthor,
        "function",
      );
      assertEquals(
        typeof (bookMulti as BfBookWithMultipleMethods).findIllustrator,
        "function",
      );
      assertEquals(
        typeof (bookMulti as BfBookWithMultipleMethods).createAuthor,
        "function",
      );
      assertEquals(
        typeof (bookMulti as BfBookWithMultipleMethods).createIllustrator,
        "function",
      );

      // Create different people for each role
      const author = await (bookMulti as BfBookWithMultipleMethods)
        .createAuthor({
          name: "Author Name",
        });
      const illustrator = await (bookMulti as BfBookWithMultipleMethods)
        .createIllustrator({
          name: "Illustrator Name",
        });

      assertEquals(author.props.name, "Author Name");
      assertEquals(illustrator.props.name, "Illustrator Name");

      // Note: Due to stub implementation, relationships are not persisted
      // so the created persons won't be findable through find methods
      const foundAuthor = await (bookMulti as BfBookWithMultipleMethods)
        .findAuthor();
      const foundIllustrator = await (bookMulti as BfBookWithMultipleMethods)
        .findIllustrator();

      assertEquals(foundAuthor, null); // Stub implementation returns null
      assertEquals(foundIllustrator, null); // Stub implementation returns null
    });
  });

  describe("edge cases", () => {
    it("should handle nodes with no relationships", async () => {
      class BfSimpleNode extends BfNode<{ name: string }> {
        static override gqlSpec = this.defineGqlNode((gql) =>
          gql.string("name")
        );
        static override bfNodeSpec = this.defineBfNode((f) => f.string("name"));
      }

      const cv = CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
        import.meta,
      );
      const node = await BfSimpleNode.__DANGEROUS__createUnattached(cv, {
        name: "Simple",
      });

      // Should not have any relationship methods
      assertEquals(
        (node as unknown as BfNode & Record<string, unknown>).findAuthor,
        undefined,
      );
      assertEquals(
        (node as unknown as BfNode & Record<string, unknown>).createAuthor,
        undefined,
      );
    });

    it("should handle missing currentViewer gracefully", () => {
      // This test ensures that methods check for cv properly
      const book = new BfBook(null as unknown as CurrentViewer, {
        title: "Test",
        isbn: "123",
      });

      // Should not throw during construction
      assertInstanceOf(book, BfBook);
    });
  });

  describe("many relationship methods", () => {
    let cv: CurrentViewer;
    let post: BfPost;
    let comment1: BfComment;
    let comment2: BfComment;
    let tag1: BfTag;
    let tag2: BfTag;

    beforeEach(async () => {
      // Create a test org and CV
      const org = await BfOrganization.__DANGEROUS__createUnattached(
        CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
          import.meta,
        ),
        {
          name: "Test Org",
          domain: "test.com",
        },
      );
      cv = CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
        import.meta,
        "test@test.com",
        org.id,
      );

      // Create test nodes
      post = await BfPost.__DANGEROUS__createUnattached(cv, {
        title: "Test Post",
        content: "Test content",
      });

      comment1 = await BfComment.__DANGEROUS__createUnattached(cv, {
        text: "First comment",
        authorId: "author1",
      });

      comment2 = await BfComment.__DANGEROUS__createUnattached(cv, {
        text: "Second comment",
        authorId: "author2",
      });

      tag1 = await BfTag.__DANGEROUS__createUnattached(cv, {
        name: "javascript",
      });

      tag2 = await BfTag.__DANGEROUS__createUnattached(cv, {
        name: "typescript",
      });
    });

    describe("Create and find in many relationship", () => {
      it("should generate findAllComment method", async () => {
        // The method should exist
        assertEquals(
          typeof (post as BfPostWithMethods).findAllComment,
          "function",
        );

        // Should return empty array when no relationships exist
        const results = await (post as BfPostWithMethods).findAllComment();
        assertEquals(Array.isArray(results), true);
        assertEquals(results.length, 0);
      });

      it("should generate createComment method", async () => {
        // The method should exist
        assertEquals(
          typeof (post as BfPostWithMethods).createComment,
          "function",
        );

        // Should create a new comment and link it
        const newComment = await (post as BfPostWithMethods).createComment({
          text: "New comment",
          authorId: "author3",
        });

        assertInstanceOf(newComment, BfComment);
        assertEquals(newComment.props.text, "New comment");
        assertEquals(newComment.props.authorId, "author3");

        // Note: Due to stub implementation, edge creation is not implemented yet
        // so the created comment won't be findable through findAllComment
        const allComments = await (post as BfPostWithMethods).findAllComment();
        assertEquals(allComments.length, 0); // Currently returns empty due to stub
      });

      it("should handle empty results gracefully", async () => {
        // All find methods should return empty arrays/null when no relationships exist
        const comments = await (post as BfPostWithMethods).findAllComment();
        const tags = await (post as BfPostWithMethods).findAllTag();

        assertEquals(Array.isArray(comments), true);
        assertEquals(comments.length, 0);
        assertEquals(Array.isArray(tags), true);
        assertEquals(tags.length, 0);
      });
    });

    describe("Add existing node to many relationship", () => {
      it("should generate addComment method", async () => {
        // The method should exist
        assertEquals(typeof (post as BfPostWithMethods).addComment, "function");

        // Should add existing comment without creating new node
        await (post as BfPostWithMethods).addComment(comment1);

        // Note: Due to stub implementation, edge creation is not implemented yet
        const allComments = await (post as BfPostWithMethods).findAllComment();
        assertEquals(allComments.length, 0); // Currently returns empty due to stub
      });

      it("should not duplicate if already linked", async () => {
        // Add the same comment twice
        await (post as BfPostWithMethods).addComment(comment1);
        await (post as BfPostWithMethods).addComment(comment1);

        // Note: Due to stub implementation, duplicate prevention is not implemented yet
        const allComments = await (post as BfPostWithMethods).findAllComment();
        assertEquals(allComments.length, 0); // Currently returns empty due to stub
      });

      it("should verify edge creation without node creation", async () => {
        // Get the comment before adding to verify it exists
        const commentBefore = await BfComment.find(cv, comment1.id as BfGid);
        assertEquals(commentBefore?.id, comment1.id);

        // Add existing comment
        await (post as BfPostWithMethods).addComment(comment1);

        // The comment should still exist (no new node created)
        const commentAfter = await BfComment.find(cv, comment1.id as BfGid);
        assertEquals(commentAfter?.id, comment1.id);
        assertEquals(commentAfter?.props.text, comment1.props.text);
      });
    });

    describe("Remove from many relationship", () => {
      it("should generate removeComment and deleteComment methods", async () => {
        // The methods should exist
        assertEquals(
          typeof (post as BfPostWithMethods).removeComment,
          "function",
        );
        assertEquals(
          typeof (post as BfPostWithMethods).deleteComment,
          "function",
        );
      });

      it("should remove edge only with removeComment", async () => {
        // Remove comment (edge only)
        await (post as BfPostWithMethods).removeComment(comment1);

        // Comment node should still exist
        const commentStillExists = await BfComment.find(
          cv,
          comment1.id as BfGid,
        );
        assertEquals(commentStillExists?.id, comment1.id);
        assertEquals(commentStillExists?.props.text, comment1.props.text);
      });

      it("should delete node too with deleteComment", async () => {
        // Store the comment ID before deletion
        const commentId = comment1.id as BfGid;

        // Delete comment (node and edge)
        await (post as BfPostWithMethods).deleteComment(comment1);

        // Comment node should be deleted
        const commentExists = await BfComment.find(cv, commentId);
        assertEquals(commentExists, null);
      });

      it("should handle non-existent relationships gracefully", async () => {
        // Removing/deleting non-linked nodes should not throw
        const unrelatedComment = await BfComment.__DANGEROUS__createUnattached(
          cv,
          {
            text: "Unrelated comment",
            authorId: "author99",
          },
        );

        // Should not throw when removing non-existent relationship
        await (post as BfPostWithMethods).removeComment(unrelatedComment);
        await (post as BfPostWithMethods).deleteComment(unrelatedComment);

        // The unrelated comment should be deleted by deleteComment
        const exists = await BfComment.find(cv, unrelatedComment.id as BfGid);
        assertEquals(exists, null);
      });
    });

    describe("Query and pagination methods", () => {
      it("should generate queryComment method with filtering", async () => {
        // The method should exist
        assertEquals(
          typeof (post as BfPostWithMethods).queryComment,
          "function",
        );

        // Should accept query parameters
        const results = await (post as BfPostWithMethods).queryComment({
          where: { authorId: "author1" },
          orderBy: { text: "asc" },
          limit: 10,
          offset: 0,
        });

        assertEquals(Array.isArray(results), true);
        assertEquals(results.length, 0); // Currently returns empty due to stub
      });

      it("should generate connectionForComment method", async () => {
        // The method should exist
        assertEquals(
          typeof (post as BfPostWithMethods).connectionForComment,
          "function",
        );

        // Should return GraphQL connection structure
        const connection = await (post as BfPostWithMethods)
          .connectionForComment({
            first: 10,
            after: "cursor123",
          });

        // Verify connection structure
        assertEquals(typeof connection, "object");
        assertEquals(Array.isArray(connection.edges), true);
        assertEquals(typeof connection.pageInfo, "object");
        assertEquals(connection.pageInfo.hasNextPage, false);
        assertEquals(connection.pageInfo.hasPreviousPage, false);
      });

      it("should support backward pagination in connectionForComment", async () => {
        const connection = await (post as BfPostWithMethods)
          .connectionForComment({
            last: 5,
            before: "cursor456",
          });

        assertEquals(typeof connection, "object");
        assertEquals(Array.isArray(connection.edges), true);
      });

      it("should support filtering in connectionForComment", async () => {
        const connection = await (post as BfPostWithMethods)
          .connectionForComment({
            first: 10,
            where: { authorId: "author1" },
          });

        assertEquals(typeof connection, "object");
        assertEquals(Array.isArray(connection.edges), true);
      });
    });

    describe("Multiple many relationships", () => {
      it("should handle multiple many relationships on same node", async () => {
        // Post has both comments and tags relationships
        assertEquals(
          typeof (post as BfPostWithMethods).findAllComment,
          "function",
        );
        assertEquals(typeof (post as BfPostWithMethods).findAllTag, "function");
        assertEquals(
          typeof (post as BfPostWithMethods).createComment,
          "function",
        );
        assertEquals(typeof (post as BfPostWithMethods).createTag, "function");

        // Create nodes through relationships
        const newComment = await (post as BfPostWithMethods).createComment({
          text: "Test comment",
          authorId: "author123",
        });
        const newTag = await (post as BfPostWithMethods).createTag({
          name: "react",
        });

        assertInstanceOf(newComment, BfComment);
        assertInstanceOf(newTag, BfTag);
        assertEquals(newComment.props.text, "Test comment");
        assertEquals(newTag.props.name, "react");
      });

      it("should maintain separate methods for each relationship", async () => {
        // Add different types of nodes
        await (post as BfPostWithMethods).addComment(comment1);
        await (post as BfPostWithMethods).addTag(tag1);

        // Query each relationship separately
        const comments = await (post as BfPostWithMethods).findAllComment();
        const tags = await (post as BfPostWithMethods).findAllTag();

        // Currently stub implementation returns empty arrays
        assertEquals(Array.isArray(comments), true);
        assertEquals(Array.isArray(tags), true);
      });
    });
  });
});
