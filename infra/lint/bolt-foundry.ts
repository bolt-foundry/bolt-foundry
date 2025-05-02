// infra/bff/friends/plugins/lint-plugin-bolt-foundry.ts
const IMPORT_TEXT =
  'import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";\n';

/** Insert the import once (idempotent) */
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

const plugin: Deno.lint.Plugin = {
  name: "bolt-foundry",
  rules: {
    "no-env-direct-access": {
      /* only matches `Deno.env.get("FOO")` */
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
                  // 1️⃣ replace the offending call
                  fixer.replaceText(
                    node,
                    `getConfigurationVariable(${
                      sourceCode.getText(
                        node.arguments[0],
                      )
                    })`,
                  ),
                  // 2️⃣ add the import if it’s missing
                  ...ensureImport(sourceCode, fixer),
                ];
              },
            });
          },
        };
      },
    },
  },
};

export default plugin;
