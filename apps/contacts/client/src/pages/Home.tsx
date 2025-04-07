import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Contact } from "@/lib/types";
import { Header } from "@/components/ui/header";
import { ContactForm } from "@/components/ContactForm";
import { StatCard } from "@/components/StatCard";
import { ContactTable } from "@/components/ContactTable";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  const contactsQuery = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  const contacts = contactsQuery.data || [];
  const isLoading = contactsQuery.isLoading;

  // Handle manual refresh of contacts
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await contactsQuery.refetch();
      toast({
        description: "Contacts refreshed successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Refresh failed",
        description: "Failed to refresh contacts. Please try again.",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Toggle contact form visibility
  const toggleContactForm = () => {
    setShowContactForm(!showContactForm);
  };

  // Close contact form
  const closeContactForm = () => {
    setShowContactForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ContactForm
              isVisible={showContactForm}
              onClose={closeContactForm}
            />
            <StatCard
              contacts={contacts}
              onToggleAddContact={toggleContactForm}
            />
          </div>

          <div className="lg:col-span-2">
            {isLoading
              ? (
                <div className="bg-white p-8 rounded-lg shadow flex justify-center items-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto">
                    </div>
                    <p className="mt-4 text-gray-600">Loading contacts...</p>
                  </div>
                </div>
              )
              : (
                <ContactTable
                  contacts={contacts}
                  onRefresh={handleRefresh}
                  isRefreshing={isRefreshing}
                />
              )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              Bolt Foundry CMS Dashboard © {new Date().getFullYear()}
            </p>
            <div className="mt-3 sm:mt-0">
              <Link href="/api-docs">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-code"
                  >
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                  API Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
