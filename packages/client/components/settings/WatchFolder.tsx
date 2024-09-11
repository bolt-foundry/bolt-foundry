import * as React from "react";
import { GoogleFilePicker } from "packages/client/components/clipsearch/GoogleFilePicker.tsx";
import type { SettingsPageQuery$data } from "packages/__generated__/SettingsPageQuery.graphql.ts";
import { WatchFolderList } from "packages/client/components/settings/WatchFolderList.tsx";
import { BfDsGlimmer } from "packages/bfDs/BfDsGlimmer.tsx";
const { Suspense } = React;

type Props = {
  settings$key: SettingsPageQuery$data | null;
};

export function WatchFolder({ settings$key }: Props) {
  return (
    <div className="cs-main">
      <div className="cs-page-header">
        <div className="cs-page-section-title">Watch folders</div>
        <GoogleFilePicker />
      </div>
      <div className="cs-page-content">
        <Suspense fallback={<BfDsGlimmer height="400px" order={0} />}>
          <WatchFolderList settings$key={settings$key} />
        </Suspense>
      </div>
    </div>
  );
}
