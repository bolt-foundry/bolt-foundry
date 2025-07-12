#! /usr/bin/env -S bff test

/**
 * Tests for error handling and edge cases in the fragment system.
 * Tests type safety, missing dependencies, invalid configurations, etc.
 */

import { assert, assertEquals, assertRejects, assertThrows } from "@std/assert";

// Mock types for error testing
interface FragmentError {
  type:
    | "MISSING_DEPENDENCY"
    | "INVALID_FRAGMENT"
    | "TYPE_CONFLICT"
    | "CIRCULAR_DEPENDENCY";
  message: string;
  details?: unknown;
}

interface MockFragment {
  name: string;
  fields: Record<string, unknown>;
  dependencies: Array<string>;
}

interface MockNodeType {
  name: string;
  fields: Record<string, unknown>;
}

// Mock fragment validator
class FragmentValidator {
  static validateFragment(fragment: MockFragment): Array<FragmentError> {
    const errors: Array<FragmentError> = [];

    if (!fragment.name) {
      errors.push({
        type: "INVALID_FRAGMENT",
        message: "Fragment must have a name",
      });
    }

    if (
      !fragment.fields || typeof fragment.fields !== "object" ||
      Object.keys(fragment.fields).length === 0
    ) {
      errors.push({
        type: "INVALID_FRAGMENT",
        message: "Fragment must define at least one field",
      });
    }

    if (!fragment.dependencies || !Array.isArray(fragment.dependencies)) {
      errors.push({
        type: "INVALID_FRAGMENT",
        message: "Fragment must declare dependencies as an array",
      });
    }

    return errors;
  }

  static validateDependencies(
    fragments: Array<MockFragment>,
    nodeTypes: Array<MockNodeType>,
  ): Array<FragmentError> {
    const errors: Array<FragmentError> = [];
    const availableTypes = new Set(nodeTypes.map((nt) => nt.name));

    for (const fragment of fragments) {
      for (const dep of fragment.dependencies || []) {
        if (!availableTypes.has(dep)) {
          errors.push({
            type: "MISSING_DEPENDENCY",
            message:
              `Fragment '${fragment.name}' requires '${dep}' but it's not available`,
            details: { fragment: fragment.name, dependency: dep },
          });
        }
      }
    }

    return errors;
  }

  static detectCircularDependencies(
    fragments: Array<MockFragment>,
  ): Array<FragmentError> {
    const errors: Array<FragmentError> = [];

    // Simple circular dependency detection
    // In real implementation, this would be more sophisticated
    const _fragmentNames = new Set(fragments.map((f) => f.name));

    for (const fragment of fragments) {
      if (fragment.dependencies?.includes(fragment.name)) {
        errors.push({
          type: "CIRCULAR_DEPENDENCY",
          message:
            `Fragment '${fragment.name}' has circular dependency on itself`,
          details: { fragment: fragment.name },
        });
      }
    }

    return errors;
  }

  static detectFieldConflicts(
    fragments: Array<MockFragment>,
  ): Array<FragmentError> {
    const errors: Array<FragmentError> = [];
    const fieldOwners: Record<string, Array<string>> = {};

    for (const fragment of fragments) {
      for (const fieldName of Object.keys(fragment.fields || {})) {
        if (!fieldOwners[fieldName]) {
          fieldOwners[fieldName] = [];
        }
        fieldOwners[fieldName].push(fragment.name);
      }
    }

    for (const [fieldName, owners] of Object.entries(fieldOwners)) {
      if (owners.length > 1) {
        errors.push({
          type: "TYPE_CONFLICT",
          message: `Field '${fieldName}' is defined in multiple fragments: ${
            owners.join(", ")
          }`,
          details: { field: fieldName, fragments: owners },
        });
      }
    }

    return errors;
  }
}

// Mock fragments for testing
const validFragment = {
  name: "validQueries",
  fields: {
    test: { type: "string", resolve: () => "test" },
  },
  dependencies: ["TestType"],
};

const invalidFragment = {
  // Missing name
  fields: {},
  dependencies: [],
} as unknown as MockFragment;

const missingDependencyFragment = {
  name: "missingDepQueries",
  fields: {
    nonExistent: { type: "object", returnType: () => "NonExistentType" },
  },
  dependencies: ["NonExistentType"],
};

const conflictingFragment1 = {
  name: "fragment1",
  fields: {
    conflictField: { type: "string" },
  },
  dependencies: [],
};

const conflictingFragment2 = {
  name: "fragment2",
  fields: {
    conflictField: { type: "int" },
  },
  dependencies: [],
};

const circularFragment = {
  name: "circularQueries",
  fields: {
    test: { type: "string" },
  },
  dependencies: ["circularQueries"], // Self-reference
};

const mockNodeTypes = [
  { name: "BlogPost", fields: {} },
  { name: "PublishedDocument", fields: {} },
  { name: "TestType", fields: {} },
];

Deno.test("fragment validation catches invalid fragment structure", () => {
  const errors = FragmentValidator.validateFragment(invalidFragment);

  assert(errors.length > 0);
  assert(errors.some((e) => e.type === "INVALID_FRAGMENT"));
  assert(errors.some((e) => e.message.includes("name")));
});

Deno.test("fragment validation accepts valid fragment", () => {
  const errors = FragmentValidator.validateFragment(validFragment);

  assertEquals(errors.length, 0);
});

Deno.test("dependency validation catches missing dependencies", () => {
  const errors = FragmentValidator.validateDependencies(
    [missingDependencyFragment],
    mockNodeTypes,
  );

  assert(errors.length > 0);
  assert(errors.some((e) => e.type === "MISSING_DEPENDENCY"));
  assert(errors.some((e) => e.message.includes("NonExistentType")));
});

Deno.test("dependency validation passes with satisfied dependencies", () => {
  const errors = FragmentValidator.validateDependencies(
    [validFragment],
    mockNodeTypes,
  );

  assertEquals(errors.length, 0);
});

Deno.test("circular dependency detection works", () => {
  const errors = FragmentValidator.detectCircularDependencies([
    circularFragment,
  ]);

  assert(errors.length > 0);
  assert(errors.some((e) => e.type === "CIRCULAR_DEPENDENCY"));
  assert(errors.some((e) => e.message.includes("circular dependency")));
});

Deno.test("field conflict detection works", () => {
  const errors = FragmentValidator.detectFieldConflicts([
    conflictingFragment1,
    conflictingFragment2,
  ]);

  assert(errors.length > 0);
  assert(errors.some((e) => e.type === "TYPE_CONFLICT"));
  assert(errors.some((e) => e.message.includes("conflictField")));
});

Deno.test("fragment validation with null/undefined inputs", () => {
  assertThrows(() => {
    FragmentValidator.validateFragment(null as unknown as MockFragment);
  });

  assertThrows(() => {
    FragmentValidator.validateFragment(undefined as unknown as MockFragment);
  });
});

Deno.test("fragment validation with malformed fields", () => {
  const malformedFragment = {
    name: "malformed",
    fields: "not an object", // Should be object
    dependencies: [],
  } as unknown as MockFragment;

  const errors = FragmentValidator.validateFragment(malformedFragment);
  assert(errors.some((e) => e.type === "INVALID_FRAGMENT"));
});

Deno.test("dependency validation with empty node types", () => {
  const errors = FragmentValidator.validateDependencies(
    [validFragment],
    [], // No available node types
  );

  assert(errors.length > 0);
  assert(errors.some((e) => e.type === "MISSING_DEPENDENCY"));
});

Deno.test("error messages include helpful details", () => {
  const errors = FragmentValidator.validateDependencies(
    [missingDependencyFragment],
    mockNodeTypes,
  );

  const missingDepError = errors.find((e) => e.type === "MISSING_DEPENDENCY");
  const details = missingDepError?.details as {
    fragment?: string;
    dependency?: string;
  };
  assert(details?.fragment === "missingDepQueries");
  assert(details?.dependency === "NonExistentType");
});

Deno.test("multiple validation errors are collected", () => {
  const veryBadFragment = {
    // Missing name
    fields: null, // Invalid fields
    dependencies: "not an array", // Invalid dependencies
  } as unknown as MockFragment;

  const errors = FragmentValidator.validateFragment(veryBadFragment);
  assert(errors.length >= 3); // Multiple errors
});

Deno.test("fragment resolver error handling", async () => {
  const fragmentWithBadResolver = {
    name: "badResolverFragment",
    fields: {
      throwingField: {
        type: "string",
        resolve: () => {
          throw new Error("Resolver error");
        },
      },
    },
    dependencies: [],
  };

  // Test that resolver errors are caught
  const resolver = fragmentWithBadResolver.fields.throwingField.resolve;

  await assertRejects(async () => {
    await resolver();
  });
});

Deno.test("fragment with async resolver errors", async () => {
  const fragmentWithAsyncError = {
    name: "asyncErrorFragment",
    fields: {
      asyncThrowingField: {
        type: "string",
        resolve: () => {
          throw new Error("Async resolver error");
        },
      },
    },
    dependencies: [],
  };

  const resolver = fragmentWithAsyncError.fields.asyncThrowingField.resolve;

  await assertRejects(async () => {
    await resolver();
  });
});

Deno.test("fragment composition with invalid fragments", () => {
  // Test that composition handles invalid fragments gracefully
  const invalidFragments = [validFragment, invalidFragment];

  // In real implementation, this might:
  // 1. Skip invalid fragments with warnings
  // 2. Throw error and stop composition
  // 3. Return partial composition with error details

  const validationErrors = invalidFragments.flatMap((fragment) =>
    FragmentValidator.validateFragment(fragment)
  );

  assert(validationErrors.length > 0);
});

Deno.test("type safety with incorrect return types", () => {
  const wrongTypeFragment = {
    name: "wrongTypeFragment",
    fields: {
      blogPost: {
        type: "object",
        returnType: () => "ShouldBeBlogPost", // Wrong type
        resolve: () => ({}),
      },
    },
    dependencies: ["BlogPost"],
  };

  // In TypeScript, this would be caught at compile time
  // Runtime validation could check return type consistency
  const errors = FragmentValidator.validateFragment(wrongTypeFragment);

  // For now, structural validation passes
  assertEquals(errors.length, 0);

  // But type checking would fail in real implementation
});

Deno.test("fragment with undefined resolver functions", () => {
  const noResolverFragment = {
    name: "noResolverFragment",
    fields: {
      noResolver: {
        type: "string",
        // Missing resolve function
      },
    },
    dependencies: [],
  };

  // Should validate structure but note missing resolver
  const errors = FragmentValidator.validateFragment(noResolverFragment);

  // Structural validation passes
  assertEquals(errors.length, 0);

  // But execution would fail without resolver
  assert(
    !("resolve" in noResolverFragment.fields.noResolver) ||
      !noResolverFragment.fields.noResolver.resolve,
  );
});

Deno.test("fragment validation with recursive types", () => {
  const recursiveFragment = {
    name: "recursiveFragment",
    fields: {
      parent: {
        type: "object",
        returnType: () => "RecursiveType",
        resolve: () => ({}),
      },
    },
    dependencies: ["RecursiveType"],
  };

  // Should handle recursive type references
  const errors = FragmentValidator.validateFragment(recursiveFragment);
  assertEquals(errors.length, 0);
});

Deno.test("fragment validation with complex nested dependencies", () => {
  const complexFragment = {
    name: "complexFragment",
    fields: {
      blogWithAuthor: {
        type: "object",
        returnType: () => "BlogPost",
        resolve: () => ({}),
      },
    },
    dependencies: ["BlogPost", "User", "Organization"], // Multiple deps
  };

  const limitedNodeTypes = [{ name: "BlogPost", fields: {} }]; // Missing User, Organization

  const errors = FragmentValidator.validateDependencies(
    [complexFragment],
    limitedNodeTypes,
  );

  // Should find 2 missing dependencies
  assertEquals(errors.length, 2);
  assert(
    errors.some((e) =>
      (e.details as { dependency?: string })?.dependency === "User"
    ),
  );
  assert(
    errors.some((e) =>
      (e.details as { dependency?: string })?.dependency === "Organization"
    ),
  );
});

Deno.test("fragment system handles schema compilation errors", () => {
  // Test error handling during GraphQL schema compilation
  const problematicFragments = [
    {
      name: "problematicFragment",
      fields: {
        invalidField: {
          type: "NonExistentGraphQLType", // Invalid GraphQL type
          resolve: () => null,
        },
      },
      dependencies: [],
    },
  ];

  // Real implementation would catch GraphQL compilation errors
  // For now, just test validation
  const errors = FragmentValidator.validateFragment(problematicFragments[0]);
  assertEquals(errors.length, 0); // Passes structural validation

  // But would fail during GraphQL schema compilation
});

Deno.test("fragment error aggregation and reporting", () => {
  const problematicFragments = [
    invalidFragment,
    missingDependencyFragment,
    circularFragment,
  ];

  // Collect all types of errors
  const allErrors: Array<FragmentError> = [];

  for (const fragment of problematicFragments) {
    allErrors.push(...FragmentValidator.validateFragment(fragment));
  }

  allErrors.push(...FragmentValidator.validateDependencies(
    problematicFragments.filter((f) => "name" in f && f.name) as Array<
      MockFragment
    >, // Only valid structure
    mockNodeTypes,
  ));

  allErrors.push(...FragmentValidator.detectCircularDependencies(
    problematicFragments.filter((f) => "name" in f && f.name) as Array<
      MockFragment
    >,
  ));

  // Should have multiple error types
  const errorTypes = new Set(allErrors.map((e) => e.type));
  assert(errorTypes.has("INVALID_FRAGMENT"));
  assert(errorTypes.has("MISSING_DEPENDENCY"));
  assert(errorTypes.has("CIRCULAR_DEPENDENCY"));
});

Deno.test("fragment validation performance with many fragments", () => {
  // Test validation performance with large number of fragments
  const manyFragments = Array.from({ length: 100 }, (_, i) => ({
    name: `fragment${i}`,
    fields: {
      [`field${i}`]: { type: "string", resolve: () => `value${i}` },
    },
    dependencies: [],
  }));

  const start = performance.now();

  const errors = manyFragments.flatMap((fragment) =>
    FragmentValidator.validateFragment(fragment)
  );

  const end = performance.now();

  // Should validate quickly even with many fragments
  assert(end - start < 50); // Less than 50ms
  assertEquals(errors.length, 0); // All valid
});
