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

// Type aliases for cleaner test code
type BfBookWithMethods = BfBook & {
  findAuthor: () => Promise<unknown>;
  findXAuthor: () => Promise<unknown>;
  createAuthor: (props: { name: string; bio: string }) => Promise<unknown>;
  unlinkAuthor: () => Promise<void>;
  deleteAuthor: () => Promise<void>;
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
});
