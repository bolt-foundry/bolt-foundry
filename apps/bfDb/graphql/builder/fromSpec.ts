import {
  arg,
  booleanArg,
  floatArg,
  idArg,
  intArg,
  mutationField,
  objectType,
  scalarType,
  stringArg,
} from "nexus";
import type {
  FieldSpec,
  GqlScalar,
  MutationSpec,
  RelationSpec,
} from "./builder.ts";
import type { BfGraphqlContext } from "apps/bfDb/graphql/graphqlContext.ts";
import type {
  NexusOutputFieldConfig,
  ObjectDefinitionBlock,
} from "nexus/dist/core.js";

/** Subset of the builder spec we transform */
type GqlNodeSpec = {
  field: Record<string, FieldSpec>;
  relation: Record<string, RelationSpec>;
  mutation: MutationSpec;
};

const scalarMap: Record<GqlScalar, string> = {
  id: "ID",
  string: "String",
  int: "Int",
  float: "Float",
  boolean: "Boolean",
  json: "JSON",
};

// -----------------------------------------------------------------------------
//  Utility: register JSON scalar once
// -----------------------------------------------------------------------------
let jsonScalarRegistered = false;
let jsonScalarDef: unknown;
function ensureJsonScalar(): unknown {
  if (jsonScalarRegistered) return jsonScalarDef;
  jsonScalarDef = scalarType({
    name: "JSON",
    serialize: (v) => v,
    parseValue: (v) => v,
    asNexusMethod: "json",
  });
  jsonScalarRegistered = true;
  return jsonScalarDef;
}

// -----------------------------------------------------------------------------
//  Helpers – args, scalar/rel fields
// -----------------------------------------------------------------------------
function toNexusArg(scalar: GqlScalar) {
  switch (scalar) {
    case "id":
      return idArg();
    case "int":
      return intArg();
    case "float":
      return floatArg();
    case "boolean":
      return booleanArg();
    case "json":
      return arg({ type: "JSON" });
    case "string":
    default:
      return stringArg();
  }
}

function addScalarField<TName extends string>(
  t: ObjectDefinitionBlock<TName>,
  name: string,
  spec: FieldSpec,
): void {
  const options: NexusOutputFieldConfig<TName, string> = {
    type: scalarMap[spec.type],
  };

  if (spec.args) {
    type ArgDef = ReturnType<typeof idArg>;
    const args: Record<string, ArgDef> = {};
    for (const [argName, argScalar] of Object.entries(spec.args)) {
      args[argName] = toNexusArg(argScalar as GqlScalar) as ArgDef;
    }
    options.args = args;
  }
  if (spec.resolver) {
    options.resolve = spec.resolver as NexusOutputFieldConfig<
      TName,
      string
    >["resolve"];
  }

  if (spec.nullable) {
    t.field(name, options);
  } else {
    t.nonNull.field(name, options);
  }
}

function addRelationField<TName extends string>(
  t: ObjectDefinitionBlock<TName>,
  name: string,
  spec: RelationSpec,
): void {
  let targetName = "BfNode";
  try {
    const target = spec.target();
    if (target?.name) targetName = target.name as string;
  } catch {
    /* ignore – falls back to generic BfNode */
  }

  if (spec.many) {
    t.nonNull.list.nonNull.field(name, { type: targetName });
  } else {
    t.nonNull.field(name, { type: targetName });
  }
}

// -----------------------------------------------------------------------------
//  Helper – emit mutationField objects instead of a new Mutation type
// -----------------------------------------------------------------------------
function buildMutationFields(nodeName: string, mutation: MutationSpec) {
  const defs: unknown[] = [];

  // ── standard mutations ───────────────────────────────────────────────
  if (mutation.standard.update) {
    defs.push(
      mutationField(`update${nodeName}`, {
        type: "Boolean",
        args: { id: idArg() },
        resolve: () => true,
      }),
    );
  }
  if (mutation.standard.delete) {
    defs.push(
      mutationField(`delete${nodeName}`, {
        type: "Boolean",
        args: { id: idArg() },
        resolve: () => true,
      }),
    );
  }

  // ── custom mutations ─────────────────────────────────────────────────
  for (const cm of mutation.customs) {
    const fieldName = `${cm.name}${nodeName}`;
    type MutArgDef = ReturnType<typeof idArg>;
    const args: Record<string, MutArgDef> = {};
    for (const [argName, scalar] of Object.entries(cm.args)) {
      args[argName] = toNexusArg(scalar as GqlScalar) as MutArgDef;
    }
    defs.push(
      mutationField(fieldName, {
        type: "String",
        args,
        resolve: (
          _root,
          resolverArgs: Record<string, unknown>,
          ctx: unknown,
        ) => cm.resolver({} as never, resolverArgs, ctx as BfGraphqlContext),
      }),
    );
  }

  return defs;
}

// -----------------------------------------------------------------------------
//  Main transformer
// -----------------------------------------------------------------------------
export function specToNexusObject(name: string, spec: GqlNodeSpec) {
  const definitions: unknown[] = [];

  // JSON scalar only needs to be registered once
  if (Object.values(spec.field).some((f) => f.type === "json")) {
    const jsonDef = ensureJsonScalar();
    if (jsonDef) definitions.push(jsonDef);
  }

  // ── core object type ─────────────────────────────────────────────────
  definitions.push(
    objectType({
      name,
      definition(t: ObjectDefinitionBlock<typeof name>) {
        for (const [fname, fspec] of Object.entries(spec.field)) {
          addScalarField(t, fname, fspec);
        }
        for (const [rname, rspec] of Object.entries(spec.relation ?? {})) {
          addRelationField(t, rname, rspec);
        }
      },
    }),
  );

  // ── mutation fields (if any) ─────────────────────────────────────────
  if (
    spec.mutation.standard.update ||
    spec.mutation.standard.delete ||
    spec.mutation.customs.length
  ) {
    definitions.push(...buildMutationFields(name, spec.mutation));
  }

  return definitions.length === 1 ? definitions[0] : definitions;
}
