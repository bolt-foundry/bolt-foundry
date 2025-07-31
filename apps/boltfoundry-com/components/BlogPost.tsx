import { Nav } from "./Nav.tsx";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";

// Placeholder for individual blog post view
export function BlogPost({ slug }: { slug: string }) {
  return (
    <div className="landing-page">
      <Nav page="blog" />
      <section className="docs-section">
        <div className="landing-content">
          <div className="blog-layout">
            <h1>Blog Post: {slug}</h1>
            <p>
              Individual blog post functionality is coming soon. This will
              display the full content of the blog post with slug: {slug}
            </p>
            <p>
              Due to GraphQL schema limitations, individual blog posts are not
              yet available.
            </p>
          </div>
        </div>
        <div className="landing-footer">
          <div className="landing-content flexRow gapMedium alignItemsCenter">
            <div className="flex1">
              &copy; 2025 Bolt Foundry. All rights reserved.
            </div>
            <BfDsButton
              size="small"
              variant="ghost"
              icon="brand-discord"
              iconOnly
              href="https://discord.gg/tU5ksTBfEj"
              target="_blank"
            />
            <BfDsButton
              size="small"
              variant="ghost"
              icon="brand-github"
              iconOnly
              href="https://github.com/bolt-foundry/bolt-foundry"
              target="_blank"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
