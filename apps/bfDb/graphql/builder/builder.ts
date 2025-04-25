// apps/bfDb/graphql/builder/builder.ts – complete implementation matching test suite
// deno-lint-ignore-file no-explicit-any
import type {
  BfMetadataBase,
  BfNodeBase,
  BfNodeBaseProps,
} from "apps/bfDb/classes/BfNodeBase.ts";
import type { BfEdgeBaseProps } from "apps/bfDb/classes/BfEdgeBase.ts";
import type { BfGraphqlContext } from "apps/bfDb/graphql/graphqlContext.ts";
import type { GraphQLObjectBase } from "apps/bfDb/graphql/GraphQLObjectBase.ts";

/* -------------------------------------------------------------------------- */
/*  Scalars & helpers                                                         */
/* -------------------------------------------------------------------------- */

export type GqlScalar =
  | "id"
  | "BfGID"
  | "string"
  | "int"
  | "float"
  | "boolean"
  | "json";

export enum Direction {
  OUT = "OUT",
  IN = "IN",
}

/* -------------------------------------------------------------------------- */
/*  Core model helper types                                                   */
/* -------------------------------------------------------------------------- */

export type AnyBfNodeCtor<
  TProps extends BfNodeBaseProps = BfNodeBaseProps,
  TMetadata extends BfMetadataBase = BfMetadataBase,
  TEdgeProps extends BfEdgeBaseProps = BfEdgeBaseProps,
> = typeof BfNodeBase<TProps, TMetadata, TEdgeProps>;

export type AnyGqlObjectCtor = abstract new (
  ...args: never[]
) => GraphQLObjectBase & { // static side guarantees
  gqlSpec?: GqlNodeSpec | null;
  __typename: string;
};

type AnyArgs = Record<string, unknown>;

/* -------------------------------------------------------------------------- */
/*  Field builder DSL                                                        */
/* -------------------------------------------------------------------------- */

export interface FieldSpec {
  type: GqlScalar | "object";
  target?: () => AnyGqlObjectCtor; // ⬅ for object fields
  nullable: boolean;
  args?: Record<string, ArgSpec>;
  resolve?: (
    src: GraphQLObjectBase,
    args: unknown,
    ctx: BfGraphqlContext,
  ) => unknown | Promise<unknown>;
}

export type ArgSpec = { type: GqlScalar; nullable: boolean };

export type InferArgs<F> = F extends (...args: any[]) => ArgBuilder<infer T> ? T
  : Record<string, never>;

/* -------------------------------------------------------------------------- */
/*  collectArgs – stores runtime spec *and* preserves compile-time type       */
/* -------------------------------------------------------------------------- */
export function collectArgs<
  F extends ((a: ArgBuilder<any>) => any) | void | undefined,
>(fn?: F): Record<string, ArgSpec> | undefined {
  if (!fn) return undefined;

  const store: Record<string, ArgSpec> = {};
  const add = (type: GqlScalar) =>
  (
    name: string,
    nullable = true,
  ) => (store[name] = { type, nullable }, proxy);

  /* 1.  Concrete scalar helpers ------------------------------------------- */
  const base = {
    id: add("id"),
    string: add("string"),
    int: add("int"),
    float: add("float"),
    boolean: add("boolean"),
    json: add("json"),
  } as const;

  /* 2.  Proxy to implement `.nonNull.…()` sugar --------------------------- */
  let flagNonNull = false;
  const proxy: ArgBuilder = new Proxy(base as unknown as ArgBuilder, {
    get(t, prop) {
      if (prop === "nonNull") {
        flagNonNull = true;
        return proxy;
      }
      if (prop in t) {
        const fn = (t as any)[prop];
        return (name: string) => {
          const res = fn(name, /* nullable = */ !flagNonNull);
          flagNonNull = false;
          return res;
        };
      }
      return (t as any)[prop];
    },
  });

  /* 3.  Execute user callback (ignoring its return value) ----------------- */
  (fn as any)(proxy);
  return store;
}

// ---------------------------------------------------------------------------
//  ArgBuilder – carries an accumulating generic state `T`
// ---------------------------------------------------------------------------
export type ArgBuilder<T = AnyArgs> = {
  /* nullable scalars (default) */
  id<N extends string>(name: N): ArgBuilder<T & { [K in N]?: string }>;
  string<N extends string>(name: N): ArgBuilder<T & { [K in N]?: string }>;
  int<N extends string>(name: N): ArgBuilder<T & { [K in N]?: number }>;
  float<N extends string>(name: N): ArgBuilder<T & { [K in N]?: number }>;
  boolean<N extends string>(name: N): ArgBuilder<T & { [K in N]?: boolean }>;
  json<N extends string>(name: N): ArgBuilder<T & { [K in N]?: unknown }>;

  /* chain-once wrapper that flips the next call to non-nullable */
  nonNull: {
    id<N extends string>(name: N): ArgBuilder<T & { [K in N]: string }>;
    string<N extends string>(name: N): ArgBuilder<T & { [K in N]: string }>;
    int<N extends string>(name: N): ArgBuilder<T & { [K in N]: number }>;
    float<N extends string>(name: N): ArgBuilder<T & { [K in N]: number }>;
    boolean<N extends string>(name: N): ArgBuilder<T & { [K in N]: boolean }>;
    json<N extends string>(name: N): ArgBuilder<T & { [K in N]: unknown }>;
  };
};

// export interface ArgBuilder {
//   id(name: string): ArgBuilder;
//   string(name: string): ArgBuilder;
//   int(name: string): ArgBuilder;
//   float(name: string): ArgBuilder;
//   boolean(name: string): ArgBuilder;
//   json(name: string): ArgBuilder;
//   readonly nonNull: ArgBuilder;
// }

type FieldArgsOrOpts<Res extends FieldSpec["resolve"] | undefined> =
  | Res // legacy (name, resolve)
  | Record<string, ArgSpec> // legacy (name, args, resolve?)
  | {
    args?: ((a: ArgBuilder) => void) | Record<string, ArgSpec>;
    resolve?: FieldSpec["resolve"];
  };

export type AddFieldFn<Name extends string> = <
  Res extends FieldSpec["resolve"] | undefined = undefined,
>(
  name: Name,
  argsOrOpts?: FieldArgsOrOpts<Res>,
  maybeRes?: Res,
) => FieldBuilder;

export type AddObjectFieldFn<Name extends string> = (
  name: Name,
  target: () => AnyGqlObjectCtor,
  opts?: {
    args?: ((a: ArgBuilder) => void) | Record<string, ArgSpec>;
    resolve?: FieldSpec["resolve"]; // ← concrete type
  },
) => FieldBuilder;

export interface FieldBuilder {
  id: AddFieldFn<string>;
  string: AddFieldFn<string>;
  int: AddFieldFn<string>;
  float: AddFieldFn<string>;
  boolean: AddFieldFn<string>;
  json: AddFieldFn<string>;
  object: AddObjectFieldFn<string>;
  nonNull: {
    id: AddFieldFn<string>;
    string: AddFieldFn<string>;
    int: AddFieldFn<string>;
    float: AddFieldFn<string>;
    boolean: AddFieldFn<string>;
    json: AddFieldFn<string>;
    object: AddObjectFieldFn<string>;
  };
}

function buildField(store: Record<string, FieldSpec>): FieldBuilder {
  type Res = FieldSpec["resolve"];

  function save(
    name: string,
    type: GqlScalar,
    nullable: boolean,
    args?: Record<string, ArgSpec>,
    resolve?: Res,
  ) {
    store[name] = { type, nullable, args, resolve };
    return api;
  }

  function parseArgsAndResolve(
    argOrOpts?: FieldArgsOrOpts<Res>,
    maybeRes?: Res,
  ): { args?: Record<string, ArgSpec>; resolve?: Res } {
    let args: Record<string, ArgSpec> | undefined;
    let resolve: Res | undefined;

    if (typeof argOrOpts === "function" && !maybeRes) {
      // legacy (name, resolve)
      resolve = argOrOpts as Res;
    } else if (
      argOrOpts && typeof argOrOpts === "object" && !Array.isArray(argOrOpts)
    ) {
      // bag or legacy (name, args, resolve)
      const bag = argOrOpts as Record<string, unknown>;
      if ("args" in bag || "resolve" in bag) {
        const cfg = bag as {
          args?: ((a: ArgBuilder) => void) | Record<string, ArgSpec>;
          resolve?: Res;
        };
        if (cfg.args) {
          args = typeof cfg.args === "function"
            ? collectArgs(cfg.args)
            : cfg.args;
        }
        if (cfg.resolve) resolve = cfg.resolve;
      } else {
        args = bag as Record<string, ArgSpec>;
        resolve = maybeRes;
      }
    }

    return { args, resolve };
  }

  const add =
    (type: GqlScalar, nullable = true): AddFieldFn<string> =>
    (name: any, argOrOpts?: any, maybeRes?: any) => {
      const { args, resolve } = parseArgsAndResolve(argOrOpts, maybeRes);
      return save(name, type, nullable, args, resolve);
    };

  const addObject = (nullable = true): AddObjectFieldFn<string> =>
  (
    name,
    target,
    opts = {},
  ) => {
    const { args } = parseArgsAndResolve(opts);
    store[name] = {
      type: "object",
      target,
      nullable,
      args,
      resolve: opts.resolve, // now typed as Res
    };
    return api;
  };

  const api: FieldBuilder = {
    id: add("id"),
    string: add("string"),
    int: add("int"),
    float: add("float"),
    boolean: add("boolean"),
    json: add("json"),
    object: addObject(), // nullable by default
    nonNull: {
      id: add("id", false),
      string: add("string", false),
      int: add("int", false),
      float: add("float", false),
      boolean: add("boolean", false),
      json: add("json", false),
      object: addObject(false),
    },
  };

  return api;
}

/* -------------------------------------------------------------------------- */
/*  Relation builder DSL                                                      */
/* -------------------------------------------------------------------------- */

type Merge<T, U> = T & U;

type AddRelationFn<M extends boolean, D extends Direction> = <
  Name extends string,
>(
  name: Name,
  target: () => AnyGqlObjectCtor,
  opts?: Partial<Omit<RelationSpec, "target" | "many" | "direction">>,
) => RelationBuilder;

export interface RelationSpec {
  target: () => AnyGqlObjectCtor;
  many: boolean;
  edge?: () => typeof GraphQLObjectBase;
  direction: Direction;
}

interface OneDirBuilder {
  out: AddRelationFn<false, Direction.OUT>;
  in: AddRelationFn<false, Direction.IN>;
}

interface ManyDirBuilder {
  out: AddRelationFn<true, Direction.OUT>;
  in: AddRelationFn<true, Direction.IN>;
}

export interface RelationBuilder {
  one: Merge<AddRelationFn<false, Direction.OUT>, OneDirBuilder>;
  many: Merge<AddRelationFn<true, Direction.OUT>, ManyDirBuilder>;
}

function buildRelation(store: Record<string, RelationSpec>): RelationBuilder {
  const add = <M extends boolean, D extends Direction>(
    many: M,
    dir: D,
  ): AddRelationFn<M, D> =>
    ((name, target, opts = {}) => {
      store[name] = { target, many, direction: dir, edge: opts.edge };
      return api;
    }) as AddRelationFn<M, D>;

  const oneDir = {
    out: add(false, Direction.OUT),
    in: add(false, Direction.IN),
  };
  const manyDir = {
    out: add(true, Direction.OUT),
    in: add(true, Direction.IN),
  };

  const oneAlias =
    ((n, t, o?) => oneDir.out(n, t, o)) as RelationBuilder["one"];
  Object.assign(oneAlias, oneDir);
  const manyAlias =
    ((n, t, o?) => manyDir.out(n, t, o)) as RelationBuilder["many"];
  Object.assign(manyAlias, manyDir);

  const api: RelationBuilder = { one: oneAlias, many: manyAlias };
  return api;
}

/* -------------------------------------------------------------------------- */
/*  Returns builder DSL (for custom mutation payloads)                        */
/* -------------------------------------------------------------------------- */

type OutputSpec = Record<string, unknown>;

type WithNonNull<T extends OutputSpec> = T & { nonNull: () => T };

interface ReturnsBase {
  string(key?: string): WithNonNull<OutputSpec>;
  int(key?: string): WithNonNull<OutputSpec>;
  float(key?: string): WithNonNull<OutputSpec>;
  boolean(key?: string): WithNonNull<OutputSpec>;
  id(key?: string): WithNonNull<OutputSpec>;
  json(key?: string): WithNonNull<OutputSpec>;
  object<T extends AnyGqlObjectCtor>(
    cls: T,
    key: string,
  ): WithNonNull<OutputSpec>;
  collection<T extends AnyBfNodeCtor>(
    cls: T,
    key: string,
  ): WithNonNull<OutputSpec>;
  readonly list: ReturnsBase;
  readonly nonNull: ReturnsBase;
}

function makeReturnsBuilder(
  flags = { list: false, nonNull: false },
  bucket: OutputSpec = {},
): ReturnsBase {
  function attachNonNull(out: OutputSpec) {
    Object.defineProperty(out, "nonNull", {
      value: () => {
        if (flags.list || !flags.nonNull) {
          // list path already embeds nullability in inner object
        } else {
          // mark scalar/object payload nonNull flag when called later
          Object.values(out).forEach((v) => {
            if (typeof v === "object") (v as any).nullable = false;
          });
        }
        return out;
      },
      enumerable: false,
    });
  }

  function scalarFactory(type: GqlScalar) {
    return (key = "value"): WithNonNull<OutputSpec> => {
      const prop = key;
      /* ── LIST OUTPUT ─────────────────────────────────────────────── */
      if (flags.list) {
        const entry = {
          list: true,
          of: type,
          /** list itself is nullable unless .nonNull was chained */
          nullable: !flags.nonNull,
        };
        const out: OutputSpec = { [prop]: entry };
        Object.assign(bucket, out);
        attachNonNull(out);
        return out as WithNonNull<OutputSpec>;
      }

      /* ── SCALAR OUTPUT ───────────────────────────────────────────── */
      const entry = {
        type,
        /** scalar is nullable unless .nonNull */ nullable: !flags.nonNull,
      };
      const out: OutputSpec = { [prop]: entry };
      Object.assign(bucket, out);
      attachNonNull(out);
      return out as WithNonNull<OutputSpec>;
    };
  }

  const base: Omit<ReturnsBase, "list" | "nonNull"> = {
    string: scalarFactory("string"),
    int: scalarFactory("int"),
    float: scalarFactory("float"),
    boolean: scalarFactory("boolean"),
    id: scalarFactory("id"),
    json: scalarFactory("json"),
    object: (cls, key) => {
      const fn = () => cls;
      Object.defineProperty(fn, "toString", {
        value: () => "() => " + cls.name,
        enumerable: false,
      });
      const out: OutputSpec = { [key]: fn };
      Object.assign(bucket, out);
      attachNonNull(out);
      return out as WithNonNull<OutputSpec>;
    },
    collection: (cls, key) => {
      const fn = () => cls;
      Object.defineProperty(fn, "toString", {
        value: () => "() => " + cls.name,
        enumerable: false,
      });
      const entry = { connection: true, node: fn };
      const out: OutputSpec = { [key]: entry };
      Object.assign(bucket, out);
      attachNonNull(out);
      return out as WithNonNull<OutputSpec>;
    },
  } as const;

  const flagsBuilder = (extra: Partial<typeof flags>): ReturnsBase =>
    makeReturnsBuilder(
      {
        list: flags.list || !!extra.list,
        nonNull: flags.nonNull || !!extra.nonNull,
      },
      bucket, // ⬅ share the same bucket
    );

  const obj: any = Object.create(null);
  Object.assign(obj, base);

  Object.defineProperty(obj, "_spec", { value: bucket, enumerable: false });

  Object.defineProperty(obj, "list", {
    get() {
      return flagsBuilder({ list: true });
    },
    enumerable: false,
  });

  Object.defineProperty(obj, "nonNull", {
    get() {
      return flagsBuilder({ nonNull: true });
    },
    enumerable: false,
  });

  return obj as ReturnsBase;
}

/* -------------------------------------------------------------------------- */
/*  Mutation builder DSL                                                     */
/* -------------------------------------------------------------------------- */

export interface CustomMutation<A = AnyArgs> {
  name: string;
  args: Record<string, ArgSpec>;
  output: OutputSpec;
  resolve: (
    src: InstanceType<AnyGqlObjectCtor>,
    args: A,
    ctx: BfGraphqlContext,
  ) => unknown | Promise<unknown>;
}

export interface StandardMutations {
  update: boolean;
  delete: boolean;
}

export interface MutationSpec {
  createdBy?: {
    parent: () => AnyGqlObjectCtor;
    relation?: string;
    name?: string;
  };
  standard: StandardMutations;
  customs: CustomMutation[];
}

function buildMutation() {
  const spec: MutationSpec = {
    standard: { update: false, delete: false },
    customs: [] as Array<CustomMutation<any>>,
  };

  const api = {
    createdBy(
      parent: () => AnyGqlObjectCtor,
      opts: { relation?: string; name?: string } = {},
    ) {
      spec.createdBy = { parent, ...opts };
      return api;
    },
    update() {
      spec.standard.update = true;
      return api;
    },
    delete() {
      spec.standard.delete = true;
      return api;
    },
    custom<
      F extends ((a: ArgBuilder<any>) => any) | void = (a: ArgBuilder) => void,
    >(
      name: string,
      cfg: {
        args?: F;
        returns: (r: ReturnsBase) => void | OutputSpec;
        resolve: (
          src: InstanceType<AnyGqlObjectCtor>,
          args: InferArgs<F>, // ← inferred object
          ctx: BfGraphqlContext,
        ) => unknown | Promise<unknown>;
      },
    ) {
      const argsSpec = typeof cfg.args === "function"
        ? collectArgs(cfg.args)
        : cfg.args ?? {};

      const builder = makeReturnsBuilder();
      const output =
        (cfg.returns(builder) ?? (builder as any)._spec) as OutputSpec;
      const typedMut = {
        name,
        args: argsSpec,
        output,
        resolve: cfg.resolve,
      } as CustomMutation<InferArgs<F>>;
      spec.customs.push(typedMut as unknown as CustomMutation<any>);

      return api;
    },
    _build(): MutationSpec {
      return spec;
    },
  } as const;

  return api;
}

/* -------------------------------------------------------------------------- */
/*  Public entrypoint                                                        */
/* -------------------------------------------------------------------------- */

export function defineGqlNode(
  def: (
    field: ReturnType<typeof buildField>,
    relation: ReturnType<typeof buildRelation>,
    mutation: ReturnType<typeof buildMutation>,
  ) => void,
): GqlNodeSpec {
  const fields: Record<string, FieldSpec> = {};
  const relations: Record<string, RelationSpec> = {};
  const mutationBuilder = buildMutation();

  def(buildField(fields), buildRelation(relations), mutationBuilder);

  return {
    field: fields,
    relation: relations,
    mutation: mutationBuilder._build(),
  };
}

export type GqlNodeSpec = {
  field: Record<string, FieldSpec>;
  relation: Record<string, RelationSpec>;
  mutation: MutationSpec;
  implements?: Array<string>;
  owner?: string;
};
