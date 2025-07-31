import { useState } from "react";
import { CfDsListItem } from "@bfmono/apps/cfDs/components/CfDsListItem.tsx";
import { CfDsList } from "@bfmono/apps/cfDs/components/CfDsList.tsx";

import { ColorsAndFonts } from "@bfmono/apps/cfDs/demo/ColorsAndFonts.tsx";
import { Example as ExampleBreadcrumb } from "@bfmono/apps/cfDs/components/CfDsBreadcrumbs.tsx";
import { Example as ExampleCallout } from "@bfmono/apps/cfDs/components/CfDsCallout.tsx";
import { Example as ExampleDropzone } from "@bfmono/apps/cfDs/components/CfDsDropzone.tsx";
import { Example as ExampleTable } from "@bfmono/apps/cfDs/components/CfDsTable.tsx";
import { Example as ExampleTabs } from "@bfmono/apps/cfDs/components/CfDsTabs.tsx";
import { Example as ExampleToast } from "@bfmono/apps/cfDs/components/CfDsToast.tsx";
import { Example as ExampleTodos } from "@bfmono/apps/cfDs/components/CfDsTodos.tsx";
import { Example as ExampleList } from "@bfmono/apps/cfDs/components/CfDsList.tsx";
import { Example as ExampleModal } from "@bfmono/apps/cfDs/components/CfDsModal.tsx";
import { Example as ExamplePill } from "@bfmono/apps/cfDs/components/CfDsPill.tsx";
import { Example as ExampleSheet } from "@bfmono/apps/cfDs/components/CfDsSheet.tsx";
import { Demo as GlimmerDemo } from "@bfmono/apps/cfDs/components/CfDsGlimmer.tsx";
import { Buttons } from "@bfmono/apps/cfDs/demo/Buttons.tsx";
import { RouterLink } from "@bfmono/apps/boltFoundry/components/Router/RouterLink.tsx";
import { Form } from "@bfmono/apps/cfDs/components/demo/Form.tsx";
import { IconDemo } from "@bfmono/apps/cfDs/components/CfDsIcon.tsx";
import { Tooltips } from "@bfmono/apps/cfDs/components/demo/Tooltips.tsx";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { KitchenSink } from "@bfmono/apps/cfDs/components/demo/KitchenSink.tsx";
const _logger = getLogger(import.meta);

type DemoData = {
  name: string;
  component: React.ReactNode;
};
const demoData: Array<DemoData> = [
  {
    name: "Colors and fonts",
    component: <ColorsAndFonts />,
  },
  {
    name: "Breadcrumbs",
    component: (
      <div className="ui-section">
        <h2>Breadcrumbs</h2>
        <ExampleBreadcrumb />
      </div>
    ),
  },
  {
    name: "Buttons",
    component: <Buttons />,
  },
  {
    name: "Callouts",
    component: (
      <div className="ui-section">
        <h2>Callouts</h2>
        <ExampleCallout />
      </div>
    ),
  },
  {
    name: "Dropzone",
    component: (
      <div className="ui-section">
        <h2>Dropzone</h2>
        <ExampleDropzone />
      </div>
    ),
  },
  {
    name: "Forms",
    component: <Form />,
  },
  {
    name: "Glimmers",
    component: (
      <div className="ui-section">
        <h2>Glimmers</h2>
        <GlimmerDemo />
      </div>
    ),
  },
  {
    name: "Icons",
    component: (
      <div className="ui-section">
        <h2>Icons</h2>
        <IconDemo />
      </div>
    ),
  },
  {
    name: "Lists",
    component: (
      <div className="ui-section">
        <h2>Lists</h2>
        <ExampleList />
      </div>
    ),
  },
  {
    name: "Modals",
    component: (
      <div className="ui-section">
        <h2>Modals</h2>
        <ExampleModal />
      </div>
    ),
  },
  {
    name: "Pills",
    component: (
      <div>
        <div className="ui-section">
          <h2>Pills</h2>
          <ExamplePill />
        </div>
      </div>
    ),
  },
  {
    name: "Sheet",
    component: <ExampleSheet />,
  },
  {
    name: "Tabs",
    component: (
      <div className="ui-section">
        <h2>Tabs</h2>
        <ExampleTabs />
      </div>
    ),
  },
  {
    name: "Tables",
    component: (
      <div className="ui-section">
        <h2>Tables</h2>
        <ExampleTable />
      </div>
    ),
  },
  {
    name: "Toasts",
    component: (
      <div className="ui-section">
        <h2>Toasts</h2>
        <ExampleToast />
      </div>
    ),
  },
  {
    name: "Todos",
    component: (
      <div className="ui-section">
        <ExampleTodos />
      </div>
    ),
  },
  {
    name: "Tooltips",
    component: <Tooltips />,
  },
  {
    name: "Kitchen sink",
    component: <KitchenSink />,
  },
];

export function PageUIDemo() {
  const [tab, setTab] = useState(0);

  const demoComponent = demoData[tab]?.component ?? (
    <div>Pick one from the sidebar</div>
  );

  return (
    <div className="ui flexRow">
      <div className="ui-sidebar">
        <RouterLink to="/">Home</RouterLink>
        <h1>Demo</h1>
        <CfDsList>
          {demoData.map((demo, index) => (
            <CfDsListItem
              content={demo.name}
              isHighlighted={index === tab}
              onClick={() => setTab(index)}
              key={demo.name}
            />
          ))}
        </CfDsList>
      </div>
      <div className="ui-content">
        {demoComponent}
      </div>
    </div>
  );
}
