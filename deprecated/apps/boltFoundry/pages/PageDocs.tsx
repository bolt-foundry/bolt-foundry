import { PageError } from "./PageError.tsx";
import { useRouter } from "@bfmono/apps/boltFoundry/contexts/RouterContext.tsx";

export function PageDocs() {
  const { routeParams } = useRouter();
  const slug = routeParams.slug as string;

  // TODO: This will be replaced with Isograph data fetching
  // For now, return a placeholder that doesn't use backend services
  const htmlContent =
    `<h1>Documentation: ${slug}</h1><p>This page will display documentation content via GraphQL.</p>`;

  if (!slug) {
    return <PageError error={new Error(`Documentation page not found`)} />;
  }

  return (
    <div className="docs-container max-w-4xl mx-auto px-4 py-8">
      <article
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
