import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Contact,
  FilterValue,
  SortDirection,
  SortField,
  SortState,
} from "@/lib/types";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Search,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ContactTableProps {
  contacts: Contact[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function ContactTable(
  { contacts, onRefresh, isRefreshing = false }: ContactTableProps,
) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState<FilterValue>("all");
  const [sortState, setSortState] = useState<SortState>({
    field: "createdAt",
    direction: "desc",
  });

  // Handle contact status update
  const toggleContactStatus = useMutation({
    mutationFn: async (
      { id, contacted }: { id: number; contacted: boolean },
    ) => {
      try {
        console.log(`Updating contact ${id} to contacted=${contacted}`);
        const response = await apiRequest("PATCH", `/api/contacts/${id}`, {
          contacted,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `Failed to update contact: ${response.status} ${response.statusText}`,
            errorText,
          );
          throw new Error(
            `Failed to update contact: ${response.statusText}. ${errorText}`,
          );
        }

        return response.json();
      } catch (error) {
        console.error("Contact update error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({
        description: "Contact status updated successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Contact update error in onError:", error);
      toast({
        variant: "destructive",
        title: "Error updating contact",
        description: error.message ||
          "Failed to update contact status. Please try again.",
      });
    },
  });

  // Send email to contact
  const sendEmail = useMutation({
    mutationFn: async (contact: Contact) => {
      try {
        console.log(
          `Sending email to contact ${contact.id} (${contact.email})`,
        );
        const response = await apiRequest(
          "POST",
          `/api/contacts/${contact.id}/email`,
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `Failed to send email: ${response.status} ${response.statusText}`,
            errorText,
          );
          throw new Error(
            `Failed to send email: ${response.statusText}. ${errorText}`,
          );
        }

        return response.json();
      } catch (error) {
        console.error("Send email error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({
        description: "Email sent successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Send email error in onError:", error);
      toast({
        variant: "destructive",
        title: "Error sending email",
        description: error.message ||
          "Failed to send the email. Please try again.",
      });
    },
  });

  // Handle contact deletion
  const deleteContact = useMutation({
    mutationFn: async (id: number) => {
      try {
        console.log(`Deleting contact ${id}`);
        const response = await apiRequest("DELETE", `/api/contacts/${id}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `Failed to delete contact: ${response.status} ${response.statusText}`,
            errorText,
          );
          throw new Error(
            `Failed to delete contact: ${response.statusText}. ${errorText}`,
          );
        }

        return response.json();
      } catch (error) {
        console.error("Contact deletion error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({
        description: "Contact deleted successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Contact deletion error in onError:", error);
      toast({
        variant: "destructive",
        title: "Error deleting contact",
        description: error.message ||
          "Failed to delete contact. Please try again.",
      });
    },
  });

  // Handle sort change
  const handleSort = (field: SortField) => {
    setSortState((prevState) => ({
      field,
      direction: prevState.field === field && prevState.direction === "asc"
        ? "desc"
        : "asc",
    }));
  };

  // Filter, sort, and search contacts
  const filteredContacts = useMemo(() => {
    return contacts
      .filter((contact) => {
        // Apply status filter
        if (filterValue === "contacted") return contact.contacted;
        if (filterValue === "not-contacted") return !contact.contacted;
        return true;
      })
      .filter((contact) => {
        // Apply search term
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          contact.name.toLowerCase().includes(term) ||
          contact.email.toLowerCase().includes(term) ||
          contact.company.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => {
        // Apply sorting
        const { field, direction } = sortState;
        let valueA: any = a[field];
        let valueB: any = b[field];

        // Handle date fields
        if (field === "createdAt") {
          valueA = new Date(valueA).getTime();
          valueB = new Date(valueB).getTime();
        }

        // String comparison
        if (typeof valueA === "string" && typeof valueB === "string") {
          return direction === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }

        // Number/Date comparison
        return direction === "asc" ? valueA - valueB : valueB - valueA;
      });
  }, [contacts, filterValue, searchTerm, sortState]);

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  // Sort indicator component
  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortState.field !== field) return null;
    return sortState.direction === "asc"
      ? <ChevronUp className="h-4 w-4 ml-1" />
      : <ChevronDown className="h-4 w-4 ml-1" />;
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium text-gray-900">
                Contact List
              </h2>
              {onRefresh && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={onRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  <span className="sr-only">Refresh contacts</span>
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 text-gray-400 absolute left-2.5 top-2.5" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select
                value={filterValue}
                onValueChange={(value) => setFilterValue(value as FilterValue)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contacts</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="not-contacted">Not Contacted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredContacts.length > 0
            ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Name
                        <SortIndicator field="name" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("email")}
                    >
                      <div className="flex items-center">
                        Email
                        <SortIndicator field="email" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("company")}
                    >
                      <div className="flex items-center">
                        Company
                        <SortIndicator field="company" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center">
                        Date Added
                        <SortIndicator field="createdAt" />
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow
                      key={contact.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {contact.name}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {contact.email}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {contact.company}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {formatDate(contact.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={contact.contacted
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"}
                        >
                          {contact.contacted ? "Contacted" : "Not Contacted"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {contact.contacted
                          ? (
                            <Button
                              variant="link"
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={() =>
                                toggleContactStatus.mutate({
                                  id: contact.id,
                                  contacted: false,
                                })}
                              disabled={toggleContactStatus.isPending}
                            >
                              Mark Pending
                            </Button>
                          )
                          : (
                            <Button
                              variant="link"
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={() => sendEmail.mutate(contact)}
                              disabled={sendEmail.isPending}
                            >
                              Send Email
                            </Button>
                          )}

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="link"
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the contact for
                                {" "}
                                {contact.name}. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteContact.mutate(contact.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )
            : (
              <div className="py-10 text-center bg-white">
                <UserRound className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No contacts found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterValue !== "all"
                    ? "Try adjusting your search or filter settings."
                    : "Add a new contact to get started."}
                </p>
              </div>
            )}
        </div>

        {filteredContacts.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{filteredContacts.length}</span>
                {" "}
                of{" "}
                <span className="font-medium">{filteredContacts.length}</span>
                {" "}
                results
              </p>
            </div>
            {/* Pagination can be added here in the future */}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
