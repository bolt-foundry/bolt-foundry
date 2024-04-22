// deno run -A npm:relay-compiler@15.0.0

import { register } from "infra/bff/mod.ts";
import startSpinner from "lib/terminalSpinner.ts";
import { build } from "packages/graphql/schema.ts";

const staticImportFileLocation =
  new URL(import.meta.resolve("packages/__generated__/_graphql_imports.ts"))
    .pathname;

export async function buildRelay(args: Array<string> = []) {
  // deno-lint-ignore no-console
  console.log("compiling relay...");
  let stopSpinner;
  if (args.indexOf("--watch") === -1) {
    stopSpinner = startSpinner();
  }
  await build();

  const cmd = new Deno.Command("deno", {
    args: ["run", "-A", "npm:relay-compiler", ...args],
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });

  const { code } = await cmd.output();

  // read the __generated__ folder and generate a file that imports all the files in it
  // this is so that we can import all the generated files in one go
  // this is needed because the graphql macro doesn't work with dynamic imports

  const dir = Deno.readDir(Deno.cwd() + "/packages/__generated__");
  const imports = [];
  for await (const file of dir) {
    if (file.isFile) {
      if (file.name.startsWith("_")) {
        // deno-lint-ignore no-console
        console.log(file.name);
        continue;
      }
      imports.push(`import "packages/__generated__/${file.name}"`);
      const fileLocation = new URL(
        import.meta.resolve(`packages/__generated__/${file.name}`),
      ).pathname;
      let fileContents = await Deno.readTextFile(fileLocation);

      // Find all require calls
      const requireCalls = [
        ...fileContents.matchAll(/require\((['"])(.*?)\1\)/g),
      ];

      // Create a mapping of module names to variable names
      const modules = new Map();

      // Create unique variable names for each module and replace require calls
      for (const [match, , moduleName] of requireCalls) {
        let variableName = modules.get(moduleName);
        if (!variableName) {
          // Create a new variable name
          variableName = moduleName.replace(/[^a-zA-Z0-9_]/g, "_");
          modules.set(moduleName, variableName);
        }
        fileContents = fileContents.replace(match, variableName);
      }

      // Modify file contents to add ".ts" extension to import paths that appear to be file paths
      fileContents = fileContents.replace(
        /from\s+['"](.+?)['"];/g,
        (match, path) => {
          // Check if the path is likely a file path
          if (
            !/\.[^\/]+$/.test(path) &&
            (path.startsWith("..") || (path.match(/\//g) || []).length > 1)
          ) {
            // Add ".ts" extension if no extension is present
            return match.replace(path, path + ".ts");
          }
          return match;
        },
      );

      // Find the end of the first import statement
      const firstImportEndIndex =
        fileContents.indexOf(";", fileContents.indexOf("import")) + 1;

      // Insert new import statements after the first import
      for (const [moduleName, variableName] of modules) {
        const importStatement =
          `\nimport * as ${variableName} from "packages/__generated__/${moduleName}.ts";`;
        fileContents = fileContents.slice(0, firstImportEndIndex) +
          importStatement + fileContents.slice(firstImportEndIndex);
      }

      fileContents = fileContents.replace(
        "packages/__generated__/./..",
        "packages",
      );

      await Deno.writeTextFile(fileLocation, fileContents);
    }
  }
  await Deno.writeTextFile(
    staticImportFileLocation,
    imports.join("\n"),
  );

  const buildTypesCmd = new Deno.Command("deno", {
    args: ["run", "-A", "packages/graphql/schema.ts", "--compile", ...args],
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });

  const { code: buildCode } = await buildTypesCmd.output();

  if (stopSpinner) {
    stopSpinner();
  }
  if (code === 0 && buildCode === 0) {
    // deno-lint-ignore no-console
    console.log("Relay success.");
    return 0;
  }
  return code || buildCode;
}

register("relay", "Builds relay artifacts.", buildRelay);
