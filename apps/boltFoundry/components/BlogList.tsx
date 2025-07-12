import { iso } from "@bfmono/apps/boltFoundry/__generated__/__isograph/iso.ts";
import { RouterLink } from "@bfmono/apps/boltFoundry/components/Router/RouterLink.tsx";
import { CfDsButton } from "@bfmono/apps/cfDs/components/CfDsButton.tsx";
import { blogMetadata } from "@bfmono/apps/boltFoundry/lib/blogHelper.ts";
import { CfDsPill } from "@bfmono/apps/cfDs/components/CfDsPill.tsx";

// Blog list component for BlogPostConnection
export function BlogList() {
  return (
    <main className="blog-main">
      <div className="blog-list">
        <h1>Blog Posts</h1>
        <p>Blog functionality is temporarily disabled.</p>
      </div>
    </main>
  );
}
