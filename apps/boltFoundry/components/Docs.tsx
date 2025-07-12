import { useState } from "react";
import { CfDsButton } from "@bfmono/apps/cfDs/components/CfDsButton.tsx";
import { Nav } from "@bfmono/apps/boltFoundry/components/Nav.tsx";

export function Docs({ parameters }: { parameters?: { slug?: string } }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const currentSlug = parameters?.slug || "getting-started";

  return (
    <div className="docs">
      <Nav />
      <section className="landing docs-container flexColumn">
        <div className="docs-content">
          <div className="docs-layout">
            <div className="docs-sidebar-container">
              <div className="docs-sidebar-toggle">
                <CfDsButton
                  iconLeft={showSidebar ? "back" : "menu"}
                  text=""
                  size="medium"
                />
                <div
                  className="flex1"
                  onClick={() => {
                    setShowSidebar(!showSidebar);
                  }}
                >
                  {currentSlug}
                </div>
              </div>
            </div>
            <main className="docs-main paper">
              <article className="prose prose-lg">
                <h1>Documentation</h1>
                <p>Documentation functionality is temporarily disabled.</p>
              </article>
            </main>
          </div>
        </div>
        <div className="landing-footer">
          <div className="landing-content flexRow gapMedium alignItemsCenter">
            <div className="flex1">
              &copy; 2025 Bolt Foundry. All rights reserved.
            </div>
            <CfDsButton
              size="medium"
              kind="danDim"
              iconLeft="brand-discord"
              href="https://discord.gg/tU5ksTBfEj"
              hrefTarget="_blank"
            />
            <CfDsButton
              size="medium"
              kind="danDim"
              iconLeft="brand-github"
              href="https://github.com/bolt-foundry/bolt-foundry"
              hrefTarget="_blank"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
