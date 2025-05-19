/**
 * Returns builder for defining mutation return types inline with type inference
 * Similar to ArgsBuilder but for building return payload types
 */

import type { ReturnFieldDef } from "./types/returnTypes.ts";

// Type that accumulates the shape as we build
export type ReturnShape<R extends Record<string, unknown>> = R;

// Builder interface that tracks type as we build
// deno-lint-ignore ban-types
export interface ReturnsBuilder<R extends Record<string, unknown> = {}> {
  string<K extends string>(
    name: K,
  ): ReturnsBuilder<R & { [key in K]?: string }>;

  int<K extends string>(
    name: K,
  ): ReturnsBuilder<R & { [key in K]?: number }>;

  boolean<K extends string>(
    name: K,
  ): ReturnsBuilder<R & { [key in K]?: boolean }>;

  id<K extends string>(
    name: K,
  ): ReturnsBuilder<R & { [key in K]?: string }>;

  nonNull: NonNullReturnsBuilder<R>;

  _spec: ReturnSpec;
}

// NonNull version that makes fields required
// deno-lint-ignore ban-types
export interface NonNullReturnsBuilder<R extends Record<string, unknown> = {}> {
  string<K extends string>(
    name: K,
  ): ReturnsBuilder<R & { [key in K]: string }>;

  int<K extends string>(
    name: K,
  ): ReturnsBuilder<R & { [key in K]: number }>;

  boolean<K extends string>(
    name: K,
  ): ReturnsBuilder<R & { [key in K]: boolean }>;

  id<K extends string>(
    name: K,
  ): ReturnsBuilder<R & { [key in K]: string }>;
}

// Spec that stores field definitions
export interface ReturnSpec {
  fields: Record<string, ReturnFieldDef>;
}

/**
 * Creates a returns builder for defining mutation return types
 */
export function makeReturnsBuilder<
  // deno-lint-ignore ban-types
  R extends Record<string, unknown> = {},
>(): ReturnsBuilder<R> {
  const spec: ReturnSpec = {
    fields: {},
  };

  const builder: ReturnsBuilder<R> = {
    string(name) {
      spec.fields[name] = { type: "String", nonNull: false };
      return builder as ReturnsBuilder<R & { [key in typeof name]?: string }>;
    },

    int(name) {
      spec.fields[name] = { type: "Int", nonNull: false };
      return builder as ReturnsBuilder<R & { [key in typeof name]?: number }>;
    },

    boolean(name) {
      spec.fields[name] = { type: "Boolean", nonNull: false };
      return builder as ReturnsBuilder<R & { [key in typeof name]?: boolean }>;
    },

    id(name) {
      spec.fields[name] = { type: "ID", nonNull: false };
      return builder as ReturnsBuilder<R & { [key in typeof name]?: string }>;
    },

    get nonNull() {
      const nonNullBuilder: NonNullReturnsBuilder<R> = {
        string(name) {
          spec.fields[name] = { type: "String", nonNull: true };
          return builder as ReturnsBuilder<
            R & { [key in typeof name]: string }
          >;
        },

        int(name) {
          spec.fields[name] = { type: "Int", nonNull: true };
          return builder as ReturnsBuilder<
            R & { [key in typeof name]: number }
          >;
        },

        boolean(name) {
          spec.fields[name] = { type: "Boolean", nonNull: true };
          return builder as ReturnsBuilder<
            R & { [key in typeof name]: boolean }
          >;
        },

        id(name) {
          spec.fields[name] = { type: "ID", nonNull: true };
          return builder as ReturnsBuilder<
            R & { [key in typeof name]: string }
          >;
        },
      };

      return nonNullBuilder;
    },

    _spec: spec,
  };

  return builder;
}
