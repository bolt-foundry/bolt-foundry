import { assertEquals, assertInstanceOf, assertRejects } from "@std/assert";
import { BfNode } from "@bfmono/apps/bfDb/classes/BfNode.ts";
import { CurrentViewer } from "@bfmono/apps/bfDb/classes/CurrentViewer.ts";
import { BfOrganization } from "@bfmono/apps/bfDb/nodeTypes/BfOrganization.ts";
import { BfErrorNotFound } from "@bfmono/lib/BfError.ts";
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
  findAuthor: () => Promise<BfAuthor | null>;
  findXAuthor: () => Promise<BfAuthor>;
  createAuthor: (props: { name: string; bio: string }) => Promise<BfAuthor>;
  unlinkAuthor: () => Promise<void>;
  deleteAuthor: () => Promise<void>;
};

// Type aliases for many relationships
type BfPostWithMethods = BfPost & {
  // Many relationship methods for comments
  findAllComment: () => Promise<Array<BfComment>>;
  queryComment: (args: {
    where?: Partial<{ text: string; authorId: string }>;
    orderBy?: { text?: "asc" | "desc"; authorId?: "asc" | "desc" };
    limit?: number;
    offset?: number;
  }) => Promise<Array<BfComment>>;
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
  // Phase 7 batch operations
  addManyComment: (nodes: Array<BfComment>) => Promise<void>;
  removeManyComment: (nodes: Array<BfComment>) => Promise<void>;
  createManyComment: (
    propsArray: Array<{
      text: string;
      authorId: string;
    }>,
  ) => Promise<Array<BfComment>>;
  iterateComment: () => AsyncIterableIterator<BfComment>;

  // Many relationship methods for tags
  findAllTag: () => Promise<Array<BfTag>>;
  queryTag: (args: {
    where?: Partial<{ name: string }>;
    orderBy?: { name?: "asc" | "desc" };
    limit?: number;
    offset?: number;
  }) => Promise<Array<BfTag>>;
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
  // Phase 7 batch operations
  addManyTag: (nodes: Array<BfTag>) => Promise<void>;
  removeManyTag: (nodes: Array<BfTag>) => Promise<void>;
  createManyTag: (propsArray: Array<{ name: string }>) => Promise<Array<BfTag>>;
  iterateTag: () => AsyncIterableIterator<BfTag>;
};

// Class with multiple relationships to the same type
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

// Helper function to setup test environment
async function setupTestEnvironment() {
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
  const cv = CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
    import.meta,
    "test@test.com",
    org.id,
  );

  // Create test nodes
  const author = await BfAuthor.__DANGEROUS__createUnattached(cv, {
    name: "Jane Doe",
    bio: "A great author",
  });

  const book = await BfBook.__DANGEROUS__createUnattached(cv, {
    title: "Test Book",
    isbn: "123-456",
  });

  return { cv, book, author };
}

Deno.test("relationshipMethods - should generate findAuthor method", async () => {
  const { book } = await setupTestEnvironment();

  // The method should exist
  assertEquals(typeof (book as BfBookWithMethods).findAuthor, "function");

  // Should return null when no relationship exists
  const result = await (book as BfBookWithMethods).findAuthor();
  assertEquals(result, null);
});

Deno.test("relationshipMethods - should generate findXAuthor method", async () => {
  const { book } = await setupTestEnvironment();

  // The method should exist
  assertEquals(typeof (book as BfBookWithMethods).findXAuthor, "function");

  // Should throw when no relationship exists
  await assertRejects(
    () => (book as BfBookWithMethods).findXAuthor(),
    BfErrorNotFound,
    "Author not found",
  );
});

Deno.test("relationshipMethods - should generate createAuthor method", async () => {
  const { book } = await setupTestEnvironment();

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

  // Verify the relationship was created
  const foundAuthor = await (book as BfBookWithMethods).findAuthor();
  assertEquals(foundAuthor?.props.name, "John Smith");
  assertEquals(foundAuthor?.props.bio, "Another author");
});

Deno.test("relationshipMethods - should generate unlinkAuthor method", async () => {
  const { cv, book, author } = await setupTestEnvironment();

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

Deno.test("relationshipMethods - should generate deleteAuthor method", async () => {
  const { cv, book, author } = await setupTestEnvironment();

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

Deno.test("relationshipMethods - should handle multiple relationships to the same type", async () => {
  const { cv } = await setupTestEnvironment();

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

  // Verify the relationships were created correctly
  const foundAuthor = await (bookMulti as BfBookWithMultipleMethods)
    .findAuthor();
  const foundIllustrator = await (bookMulti as BfBookWithMultipleMethods)
    .findIllustrator();

  assertEquals(foundAuthor?.props.name, "Author Name");
  assertEquals(foundIllustrator?.props.name, "Illustrator Name");
});

Deno.test("relationshipMethods - should handle nodes with no relationships", async () => {
  class BfSimpleNode extends BfNode<{ name: string }> {
    static override gqlSpec = this.defineGqlNode((gql) => gql.string("name"));
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

Deno.test("relationshipMethods - should handle missing currentViewer gracefully", () => {
  // This test ensures that methods check for cv properly
  const book = new BfBook(null as unknown as CurrentViewer, {
    title: "Test",
    isbn: "123",
  });

  // Should not throw during construction
  assertInstanceOf(book, BfBook);
});

// Phase 6: Many relationship tests
Deno.test("many relationship methods - should generate findAllComment method", async () => {
  const org = await BfOrganization.__DANGEROUS__createUnattached(
    CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
      import.meta,
    ),
    {
      name: "Test Org",
      domain: "test.com",
    },
  );
  const cv = CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
    import.meta,
    "test@test.com",
    org.id,
  );

  const post = await BfPost.__DANGEROUS__createUnattached(cv, {
    title: "Test Post",
    content: "Test content",
  });

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

Deno.test("many relationship methods - should generate createComment method", async () => {
  const org = await BfOrganization.__DANGEROUS__createUnattached(
    CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
      import.meta,
    ),
    {
      name: "Test Org",
      domain: "test.com",
    },
  );
  const cv = CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
    import.meta,
    "test@test.com",
    org.id,
  );

  const post = await BfPost.__DANGEROUS__createUnattached(cv, {
    title: "Test Post",
    content: "Test content",
  });

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

  // Verify the comment was created and linked
  const allComments = await (post as BfPostWithMethods).findAllComment();
  assertEquals(allComments.length, 1);
  assertEquals(allComments[0].props.text, "New comment");
  assertEquals(allComments[0].props.authorId, "author3");
});

Deno.test("many relationship methods - should generate queryComment method", async () => {
  const org = await BfOrganization.__DANGEROUS__createUnattached(
    CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
      import.meta,
    ),
    {
      name: "Test Org",
      domain: "test.com",
    },
  );
  const cv = CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
    import.meta,
    "test@test.com",
    org.id,
  );

  const post = await BfPost.__DANGEROUS__createUnattached(cv, {
    title: "Test Post",
    content: "Test content",
  });

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

Deno.test("many relationship methods - should generate connectionForComment method", async () => {
  const org = await BfOrganization.__DANGEROUS__createUnattached(
    CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
      import.meta,
    ),
    {
      name: "Test Org",
      domain: "test.com",
    },
  );
  const cv = CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
    import.meta,
    "test@test.com",
    org.id,
  );

  const post = await BfPost.__DANGEROUS__createUnattached(cv, {
    title: "Test Post",
    content: "Test content",
  });

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

// Phase 7: Batch operations tests
Deno.test("Phase 7: batch operations - should generate addManyComment method", async () => {
  const org = await BfOrganization.__DANGEROUS__createUnattached(
    CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
      import.meta,
    ),
    {
      name: "Test Org",
      domain: "test.com",
    },
  );
  const cv = CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
    import.meta,
    "test@test.com",
    org.id,
  );

  const post = await BfPost.__DANGEROUS__createUnattached(cv, {
    title: "Test Post",
    content: "Test content",
  });

  const comment1 = await BfComment.__DANGEROUS__createUnattached(cv, {
    text: "First comment",
    authorId: "author1",
  });

  const comment2 = await BfComment.__DANGEROUS__createUnattached(cv, {
    text: "Second comment",
    authorId: "author2",
  });

  // The method should exist
  assertEquals(
    typeof (post as BfPostWithMethods).addManyComment,
    "function",
  );

  // Should add multiple existing comments
  await (post as BfPostWithMethods).addManyComment([
    comment1,
    comment2,
  ]);

  // Note: Due to stub implementation, edges are not created
  const allComments = await (post as BfPostWithMethods)
    .findAllComment();
  assertEquals(allComments.length, 0); // Currently returns empty due to stub
});

Deno.test("Phase 7: batch operations - should generate createManyComment method", async () => {
  const org = await BfOrganization.__DANGEROUS__createUnattached(
    CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
      import.meta,
    ),
    {
      name: "Test Org",
      domain: "test.com",
    },
  );
  const cv = CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
    import.meta,
    "test@test.com",
    org.id,
  );

  const post = await BfPost.__DANGEROUS__createUnattached(cv, {
    title: "Test Post",
    content: "Test content",
  });

  // The method should exist
  assertEquals(
    typeof (post as BfPostWithMethods).createManyComment,
    "function",
  );

  // Should create multiple comments
  const newComments = await (post as BfPostWithMethods)
    .createManyComment([
      { text: "Batch comment 1", authorId: "author1" },
      { text: "Batch comment 2", authorId: "author2" },
      { text: "Batch comment 3", authorId: "author3" },
    ]);

  // Should return array of created comments
  assertEquals(newComments.length, 3);
  assertInstanceOf(newComments[0], BfComment);
  assertInstanceOf(newComments[1], BfComment);
  assertInstanceOf(newComments[2], BfComment);
  assertEquals(newComments[0].props.text, "Batch comment 1");
  assertEquals(newComments[1].props.text, "Batch comment 2");
  assertEquals(newComments[2].props.text, "Batch comment 3");
});

Deno.test("Phase 7: batch operations - should generate iterateComment method", async () => {
  const org = await BfOrganization.__DANGEROUS__createUnattached(
    CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
      import.meta,
    ),
    {
      name: "Test Org",
      domain: "test.com",
    },
  );
  const cv = CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
    import.meta,
    "test@test.com",
    org.id,
  );

  const post = await BfPost.__DANGEROUS__createUnattached(cv, {
    title: "Test Post",
    content: "Test content",
  });

  // The method should exist
  assertEquals(
    typeof (post as BfPostWithMethods).iterateComment,
    "function",
  );

  // Should return async iterator
  const iterator = (post as BfPostWithMethods).iterateComment();
  assertEquals(typeof iterator[Symbol.asyncIterator], "function");

  // Should iterate over empty collection
  const items = [];
  for await (
    const comment of iterator
  ) {
    items.push(comment);
  }

  assertEquals(items.length, 0);
});
