import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const contactFormSchema = z.object({
  name: z.string().min(1, { message: "Please enter a valid name" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  company: z.string().min(1, { message: "Please enter a company name" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  isVisible?: boolean;
  onClose?: () => void;
}

export function ContactForm({ isVisible = true, onClose }: ContactFormProps) {
  const { toast } = useToast();
  const [alertShown, setAlertShown] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
    },
  });

  const createContact = useMutation({
    mutationFn: async (values: ContactFormValues) => {
      const response = await apiRequest("POST", "/api/contacts", values);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({
        title: "Success",
        description: "Contact added successfully!",
        className: "bg-green-50 text-green-800 border-green-200",
      });
      form.reset();
      setAlertShown(true);

      // Hide the alert after 3 seconds
      setTimeout(() => setAlertShown(false), 3000);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add contact",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: ContactFormValues) {
    createContact.mutate(values);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <Card className="border-blue-200 animate-in slide-in-from-top-5 duration-300 mb-6">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Add New Contact</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@example.com"
                      {...field}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Acme Inc."
                      {...field}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
              disabled={createContact.isPending}
            >
              {createContact.isPending ? "Adding..." : "Add Contact"}
            </Button>
          </form>
        </Form>

        {alertShown && (
          <div className="mt-4 p-3 rounded-md bg-green-50 animate-in fade-in duration-300">
            <p className="text-sm font-medium text-green-800">
              Contact added successfully!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
