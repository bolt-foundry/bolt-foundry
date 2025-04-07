import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Check, Edit2, Mail, Save, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
  isEnabled: boolean;
}

interface EmailSettings {
  isEnabled: boolean;
  template: EmailTemplate;
}

export function EmailSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editSubject, setEditSubject] = useState("");
  const [editTextContent, setEditTextContent] = useState("");

  // Fetch email settings
  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["/api/email/settings"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/email/settings");

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch email settings: ${response.statusText}. ${errorText}`,
          );
        }

        return response.json() as Promise<EmailSettings>;
      } catch (error) {
        console.error("Error fetching email settings:", error);
        throw error;
      }
    },
  });

  // Set the form values when settings are loaded
  useEffect(() => {
    if (settings?.template) {
      setEditSubject(settings.template.subject);
      setEditTextContent(settings.template.textContent);
    }
  }, [settings]);

  // Update email settings (enabled/disabled)
  const updateSettings = useMutation({
    mutationFn: async ({ isEnabled }: { isEnabled: boolean }) => {
      try {
        const response = await apiRequest("PATCH", "/api/email/settings", {
          isEnabled,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to update email settings: ${response.statusText}. ${errorText}`,
          );
        }

        return response.json() as Promise<EmailSettings>;
      } catch (error) {
        console.error("Error updating email settings:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/email/settings"] });
      toast({
        description: "Email settings updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error updating email settings",
        description: error.message ||
          "Failed to update email settings. Please try again.",
      });
    },
  });

  // Update email template
  const updateTemplate = useMutation({
    mutationFn: async (
      { subject, textContent }: { subject: string; textContent: string },
    ) => {
      try {
        const response = await apiRequest("PATCH", "/api/email/template", {
          subject,
          textContent,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to update email template: ${response.statusText}. ${errorText}`,
          );
        }

        return response.json() as Promise<EmailSettings>;
      } catch (error) {
        console.error("Error updating email template:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/email/settings"] });
      setIsEditorOpen(false);
      toast({
        description: "Email template updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error updating email template",
        description: error.message ||
          "Failed to update email template. Please try again.",
      });
    },
  });

  // Handle toggle change
  const handleToggleChange = (checked: boolean) => {
    updateSettings.mutate({ isEnabled: checked });
  };

  // Handle template save
  const handleTemplateSave = () => {
    updateTemplate.mutate({
      subject: editSubject,
      textContent: editTextContent,
    });
  };

  return (
    <>
      <Card className="mt-4">
        <CardContent className="pt-6">
          <div className="flex flex-row justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-medium text-gray-900">
                Email Settings
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-email"
                checked={settings?.isEnabled || false}
                onCheckedChange={handleToggleChange}
                disabled={isLoadingSettings || updateSettings.isPending}
              />
            </div>
          </div>

          <div className="rounded-md border p-4 bg-gray-50 mb-4">
            <div className="font-medium mb-1 flex justify-between items-center">
              <span>Auto-send emails</span>
              {settings?.isEnabled
                ? (
                  <span className="flex items-center text-green-700 bg-green-50 px-2 py-1 rounded-full text-xs">
                    <Check className="h-3 w-3 mr-1" />
                    Enabled
                  </span>
                )
                : (
                  <span className="flex items-center text-red-700 bg-red-50 px-2 py-1 rounded-full text-xs">
                    <X className="h-3 w-3 mr-1" />
                    Disabled
                  </span>
                )}
            </div>
            <p className="text-sm text-gray-500">
              When enabled, new contacts will automatically receive a welcome
              email and be marked as contacted.
            </p>
          </div>

          <div className="rounded-md border p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="font-medium">Email Template</div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setIsEditorOpen(true)}
              >
                <Edit2 className="h-3 w-3 mr-1" /> Edit Template
              </Button>
            </div>

            {settings?.template
              ? (
                <div className="text-sm text-gray-700 space-y-2">
                  <div>
                    <span className="font-medium">Subject:</span>{" "}
                    {settings.template.subject}
                  </div>
                  <div className="border-t border-dashed border-gray-200 pt-2">
                    <div className="font-medium mb-1">Email Content:</div>
                    <div className="max-h-24 overflow-y-auto bg-white p-2 border rounded-md text-xs font-mono whitespace-pre-wrap">
                      {settings.template.textContent}
                    </div>
                  </div>
                </div>
              )
              : (
                <div className="text-sm text-gray-500 italic">
                  Loading template...
                </div>
              )}
          </div>
        </CardContent>
      </Card>

      {/* Email Template Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Plain Text Email Template</DialogTitle>
            <DialogDescription>
              Customize the plain text email template sent to new contacts. Use
              &#123;&#123;name&#125;&#125; as a placeholder for the contact's
              name.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div className="space-y-2">
              <Label htmlFor="email-subject">Email Subject</Label>
              <Input
                id="email-subject"
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                placeholder="Enter email subject"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-content">Email Content</Label>
              <div className="bg-gray-50 p-2 mb-2 rounded text-sm">
                <Textarea
                  id="email-content"
                  value={editTextContent}
                  onChange={(e) => setEditTextContent(e.target.value)}
                  placeholder="Enter your complete email content"
                  rows={10}
                  className="resize-none my-2 font-mono text-sm"
                />
              </div>
              <p className="text-xs text-gray-500">
                This is a plain text email. Use &#123;&#123;name&#125;&#125; to
                include the contact's name.
                <br />
                For better readability, consider using blank lines between
                paragraphs.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditorOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleTemplateSave}
              disabled={updateTemplate.isPending}
              className="gap-1"
            >
              {updateTemplate.isPending
                ? <span className="animate-spin">↻</span>
                : <Save className="h-4 w-4" />}
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
