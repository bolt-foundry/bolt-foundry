import { createContext, ReactNode, useContext } from "react";
import {
  useMutation,
  UseMutationResult,
  useQuery,
} from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type User = {
  id: number;
  email: string;
  name: string;
  isVerified: boolean;
  createdAt: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
  resendVerificationMutation: UseMutationResult<void, Error, void>;
};

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  email: string;
  password: string;
  name: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();

  const {
    data: user,
    error,
    isLoading,
    refetch: refetchUser,
  } = useQuery<User | null>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      try {
        console.log("Fetching user data...");
        const res = await fetch("/api/user", {
          method: "GET",
          credentials: "include", // This is crucial for cookies to be sent
          headers: {
            "Accept": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
          },
          cache: "no-store", // Strongest cache prevention setting
        });

        console.log("User fetch response status:", res.status);
        // Log a subset of important headers instead of all headers
        console.log(
          "Response headers - Content-Type:",
          res.headers.get("content-type"),
        );
        console.log(
          "Response headers - Cache-Control:",
          res.headers.get("cache-control"),
        );

        if (res.status === 401) {
          console.log("User not authenticated");
          return null;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }

        const userData = await res.json();
        console.log("User data fetched successfully:", userData);
        return userData;
      } catch (error) {
        console.error("Error fetching user:", error);
        return null;
      }
    },
    initialData: null,
    refetchOnMount: "always", // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnReconnect: true, // Refetch when reconnecting
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes to keep session alive
    staleTime: 30 * 1000, // Data considered fresh for 30 seconds
    retry: 3, // Retry 3 times on failure
    retryDelay: 1000, // Wait 1 second between retries
    networkMode: "always", // Make request even if offline (will fail, but will retry when online)
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message ||
          "Please check your credentials and try again",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterData) => {
      const res = await apiRequest("POST", "/api/register", credentials);
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message ||
          "Please check your information and try again",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/resend-verification");
    },
    onSuccess: () => {
      toast({
        title: "Verification email sent",
        description: "Please check your email to verify your account",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to resend verification email",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        resendVerificationMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
