import * as React from "react";
import { useLazyLoadQuery, useMutation } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { useAppEnvironment } from "packages/client/contexts/AppEnvironmentContext.tsx";
import type { GoogleFilePickerAddToGoogleMutation } from "packages/__generated__/GoogleFilePickerAddToGoogleMutation.graphql.ts";
import type { GoogleFilePickerPickFolderMutation } from "packages/__generated__/GoogleFilePickerPickFolderMutation.graphql.ts";
import type { GoogleFilePickerQuery } from "packages/__generated__/GoogleFilePickerQuery.graphql.ts";
const { useState } = React;

export enum GoogleDriveFilePickerFileType {
  VIDEO = "video",
  FOLDER = "folder",
}

function openPicker(
  oauthToken: string,
  appId: string,
  type: GoogleDriveFilePickerFileType = GoogleDriveFilePickerFileType.VIDEO,
): Promise<google.picker.ResponseObject> {
  return new Promise((resolve, reject) => {
    const gapiload = new Promise<void>((gapiResolve) => {
      gapi.load("picker", () => {
        gapiResolve();
      });
    });

    const showPicker = async () => {
      await gapiload;
      const sharedDrive = new google.picker.DocsView(google.picker.ViewId.DOCS);
      sharedDrive.setEnableDrives(true).setIncludeFolders(true);

      switch (type) {
        case GoogleDriveFilePickerFileType.FOLDER: {
          sharedDrive.setSelectFolderEnabled(true).setMimeTypes(
            "application/vnd.google-apps.folder",
          );
        }
      }

      const picker = new google.picker.PickerBuilder()
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
    const popup = globalThis.open(url, "Google Authorization", features);
    globalThis.addEventListener("message", (event) => {
      if (event.data.code) {
        resolve(event.data.code);
        popup?.postMessage("close", "*");
      }
    });
  });
}

const query = await graphql`
  query GoogleFilePickerQuery {
    currentViewer {
    person {
      name
      googleAuthAccessToken
    }
  }
}
`;

const mutationToAuthorizeGoogle = await graphql`
  mutation GoogleFilePickerAddToGoogleMutation($code: String!) {
    linkAdvancedGoogleAuth(code: $code) {
      ... on BfCurrentViewer {
        person {
          googleAuthAccessToken
        }
      }
    }
  }
`;

const mutationToPickFolder = await graphql`
  mutation GoogleFilePickerPickFolderMutation($resourceId: String!, $name: String!) {
    addFolderToCollection(googleDriveResourceId: $resourceId, name: $name) {
      __typename
    }
  }
`;

export function GoogleFilePicker() {
  const data = useLazyLoadQuery<GoogleFilePickerQuery>(query, {});
  const [commit, inFlight] = useMutation<
    GoogleFilePickerAddToGoogleMutation
  >(mutationToAuthorizeGoogle);
  const { GOOGLE_OAUTH_CLIENT_ID } = useAppEnvironment();
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(
    data?.currentViewer?.person?.googleAuthAccessToken ?? null,
  );
  const [commitFolder, inFlightFolder] = useMutation<
    GoogleFilePickerPickFolderMutation
  >(
    mutationToPickFolder,
  );
  async function authorizer() {
    try {
      const code = await authorizeGdrive();
      commit({
        variables: { code },
        // @ts-expect-error #techdebt
        onCompleted: (data) => {
          // deno-lint-ignore no-console
          console.log(data);
          setGoogleAccessToken(
            data.linkAdvancedGoogleAuth?.person?.googleAuthAccessToken,
          );
        },
        onError: (error: unknown) => {
          // deno-lint-ignore no-console
          console.error(error);
        },
      });
    } catch (e) {
      // deno-lint-ignore no-console
      console.error(e);
    }
  }
  async function pickFile() {
    const folder = await openPicker(
      googleAccessToken!,
      GOOGLE_OAUTH_CLIENT_ID!,
      GoogleDriveFilePickerFileType.FOLDER,
    );
    commitFolder({
      variables: { resourceId: folder.docs[0].id, name: folder.docs[0].name },
    });
  }

  return (
    <div>
      {googleAccessToken
        ? (
          <BfDsButton
            iconLeft="plus"
            text={"Choose Folder"}
            onClick={pickFile}
            disabled={!googleAccessToken}
          />
        )
        : (
          <BfDsButton
            text={googleAccessToken ? "Authorized!!" : "Authorize Google"}
            onClick={authorizer}
            disabled={googleAccessToken != null}
          />
        )}
    </div>
  );
}
