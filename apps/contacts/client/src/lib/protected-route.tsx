import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route, zRouteProps } from "wouter";

interface ProtectedRouteProps extends Omit<RouteProps, "component"> {
  component: React.ComponentType;
}

export function ProtectedRoute({
  path,
  component: Component,
  ...rest
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  console.log(
    "ProtectedRoute - Path:",
    path,
    "User:",
    user,
    "Loading:",
    isLoading,
  );

  return (
    <Route
      path={path}
      {...rest}
      component={() => {
        // Always show loading state when we're checking authentication
        if (isLoading) {
          console.log("ProtectedRoute - Loading state for path:", path);
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          );
        }

        // If no user is found, redirect to auth page
        if (!user) {
          console.log("ProtectedRoute - No user, redirecting to /auth");
          return <Redirect to="/auth" />;
        }

        // If user is not verified, redirect to verification page
        if (!user.isVerified) {
          console.log(
            "ProtectedRoute - User not verified, redirecting to /verify",
          );
          return <Redirect to="/verify" />;
        }

        // User is authenticated and verified, render the protected component
        console.log(
          "ProtectedRoute - User authenticated and verified, rendering component",
        );
        return <Component />;
      }}
    />
  );
}
