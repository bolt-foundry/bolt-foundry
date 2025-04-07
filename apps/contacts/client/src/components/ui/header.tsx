import { FileText, Home, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./button";

interface HeaderProps {
  userEmail?: string;
}

export function Header({ userEmail }: HeaderProps) {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-semibold text-gray-900">
            Bolt Foundry CMS
          </h1>

          {user && (
            <nav className="hidden md:flex items-center space-x-4">
              <Link href="/">
                <div
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    location === "/"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </div>
              </Link>
              <Link href="/api-docs">
                <div
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    location === "/api-docs"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>API Docs</span>
                </div>
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <>
              <span className="text-sm text-gray-600 hidden md:inline">
                {user.email}
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-sm"
                >
                  Log out
                </Button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Settings className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
