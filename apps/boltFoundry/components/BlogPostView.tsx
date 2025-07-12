import { useEffect, useRef } from "react";
import { iso } from "@bfmono/apps/boltFoundry/__generated__/__isograph/iso.ts";
import { PageError } from "@bfmono/apps/boltFoundry/pages/PageError.tsx";
import { marked, Renderer } from "marked";
import { blogMetadata } from "@bfmono/apps/boltFoundry/lib/blogHelper.ts";
import { CfDsPill } from "@bfmono/apps/cfDs/components/CfDsPill.tsx";

// Single blog post view component - temporarily disabled
export function BlogPostView() {
  return (
    <main className="blog-main paper">
      <article className="prose prose-lg">
        <h1>Blog Post</h1>
        <p>Blog functionality is temporarily disabled.</p>
      </article>
    </main>
  );
}
