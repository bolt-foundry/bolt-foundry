import { useRouter } from "apps/boltFoundry/contexts/RouterContext.tsx";
import { HeaderTitle } from "apps/boltFoundry/components/Header/HeaderTitle.tsx";
import { useDocComponent } from "apps/boltFoundry/hooks/useDocComponent.ts";

export function DocsPage() {
  const { routeParams } = useRouter();
  const slug = routeParams.slug || "";
  const { Component, loading, error } = useDocComponent(slug);

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

  if (loading) {
    return (
      <div className="docs-container">
        <p>Loading documentation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="docs-container">
        <h1>Documentation Error</h1>
        <p>{error}</p>
        <p>
          <a href="/docs">Return to documentation home</a>
        </p>
      </div>
    );
  }

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
