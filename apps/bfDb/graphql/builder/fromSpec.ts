// apps/bfDb/graphql/builder/fromSpec.ts
// -----------------------------------------------------------------------------
// Nexus compiler for the builder DSL – now with `date` scalar & `enum` support.
// -----------------------------------------------------------------------------
import {
  arg,
  booleanArg,
  enumType,
  floatArg,
  idArg,
  intArg,
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

// ------------------------------------------------------------------
//  Scalar handling
// ------------------------------------------------------------------
const scalarMap: Record<GqlScalar, string> = {
  id: "ID",
  string: "String",
  int: "Int",
  float: "Float",
  boolean: "Boolean",
  json: "JSON",
  date: "Date", // NEW
};

// JSON scalar (existing)
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

// Date scalar (ISO‑8601 DateTime → JS Date)
let dateScalarRegistered = false;
let dateScalarDef: unknown;
function ensureDateScalar(): unknown {
  if (dateScalarRegistered) return dateScalarDef;
  dateScalarDef = scalarType({
    name: "Date",
    description: "ISO‑8601 DateTime serialized as a string",
    serialize: (v) => (v instanceof Date ? v.toISOString() : v),
    parseValue: (v) => (typeof v === "string" ? new Date(v) : v),
    asNexusMethod: "date",
  });
  dateScalarRegistered = true;
  return dateScalarDef;
}

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
    case "date":
      return arg({ type: "Date" });
    case "string":
    default:
      return stringArg();
  }
}

// ------------------------------------------------------------------
//  Field helpers
// ------------------------------------------------------------------
const enumRegistry = new Map<string, unknown>();

function addEnumField<TName extends string>(
  t: ObjectDefinitionBlock<TName>,
  nodeName: string,
  fieldName: string,
  spec: FieldSpec,
): void {
  const enumName = `${nodeName}_${fieldName}_Enum`;
  if (spec.nullable) {
    t.field(fieldName, { type: enumName });
  } else {
    t.nonNull.field(fieldName, { type: enumName });
  }
}

function addScalarField<TName extends string>(
  t: ObjectDefinitionBlock<TName>,
  fieldName: string,
  spec: FieldSpec,
): void {
  const options: NexusOutputFieldConfig<TName, string> = {
    type: scalarMap[spec.type as GqlScalar],
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
    t.field(fieldName, options);
  } else {
    t.nonNull.field(fieldName, options);
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
    if (target && target.name) targetName = target.name as string;
  } catch {
    /* ignore */
  }

  if (spec.many) {
    t.nonNull.list.nonNull.field(name, { type: targetName });
  } else {
    t.nonNull.field(name, { type: targetName });
  }
}

// ------------------------------------------------------------------
//  Mutation helpers (unchanged)
// ------------------------------------------------------------------
function buildMutationObject(nodeName: string, mutation: MutationSpec) {
  return objectType({
    name: "Mutation",
    definition(t: ObjectDefinitionBlock<"Mutation">) {
      // standard mutations
      if (mutation.standard.update) {
        t.boolean(`update${nodeName}`, {
          args: { id: idArg() },
          resolve: () => true,
        });
      }
      if (mutation.standard.delete) {
        t.boolean(`delete${nodeName}`, {
          args: { id: idArg() },
          resolve: () => true,
        });
      }
      // custom mutations
      for (const cm of mutation.customs) {
        const fieldName = `${cm.name}${nodeName}`;
        type MutArgDef = ReturnType<typeof idArg>;
        const args: Record<string, MutArgDef> = {};
        for (const [argName, scalar] of Object.entries(cm.args)) {
          args[argName] = toNexusArg(scalar as GqlScalar) as MutArgDef;
        }
        t.field(fieldName, {
          type: "String",
          args,
          resolve: (
            _root: unknown,
            resolverArgs: Record<string, unknown>,
            ctx: BfGraphqlContext,
          ) => cm.resolver({} as never, resolverArgs, ctx as BfGraphqlContext),
        });
      }
    },
  });
}

// ------------------------------------------------------------------
//  Main compiler export
// ------------------------------------------------------------------
export function specToNexusObject(name: string, spec: GqlNodeSpec) {
  const definitions: unknown[] = [];

  // --------------------------------------------------------------
  // 1. Pre‑register scalars used by this node
  // --------------------------------------------------------------
  const usesJson = Object.values(spec.field).some((f) => f.type === "json");
  const usesDate = Object.values(spec.field).some((f) => f.type === "date");
  if (usesJson) definitions.push(ensureJsonScalar());
  if (usesDate) definitions.push(ensureDateScalar());

  // --------------------------------------------------------------
  // 2. Register enum types before schema generation
  // --------------------------------------------------------------
  for (const [fname, fspec] of Object.entries(spec.field)) {
    if (fspec.type === "enum") {
      const enumName = `${name}_${fname}_Enum`;
      if (!enumRegistry.has(enumName)) {
        const enumDef = enumType({
          name: enumName,
          members: fspec.enumRef as Record<string, string | number>,
        });
        enumRegistry.set(enumName, enumDef);
        definitions.push(enumDef);
      }
    }
  }

  // --------------------------------------------------------------
  // 3. Create the main object type
  // --------------------------------------------------------------
  const nodeObject = objectType({
    name,
    definition(t: ObjectDefinitionBlock<typeof name>) {
      for (const [fname, fspec] of Object.entries(spec.field)) {
        if (fspec.type === "enum") {
          addEnumField(t, name, fname, fspec);
        } else {
          addScalarField(t, fname, fspec);
        }
      }
      for (const [rname, rspec] of Object.entries(spec.relation ?? {})) {
        addRelationField(t, rname, rspec);
      }
    },
  });
  definitions.push(nodeObject);

  // --------------------------------------------------------------
  // 4. Append mutation helpers if any
  // --------------------------------------------------------------
  if (
    spec.mutation.standard.update ||
    spec.mutation.standard.delete ||
    spec.mutation.customs.length > 0
  ) {
    definitions.push(buildMutationObject(name, spec.mutation));
  }

  return definitions.length === 1 ? definitions[0] : definitions;
}
