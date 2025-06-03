import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { PageError } from "apps/boltFoundry/pages/PageError.tsx";
import { getLogger } from "packages/logger/logger.ts";
import { marked } from "marked";

const _logger = getLogger(import.meta);

export const Docs = iso(`
  field Query.Docs($slug: String) @component {
    documentsBySlug(slug: $slug) {
      id
      content
    }
  }
`)(function Docs({ data }) {
  const blogPost = data.documentsBySlug;

  if (!blogPost) {
    return <PageError error={new Error(`Documentation page not found`)} />;
  }

  // Convert markdown to HTML
  const htmlContent = marked(blogPost.content) as string;

  return (
    <div className="docs-container max-w-4xl mx-auto px-4 py-8">
      <article
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
});
