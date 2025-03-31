import { useState } from "react";
import { BfDsListItem } from "apps/bfDs/components/BfDsListItem.tsx";
import { BfDsList } from "apps/bfDs/components/BfDsList.tsx";

import { ColorsAndFonts } from "apps/bfDs/demo/ColorsAndFonts.tsx";
import { Example as ExampleBreadcrumb } from "apps/bfDs/components/BfDsBreadcrumbs.tsx";
import { Example as ExampleCallout } from "apps/bfDs/components/BfDsCallout.tsx";
import { Example as ExampleDropzone } from "apps/bfDs/components/BfDsDropzone.tsx";
import { Example as ExampleTable } from "apps/bfDs/components/BfDsTable.tsx";
import { Example as ExampleToast } from "apps/bfDs/components/BfDsToast.tsx";
import { Example as ExampleTodos } from "apps/bfDs/components/BfDsTodos.tsx";
import { Example as ExampleList } from "apps/bfDs/components/BfDsList.tsx";
import { Example as ExampleModal } from "apps/bfDs/components/BfDsModal.tsx";
import { Example as ExamplePill } from "apps/bfDs/components/BfDsPill.tsx";
import { Example as ExampleSheet } from "apps/bfDs/components/BfDsSheet.tsx";
import { Demo as GlimmerDemo } from "apps/bfDs/components/BfDsGlimmer.tsx";
import { Buttons } from "apps/bfDs/demo/Buttons.tsx";
import { RouterLink } from "apps/boltFoundry/components/Router/RouterLink.tsx";
import { Form } from "apps/bfDs/components/demo/Form.tsx";
import { IconDemo } from "apps/bfDs/components/BfDsIcon.tsx";
import { Tooltips } from "apps/bfDs/components/demo/Tooltips.tsx";
import { getLogger } from "packages/logger/logger.ts";
import { KitchenSink } from "apps/bfDs/components/demo/KitchenSink.tsx";
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
  const [tab, setTab] = useState(1);

  const demoComponent = demoData[tab]?.component ?? (
    <div>Pick one from the sidebar</div>
  );

  return (
    <div className="ui flexRow">
      <div className="ui-sidebar">
        <RouterLink to="/">Home</RouterLink>
        <h1>Demo</h1>
        <BfDsList>
          {demoData.map((demo, index) => (
            <BfDsListItem
              content={demo.name}
              isHighlighted={index === tab}
              onClick={() => setTab(index)}
              key={demo.name}
            />
          ))}
        </BfDsList>
      </div>
      <div className="ui-content">
        {demoComponent}
      </div>
    </div>
  );
}
