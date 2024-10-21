import { WatchFolderList } from "packages/client/components/settings/WatchFolderList.tsx";
import { UserList } from "packages/client/components/clipsearch/UserList.tsx";
import { Link } from "packages/client/components/Link.tsx";
import { FeatureFlag } from "packages/client/components/FeatureFlag.tsx";

type Props = {
  count: number;
  settings$key: unknown;
};

export function ClipsViewNullState({ count, settings$key }: Props) {
  return (
    <div className="flexColumn">
      <div className="cs-page-hero-callout">
        Search <span style={{ fontWeight: 700 }}>{count ?? ""}</span>{" "}
        videos in your library for a topic above.<br />{" "}
        You can manage which videos are active in{" "}
        <Link to="/settings">
          Settings
        </Link>
      </div>
      <FeatureFlag name="placeholder">
        <div className="cs-page-section-outside-header">
          <div className="cs-page-section-title">
            Recent clips
          </div>
        </div>
        <div className="cs-page-section">
          Clips coming soon.....
        </div>
      </FeatureFlag>
      <div className="cs-page-section-outside-header">
        <div className="cs-page-section-title">
          Watched folder
        </div>
        Set up Google Drive watch folders to use this software.
      </div>
      <FeatureFlag name="placeholder">
        <UserList />
      </FeatureFlag>
    </div>
  );
}
