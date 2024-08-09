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
    <div className="cs-page-content">
      <div className="cs-page-section">
        <GoogleFilePicker />
      </div>
      <WatchFolderList settings$key={settings$key} />
    </div>
  );
}
