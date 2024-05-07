type GoogleDriveMetadata = {
  id: string;
  name: string;
  mimeType: string;
  parents: string[];
  webViewLink: string;
};

export async function fetchMetadata(
  accessToken: string,
  fileId: string,
): Promise<GoogleDriveMetadata> {
  const url =
    `https://www.googleapis.com/drive/v3/files/${fileId}?supportsAllDrives=true`;
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
