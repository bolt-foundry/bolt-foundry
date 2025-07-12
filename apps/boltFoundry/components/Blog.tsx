import { CfDsButton } from "@bfmono/apps/cfDs/components/CfDsButton.tsx";
import { BlogSimple } from "./BlogSimple.tsx";
import { Nav } from "@bfmono/apps/boltFoundry/components/Nav.tsx";

// Main Blog component - temporarily disabled
export function Blog({ parameters }: { parameters?: { slug?: string } }) {
  return (
    <div className="landing-page">
      {/* Header */}
      <Nav page="blog" />
      {/* Blog Content */}
      <section className="docs-section">
        <div className="landing-content">
          <div className="blog-layout">
            <div>
              <h1>Blog</h1>
              <p>Blog functionality is temporarily disabled.</p>
            </div>
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