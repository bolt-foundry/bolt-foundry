import {
  arg,
  booleanArg,
  floatArg,
  idArg,
  intArg,
  interfaceType,
  mutationField,
  objectType,
  scalarType,
  stringArg,
} from "nexus";
import type {
  FieldSpec,
  GqlNodeSpec,
  GqlScalar,
  MutationSpec,
  RelationSpec,
} from "apps/bfDb/graphql/builder/builder.ts";
import type {
  InterfaceDefinitionBlock,
  NexusOutputFieldConfig,
  ObjectDefinitionBlock,
} from "nexus/dist/core.js";
import { getLogger } from "packages/logger/logger.ts";

type DefBlock<TName extends string> =
  & ObjectDefinitionBlock<TName>
  & InterfaceDefinitionBlock<TName>;
const _logger = getLogger(import.meta);

const scalarMap: Record<GqlScalar, string> = {
  id: "ID",
  string: "String",
  int: "Int",
  float: "Float",
  boolean: "Boolean",
  json: "JSON",
};

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
  t: DefBlock<TName>,
  name: string,
  spec: FieldSpec,
): void {
  const options: NexusOutputFieldConfig<TName, string> = {
    type: scalarMap[spec.type],
  };
  if (spec.args) {
    const args: Record<string, ReturnType<typeof idArg>> = {};
    for (const [argName, argScalar] of Object.entries(spec.args)) {
      args[argName] = toNexusArg(argScalar as GqlScalar);
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
  t: DefBlock<TName>,
  name: string,
  spec: RelationSpec,
): void {
  let targetName = "BfNode";
  try {
    const target = spec.target();
    if (target?.name) targetName = target.name as string;
  } catch {
    // ignore
  }

  if (spec.many) {
    t.nonNull.list.nonNull.field(name, { type: targetName });
  } else {
    t.nonNull.field(name, { type: targetName });
  }
}

function buildMutationFields(nodeName: string, mutation: MutationSpec) {
  const defs: unknown[] = [];

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

  for (const cm of mutation.customs) {
    const argsCfg: Record<string, ReturnType<typeof idArg>> = {};
    for (const [argName, argScalar] of Object.entries(cm.args)) {
      argsCfg[argName] = toNexusArg(argScalar as GqlScalar);
    }

    defs.push(
      mutationField(`${cm.name}${nodeName}`, {
        type: "JSON",
        args: argsCfg,
        resolve: cm.resolve,
      }),
    );
  }

  return defs;
}

export function specsToNexusDefs(
  specs: Record<string, GqlNodeSpec>,
): unknown[] {
  ensureJsonScalar();

  /* 1. Find every interface name already referenced */
  const directlyReferenced = new Set<string>();
  for (const { implements: impl = [] } of Object.values(specs)) {
    impl.forEach((n) => directlyReferenced.add(n));
  }

  /* 2. If *two* specs share the same root interface (e.g. BfNodeBase)
        treat the older sibling as an interface too. */
  const promotedInterfaces = new Set<string>();
  for (const [nodeName, _spec] of Object.entries(specs)) {
    if (
      [...directlyReferenced].filter((n) =>
        specs[n]?.implements?.includes("BfNodeBase")
      ).length > 1
    ) {
      promotedInterfaces.add(nodeName);
    }
  }

  const interfaceNames = new Set<string>([
    ...directlyReferenced,
    ...promotedInterfaces,
  ]);

  const allDefs: unknown[] = [];

  for (const iface of interfaceNames) {
    if (!(iface in specs)) {
      allDefs.push(
        interfaceType({
          name: iface,
          definition() {},
          // default resolver so abstract-type runtime checks pass
          resolveType: (src) => (src as { __typename?: string }).__typename,
        }),
      );
    }
  }

  /* 4. Build real specs -------------------------------------------------- */
  for (const [nodeName, spec] of Object.entries(specs)) {
    const isInterface = interfaceNames.has(nodeName);

    // Only emit an object-type if the spec actually *has* fields
    const hasOutputFields = Object.keys(spec.field ?? {}).length > 0 ||
      Object.keys(spec.relation ?? {}).length > 0;

    if (hasOutputFields || isInterface) {
      const definition = (t: DefBlock<string>) => {
        for (const [fname, fspec] of Object.entries(spec.field)) {
          addScalarField(t, fname, fspec);
        }
        for (const [rname, rspec] of Object.entries(spec.relation)) {
          addRelationField(t, rname, rspec);
        }

        // Original implements
        for (const ifName of spec.implements ?? []) t.implements(ifName);

        /* 4a.  Extra "sibling" interface if needed (SubNode → BaseNode) */
        if (
          !isInterface &&
          (spec.implements ?? []).every((n) => n === "BfNodeBase")
        ) {
          const extra = [...promotedInterfaces].find((n) => n !== nodeName);
          if (extra) t.implements(extra);
        }
      };

      const typeDef = isInterface
        ? interfaceType({
          name: nodeName,
          definition,
          resolveType: (f) => f.__typename,
        })
        : objectType({ name: nodeName, definition });

      allDefs.push(typeDef);
    }

    if (!isInterface) {
      allDefs.push(...buildMutationFields(nodeName, spec.mutation));
    }
  }

  allDefs.push(ensureJsonScalar());
  return allDefs;
}
