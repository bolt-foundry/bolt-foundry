/* -------------------------------------------------------------------------- */
/*  IMPORTS & SHARED TYPES                                                    */
/* -------------------------------------------------------------------------- */

import type { GraphQLInputType, GraphQLResolveInfo } from "graphql";
import type { Connection, ConnectionArguments } from "graphql-relay";
import type { BfGraphqlContext } from "apps/bfDb/graphql/graphqlContext.ts";
import type { AnyBfNodeCtor } from "apps/bfDb/builders/bfDb/types.ts";

type ThisNode = InstanceType<AnyBfNodeCtor>;
export type MaybePromise<T> = T | Promise<T>;

type ArgBuilder<
  S extends Record<string, unknown> = {},   // ← the running shape
> = {
  /* scalar helpers ─────────────────────────────────────────────────── */
  string <N extends string>(name: N): ArgBuilder<S & { [K in N]: string }>;
  int    <N extends string>(name: N): ArgBuilder<S & { [K in N]: number }>;
  float  <N extends string>(name: N): ArgBuilder<S & { [K in N]: number }>;
  boolean<N extends string>(name: N): ArgBuilder<S & { [K in N]: boolean }>;
  id     <N extends string>(name: N): ArgBuilder<S & { [K in N]: string }>;

  /* .nonNull just re-uses the same compile-time mapping                */
  nonNull: {
    string <N extends string>(name: N): ArgBuilder<S & { [K in N]: string }>;
    int    <N extends string>(name: N): ArgBuilder<S & { [K in N]: number }>;
    float  <N extends string>(name: N): ArgBuilder<S & { [K in N]: number }>;
    boolean<N extends string>(name: N): ArgBuilder<S & { [K in N]: boolean }>;
    id     <N extends string>(name: N): ArgBuilder<S & { [K in N]: string }>;
  };

  /** 👈 makes the accumulated spec available to the outer builder  */
  readonly _spec: S;
};

export type ArgsSpec =
  | Record<string, GraphQLInputType>
  | ((ab: ArgBuilder) => Record<string, GraphQLInputType>)
  | ((ab: ArgBuilder) => ArgBuilder);

/* -------------------------------------------------------------------------- */
/*  FIELD / MUTATION OPTION SHAPES                                            */
/* -------------------------------------------------------------------------- */

interface BaseFieldOpts<Return> {
  args?: ArgsSpec;
  nonNull?: boolean;
  resolve?: (
    root: ThisNode,
    args: Record<string, unknown>,
    ctx: BfGraphqlContext,
    info: GraphQLResolveInfo,
  ) => MaybePromise<Return>;
}

interface ConnectionOpts {
  additionalArgs?: ArgsSpec;
  resolve?: (
    root: ThisNode,
    args: ConnectionArguments & Record<string, unknown>,
    ctx: BfGraphqlContext,
    info: GraphQLResolveInfo,
  ) => MaybePromise<Connection<ThisNode>>;
}

interface MutationOpts<A extends Record<string, unknown> = Record<string, unknown>> {
  args?:    ArgsSpec;
  returns?: unknown;
  resolve?: (
    root: ThisNode,
    args: A,                              // ← precise!
    ctx:  BfGraphqlContext,
    info: GraphQLResolveInfo,
  ) => MaybePromise<Record<string, unknown>>;
}

type PublicNonNull = Pick<
  GqlBuilderImpl,
  "string" | "int" | "float" | "boolean" | "id" | "object"
> & { _spec: GqlNodeSpec };   // <- add _spec back in

/* -------------------------------------------------------------------------- */
/*  SPEC OBJECT (what callers eventually consume)                             */
/* -------------------------------------------------------------------------- */

export interface GqlNodeSpec {
  fields: Record<string, unknown>;
  relations: Record<string, unknown>;
  mutations: Record<string, MutationOpts>;
}

/* -------------------------------------------------------------------------- */
/*  INTERNAL HELPERS                                                          */
/* -------------------------------------------------------------------------- */

/** Generates scalar / object field-builder methods (“string”, “int”, …).     *
 *  NOTE: `this` is deliberately typed as `any` so calls on the *public*      *
 *  `GqlBuilder` (which omits `_addMutation`) still satisfy the signature.    */
type WithSpec = { _spec: GqlNodeSpec };

/** Strongly-typed scalar / object field builder */
function makeFieldMethod<T>(typeName: string) {
  return function <Self extends WithSpec>(
    this: Self,
    name: string,
    opts: BaseFieldOpts<T> = {},
  ): Self {
    this._spec.fields[name] = { type: typeName, ...opts };
    return this;
  };
}


/** Helper that wraps a field-builder so `.nonNull.<type>()` works.           */
function addNonNull<
  F extends (name: string, opts?: Record<string, unknown>) => WithSpec,
>(fn: F): F {
  return ((
    name: Parameters<F>[0],
    opts: Parameters<F>[1] = {} as Parameters<F>[1],
  ) => fn(name, { ...(opts ?? {}), nonNull: true })) as F;
}

/* -------------------------------------------------------------------------- */
/*  IMPLEMENTATION                                                            */
/* -------------------------------------------------------------------------- */

class GqlBuilderImpl {
  /* Spec backing store                                                       */
  readonly _spec: GqlNodeSpec = { fields: {}, relations: {}, mutations: {} };

  private _addMutation = <A extends Record<string, unknown>>(
    name: string,
    value: MutationOpts<A>,
  ): this => {
    // NB: we intentionally erase the generic here so heterogeneous
    //     payload shapes can coexist in `_spec.mutations` without
    //     fighting the invariance of interface type-parameters.
    this._spec.mutations[name] = value as MutationOpts<Record<string, unknown>>;
    return this;
  };


  /* Scalar / object fields                                                   */
  string = makeFieldMethod<string>("String");
  int = makeFieldMethod<number>("Int");
  float = makeFieldMethod<number>("Float");
  boolean = makeFieldMethod<boolean>("Boolean");
  id = makeFieldMethod<string>("ID");
  object = makeFieldMethod<unknown>("Object");

  /* Connection helper                                                        */
  connection(
    name: string,
    opts: ConnectionOpts = {},
  ): this {
    this._spec.fields[name] = { type: "Connection", ...opts };
    return this;
  }

  mutation<
    // deno-lint-ignore no-explicit-any
    B extends ArgBuilder<any>,
    A extends Record<string, unknown> = B["_spec"],
  >(
    name: string,
    opts: Omit<MutationOpts<A>, "args"> & {
      args: (ab: ArgBuilder) => B;
    },
  ): this;

  // 2) args supplied as a *builder instance* directly
  mutation<
    B extends ArgBuilder<any>,
    A extends Record<string, unknown> = B["_spec"],
  >(
    name: string,
    opts: Omit<MutationOpts<A>, "args"> & {
      args: B;
    },
  ): this;

  // 3) fallback for a plain { [id]: GraphQLInputType }
  mutation<
    A extends Record<string, unknown>,
  >(
    name: string,
    opts: Omit<MutationOpts<A>, "args"> & {
      args: Record<keyof A, GraphQLInputType>;
    },
  ): this;
  
  /* Mutation helper                                                          */
  mutation<A extends Record<string, unknown>>(
    name: string,
    opts: MutationOpts<A>,         // passes through your arg-shape
  ): this {
    this._addMutation(name, opts);
    return this;
  }


  /* .nonNull shorthand                                                       */
  readonly nonNull = {
    string:  addNonNull(this.string.bind(this)),
    int:     addNonNull(this.int.bind(this)),
    float:   addNonNull(this.float.bind(this)),
    boolean: addNonNull(this.boolean.bind(this)),
    id:      addNonNull(this.id.bind(this)),
    object:  addNonNull(this.object.bind(this)),
    _spec:   this._spec,
  } as PublicNonNull;
}

/* -------------------------------------------------------------------------- */
/*  PUBLIC API                                                                */
/* -------------------------------------------------------------------------- */

/**
 *  The public builder surface. We expose `_spec` (read-only) because a few
 *  downstream helpers and tests reference it directly, but we keep `_addMutation`
 *  private so callers can’t mutate the spec except through the DSL.
 */
export type GqlBuilder = Omit<GqlBuilderImpl, "_addMutation">;

/** Entry-point — returns a fresh, fully-typed builder instance               */
export function makeGqlBuilder(): GqlBuilder {
  return new GqlBuilderImpl();
}
