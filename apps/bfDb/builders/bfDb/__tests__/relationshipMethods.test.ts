#! /usr/bin/env -S bff test
/**
 * Tests for automatically generated relationship methods based on bfNodeSpec
 */

import { assertEquals, assertExists } from "@std/assert";
import { withIsolatedDb } from "@bfmono/apps/bfDb/bfDb.ts";
import { makeLoggedInCv } from "@bfmono/apps/bfDb/utils/testUtils.ts";
import { BfNode, type InferProps } from "@bfmono/apps/bfDb/classes/BfNode.ts";

// Helper type for accessing dynamic relationship methods
// deno-lint-ignore no-explicit-any
type WithRelationshipMethods<T> = T & Record<string, any>;

// Test nodes with relationships defined in bfNodeSpec
class TestAuthor extends BfNode<InferProps<typeof TestAuthor>> {
  static override gqlSpec = this.defineGqlNode((f) =>
    f.string("name").string("bio")
  );

  static override bfNodeSpec = this.defineBfNode((f) =>
    f.string("name").string("bio")
  );
}

class TestBook extends BfNode<InferProps<typeof TestBook>> {
  static override gqlSpec = this.defineGqlNode((f) =>
    f.string("title").string("isbn")
  );

  static override bfNodeSpec = this.defineBfNode((f) =>
    f
      .string("title")
      .string("isbn")
      .one("author", () => TestAuthor)
  );
}

class TestReview extends BfNode<InferProps<typeof TestReview>> {
  static override gqlSpec = this.defineGqlNode((f) =>
    f.int("rating").string("content")
  );

  static override bfNodeSpec = this.defineBfNode((f) =>
    f
      .number("rating")
      .string("content")
      .one("book", () => TestBook)
      .one("reviewer", () => TestAuthor)
  );
}

Deno.test("Generated relationship methods - findRelation", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();

    // Create an author
    const author = await TestAuthor.__DANGEROUS__createUnattached(cv, {
      name: "J.K. Rowling",
      bio: "British author",
    });

    // Create a book linked to the author
    const book = await author.createTargetNode(TestBook, {
      title: "Harry Potter",
      isbn: "978-0-7475-3269-9",
    }, { role: "author" });

    // Test: Book should have findAuthor method
    const bookWithMethods = book as WithRelationshipMethods<typeof book>;
    assertExists(
      bookWithMethods.findAuthor,
      "Book should have findAuthor method",
    );

    // Test: findAuthor should return the linked author
    const foundAuthor = await bookWithMethods.findAuthor();
    assertExists(foundAuthor, "Should find the author");
    assertEquals(foundAuthor.props.name, "J.K. Rowling");
    assertEquals(foundAuthor.metadata.bfGid, author.metadata.bfGid);
  });
});

Deno.test("Generated relationship methods - createRelation", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();

    // Create a book
    const book = await TestBook.__DANGEROUS__createUnattached(cv, {
      title: "The Hobbit",
      isbn: "978-0-547-92822-7",
    });

    // Test: Book should have createAuthor method
    const bookWithMethods = book as WithRelationshipMethods<typeof book>;
    assertExists(
      bookWithMethods.createAuthor,
      "Book should have createAuthor method",
    );

    // Test: createAuthor should create and link a new author
    const author = await bookWithMethods.createAuthor({
      name: "J.R.R. Tolkien",
      bio: "English author",
    });

    assertExists(author, "Should create an author");
    assertEquals(author.props.name, "J.R.R. Tolkien");

    // Verify the relationship was created
    const foundAuthor = await bookWithMethods.findAuthor();
    assertEquals(foundAuthor.metadata.bfGid, author.metadata.bfGid);
  });
});

Deno.test.ignore(
  "Generated relationship methods - deleteRelation",
  async () => {
    // Skipped because BfEdge.delete() is not implemented
    await withIsolatedDb(async () => {
      const cv = makeLoggedInCv();

      // Create an author and book
      const author = await TestAuthor.__DANGEROUS__createUnattached(cv, {
        name: "George Orwell",
        bio: "English novelist",
      });

      const book = await author.createTargetNode(TestBook, {
        title: "1984",
        isbn: "978-0-452-28423-4",
      }, { role: "author" });

      // Test: Book should have deleteAuthor method
      const bookWithMethods = book as WithRelationshipMethods<typeof book>;
      assertExists(
        bookWithMethods.deleteAuthor,
        "Book should have deleteAuthor method",
      );

      // Verify author exists before deletion
      let foundAuthor = await bookWithMethods.findAuthor();
      assertExists(foundAuthor, "Author should exist before deletion");

      // Delete the relationship only (not the node)
      await bookWithMethods.deleteAuthor();

      // Verify relationship is gone
      foundAuthor = await bookWithMethods.findAuthor();
      assertEquals(foundAuthor, null, "Author relationship should be deleted");

      // Verify the author node still exists
      const authorStillExists = await TestAuthor.findX(
        cv,
        author.metadata.bfGid,
      );
      assertExists(authorStillExists, "Author node should still exist");
    });
  },
);

Deno.test.ignore(
  "Generated relationship methods - deleteRelation with deleteNode option",
  async () => {
    // Skipped because BfNode.delete() is not implemented
    await withIsolatedDb(async () => {
      const cv = makeLoggedInCv();

      // Create an author and book
      const author = await TestAuthor.__DANGEROUS__createUnattached(cv, {
        name: "Agatha Christie",
        bio: "English writer",
      });

      const book = await author.createTargetNode(TestBook, {
        title: "Murder on the Orient Express",
        isbn: "978-0-00-711935-9",
      }, { role: "author" });

      // Delete the relationship AND the node
      const bookWithMethods = book as WithRelationshipMethods<typeof book>;
      await bookWithMethods.deleteAuthor({ deleteNode: true });

      // Verify relationship is gone
      const foundAuthor = await bookWithMethods.findAuthor();
      assertEquals(foundAuthor, null, "Author relationship should be deleted");

      // Verify the author node is also deleted
      try {
        await TestAuthor.findX(cv, author.metadata.bfGid);
        throw new Error("Author should have been deleted");
      } catch (error) {
        // Expected - author should not be found
        assertExists(error, "Should throw when author not found");
      }
    });
  },
);

Deno.test("Generated relationship methods - multiple relationships", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();

    // Create test data
    await TestBook.__DANGEROUS__createUnattached(cv, {
      title: "Clean Code",
      isbn: "978-0-13-235088-4",
    });

    await TestAuthor.__DANGEROUS__createUnattached(cv, {
      name: "Tech Reviewer",
      bio: "Software engineer",
    });

    // Create a review with multiple relationships
    const review = await TestReview.__DANGEROUS__createUnattached(cv, {
      rating: 5,
      content: "Excellent book on software craftsmanship",
    });

    // Test: Review should have methods for both relationships
    const reviewWithMethods = review as WithRelationshipMethods<typeof review>;
    assertExists(
      reviewWithMethods.findBook,
      "Review should have findBook method",
    );
    assertExists(
      reviewWithMethods.findReviewer,
      "Review should have findReviewer method",
    );
    assertExists(
      reviewWithMethods.createBook,
      "Review should have createBook method",
    );
    assertExists(
      reviewWithMethods.createReviewer,
      "Review should have createReviewer method",
    );
    assertExists(
      reviewWithMethods.deleteBook,
      "Review should have deleteBook method",
    );
    assertExists(
      reviewWithMethods.deleteReviewer,
      "Review should have deleteReviewer method",
    );

    // Create relationships using generated methods
    await reviewWithMethods.createBook({
      title: "Clean Architecture",
      isbn: "978-0-13-449416-6",
    });

    await reviewWithMethods.createReviewer({
      name: "Another Reviewer",
      bio: "Professional reviewer",
    });

    // Verify both relationships work
    const foundBook = await reviewWithMethods.findBook();
    const foundReviewer = await reviewWithMethods.findReviewer();

    assertExists(foundBook, "Should find book");
    assertExists(foundReviewer, "Should find reviewer");
    assertEquals(foundBook.props.title, "Clean Architecture");
    assertEquals(foundReviewer.props.name, "Another Reviewer");
  });
});

Deno.test("Generated relationship methods - no relationships defined", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();

    // TestAuthor has no relationships defined
    const author = await TestAuthor.__DANGEROUS__createUnattached(cv, {
      name: "No Relations",
      bio: "Lonely author",
    });

    // Should not have any relationship methods
    const authorWithMethods = author as WithRelationshipMethods<typeof author>;
    assertEquals(
      authorWithMethods.findBook,
      undefined,
      "Should not have findBook",
    );
    assertEquals(
      authorWithMethods.createBook,
      undefined,
      "Should not have createBook",
    );
    assertEquals(
      authorWithMethods.deleteBook,
      undefined,
      "Should not have deleteBook",
    );
  });
});
