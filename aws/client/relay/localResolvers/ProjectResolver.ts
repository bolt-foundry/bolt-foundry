import { graphql } from "aws/client/deps.ts";
import { ProjectResolverOpurlResolver$key } from "aws/__generated__/ProjectResolverOpurlResolver.graphql.ts";
// fragment reading isn't working, so we can use the ID to hack around it.
// import { readFragment } from "npm:relay-runtime/store/ResolverFragments";

// super hack! We generate the fragment only so we can get the ID.
const _fragment = await graphql`
fragment ProjectResolverOpurlResolver on Project {
  id
}`;

/**
 * @RelayResolver Project.opurl: String
 * @rootFragment ProjectResolverOpurlResolver
 *
 * A greeting for the user which includes their name and title.
 */
export function opurl(projectKey: ProjectResolverOpurlResolver$key): string {
  // @ts-expect-error super hack! Can't access any other fields except the id.
  const id = projectKey.__id;
  const url = getObjectUrl(`${id}.mp4`);

  return url;
}

const availableFiles = {};
const objectUrlCache = {};

if (navigator.storage) {
  await refreshFiles();
} else {
  // deno-lint-ignore no-console
  console.warn("does not support navigator");
}

function getObjectUrl(id: string) {
  // @ts-expect-error #techdebt
  if (objectUrlCache[id]) {
    // @ts-expect-error #techdebt
    return objectUrlCache[id];
  }

  // @ts-expect-error #techdebt
  if (availableFiles[id]) {
    // @ts-expect-error #techdebt
    const url = URL.createObjectURL(availableFiles[id]);
    // @ts-expect-error #techdebt
    objectUrlCache[id] = url;
    return url;
  }
  return null;
}

export async function refreshFiles() {
  try {
    const rootDirectory = await navigator.storage.getDirectory();
    const videosDirectory = await rootDirectory.getDirectoryHandle("videos", {
      create: true,
    });
    // @ts-expect-error #techdebt
    for await (const [id, handle] of videosDirectory.entries()) {
      // @ts-expect-error #techdebt
      availableFiles[id] = await handle.getFile();
    }
    // deno-lint-ignore no-console
    console.log(availableFiles);
  } catch (e) {
    // deno-lint-ignore no-console
    console.error(e);
    // throw e;
  }
}

export function addFile(file: File) {
  // @ts-expect-error #techdebt
  availableFiles[file.name] = file;
  getObjectUrl(`${file.name}.mp4`);
}
