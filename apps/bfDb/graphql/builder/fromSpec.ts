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
import type {
  NexusOutputFieldConfig,
  ObjectDefinitionBlock,
} from "nexus/dist/core.js";

/* -------------------------------------------------------------------------- */
/*  Sub‑types & helpers                                                       */
/* -------------------------------------------------------------------------- */

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

// ensure JSON scalar only once ------------------------------------------------
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

/* -------------------------------------------------------------------------- */
/*  Helpers – arguments, scalar fields, relations                              */
/* -------------------------------------------------------------------------- */

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
  if (spec.resolve) {
    options.resolve = spec.resolve as NexusOutputFieldConfig<
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
    /* ignore – fallback to generic */
  }

  if (spec.many) {
    t.nonNull.list.nonNull.field(name, { type: targetName });
  } else {
    t.nonNull.field(name, { type: targetName });
  }
}

/* -------------------------------------------------------------------------- */
/*  Mutations – convert builder spec → mutationField objs                      */
/* -------------------------------------------------------------------------- */

function buildMutationFields(nodeName: string, mutation: MutationSpec) {
  const defs: unknown[] = [];

  // standard mutations --------------------------------------------------------
  if (mutation.standard.update) {
    defs.push(
      mutationField(`update${nodeName}`, {
        type: "Boolean",
        args: {
          id: idArg(),
          params: arg({ type: "JSON" }),
        },
        resolve: () => true,
      }),
    );
  }
  if (mutation.standard.delete) {
    defs.push(
      mutationField(`delete${nodeName}`, {
        type: "Boolean",
        args: {
          id: idArg(),
          params: arg({ type: "JSON" }),
        },
        resolve: () => true,
      }),
    );
  }

  // custom mutations ----------------------------------------------------------
  for (const cm of mutation.customs) {
    const argsCfg: Record<string, ReturnType<typeof idArg>> = {};
    for (const [argName, argScalar] of Object.entries(cm.args)) {
      argsCfg[argName] = toNexusArg(argScalar as GqlScalar) as ReturnType<
        typeof idArg
      >;
    }

    defs.push(
      mutationField(`${cm.name}${nodeName}`, {
        type: "JSON", // generic opaque payload – concrete types could be generated later
        args: argsCfg,
        // deno-lint-ignore no-explicit-any
        resolve: cm.resolve as any,
      }),
    );
  }

  return defs;
}

/* -------------------------------------------------------------------------- */
/*  Main – convert a GqlNodeSpec to Nexus object & mutation fields             */
/* -------------------------------------------------------------------------- */

export function specToNexusObject(nodeName: string, spec: GqlNodeSpec) {
  ensureJsonScalar();

  const nodeType = objectType({
    name: nodeName,
    definition(t) {
      // scalar fields
      for (const [fieldName, fieldSpec] of Object.entries(spec.field)) {
        addScalarField(t, fieldName, fieldSpec);
      }
      // relations
      for (const [relName, relSpec] of Object.entries(spec.relation)) {
        addRelationField(t, relName, relSpec);
      }
    },
  });

  const mutationDefs = buildMutationFields(nodeName, spec.mutation);

  return [nodeType, ...mutationDefs, ensureJsonScalar()];
}
