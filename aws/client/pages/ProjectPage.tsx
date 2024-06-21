import { graphql, React, ReactRelay } from "aws/client/deps.ts";
import { useAppEnvironment } from "aws/client/contexts/AppEnvironmentContext.tsx";
import type { ProjectPageQuery } from "aws/__generated__/ProjectPageQuery.graphql.ts";
import type ProjectPageLinkGoogleAccountMutation from "aws/__generated__/ProjectPageLinkGoogleAccountMutation.graphql.ts";
import type ProjectPageCreateGoogleDriveFileMutation from "aws/__generated__/ProjectPageCreateGoogleDriveFileMutation.graphql.ts";
const { useCallback, useState } = React;
const { useLazyLoadQuery, useMutation } = ReactRelay;

const accessTokenQuery = await graphql`
  query ProjectPageQuery {
    currentViewer {
      googleAccessToken
    }
  }
`;

const linkGoogleAccountMutation = await graphql`
  mutation ProjectPageLinkGoogleAccountMutation($code: String!) {
    linkGoogleAccount(code: $code) {
      googleAccessToken
    }
  }
`;

const pickFileMutation = await graphql`
  mutation ProjectPageCreateGoogleDriveFileMutation($googleFileId: String!) {
    createBfMediaGoogleDrive(googleFileId: $googleFileId) {
      googleFileId
    }
  }
`;

// Create and render a Google Picker object for selecting from Drive.
function openPicker(
  oauthToken: string,
  appId: string,
): Promise<google.picker.ResponseObject> {
  return new Promise((resolve, reject) => {
    const gapiload = new Promise<void>((gapiResolve) => {
      gapi.load("picker", () => {
        gapiResolve();
      });
    });

    const showPicker = async () => {
      await gapiload;
      // Updated to use DocsView for videos and include folders
      const myDrive = new google.picker.DocsView(google.picker.ViewId.DOCS);
      myDrive.setIncludeFolders(true);
      const sharedDrive = new google.picker.DocsView(google.picker.ViewId.DOCS);
      sharedDrive.setEnableDrives(true).setIncludeFolders(true);

      const picker = new google.picker.PickerBuilder()
        .addView(myDrive)
        .addView(sharedDrive)
        .setOAuthToken(
          oauthToken,
        )
        .setAppId(appId)
        .setCallback((pickerResponse) => {
          switch (pickerResponse.action) {
            case google.picker.Action.PICKED:
              resolve(pickerResponse);
              break;
            case google.picker.Action.CANCEL:
              reject(new Error("User cancelled"));
              break;
          }
        })
        .build();
      picker.setVisible(true);
    };
    return showPicker();
  });
}

function authorizeGdrive(): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = `/google/oauth/start`;
    // center the popup on the screen
    const width = 600;
    const height = 800;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const features =
      `scrollbars=yes, width=${width}, height=${height}, top=${top}, left=${left}`;
    const popup = window.open(url, "Google Authorization", features);
    // @ts-expect-error - added to window
    window.resolveGoogleAuth = (result: string, error?: Error) => {
      // @ts-expect-error - added to window
      delete window.resolveGoogleAuth;
      popup?.close();
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    };
  });
}

export default function ProjectPage() {
  const [commit] = useMutation<
    typeof ProjectPageLinkGoogleAccountMutation
  >(linkGoogleAccountMutation);
  const [commitPickFile] = useMutation<
    typeof ProjectPageCreateGoogleDriveFileMutation
  >(pickFileMutation);
  const data = useLazyLoadQuery<ProjectPageQuery>(accessTokenQuery, {});
  const { GOOGLE_OAUTH_CLIENT_ID } = useAppEnvironment();
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(
    data?.currentViewer?.googleAccessToken ?? null,
  );
  const [fileId, setFileId] = useState<string | null>(null);
  const authorize = useCallback(async () => {
    try {
      const code = await authorizeGdrive();
      commit({
        variables: { code },
        onCompleted: (res) => {
          setGoogleAccessToken(res.linkGoogleAccount.googleAccessToken);
        },
      });
    } catch (e) {
      // deno-lint-ignore no-console
      console.log("Error authorizing", e);
    }
  }, [GOOGLE_OAUTH_CLIENT_ID]);

  const openPickerClick = useCallback(async () => {
    if (!googleAccessToken) {
      // deno-lint-ignore no-console
      console.log("No google access token");
      return;
    }
    try {
      const response = await openPicker(
        googleAccessToken,
        GOOGLE_OAUTH_CLIENT_ID,
      );
      if (!response.docs || response.docs.length === 0) {
        // deno-lint-ignore no-console
        console.log("No file selected");
        return;
      }
      const googleFileId = response.docs[0].id;
      commitPickFile({
        variables: { googleFileId },
        onCompleted: (res) => {
          setFileId(res.createBfMediaGoogleDrive.googleFileId);
        },
      });
    } catch (e) {
      // deno-lint-ignore no-console
      console.log("Error opening picker", e);
    }
  }, [GOOGLE_OAUTH_CLIENT_ID, googleAccessToken]);
  return (
    <>
      {googleAccessToken
        ? (
          <>
            <p>Authorized</p>
            <button onClick={() => openPickerClick()}>
              open google drive picker
            </button>
          </>
        )
        : (
          <>
            <p>Not yet authorized.</p>
            <button onClick={() => authorize()}>authorize</button>
          </>
        )}
      {fileId ? <p>File ID: {fileId}</p> : null}
    </>
  );
}
