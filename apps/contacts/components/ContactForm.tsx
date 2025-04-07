import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  company: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm(
  { onSubmit }: { onSubmit: (data: ContactFormData) => void },
) {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          {...form.register("name")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {form.formState.errors.name && (
          <span className="text-red-500">
            {form.formState.errors.name.message}
          </span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          {...form.register("email")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {form.formState.errors.email && (
          <span className="text-red-500">
            {form.formState.errors.email.message}
          </span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Company</label>
        <input
          {...form.register("company")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Save Contact
      </button>
    </form>
  );
}
