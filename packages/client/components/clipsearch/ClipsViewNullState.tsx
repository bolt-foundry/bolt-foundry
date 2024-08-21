import { React } from "deps.ts";
import { WatchFolderList } from "packages/client/components/settings/WatchFolderList.tsx";
import { UserList } from "packages/client/components/clipsearch/UserList.tsx";
import { Link } from "packages/client/components/Link.tsx";

type Props = {
  count: number;
  settings$key: unknown;
};

export function ClipsViewNullState({ count, settings$key }: Props) {
  count = count ?? 0;
  return (
    <div className="flexColumn" style={{ gap: "20px" }}>
      <div
        className="cs-page-section-title"
        style={{ textAlign: "center" }}
      >
        Search your library of {count} videos for a topic above.<br />{" "}
        You can manage which videos are active in{" "}
        <Link to="/settings">
          Settings
        </Link>
      </div>
      <div className="cs-page-section-title">
        Recent clips
      </div>
      <div className="cs-page-section">
        Clips coming soon.....
      </div>
      <div className="cs-page-section-title">
        Watched folder
      </div>
      Set up Google Drive watch folders to use this software.
      {/* <GoogleFilePicker /> */}
      <WatchFolderList settings$key={settings$key} />
      <UserList />
    </div>
  );
}
