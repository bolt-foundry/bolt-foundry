import type { BfNodeBase } from "apps/bfDb/classes/BfNodeBase.ts";
import type { BfEdgeBase } from "apps/bfDb/classes/BfEdgeBase.ts";
import type { BfGraphqlContext } from "apps/bfDb/graphql/graphqlContext.ts";

export type GqlScalar = "id" | "string" | "int" | "float" | "boolean" | "json";

export enum Direction {
  OUT = "OUT",
  IN = "IN",
}

export type FieldSpec = {
  type: GqlScalar;
  nullable: boolean;
  args?: Record<string, GqlScalar>;
  resolver?: (
    src: BfNodeBase,
    args: unknown,
    ctx: BfGraphqlContext,
  ) => unknown | Promise<unknown>;
};

export type RelationSpec = {
  target: () => typeof BfNodeBase;
  many: boolean;
  edge?: () => typeof BfEdgeBase;
  direction: Direction;
};

type AddFieldFn = <
  Name extends string,
  Args extends Record<string, GqlScalar> | undefined = undefined,
  Res extends FieldSpec["resolver"] | undefined = undefined,
>(
  name: Name,
  argOrRes?: Args | Res,
  maybeRes?: Res,
) => FieldBuilder;

interface FieldBuilder {
  id: AddFieldFn;
  string: AddFieldFn;
  int: AddFieldFn;
  float: AddFieldFn;
  boolean: AddFieldFn;
  json: AddFieldFn;
  nullable: {
    string: AddFieldFn;
    int: AddFieldFn;
    float: AddFieldFn;
    boolean: AddFieldFn;
    json: AddFieldFn;
  };
}

function buildField(store: Record<string, FieldSpec>): FieldBuilder {
  type Res = FieldSpec["resolver"];
  const save = (
    name: string,
    type: GqlScalar,
    nullable: boolean,
    args?: Record<string, GqlScalar>,
    resolver?: Res,
  ) => {
    store[name] = { type, nullable, args, resolver };
    return api;
  };

  const add = (type: GqlScalar, nullable = false): AddFieldFn =>
  (
    name,
    argOrRes,
    maybeRes,
  ) => {
    const args = typeof argOrRes === "object" && argOrRes
      ? (argOrRes as Record<string, GqlScalar>)
      : undefined;
    const resolver = typeof argOrRes === "function"
      ? (argOrRes as Res)
      : maybeRes;
    return save(name, type, nullable, args, resolver);
  };

  const api = {
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
  } satisfies FieldBuilder;

  return api;
}

// Generic callable that also carries properties (intersection
type MergeCallable<T, U> = T & U;

type AddRelationFn<_M extends boolean, _D extends Direction> = <
  Name extends string,
>(
  name: Name,
  target: () => typeof BfNodeBase,
  opts?: Partial<Omit<RelationSpec, "target" | "many" | "direction">>,
) => RelationBuilder;

interface OneDirBuilder {
  out: AddRelationFn<false, Direction.OUT>;
  in: AddRelationFn<false, Direction.IN>;
}

interface ManyDirBuilder {
  out: AddRelationFn<true, Direction.OUT>;
  in: AddRelationFn<true, Direction.IN>;
}

interface RelationBuilder {
  one: MergeCallable<AddRelationFn<false, Direction.OUT>, OneDirBuilder>;
  many: MergeCallable<AddRelationFn<true, Direction.OUT>, ManyDirBuilder>;
}

function buildRelation(store: Record<string, RelationSpec>): RelationBuilder {
  const add = <M extends boolean, D extends Direction>(
    many: M,
    direction: D,
  ): AddRelationFn<M, D> =>
    ((name, target, opts = {}) => {
      store[name] = { target, many, direction, edge: opts.edge };
      return api;
    }) as AddRelationFn<M, D>;

  const oneDir = {
    out: add(false, Direction.OUT),
    in: add(false, Direction.IN),
  } as const;

  const manyDir = {
    out: add(true, Direction.OUT),
    in: add(true, Direction.IN),
  } as const;

  // callable aliases so relation.one(...) defaults to .one.out(...)
  const oneAlias =
    ((name, target, opts?) =>
      oneDir.out(name, target, opts)) as RelationBuilder["one"];
  Object.assign(oneAlias, oneDir);

  const manyAlias =
    ((name, target, opts?) =>
      manyDir.out(name, target, opts)) as RelationBuilder["many"];
  Object.assign(manyAlias, manyDir);

  const api: RelationBuilder = {
    one: oneAlias,
    many: manyAlias,
  };

  return api;
}

export type StandardMutations = {
  update: boolean;
  delete: boolean;
};

export type CustomMutation = {
  name: string;
  args: Record<string, GqlScalar>;
  resolver: (
    src: InstanceType<typeof BfNodeBase>,
    args: Record<string, unknown>,
    ctx: BfGraphqlContext,
  ) => unknown | Promise<unknown>;
};

export type MutationSpec = {
  createdBy?: {
    parent: () => typeof BfNodeBase;
    relation?: string;
    name?: string;
  };
  standard: StandardMutations;
  customs: CustomMutation[];
};

function buildMutation() {
  const spec: MutationSpec = {
    standard: { update: false, delete: false },
    customs: [],
  };
  return {
    createdBy(
      parent: () => typeof BfNodeBase,
      opts: Partial<{ relation: string; name: string }> = {},
    ) {
      spec.createdBy = { parent, ...opts };
      return this;
    },
    update() {
      spec.standard.update = true;
      return this;
    },
    delete() {
      spec.standard.delete = true;
      return this;
    },
    custom(
      name: string,
      args: Record<string, GqlScalar>,
      resolver: CustomMutation["resolver"],
    ) {
      spec.customs.push({ name, args, resolver });
      return this;
    },
    _build() {
      return spec;
    },
  } as const;
}

export function defineGqlNode(
  def: (
    field: ReturnType<typeof buildField>,
    relation: ReturnType<typeof buildRelation>,
    mutation: ReturnType<typeof buildMutation>,
  ) => void,
) {
  const fieldStore: Record<string, FieldSpec> = {};
  const relationStore: Record<string, RelationSpec> = {};
  const mutBuilder = buildMutation();
  def(buildField(fieldStore), buildRelation(relationStore), mutBuilder);
  return {
    field: fieldStore,
    relation: relationStore,
    mutation: mutBuilder._build(),
  } as const;
}
