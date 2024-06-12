// deno run -A npm:relay-compiler

import { register } from "infra/bff/mod.ts";
import startSpinner from "lib/terminalSpinner.ts";
import { build } from "packages/graphql/schema.ts";

import { getLogger } from "deps.ts";
const logger = getLogger(import.meta);

export async function buildRelay(args: Array<string> = []) {
  const configLocation = args.shift() ?? "packages";
  const staticImportFileLocation = new URL(
    import.meta.resolve(
      `${configLocation}/__generated__/_graphql_imports.ts`,
    ),
  )
    .pathname;
  const relayConfigLocation =
    new URL(import.meta.resolve(`${configLocation}/relay.config.json`))
      .pathname;
  logger.log("compiling relay...");
  let stopSpinner;
  if (args.indexOf("--watch") === -1) {
    stopSpinner = startSpinner();
  }
  await build(configLocation);

  const cmd = new Deno.Command("deno", {
    args: ["run", "-A", "npm:relay-compiler", relayConfigLocation, ...args],
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });

  const { code } = await cmd.output();

  // read the __generated__ folder and generate a file that imports all the files in it
  // this is so that we can import all the generated files in one go
  // this is needed because the graphql macro doesn't work with dynamic imports

  const dir = Deno.readDir(Deno.cwd() + `/${configLocation}/__generated__`);
  const imports = [];
  for await (const file of dir) {
    if (file.isFile) {
      if (file.name.startsWith("_")) {
        logger.log(file.name);
        continue;
      }
      imports.push(`import "${configLocation}/__generated__/${file.name}"`);
      const fileLocation = new URL(
        import.meta.resolve(`${configLocation}/__generated__/${file.name}`),
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
          `\nimport * as ${variableName} from "${configLocation}/__generated__/${moduleName}.ts";`;
        fileContents = fileContents.slice(0, firstImportEndIndex) +
          importStatement + fileContents.slice(firstImportEndIndex);
      }

      fileContents = fileContents.replace(
        `${configLocation}/__generated__/./..`,
        configLocation,
      );

      await Deno.writeTextFile(fileLocation, fileContents);
    }
  }
  await Deno.writeTextFile(
    staticImportFileLocation,
    imports.join("\n"),
  );

  const buildTypesCmd = new Deno.Command("deno", {
    args: [
      "run",
      "-A",
      `${configLocation}/graphql/schema.ts`,
      "--compile",
      configLocation,
    ],
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });

  const { code: buildCode } = await buildTypesCmd.output();

  if (stopSpinner) {
    stopSpinner();
  }
  if (code === 0 && buildCode === 0) {
    logger.log("Relay success.");
    return 0;
  }
  return code || buildCode;
}

register("relay", "Builds all relay artifacts", async (args) => {
  await Promise.all([buildRelay(["packages", ...args]), buildRelay(["infra", ...args])]);
  return 0;
});
register("relay:packages", "Builds packaes relay artifacts.", buildRelay);
register("relay:infra", "builds infra relay artifacts", (args) => {
  return buildRelay(["infra", ...args]);
});
