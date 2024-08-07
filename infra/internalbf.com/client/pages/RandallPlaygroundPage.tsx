import { React } from "deps.ts";
import {useMutation, useLazyLoadQuery} from "react-relay";
import { graphql } from "infra/internalbf.com/client/deps.ts";
import { BfSymbol } from "packages/bfDs/static/BfSymbol.tsx";
import { Tooltip } from "packages/bfDs/Tooltip.tsx";
import { Icon, IconType } from "packages/bfDs/Icon.tsx";
import { List } from "packages/bfDs/List.tsx";
import { ListItem } from "packages/bfDs/ListItem.tsx";
import { classnames } from "lib/classnames.ts";
import { ClipChangesPage } from "infra/internalbf.com/client/pages/ClipChangesPage.tsx";
import { RandallPlaygroundPageQuery } from "infra/__generated__/RandallPlaygroundPageQuery.graphql.ts";
import { RandallPlaygroundPageAddToGoogleMutation } from "infra/__generated__/RandallPlaygroundPageAddToGoogleMutation.graphql.ts";
import { RandallPlaygroundPagePickFolderMutation } from "infra/__generated__/RandallPlaygroundPagePickFolderMutation.graphql.ts";
import { Button } from "packages/bfDs/Button.tsx";
import { useAppEnvironment } from "infra/internalbf.com/client/contexts/AppEnvironmentContext.tsx";
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
const mutation = await graphql`
  mutation RandallPlaygroundPageMutation($file: File!, $title: String!, $originalClipId: String!) {
    upsertClip(file: $file, title: $title, originalClipId: $originalClipId) {
      title
    }
  }
`;

const query = await graphql`
  query RandallPlaygroundPageQuery {
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
  mutation RandallPlaygroundPageAddToGoogleMutation($code: String!) {
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
  mutation RandallPlaygroundPagePickFolderMutation($folderId: String!) {
    pickGoogleDriveFolder(folderId: $folderId) {
      __typename
    }
  }
`;

type Tab = {
  header: string;
  icon: IconType;
  label: string;
};
type Tabs = Record<string, Tab>;
const tabs: Tabs = {
  qc: {
    header: "Clips ready for QC",
    icon: "starSolid",
    label: "QC",
  },
  changes: {
    header: "Clips with changes",
    icon: "back",
    label: "Changes",
  },
  approved: {
    header: "Clips approved",
    icon: "check",
    label: "Approved",
  },
  rejected: {
    header: "Clips rejected",
    icon: "cross",
    label: "Rejected",
  },
};
export function RandallPlaygroundPage() {
  const data = useLazyLoadQuery<RandallPlaygroundPageQuery>(query, {});
  const [commit, inFlight] = useMutation<
    RandallPlaygroundPageAddToGoogleMutation
  >(mutationToAuthorizeGoogle);
  const [file, setFile] = React.useState<File>();
  const [text, setText] = React.useState<string>("nothing uploaded");
  const [currentTab, setCurrentTab] = useState("qc");
  const [ownerFilter, setOwnerFilter] = useState<string | null>(null);
  const [clientFilter, setClientFilter] = useState<string | null>(null);
  const [currentClipId, setCurrentClipId] = useState<string | null>(null);
  const { GOOGLE_OAUTH_CLIENT_ID } = useAppEnvironment();
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(
    data?.currentViewer?.person?.googleAuthAccessToken ?? null,
  );
  const [commitFolder, inFlightFolder] = useMutation<RandallPlaygroundPagePickFolderMutation>(
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

  const filteredData =
    data?.currentViewer?.organization?.reviewableClips?.nodes ?? [];

  // const currentClip = filteredData.find((item) => item.id === currentClipId);
  const currentClip = {};

  return (
    <>
      <div className="internalPage flexColumn">
        <div className="internalMainHeader">
          <div className="internalLogo">
            <div style={{ height: 32 }}>
              <BfSymbol
                color="var(--backgroundIcon)"
                color2="var(--textSecondary)"
              />
            </div>
            <div>
              <Button
                text={googleAccessToken ? "Authorized!!" : "Authorize Google"}
                onClick={authorizer}
                disabled={googleAccessToken != null}
              />
              <Button text={"Open file picker"} onClick={pickFile} disabled={!googleAccessToken} />
              {tabs[currentTab].header} -{" "}
              {data?.currentViewer?.person?.name ?? "Not set up"}
            </div>
          </div>
        </div>
        <div className="internalMainFilters">
          <Tooltip
            menu={[
              { label: "All people", onClick: () => setOwnerFilter(null) },
            ]}
            position="bottom"
            justification="start"
          >
            <div className="pill">
              {ownerFilter ?? "All people"}
              <Icon name="arrowDown" size={12} />
            </div>
          </Tooltip>
          <Tooltip
            menu={[
              { label: "All clients", onClick: () => setClientFilter(null) },
            ]}
            position="bottom"
            justification="start"
          >
            <div className="pill">
              {clientFilter ?? "All clients"}
              <Icon name="arrowDown" size={12} />
            </div>
          </Tooltip>
        </div>
        <div className="internalMainContent" style={{ flex: "auto" }}>
          <List separator={true}>
            {filteredData.map((item) => {
              let statusColor = "var(--textLight)";
              switch (item.status) {
                case "changes":
                  statusColor = "var(--primaryColor)";
                  break;
                case "approved":
                  statusColor = "var(--success)";
                  break;
                case "rejected":
                  statusColor = "var(--alert)";
                  break;
                default:
                  break;
              }
              const content = (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      className="statusDot"
                      style={{ backgroundColor: statusColor }}
                    />
                  </div>
                  <div className="ellipsis" style={{ flex: "1" }}>
                    {item.title}
                  </div>
                </div>
              );
              const footer = (
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "8px" }}
                >
                  <div className="pill">{item.owner}</div>
                  <div className="pill">{item.client}</div>
                  {item.comments?.length > 0 && (
                    <div className="pill">
                      <Icon name="comment" size={12} />
                      {item.comments?.length}
                    </div>
                  )}
                </div>
              );
              return (
                <ListItem
                  footer={footer}
                  onClick={() => setCurrentClipId(item.id)}
                  content={content}
                />
              );
            })}
          </List>
        </div>
        <div className="internalMobileTabs">
          {Object.entries(tabs).map(([key, tab]) => {
            const color = key === currentTab
              ? "var(--secondaryColor)"
              : undefined;
            const classes = classnames([
              "internalMobileTab",
              { "selected": key === currentTab },
            ]);
            return (
              <div
                className={classes}
                onClick={() => setCurrentTab(key)}
              >
                <Icon name={tab.icon as IconType} color={color} />
                <div>{tab.label}</div>
              </div>
            );
          })}
        </div>
      </div>
      {currentClipId && currentClip?.status === "changes" &&
        (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "100%",
            }}
          >
            <ClipChangesPage
              currentClip={currentClip}
              onClose={() => setCurrentClipId(null)}
            />
          </div>
        )}
    </>
  );
}
