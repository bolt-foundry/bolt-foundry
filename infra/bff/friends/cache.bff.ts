import { register } from "infra/bff/mod.ts";
import { walk } from "https://deno.land/std/fs/mod.ts";

const BFF_ROOT = Deno.env.get("BFF_ROOT") ?? Deno.cwd();

const paths: Array<string> = [];
const validPaths = [
  `${BFF_ROOT}/packages`,
  `${BFF_ROOT}/infra`,
  `${BFF_ROOT}/experimental`,
  `${BFF_ROOT}/lib`,
];
async function cache() {
  const directory = `${BFF_ROOT}`;
  for await (const entry of walk(directory, { exts: [".ts"] })) {
    const startsWithValidPath = validPaths.some((validPath) =>
      entry.path.startsWith(validPath)
    );
    if (entry.isFile && startsWithValidPath) {
      // deno-lint-ignore no-console
      console.log(`Caching: ${entry.path}`);
      try {
        // await import(entry.path);
        paths.push(entry.path);
      } catch {
        // console.log(`problem w/ ${entry.path}`);
      }
    }
  }
  const cmd = new Deno.Command("deno", {
    args: ["cache", ...paths],
    stdout: "inherit",
    stderr: "inherit",
  });
  const { code } = await cmd.output();
  return code;
}

register("cache", "caches all files", cache);
register("cache:clean", "removes old files", async () => {
  await Deno.remove(`${BFF_ROOT}/vendor`, { recursive: true });
  return cache();
});