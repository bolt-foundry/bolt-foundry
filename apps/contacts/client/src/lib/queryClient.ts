import { QueryClient, QueryFunction } from "@tanstack/react-query";

// API key storage
let apiKey: string = "";

// Function to fetch API key from the server
async function fetchApiKey(): Promise<string> {
  if (apiKey) return apiKey;

  try {
    const response = await fetch("/api/config");
    if (!response.ok) {
      throw new Error("Failed to fetch API key");
    }
    const data = await response.json();
    apiKey = data.apiKey || "";
    return apiKey;
  } catch (error) {
    console.error("Error fetching API key:", error);
    return "";
  }
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Get API key
  const key = await fetchApiKey();

  // Define headers with API key
  const headers: Record<string, string> = {
    "x-api-key": key,
    "Accept": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  };

  // Add Content-Type header if data is provided
  if (data) {
    headers["Content-Type"] = "application/json";
  }

  try {
    console.log(`Making ${method} request to ${url}`);

    const res = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include", // Critical for sending cookies with request
      cache: "no-store", // Prevent caching
      mode: "cors", // Enable CORS
      redirect: "follow", // Follow redirects automatically
    });

    // Log detailed response info for debugging
    console.log(`${method} ${url} response:`, {
      status: res.status,
      statusText: res.statusText,
      headers: {
        contentType: res.headers.get("content-type"),
        setCookie: res.headers.get("set-cookie"),
      },
    });

    if (!res.ok) {
      console.error(
        `API request failed: ${method} ${url} returned ${res.status} ${res.statusText}`,
      );
    } else {
      console.log(
        `API request succeeded: ${method} ${url} returned ${res.status}`,
      );
    }

    return res;
  } catch (error) {
    console.error(`API request error: ${method} ${url}`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) => async ({ queryKey }) => {
    try {
      // Get API key
      const key = await fetchApiKey();
      const url = queryKey[0] as string;

      console.log(`Making GET request to ${url}`);

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "x-api-key": key,
          "Accept": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
        credentials: "include", // Critical for sending cookies with request
        cache: "no-store", // Prevent caching
        mode: "cors", // Enable CORS
        redirect: "follow", // Follow redirects automatically
      });

      // Log detailed response info for debugging
      console.log(`GET ${url} response:`, {
        status: res.status,
        statusText: res.statusText,
        headers: {
          contentType: res.headers.get("content-type"),
          setCookie: res.headers.get("set-cookie"),
        },
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        console.log(
          `Unauthorized request to ${url}, returning null as configured`,
        );
        return null;
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error(
          `API request failed: GET ${url} returned ${res.status} ${res.statusText}`,
          errorText,
        );
        throw new Error(`${res.status}: ${errorText || res.statusText}`);
      }

      console.log(`API request succeeded: GET ${url} returned ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error(`Query function error:`, error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: true, // Changed to true - refetch when focus returns to window
      staleTime: 5 * 60 * 1000, // 5 minutes instead of Infinity
      retry: 1, // Allow one retry on failure
    },
    mutations: {
      retry: 1, // Allow one retry on failure
    },
  },
});
