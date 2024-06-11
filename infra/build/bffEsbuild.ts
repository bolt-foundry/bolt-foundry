import type { esbuild } from "./deps.ts";
import { dirname, join } from "infra/build/deps.ts";
import { getLogger } from "deps.ts";
const logger = getLogger(import.meta);

const REMOTE_MODULE_REGEX = /^https?:\/\//;
const NODE_REGEX = /^node:/;
const denoLockFilePath = `${Deno.env.get("BF_PATH")}/deno.lock`;
const denoLockFile = await Deno.readTextFile(denoLockFilePath);
const denoLock = JSON.parse(denoLockFile);
const vendorManifestFilePath = `${
  Deno.env.get("BF_PATH")
}/vendor/manifest.json`;
const vendorManifestFile = await Deno.readTextFile(vendorManifestFilePath);
const vendorManifest = JSON.parse(vendorManifestFile);

const cacheLocations = await getCacheLocations();

const extractGraphqlTags = (contents: string) => {
  const matches = Array.from(contents.matchAll(/graphql`([\s\S]+?)`/g)).map(
    (match) => match[1].trim(),
  );
  return matches;
};

const replaceTagsWithImports = async (
  contents: string,
  matches: string[],
  rootDirectory = "packages"
) => {
  let updatedContents = contents;
  const artifactsDirectory = `${rootDirectory}/__generated__`;

  const replacements: Record<string, string> = {};

  for (const match of matches) {
    const pattern = /^(?<operationType>\w+)\s+(?<operationName>\w+)/m;

    const { _operationType, operationName } = match.match(pattern)?.groups ??
      {};
    const generatedFileName = `${operationName}.graphql.ts`;
    const generatedFilePath = join(artifactsDirectory, generatedFileName);

    try {
      const filesystemPath =
        new URL(import.meta.resolve(generatedFilePath)).pathname;
      await Deno.stat(filesystemPath);
      const replacement =
        `(async () => { const importedModule = await import('${generatedFilePath}'); return importedModule.default; })()`;

      replacements[match] = replacement;
    } catch (_error) {
      logger.error(
        `Generated Relay file not found for query: ${generatedFilePath}, skipping replacement.`,
      );
    }
  }

  updatedContents = updatedContents.replace(
    /graphql`([\s\S]+?)`/g,
    (fullMatch, group) => {
      const trimmedGroup = group.trim();
      return replacements[trimmedGroup] || fullMatch;
    },
  );

  return updatedContents;
};

async function getCacheLocations() {
  logger.debug("Fetching cache locations...");
  const p = Deno.run({
    cmd: [
      "deno",
      "info",
    ],
    stdout: "piped",
  });
  const { code } = await p.status();
  if (code !== 0) {
    throw new Error("deno info failed");
  }
  const decoder = new TextDecoder("utf-8");
  const output = decoder.decode(await p.output());
  // deno-lint-ignore no-control-regex
  const plainText = output.replace(/\x1b\[[0-9;]*m/g, "");
  const lines = plainText.split("\n");
  const denoDirLocation = lines.find((line) =>
    line.startsWith("DENO_DIR location: ")
  )?.split(
    "DENO_DIR location: ",
  )[1];
  const remoteModulesCache = lines.find((line) =>
    line.startsWith("Remote modules cache: ")
  )?.split(
    "Remote modules cache: ",
  )[1];
  const npmModulesCacheRoot =
    lines.find((line) => line.startsWith("npm modules cache: "))?.split(
      "npm modules cache: ",
    )[1] ?? "./.deno/npm";
  const npmModulesCache = join(npmModulesCacheRoot, "registry.npmjs.org");
  logger.debug("Cache locations fetched successfully.");
  return {
    vendorLocation: `${Deno.env.get("BF_PATH")}/vendor`,
    denoDirLocation,
    remoteModulesCache,
    npmModulesCache,
  };
}

function getPackageName(path: string) {
  const parts = path.split("/");
  if (parts[0].startsWith("@")) {
    return `${parts[0]}/${parts[1]}`;
  }
  return parts[0];
}

export const denoPlugin = {
  name: "deno",
  setup(build: esbuild.PluginBuild) {
    const { onResolve, onLoad } = build;

    onResolve({ filter: NODE_REGEX }, (args) => {
      return {
        path: args.path,
        namespace: "empty",
      };
    });

    onResolve({ filter: /.*/ }, async (args) => {
      if (args.kind === "entry-point") {
        return;
      }
      if (args.path.indexOf("posthog-node") > -1) {
        return {
          namespace: "empty",
          path: args.path,
        };
      }

      let resolvedPath = args.path;
      try {
        resolvedPath = import.meta.resolve(args.path);
      } catch {
        const packageWithDirectories =
          args.resolveDir.split("/registry.npmjs.org/")[1];
        const [parentPackageName, parentPackageVersion] = packageWithDirectories
          .split("/");
        const resolvedSpecifier = denoLock.packages
          .specifiers[`npm:${parentPackageName}@${parentPackageVersion}`];
        const bareResolvedSpecifier = resolvedSpecifier.split("npm:")[1];
        const entry = denoLock.packages.npm[bareResolvedSpecifier];
        const packageName = getPackageName(args.path);
        const packageSpecifier = entry.dependencies[packageName];
        const packageVersion = packageSpecifier.split("@").pop();
        const packageJsonString = await Deno.readTextFile(
          `${cacheLocations.npmModulesCache}/${packageName}/${packageVersion}/package.json`,
        );
        const packageJson = JSON.parse(packageJsonString);
        const restOfThePath = args.path.split(packageName)[1];
        const main = restOfThePath ? `${restOfThePath}.js` : packageJson.main;
        const path =
          `${cacheLocations.npmModulesCache}/${packageName}/${packageVersion}/${main}`;
        return {
          path,
        };
      }
      const url = new URL(resolvedPath);
      switch (url.protocol) {
        case "file:": {
          if (args.kind === "require-call") {
            const pathWithOrWithoutExtension = join(
              args.resolveDir,
              args.path,
            );

            const path = pathWithOrWithoutExtension.endsWith(".ts") ||
                pathWithOrWithoutExtension.endsWith(".js")
              ? pathWithOrWithoutExtension
              : `${pathWithOrWithoutExtension}.js`;

            return {
              path,
            };
          }
          if (args.resolveDir.startsWith(cacheLocations.vendorLocation)) {
            const resolveDirDomain = args.resolveDir.split(
              cacheLocations.vendorLocation + "/",
            )[1].split("/")[0];
            const resolveDirWithDomain =
              `${cacheLocations.vendorLocation}/${resolveDirDomain}`;
            let path = join(resolveDirWithDomain, args.path);

            try {
              await Deno.stat(path);
            } catch {
              const manifestPath = path.replace(
                cacheLocations.vendorLocation,
                "https:/",
              );
              const regex = /(https?:\/\/[^\/]+\/.+?@[\d.]+\/)/;
              const matches = manifestPath.match(regex) ?? "";
              const manifestFolder = vendorManifest.folders[matches[0]];
              if (manifestFolder) {
                const [_, location] = manifestPath.split(matches[0]);
                path = join(
                  cacheLocations.vendorLocation,
                  manifestFolder,
                  location,
                );
              }
              const file = path.split("/").pop();
              const dirFiles = Deno.readDir(dirname(path));
              for await (const dirEntry of dirFiles) {
                if (
                  dirEntry.name.startsWith("#") &&
                  dirEntry.name.endsWith("js")
                ) {
                  const beginningPartOfDirEntry = dirEntry.name.split("_")[0];
                  const choppedFile = `#${
                    file?.substring(0, beginningPartOfDirEntry.length - 1)
                  }`;
                  if (choppedFile === beginningPartOfDirEntry) {
                    const fileContents = await Deno.readTextFile(
                      join(dirname(path), dirEntry.name),
                    );
                    const fileWithoutExtension = file?.split(".")[0];
                    const firstLine = fileContents.split("\n").shift();
                    if (
                      firstLine &&
                      firstLine?.indexOf(fileWithoutExtension ?? "") > -1
                    ) {
                      path = join(dirname(path), dirEntry.name);
                    }
                  }
                }
              }
            }
            return {
              path,
            };
          }

          return {
            namespace: "LOCAL",
            path: url.pathname,
          };
        }

        case "npm:": {
          const [specifierWithNoSlash, ...rest] = url.pathname.split("/")
          const specifier = `npm:${specifierWithNoSlash}`;
          const resolvedSpecifier = denoLock.packages.specifiers[specifier];
          logger.debug(
            `Resolved specifier: ${resolvedSpecifier} for ${specifier} from ${args.path}`,
          );
          const packageSpecifier =
            resolvedSpecifier.split("_")[0].split("npm:")[1];
          const [packageName, packageVersion] = packageSpecifier.split("@");
          const packagePath =
            `${cacheLocations.npmModulesCache}/${packageName}/${packageVersion}`;
          const packageJsonPath = join(packagePath, "package.json");
          logger.debug(`Loading ${packageJsonPath}`);
          const packageJsonString = await Deno.readTextFile(packageJsonPath);
          const packageJson = JSON.parse(packageJsonString);
          const main = packageJson.main ?? "index.js";
          let mainPath = join(packagePath, main);
          //  check if mainPath is a directory
          const stat = await Deno.stat(mainPath);
          if (stat.isDirectory) {
            mainPath = join(mainPath, "index.js");
          }

          
          if (rest.length > 2) {
            const restPath = rest.join("/");
            const completeRestPath = join(packagePath, restPath);
            const restPathStat = await Deno.stat(completeRestPath);
            if (restPathStat.isFile) {
              mainPath = completeRestPath;
            }
          }


          return {
            path: mainPath,
            pluginData: {
              specifier,
            },
          };
        }
      }
    });

    onResolve({ filter: REMOTE_MODULE_REGEX }, async (args: unknown) => {
      const vendorDirectory = cacheLocations.vendorLocation;
      const url = new URL(args.path);
      const vendorDomain = url.hostname;
      const vendorPath = `${vendorDirectory}/${vendorDomain}${url.pathname}`;
      const filename = url.pathname.split("/").pop() ?? "";
      const vendorPathPrefix = vendorPath.split(filename)[0];
      // find file that starts with "#${filename}_" and ends in ".js"
      const vendorFiles = Deno.readDir(vendorPathPrefix);
      for await (const file of vendorFiles) {
        if (
          file.name.startsWith(`#${filename}_`) && file.name.endsWith(".js")
        ) {
          const path = join(vendorPathPrefix, file.name);
          return {
            path,
          };
        }
      }
    });

    onLoad({ filter: /.*/, namespace: "LOCAL" }, async (args) => {
      const source = await Deno.readTextFile(args.path);
      const graphqlTags = extractGraphqlTags(source);
      let contents = source;
      if (graphqlTags.length > 0) {
        const relativeLocation = args.path.split(Deno.env.get("BF_PATH") ?? "")[1];
        const rootDirectory = relativeLocation.split("/")[1];
        
        contents = await replaceTagsWithImports(source, graphqlTags, rootDirectory);
      }
      const ext = args.path.match(/[^.]+$/);
      const loader = (ext ? ext[0] : "ts") as esbuild.Loader;

      logger.debug(`Loading local module: ${args.path}`);
      return { contents, loader };
    });

    onLoad({ filter: /.*/, namespace: "empty" }, (args) => {
      // Creating a Proxy to handle any named import dynamically.
      // This will cater to both default and named exports.
      const contents = `
        const handler = {
          get: (target, prop) => undefined
        };
        const moduleProxy = new Proxy({}, handler);
        export default moduleProxy;
        export const Buffer = undefined;
      `;
      const loader = "js"; // JavaScript loader for the content

      logger.debug(`Handling 'empty' namespace for module: ${args.path}`);
      return { contents, loader };
    });
  },
};
