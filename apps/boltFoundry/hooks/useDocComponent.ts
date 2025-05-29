import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { loadDocComponent } from "apps/boltFoundry/__generated__/docsImportMap.ts";

interface UseDocComponentResult {
  Component: ComponentType | null;
  loading: boolean;
  error: string | null;
}

export function useDocComponent(slug: string): UseDocComponentResult {
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadComponent() {
      setLoading(true);
      setError(null);
      setComponent(null);

      try {
        const loadedComponent = await loadDocComponent(slug);

        if (!cancelled) {
          if (loadedComponent) {
            setComponent(() => loadedComponent);
            setError(null);
          } else {
            setError(`Documentation page "${slug}" not found`);
          }
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load documentation",
          );
          setLoading(false);
        }
      }
    }

    if (slug) {
      loadComponent();
    } else {
      setLoading(false);
      setError(null);
      setComponent(null);
    }

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { Component, loading, error };
}
