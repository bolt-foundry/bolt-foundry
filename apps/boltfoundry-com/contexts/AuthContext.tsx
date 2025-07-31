import * as React from "react";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  login: () => void;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  // Check current auth status on mount
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            query: `
              query CurrentViewer {
                currentViewer {
                  __typename
                  ... on CurrentViewerLoggedIn {
                    personBfGid
                  }
                }
              }
            `,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        logger.info("Auth check response:", data);

        if (data.data?.currentViewer?.__typename === "CurrentViewerLoggedIn") {
          // For now, just set a mock user when logged in
          // In a real app, we'd fetch the person data separately
          const mockUser = {
            id: data.data.currentViewer.personBfGid,
            name: "Test User",
            email: "test@example.com",
            avatarUrl: "",
          };
          logger.info("Setting authenticated user:", mockUser);
          setUser(mockUser);
        } else {
          logger.info(
            "User not authenticated, currentViewer:",
            data.data?.currentViewer,
          );
        }
      } catch (err) {
        logger.error("Auth check error:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const isAuthenticated = !!user;

  const login = React.useCallback(() => {
    // Login will be handled by LoginWithGoogleButton component
    logger.debug("Login initiated");
  }, []);

  const logout = React.useCallback(async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Reload to clear client state
      globalThis.location.href = "/";
    } catch (err) {
      logger.error("Logout error:", err);
      setError(err as Error);
    }
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      error,
      login,
      logout,
    }),
    [user, isLoading, isAuthenticated, error, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
