import { Contact } from "@/lib/types";
import { AlertCircle, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface EmailActivityProps {
  contacts: Contact[];
}

export function EmailActivity({ contacts }: EmailActivityProps) {
  // Get recent contacted contacts (last 5)
  // Get recently emailed contacts by looking at timestamps
  const recentlyContacted = [...contacts]
    .filter((contact) => contact.contacted && contact.emailSentAt)
    .sort((a, b) => {
      const bTime = b.emailSentAt ? new Date(b.emailSentAt).getTime() : 0;
      const aTime = a.emailSentAt ? new Date(a.emailSentAt).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 5);

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="h-5 w-5 text-blue-600" />
          <h3 className="text-base font-medium text-gray-900">
            Recent Email Activity
          </h3>
        </div>

        {recentlyContacted.length > 0
          ? (
            <div className="space-y-3">
              {recentlyContacted.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-start gap-3 border-b border-gray-100 pb-2"
                >
                  <div className="bg-green-100 text-green-800 rounded-full p-1">
                    <Mail className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {contact.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {contact.email}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatDate(contact.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )
          : (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <AlertCircle className="h-8 w-8 text-gray-300 mb-2" />
              <p className="text-sm font-medium text-gray-900">
                No email activity yet
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Email activity will appear here once contacts are added and
                emailed.
              </p>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
