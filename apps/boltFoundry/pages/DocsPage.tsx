import { useRouter } from "apps/boltFoundry/contexts/RouterContext.tsx";
import {
  docComponents,
  type DocSlug,
} from "apps/boltFoundry/__generated__/docsImportMap.ts";
import { HeaderTitle } from "apps/boltFoundry/components/Header/HeaderTitle.tsx";

export function DocsPage() {
  const { routeParams } = useRouter();
  const slug = routeParams.slug || "";

  // Handle root /docs route
  if (!slug || slug === "") {
    return (
      <div className="docs-container">
        <h1>Documentation</h1>
        <p>Welcome to the Bolt Foundry documentation!</p>
        <ul>
          <li>
            <a href="/docs/quickstart">Quickstart Guide</a>
          </li>
          <li>
            <a href="/docs/getting-started">Getting Started</a>
          </li>
          <li>
            <a href="/docs/interactive-demo">Interactive Demo</a>
          </li>
        </ul>
      </div>
    );
  }

  // Look up the component for this slug directly
  const Component = docComponents[slug as DocSlug];

  if (!Component) {
    return (
      <div className="docs-container">
        <h1>Documentation not found</h1>
        <p>The requested documentation page "{slug}" could not be found.</p>
        <p>
          <a href="/docs">Return to documentation home</a>
        </p>
      </div>
    );
  }

  // Render the MDX component
  return (
    <div className="docs-container">
      <Component />
    </div>
  );
}

DocsPage.HeaderComponent = function DocsPageHeaderComponent() {
  const { routeParams } = useRouter();
  const slug = routeParams.slug || "Documentation";
  const title = slug.replace(/-/g, " ").replace(
    /\b\w/g,
    (c) => c.toUpperCase(),
  );

  return (
    <HeaderTitle>
      {title}
    </HeaderTitle>
  );
};
