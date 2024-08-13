import * as React from "react";
import { GoogleFilePicker } from "packages/client/components/clipsearch/GoogleFilePicker.tsx";
import { SettingsPageQuery$data } from "packages/__generated__/SettingsPageQuery.graphql.ts";
import { WatchFolderList } from "packages/client/components/settings/WatchFolderList.tsx";
import { FullPageSpinner } from "packages/bfDs/Spinner.tsx";

type Props = {
  settings$key: SettingsPageQuery$data | null;
};

export function WatchFolder({ settings$key }: Props) {
  if (!settings$key) {
    return <FullPageSpinner />;
  }
  return (
    <div className="cs-main">
      <div className="cs-page-header">
        <div className="cs-page-section-title">Watch folders</div>
        <GoogleFilePicker />
      </div>
      <div className="cs-page-content">
        <WatchFolderList settings$key={settings$key} />
      </div>
    </div>
  );
}
