import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

export type GoogleDriveFileMetadata = {
  id: string;
  name: string;
  mimeType: string;
  parents: string[];
  webViewLink: string;
  files?: Array<GoogleDriveFileMetadata>;
};

export async function fetchMetadata(
  accessToken: string,
  fileId: string,
  fields = ["id", "name", "mimeType", "parents", "webViewLink"],
): Promise<GoogleDriveFileMetadata> {
  const endpointUrl = `https://www.googleapis.com/drive/v3/files/${fileId}`;
  const searchParams = new URLSearchParams();
  searchParams.set("fields", fields.join(","))
  searchParams.set("supportsAllDrives", "true");
  const url = new URL(endpointUrl);
  url.search = searchParams.toString();
  const response = await fetch(url, {
    method: "GET",
    headers: new Headers({
      "Authorization": `Bearer ${accessToken}`,
      "Accept": "application/json",
    }),
  });

  return await response.json();
}

export async function fetchFile(
  accessToken: string,
  fileId: string,
): Promise<Response> {
  const url =
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&supportsAllDrives=true`;
  const response = await fetch(url, {
    method: "GET",
    headers: new Headers({
      "Authorization": `Bearer ${accessToken}`,
    }),
  });

  return response;
}


export async function fetchFolderContents(
  accessToken: string,
  folderId: string,
  fields: string =
    `nextPageToken, files(id)`,
): Promise<GoogleDriveFileMetadata> {
  const searchParams = new URLSearchParams();
  searchParams.set("supportsAllDrives", "true");
  searchParams.set("includeItemsFromAllDrives", "true");
  searchParams.set("q", `'${folderId}' in parents and trashed = false`);
  searchParams.set("fields", fields);
  const endpointUrl = `https://www.googleapis.com/drive/v3/files`;
  const url = new URL(endpointUrl);
  url.search = searchParams.toString();

  logger.debug("fetching folder contents", url);
  const response = await fetch(url, {
    method: "GET",
    headers: new Headers({
      "Authorization": `Bearer ${accessToken}`,
    }),
  });
  const json = await response.json();
  logger.debug("got json", json);

  return json;
}

export async function createFolder(
  accessToken: string,
  parentFolderResourceId: string,
  newFolderName: string,
): Promise<GoogleDriveFileMetadata> {
  const url =
    `https://www.googleapis.com/drive/v3/files?supportsAllDrives=true`;
  const response = await fetch(url, {
    method: "POST",
    headers: new Headers({
      "Authorization": `Bearer ${accessToken}`,
      "Accept": "application/json",
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      "name": newFolderName,
      "mimeType": "application/vnd.google-apps.folder",
      "parents": [parentFolderResourceId],
    }),
  });
  return await response.json();
}
