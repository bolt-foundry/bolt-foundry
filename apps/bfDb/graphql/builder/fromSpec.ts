// deno-lint-ignore-file no-explicit-any
import {
  arg,
  idArg,
  interfaceType,
  mutationField,
  nonNull,
  objectType,
  scalarType,
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
  BfGID: "BfGID",
  string: "String",
  int: "Int",
  float: "Float",
  boolean: "Boolean",
  json: "JSON",
};

/* ------------------------------------------------------------------ */
/*  Custom BfGID scalar (placeholder passthrough implementation)       */
/* ------------------------------------------------------------------ */
let bfGidScalarRegistered = false;
let bfGidScalarDef: unknown;
function ensureBfGidScalar(): unknown {
  if (bfGidScalarRegistered) return bfGidScalarDef;
  bfGidScalarDef = scalarType({
    name: "BfGID",
    serialize: (v) => v,
    parseValue: (v) => v,
    asNexusMethod: "bfGid",
  });
  bfGidScalarRegistered = true;
  return bfGidScalarDef;
}

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

function toNexusArg(
  spec: GqlScalar | { type: GqlScalar; nullable?: boolean },
) {
  // ── 1. Normalise input ────────────────────────────────────────────
  const scalar = typeof spec === "string" ? spec : spec.type;
  const nullable = typeof spec === "string" ? false : spec.nullable ?? true;

  if (scalar === "json") ensureJsonScalar();
  if (scalar === "BfGID") ensureBfGidScalar();

  // ── 2. Map to GraphQL & wrap in nonNull() if needed ───────────────
  const baseType = scalarMap[scalar] ?? scalar;
  const wrapped = nullable ? baseType : nonNull(baseType);

  return arg({ type: wrapped });
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
    for (const [argName, argSpec] of Object.entries(spec.args)) {
      args[argName] = toNexusArg(argSpec);
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
    /* ────────────────────────────────────────────────────────────────
     * Emit a concrete payload object so linked-field selections work
     * (fixes Isograph "scalar selected as linked field" error).
     * ──────────────────────────────────────────────────────────────── */

    /* 0.  Does this custom mutation have a concrete output spec? */
    const outputFields = cm.output ?? {}; // ← the builder puts fields here
    const hasConcretePayload = Object.keys(outputFields).length > 0;

    /* 1.  If so, create a Nexus object that mirrors those fields ------ */
    let payloadName = "JSON"; // default / fallback

    if (hasConcretePayload) {
      const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
      payloadName = `${cap(cm.name)}${nodeName}Payload`;

      defs.push(
        objectType({
          name: payloadName,
          definition(t) {
            // `t` is an ObjectDefinitionBlock; we need the DefBlock union.
            // A single cast keeps the helpers happy without touching runtime.
            const def = t as any;

            for (const [fname, fspec] of Object.entries(outputFields)) {
              /* ── recognise scalar shorthand ─────────────────────────────── */
              const isScalar = typeof fspec === "string" || // "boolean", "string", …
                (typeof fspec === "object" && // long-form scalar / list
                  fspec &&
                  ("scalarType" in fspec ||
                    (fspec as any).kind === "scalar" ||
                    "type" in fspec));

              if (isScalar) {
                const specObj = typeof fspec === "string"
                  ? { type: fspec, nullable: false } // normalise shorthand
                  : (fspec as any);
                addScalarField(def, fname, specObj);
              } else {
                addRelationField(def, fname, fspec as any);
              }
            }
          },
        }),
      );
    }

    /* 2.  Mutation field (payloadName is either the new type or "JSON") */
    const argsCfg: Record<string, ReturnType<typeof idArg>> = {};
    for (const [argName, argSpec] of Object.entries(cm.args)) {
      argsCfg[argName] = toNexusArg(argSpec);
    }

    defs.push(
      mutationField(`${cm.name}${nodeName}`, {
        type: payloadName, // concrete payload or JSON fallback
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

  /* ------------------------------------------------------------------ */
  /*  Helper: synthesise fields for stub interfaces                      */
  /* ------------------------------------------------------------------ */

  function buildInterfaceFields(iface: string) {
    const mergedFields: Record<string, FieldSpec> = {};
    const mergedRelations: Record<string, RelationSpec> = {};

    // collect every spec that declares `implements iface` and merge its
    // scalar + relation definitions. The simple Object.assign()‑merge is
    // sufficient because field names must be unique across the graph.
    for (const s of Object.values(specs)) {
      if (s?.implements?.includes(iface)) {
        Object.assign(mergedFields, s.field);
        Object.assign(mergedRelations, s.relation);
      }
    }

    return { mergedFields, mergedRelations };
  }

  for (const iface of interfaceNames) {
    if (!(iface in specs)) {
      const { mergedFields, mergedRelations } = buildInterfaceFields(iface);

      allDefs.push(
        interfaceType({
          name: iface,
          definition(t) {
            // DefBlock union lets us reuse the same helpers as for objects.
            const def = t as any;

            for (const [fname, fspec] of Object.entries(mergedFields)) {
              addScalarField(def, fname, fspec);
            }

            for (const [rname, rspec] of Object.entries(mergedRelations)) {
              addRelationField(def, rname, rspec as any);
            }
          },
          resolveType: (v) => (v as { __typename?: string }).__typename,
        }),
      );
    }
  }

  /* 4. Build real specs -------------------------------------------------- */
  for (const [nodeName, spec] of Object.entries(specs)) {
    const isInterface = interfaceNames.has(nodeName);

    /* ── Pure-mutation nodes (no fields, no relations) ────────────────
       Don't create an empty object type – it would be invalid SDL.
       We still add the mutation fields so the class works as a root
       "namespace" for mutations only. */
    const hasFields = Object.keys(spec.field).length > 0;
    const hasRelations = Object.keys(spec.relation).length > 0;
    if (!isInterface && !hasFields && !hasRelations) {
      allDefs.push(...buildMutationFields(nodeName, spec.mutation));
      continue; // ⟵ skip objectType()
    }

    const definition = (t: DefBlock<string>) => {
      /* ------------------------------------------------------------------
       *  Block type is  *either* ObjectDefinitionBlock or
       *  InterfaceDefinitionBlock.  The structural parts we use are
       *  common to both, so cast once to silence the protected-member
       *  mismatch that TS complains about.
       * ------------------------------------------------------------------ */
      const def = t as any;

      for (const [fname, fspec] of Object.entries(spec.field)) {
        addScalarField(def, fname, fspec);
      }
      for (const [rname, rspec] of Object.entries(spec.relation)) {
        addRelationField(def, rname, rspec as any);
      }

      // Original implements
      for (const ifName of spec.implements ?? []) t.implements(ifName);

      /* 4a.  Extra “sibling” interface if needed (SubNode → BaseNode) */
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

    if (!isInterface) {
      allDefs.push(...buildMutationFields(nodeName, spec.mutation));
    }
  }

  /* ------------------------------------------------------------------
   *  Always register the JSON scalar (args & mutations rely on it).
   *  Register the custom BfGID scalar **only** when at least one field
   *  in the compiled specs uses it; otherwise we bloat the type list and
   *  break expectations like the compileSpecs test.
   * ------------------------------------------------------------------ */

  allDefs.push(ensureJsonScalar());

  const needsBfGid = Object.values(specs).some((spec) =>
    Object.values(spec.field).some((f) =>
      (typeof f === "string" && f === "BfGID") ||
      (typeof f === "object" && (f as FieldSpec).type === "BfGID")
    )
  );

  if (needsBfGid) {
    allDefs.push(ensureBfGidScalar());
  }
  return allDefs;
}
