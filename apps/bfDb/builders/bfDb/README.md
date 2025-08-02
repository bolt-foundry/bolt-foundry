# BfDb -- the Bolt Foundry data model layer

Having stable infra on which to build means we can build better things faster.
Our data layer has a few main principles:

1. Configuring models through builders is better than configuring them through
   text / regular code.
2. Graphql is a distinct path from our backend code.
3. It should be trivial and free to add or remove models.
4. It should be extremly simple to test any model in isolation.
5. Relationships between models should be declarative and automatically generate
   typed methods.

## Automatic Relationship Methods

When you define relationships in your BfNode using the field builder, you
automatically get typed methods for managing those relationships.

### Defining Relationships

```typescript
class BfBook extends BfNode<{ title: string; isbn: string }> {
  static override bfNodeSpec = this.defineBfNode((f) =>
    f
      .string("title")
      .string("isbn")
      .one("author", () => BfAuthor) // One-to-one relationship
      .many("reviews", () => BfReview) // One-to-many relationship
  );
}
```

### Generated Methods for .one() Relationships

For each `.one()` relationship, you automatically get these methods:

#### find{RelationName}()

Find the related node. Returns `null` if not found.

```typescript
const book = await BfBook.findX(cv, bookId);
const author = await book.findAuthor(); // Returns BfAuthor | null
```

#### findX{RelationName}()

Find the related node. Throws `NotFoundError` if not found.

```typescript
const author = await book.findXAuthor(); // Returns BfAuthor or throws
```

#### create{RelationName}(props)

Create a new related node and link it.

```typescript
const author = await book.createAuthor({
  name: "Jane Doe",
  bio: "Bestselling author",
});
```

#### unlink{RelationName}()

Remove the relationship (deletes the edge only, not the related node).

```typescript
await book.unlinkAuthor(); // Removes the edge between book and author
```

#### delete{RelationName}()

Delete both the relationship and the related node.

```typescript
await book.deleteAuthor(); // Deletes the edge AND the author node
```

### Best Practices

1. **Use findX methods when the relationship is required**
   ```typescript
   // Good - throws if author is missing
   const author = await book.findXAuthor();

   // Less ideal - need to handle null case
   const author = await book.findAuthor();
   if (!author) {
     // Handle missing author
   }
   ```

2. **Choose between unlink and delete carefully**
   - Use `unlink` when you want to break the relationship but keep both nodes
   - Use `delete` when you want to remove the related node entirely

3. **Error handling**
   ```typescript
   try {
     const author = await book.findXAuthor();
   } catch (e) {
     if (e instanceof NotFoundError) {
       // Handle missing author
     }
     throw e;
   }
   ```

### GraphQL Integration

When using `defineGqlNodeWithRelations`, your GraphQL schema automatically
includes fields for relationships:

```typescript
class BfBook extends BfNode<{ title: string; isbn: string }> {
  static override gqlSpec = this.defineGqlNodeWithRelations((gql) =>
    gql.string("title").string("isbn")
  );

  static override bfNodeSpec = this.defineBfNode((f) =>
    f.string("title").string("isbn").one("author", () => BfAuthor)
  );
}
```

This automatically adds an `author` field to your GraphQL type that resolves the
relationship.

### Migration from createTargetNode

The `createTargetNode` method is now protected and should not be used directly.
Instead, use the generated relationship methods:

```typescript
// ❌ Old way - no longer allowed
const author = await book.createTargetNode(BfAuthor, {
  name: "Jane Doe",
});

// ✅ New way - type-safe and cleaner
const author = await book.createAuthor({
  name: "Jane Doe",
});
```
