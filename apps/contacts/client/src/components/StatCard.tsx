import { Card, CardContent } from "@/components/ui/card";
import { Contact } from "@/lib/types";
import { PlusCircle } from "lucide-react";
import { EmailSettings } from "@/components/EmailSettings";
import { EmailActivity } from "@/components/EmailActivity";

interface StatCardProps {
  contacts: Contact[];
  onToggleAddContact?: () => void;
}

export function StatCard({ contacts, onToggleAddContact }: StatCardProps) {
  const totalContacts = contacts.length;
  const contactedCount = contacts.filter((contact) => contact.contacted).length;

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Contact Summary
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-md p-3 relative group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-blue-600 font-medium">
                    Total Contacts
                  </p>
                  <p className="text-2xl font-semibold text-blue-800">
                    {totalContacts}
                  </p>
                </div>
                <button
                  onClick={onToggleAddContact}
                  className="text-blue-500 hover:text-blue-600 transition-colors transform hover:scale-110 focus:outline-none"
                  title="Add New Contact"
                >
                  <PlusCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="bg-green-50 rounded-md p-3">
              <p className="text-sm text-green-600 font-medium">Contacted</p>
              <p className="text-2xl font-semibold text-green-800">
                {contactedCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Settings Panel */}
      <EmailSettings />

      {/* Email Activity Panel */}
      <EmailActivity contacts={contacts} />
    </>
  );
}
