// infra/bff/friends/plugins/lint-plugin-bolt-foundry.ts
const IMPORT_TEXT =
  'import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";\n';

/* -------------------------------------------------------------------------- */
/*  Helper: add the import once (idempotent)                                  */
/* -------------------------------------------------------------------------- */
function ensureImport(
  sourceCode: Deno.lint.SourceCode,
  fixer: Deno.lint.Fixer,
): Deno.lint.Fix[] {
  const hasImport = sourceCode.ast.body.some(
    (n) =>
      n.type === "ImportDeclaration" &&
      n.source.value === "@bolt-foundry/get-configuration-var" &&
      n.specifiers.some(
        (s) =>
          (s.type === "ImportSpecifier" ||
            s.type === "ImportNamespaceSpecifier") &&
          s.local.name === "getConfigurationVariable",
      ),
  );
  if (hasImport) return [];

  const firstNode = sourceCode.ast.body[0];
  return firstNode
    ? [fixer.insertTextBefore(firstNode, IMPORT_TEXT)]
    : [fixer.insertTextBeforeRange([0, 0], IMPORT_TEXT)];
}

/* -------------------------------------------------------------------------- */
/*  Plugin                                                                    */
/* -------------------------------------------------------------------------- */
const plugin: Deno.lint.Plugin = {
  name: "bolt-foundry",
  rules: {
    /* ────────────────────────────────────────────────────────────────────── */
    /*  1. Deno.env → getConfigurationVariable                              */
    /* ────────────────────────────────────────────────────────────────────── */
    "no-env-direct-access": {
      create(context) {
        const { sourceCode } = context;

        return {
          'CallExpression[callee.property.name="get"][callee.object.property.name="env"][callee.object.object.name="Deno"]'(
            node,
          ) {
            context.report({
              node,
              message:
                "avoid Deno.env – use getConfigurationVariable() instead.",
              fix(fixer) {
                return [
                  fixer.replaceText(
                    node,
                    `getConfigurationVariable(${
                      sourceCode.getText(node.arguments[0])
                    })`,
                  ),
                  ...ensureImport(sourceCode, fixer),
                ];
              },
            });
          },
        };
      },
    },

    /* ────────────────────────────────────────────────────────────────────── */
    /*  2. bfNodeSpec must NOT be the first static field                     */
    /* ────────────────────────────────────────────────────────────────────── */
    "no-bfnodespec-first-static": {
      create(context) {
        /** Check each class (declaration or expression). */
        // deno-lint-ignore no-explicit-any
        function checkClass(node: any) {
          // Get static members in source order
          const staticMembers = node.body.body.filter(
            // deno-lint-ignore no-explicit-any
            (m: any) => m.static,
          );
          if (staticMembers.length === 0) return;

          const first = staticMembers[0];
          const isBfNodeSpec = (first.type === "PropertyDefinition" ||
            first.type === "ClassProperty") &&
            first.key &&
            first.key.type === "Identifier" &&
            first.key.name === "bfNodeSpec";

          if (isBfNodeSpec) {
            context.report({
              node: first,
              message:
                "bfNodeSpec can't be the first static item… try declaring gqlSpec first.",
            });
          }
        }

        return {
          ClassDeclaration: checkClass,
          ClassExpression: checkClass,
        };
      },
    },

    /* ────────────────────────────────────────────────────────────────────── */
    /*  3. Prevent logger.setLevel from being committed                      */
    /* ────────────────────────────────────────────────────────────────────── */
    "no-logger-set-level": {
      create(context) {
        const { sourceCode } = context;

        // Check if this file imports getLogger from our logger package
        function hasLoggerImport() {
          return sourceCode.ast.body.some(
            (n) =>
              n.type === "ImportDeclaration" &&
              n.source.value.includes("logger/logger.ts") &&
              n.specifiers.some(
                (s) =>
                  (s.type === "ImportSpecifier" ||
                    s.type === "ImportNamespaceSpecifier") &&
                  s.local.name === "getLogger",
              ),
          );
        }

        return {
          // Match any call to setLevel()
          'CallExpression[callee.property.name="setLevel"]'(node) {
            // Get the object the method is called on
            const objectNode = node.callee.object;

            // Flag for tracking if this is potentially a logger instance
            let isLoggerCall = false;

            // Direct match for variable named "logger"
            if (
              objectNode.type === "Identifier" && objectNode.name === "logger"
            ) {
              isLoggerCall = true;
            }

            // Check for any variable followed by .levels
            if (
              node.arguments.length > 0 &&
              node.arguments[0].type === "MemberExpression" &&
              node.arguments[0].property.name === "levels"
            ) {
              isLoggerCall = true;
            }

            // If we're in a file that imports our logger and this looks like a logger call
            if (
              (hasLoggerImport() && isLoggerCall) ||
              objectNode.name === "logger"
            ) {
              context.report({
                node,
                message:
                  "Avoid committing logger.setLevel() - this should be managed through environment variables.",
                fix(fixer) {
                  // Comment out the line rather than removing it completely
                  return [
                    fixer.insertTextBefore(
                      node,
                      "// UNCOMMENT FOR DEBUGGING ONLY: ",
                    ),
                  ];
                },
              });
            }
          },
        };
      },
    },
  },
};

export default plugin;
