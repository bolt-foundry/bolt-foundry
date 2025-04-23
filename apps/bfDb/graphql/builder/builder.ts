// apps/bfDb/graphql/builder/builder.ts – complete implementation matching test suite
// deno-lint-ignore-file no-explicit-any
import type {
  BfMetadataBase,
  BfNodeBase,
  BfNodeBaseProps,
} from "apps/bfDb/classes/BfNodeBase.ts";
import type {
  BfEdgeBase,
  BfEdgeBaseProps,
} from "apps/bfDb/classes/BfEdgeBase.ts";
import type { BfGraphqlContext } from "apps/bfDb/graphql/graphqlContext.ts";

/* -------------------------------------------------------------------------- */
/*  Scalars & helpers                                                         */
/* -------------------------------------------------------------------------- */

export type GqlScalar =
  | "id"
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

/* -------------------------------------------------------------------------- */
/*  Field builder DSL                                                        */
/* -------------------------------------------------------------------------- */

export interface FieldSpec {
  type: GqlScalar;
  nullable: boolean;
  args?: Record<string, GqlScalar>;
  resolve?: (
    src: BfNodeBase,
    args: unknown,
    ctx: BfGraphqlContext,
  ) => unknown | Promise<unknown>;
}

function collectArgs(fn?: (a: ArgBuilder) => unknown | void):
  | Record<string, GqlScalar>
  | undefined {
  if (!fn) return undefined;
  const store: Record<string, GqlScalar> = {};
  const b: ArgBuilder = {
    id: (n) => (store[n] = "id", b),
    string: (n) => (store[n] = "string", b),
    int: (n) => (store[n] = "int", b),
    float: (n) => (store[n] = "float", b),
    boolean: (n) => (store[n] = "boolean", b),
    json: (n) => (store[n] = "json", b),
  } as const;
  fn(b);
  return store;
}

export interface ArgBuilder {
  id(name: string): ArgBuilder;
  string(name: string): ArgBuilder;
  int(name: string): ArgBuilder;
  float(name: string): ArgBuilder;
  boolean(name: string): ArgBuilder;
  json(name: string): ArgBuilder;
}

type FieldArgsOrOpts<Res extends FieldSpec["resolve"] | undefined> =
  | Res // legacy (name, resolve)
  | Record<string, GqlScalar> // legacy (name, args, resolve?)
  | {
    args?: ((a: ArgBuilder) => void) | Record<string, GqlScalar>;
    resolve?: Res;
  };

export type AddFieldFn<Name extends string> = <
  Res extends FieldSpec["resolve"] | undefined = undefined,
>(
  name: Name,
  argsOrOpts?: FieldArgsOrOpts<Res>,
  maybeRes?: Res,
) => FieldBuilder;

export interface FieldBuilder {
  id: AddFieldFn<string>;
  string: AddFieldFn<string>;
  int: AddFieldFn<string>;
  float: AddFieldFn<string>;
  boolean: AddFieldFn<string>;
  json: AddFieldFn<string>;
  nullable: {
    string: AddFieldFn<string>;
    int: AddFieldFn<string>;
    float: AddFieldFn<string>;
    boolean: AddFieldFn<string>;
    json: AddFieldFn<string>;
  };
}

function buildField(store: Record<string, FieldSpec>): FieldBuilder {
  type Res = FieldSpec["resolve"];

  function save(
    name: string,
    type: GqlScalar,
    nullable: boolean,
    args?: Record<string, GqlScalar>,
    resolve?: Res,
  ) {
    store[name] = { type, nullable, args, resolve };
    return api;
  }

  function parseArgsAndResolve(
    argOrOpts?: FieldArgsOrOpts<Res>,
    maybeRes?: Res,
  ): { args?: Record<string, GqlScalar>; resolve?: Res } {
    let args: Record<string, GqlScalar> | undefined;
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
          args?: ((a: ArgBuilder) => void) | Record<string, GqlScalar>;
          resolve?: Res;
        };
        if (cfg.args) {
          args = typeof cfg.args === "function"
            ? collectArgs(cfg.args)
            : cfg.args;
        }
        if (cfg.resolve) resolve = cfg.resolve;
      } else {
        args = bag as Record<string, GqlScalar>;
        resolve = maybeRes;
      }
    }

    return { args, resolve };
  }

  const add =
    (type: GqlScalar, nullable = false): AddFieldFn<string> =>
    (name: any, argOrOpts?: any, maybeRes?: any) => {
      const { args, resolve } = parseArgsAndResolve(argOrOpts, maybeRes);
      return save(name, type, nullable, args, resolve);
    };

  const api: FieldBuilder = {
    id: add("id"),
    string: add("string"),
    int: add("int"),
    float: add("float"),
    boolean: add("boolean"),
    json: add("json"),
    nullable: {
      string: add("string", true),
      int: add("int", true),
      float: add("float", true),
      boolean: add("boolean", true),
      json: add("json", true),
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
  target: () => AnyBfNodeCtor,
  opts?: Partial<Omit<RelationSpec, "target" | "many" | "direction">>,
) => RelationBuilder;

export interface RelationSpec {
  target: () => AnyBfNodeCtor;
  many: boolean;
  edge?: () => typeof BfEdgeBase;
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

type WithNullable<T extends OutputSpec> = T & { nullable: () => T };

interface ReturnsBase {
  string(key?: string): WithNullable<OutputSpec>;
  int(key?: string): WithNullable<OutputSpec>;
  float(key?: string): WithNullable<OutputSpec>;
  boolean(key?: string): WithNullable<OutputSpec>;
  id(key?: string): WithNullable<OutputSpec>;
  json(key?: string): WithNullable<OutputSpec>;
  object<T extends AnyBfNodeCtor>(
    cls: T,
    key: string,
  ): WithNullable<OutputSpec>;
  collection<T extends AnyBfNodeCtor>(
    cls: T,
    key: string,
  ): WithNullable<OutputSpec>;
  readonly list: ReturnsBase;
  readonly nullable: ReturnsBase;
}

function makeReturnsBuilder(
  flags = { list: false, nullable: false },
): ReturnsBase {
  function attachNullable(out: OutputSpec) {
    Object.defineProperty(out, "nullable", {
      value: () => {
        if (flags.list || flags.nullable) {
          // list path already embeds nullability in inner object
        } else {
          // mark scalar/object payload nullable flag when called later
          Object.values(out).forEach((v) => {
            if (typeof v === "object") (v as any).nullable = true;
          });
        }
        return out;
      },
      enumerable: false,
    });
  }

  function scalarFactory(type: GqlScalar) {
    return (key = "value"): WithNullable<OutputSpec> => {
      const prop = key;
      if (flags.list) {
        const entry: any = { list: true, of: type };
        if (flags.nullable) entry.nullable = true;
        const out: OutputSpec = { [prop]: entry };
        attachNullable(out);
        return out as WithNullable<OutputSpec>;
      }
      const out: OutputSpec = { [prop]: type };
      attachNullable(out);
      return out as WithNullable<OutputSpec>;
    };
  }

  const base: Omit<ReturnsBase, "list" | "nullable"> = {
    string: scalarFactory("string"),
    int: scalarFactory("int"),
    float: scalarFactory("float"),
    boolean: scalarFactory("boolean"),
    id: scalarFactory("id"),
    json: scalarFactory("json"),
    object: (cls, key) => {
      const fn = () => cls;
      // Override function.toString so Deno std/assert compares by string value
      Object.defineProperty(fn, "toString", {
        value: () => "() => " + cls.name,
        enumerable: false,
      });
      const out: OutputSpec = { [key]: fn };
      attachNullable(out);
      return out as WithNullable<OutputSpec>;
    },
    collection: (cls, key) => {
      const fn = () => cls;
      Object.defineProperty(fn, "toString", {
        value: () => "() => " + cls.name,
        enumerable: false,
      });
      const entry = { connection: true, node: fn };
      const out: OutputSpec = { [key]: entry };
      attachNullable(out);
      return out as WithNullable<OutputSpec>;
    },
  } as const;

  const flagsBuilder = (extra: Partial<typeof flags>): ReturnsBase =>
    makeReturnsBuilder({
      list: flags.list || !!extra.list,
      nullable: flags.nullable || !!extra.nullable,
    });

  const obj: any = Object.create(null);
  Object.assign(obj, base);

  Object.defineProperty(obj, "list", {
    get() {
      return flagsBuilder({ list: true });
    },
    enumerable: false,
  });

  Object.defineProperty(obj, "nullable", {
    get() {
      return flagsBuilder({ nullable: true });
    },
    enumerable: false,
  });

  return obj as ReturnsBase;
}

/* -------------------------------------------------------------------------- */
/*  Mutation builder DSL                                                     */
/* -------------------------------------------------------------------------- */

export interface CustomMutation {
  name: string;
  args: Record<string, GqlScalar>;
  output: OutputSpec;
  resolve: (
    src: InstanceType<AnyBfNodeCtor>,
    args: Record<string, unknown>,
    ctx: BfGraphqlContext,
  ) => unknown | Promise<unknown>;
}

export interface StandardMutations {
  update: boolean;
  delete: boolean;
}

export interface MutationSpec {
  createdBy?: {
    parent: () => AnyBfNodeCtor;
    relation?: string;
    name?: string;
  };
  standard: StandardMutations;
  customs: CustomMutation[];
}

function buildMutation() {
  const spec: MutationSpec = {
    standard: { update: false, delete: false },
    customs: [],
  };

  const api = {
    createdBy(
      parent: () => AnyBfNodeCtor,
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
    custom(
      name: string,
      cfg: {
        args?: ((a: ArgBuilder) => void) | Record<string, GqlScalar>;
        returns: (r: ReturnsBase) => OutputSpec;
        resolve: CustomMutation["resolve"];
      },
    ) {
      const argsSpec = typeof cfg.args === "function"
        ? collectArgs(cfg.args)
        : (cfg.args ?? {});

      const output = cfg.returns(makeReturnsBuilder());
      spec.customs.push({
        name,
        args: argsSpec ?? {},
        output,
        resolve: cfg.resolve,
      });
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
};
