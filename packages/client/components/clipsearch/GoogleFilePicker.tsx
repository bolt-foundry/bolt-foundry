import * as React from "react";
import {useMutation, useLazyLoadQuery} from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { Button } from "packages/bfDs/Button.tsx";
import { useAppEnvironment } from "packages/client/contexts/AppEnvironmentContext.tsx";
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
    const popup = window.open(url, "Google Authorization", features);
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
    organization {
      reviewableClips(first: 10) {
        nodes {
          id
          title
          mediaUrl
        }
      } 
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
  mutation GoogleFilePickerPickFolderMutation($folderId: String!) {
    pickGoogleDriveFolder(folderId: $folderId) {
      __typename
    }
  }
`;

export function GoogleFilePicker(){
  const data = useLazyLoadQuery<GoogleFilePickerQuery>(query, {});
  const [commit, inFlight] = useMutation<
    GoogleFilePickerAddToGoogleMutation
  >(mutationToAuthorizeGoogle);
  const { GOOGLE_OAUTH_CLIENT_ID } = useAppEnvironment();
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(
    data?.currentViewer?.person?.googleAuthAccessToken ?? null,
  );
  const [commitFolder, inFlightFolder] = useMutation<GoogleFilePickerPickFolderMutation>(
    mutationToPickFolder,
  )
  async function authorizer() {
    try {
      const code = await authorizeGdrive();
      commit({
        variables: { code },
        onCompleted: (data) => {
          console.log(data);
          setGoogleAccessToken(data.linkAdvancedGoogleAuth?.person?.googleAuthAccessToken);
        },
        onError: (error) => {
          console.error(error);
        }
      });
    } catch (e) {
      console.error(e);
    }
  }
  async function pickFile() {
    const folder = await openPicker(googleAccessToken!, GOOGLE_OAUTH_CLIENT_ID!, GoogleDriveFilePickerFileType.FOLDER)
    commitFolder({
      variables: { folderId: folder.docs[0].id, name: folder.docs[0].name },
      onCompleted: (data) => {
        console.log('o shit we did it')
      }
    });

  }
  
  return (
    <div>
      <Button
        text={googleAccessToken ? "Authorized!!" : "Authorize Google"}
        onClick={authorizer}
        disabled={googleAccessToken != null}
      />
      <Button text={"Open file picker"} onClick={pickFile} disabled={!googleAccessToken} />
      {data?.currentViewer?.person?.name ?? "Not set up"}
    </div>
  )
}