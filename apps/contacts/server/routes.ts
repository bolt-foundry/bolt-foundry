import express, {
  type Express,
  NextFunction,
  Request,
  Response,
} from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, updateContactSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { apiKeyAuth } from "./middleware/auth";
import { rateLimitMiddleware, recordValidationFailure, getRateLimitStatus } from "./middleware/rateLimiter";
import { isVerified, setupAuth } from "./auth";
import {
  getWaitlistEmailTemplate,
  isWaitlistEmailEnabled,
  sendWaitlistWelcomeEmail,
  setWaitlistEmailEnabled,
  updateWaitlistEmailTemplate,
} from "./services/email";
import { sendDiscordNotification } from "./services/discord";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // API Routes prefix
  const apiRouter = express.Router();

  // Health check endpoint (not protected)
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "healthy" });
  });

  // Endpoint to get API key for frontend (not protected)
  app.get("/api/config", (req: Request, res: Response) => {
    res.json({
      apiKey: process.env.API_KEY,
    });
  });

  // Use either API key authentication or user authentication
  apiRouter.use((req: Request, res: Response, next: NextFunction) => {
    // If user is already authenticated and verified, proceed
    if (req.isAuthenticated() && req.user && (req.user as any).isVerified) {
      return next();
    }

    // Otherwise, check for API key
    apiKeyAuth(req, res, next);
  });

  // Get all contacts
  apiRouter.get("/contacts", async (req: Request, res: Response) => {
    try {
      console.log("GET /api/contacts request received");

      console.log("Fetching all contacts from database");
      const contacts = await storage.getAllContacts();

      console.log(`Successfully fetched ${contacts.length} contacts`);
      return res.status(200).json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return res.status(500).json({
        message: "Failed to fetch contacts",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Create new contact
  apiRouter.post("/contacts", rateLimitMiddleware, async (req: Request, res: Response) => {
    try {
      console.log("POST /api/contacts request received");
      console.log("Request body:", JSON.stringify(req.body));

      console.log("Validating contact data");
      const validatedData = insertContactSchema.parse(req.body);

      // Check for dry run mode (email ending with .dryrun@example.com)
      const isDryRun = validatedData.email &&
        /\.dryrun@example\.com$/.test(validatedData.email);

      if (isDryRun) {
        console.log("Dry run detected - skipping database save");
        // Return a simulated response without saving to database
        return res.status(200).json({
          id: 0,
          name: validatedData.name,
          email: validatedData.email,
          company: validatedData.company || null,
          notes: validatedData.notes || null,
          contacted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          emailSentAt: null,
          dryRun: true,
        });
      }

      console.log(
        "Creating new contact with data:",
        JSON.stringify(validatedData),
      );
      const newContact = await storage.createContact(validatedData);

      if (!newContact) {
        console.error(
          "Failed to create contact - database operation returned no data",
        );
        return res.status(500).json({
          message: "Database operation failed to return created contact",
        });
      }

      // Check if we should send a waitlist welcome email
      if (isWaitlistEmailEnabled()) {
        console.log(`Sending waitlist welcome email to ${newContact.email}`);
        try {
          const emailSent = await sendWaitlistWelcomeEmail(
            newContact.email,
            newContact.name,
          );

          if (emailSent) {
            console.log(
              `Successfully sent waitlist welcome email to ${newContact.email}`,
            );

            // Mark the contact as contacted and set emailSentAt
            await storage.updateContact(newContact.id, {
              contacted: true,
              emailSentAt: new Date(),
            });
            console.log(
              `Updated contact ${newContact.id} to contacted=true and set emailSentAt`,
            );

            // Refresh the contact data to include the updated status
            const updatedContact = await storage.getContact(newContact.id);
            if (updatedContact) {
              // Send Discord notification for new contact
              try {
                await sendDiscordNotification(updatedContact);
              } catch (discordError) {
                console.error("Error sending Discord notification:", discordError);
                // Continue with the response, don't fail contact creation if Discord notification fails
              }

              console.log(
                `Successfully created contact with ID ${updatedContact.id} and sent welcome email`,
              );
              return res.status(201).json(updatedContact);
            }
          } else {
            console.error(
              `Failed to send waitlist welcome email to ${newContact.email}`,
            );
          }
        } catch (emailError) {
          console.error("Error sending waitlist welcome email:", emailError);
          // Continue with the response, don't fail the contact creation if email fails
        }
      }

      // Send Discord notification for new contact (don't fail if it errors)
      try {
        await sendDiscordNotification(newContact);
      } catch (discordError) {
        console.error("Error sending Discord notification:", discordError);
        // Continue with the response, don't fail contact creation if Discord notification fails
      }

      console.log(`Successfully created contact with ID ${newContact.id}`);
      return res.status(201).json(newContact);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        console.error(
          "Validation error creating contact:",
          validationError.message,
        );
        // Record this as a validation failure for rate limiting
        recordValidationFailure(req);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating contact:", error);
      return res.status(500).json({
        message: "Failed to create contact",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Update contact (mark as contacted/not contacted)
  apiRouter.patch("/contacts/:id", async (req: Request, res: Response) => {
    try {
      console.log(`PATCH /api/contacts/${req.params.id} request received`);
      console.log("Request body:", JSON.stringify(req.body));

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        console.error(`Invalid contact ID: ${req.params.id}`);
        return res.status(400).json({ message: "Invalid contact ID" });
      }

      console.log(`Looking up contact with ID ${id}`);
      const contact = await storage.getContact(id);
      if (!contact) {
        console.error(`Contact not found with ID ${id}`);
        return res.status(404).json({ message: "Contact not found" });
      }

      console.log(`Validating update data for contact ${id}`);
      const validatedData = updateContactSchema.parse(req.body);

      console.log(
        `Updating contact ${id} with data:`,
        JSON.stringify(validatedData),
      );
      const updatedContact = await storage.updateContact(id, validatedData);

      if (!updatedContact) {
        console.error(
          `Failed to update contact ${id} - database operation returned no data`,
        );
        return res.status(500).json({
          message: "Database operation failed to return updated contact",
        });
      }

      console.log(`Successfully updated contact ${id}`);
      return res.status(200).json(updatedContact);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        console.error(
          `Validation error updating contact:`,
          validationError.message,
        );
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error updating contact:", error);
      return res.status(500).json({
        message: "Failed to update contact",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Bulk delete contacts
  apiRouter.delete("/contacts/bulk", rateLimitMiddleware, async (req: Request, res: Response) => {
    try {
      console.log("DELETE /api/contacts/bulk request received");
      console.log("Request body:", JSON.stringify(req.body));

      const { ids } = req.body;

      // Validate the request
      if (!Array.isArray(ids) || ids.length === 0) {
        console.error("Invalid bulk delete request: ids must be a non-empty array");
        return res.status(400).json({ message: "ids must be a non-empty array" });
      }

      if (ids.some(id => typeof id !== "number" || isNaN(id))) {
        console.error("Invalid bulk delete request: all ids must be valid numbers");
        return res.status(400).json({ message: "All ids must be valid numbers" });
      }

      console.log(`Bulk deleting ${ids.length} contacts: [${ids.join(", ")}]`);

      const deletePromises = ids.map(async (id: number) => {
        try {
          const contact = await storage.getContact(id);
          if (!contact) {
            console.warn(`Contact with ID ${id} not found during bulk delete`);
            return { id, success: false, error: "Contact not found" };
          }

          const result = await storage.deleteContact(id);
          if (result) {
            console.log(`Successfully deleted contact ${id}`);
            return { id, success: true };
          } else {
            console.error(`Failed to delete contact ${id} - database operation did not affect any rows`);
            return { id, success: false, error: "Database operation failed" };
          }
        } catch (error) {
          console.error(`Error deleting contact ${id}:`, error);
          return { id, success: false, error: error instanceof Error ? error.message : String(error) };
        }
      });

      const results = await Promise.all(deletePromises);
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      console.log(`Bulk delete completed: ${successful.length} successful, ${failed.length} failed`);

      return res.status(200).json({
        message: `Bulk delete completed: ${successful.length} successful, ${failed.length} failed`,
        successful: successful.length,
        failed: failed.length,
        results: results
      });
    } catch (error) {
      console.error("Error in bulk delete:", error);
      return res.status(500).json({
        message: "Failed to bulk delete contacts",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Delete contact
  apiRouter.delete("/contacts/:id", async (req: Request, res: Response) => {
    try {
      console.log(`DELETE /api/contacts/${req.params.id} request received`);

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        console.error(`Invalid contact ID: ${req.params.id}`);
        return res.status(400).json({ message: "Invalid contact ID" });
      }

      console.log(`Looking up contact with ID ${id}`);
      const contact = await storage.getContact(id);
      if (!contact) {
        console.error(`Contact not found with ID ${id}`);
        return res.status(404).json({ message: "Contact not found" });
      }

      console.log(`Deleting contact with ID ${id}`);
      const result = await storage.deleteContact(id);

      if (!result) {
        console.error(
          `Failed to delete contact ${id} - database operation did not affect any rows`,
        );
        return res.status(500).json({
          message: "Database operation failed to delete contact",
        });
      }

      console.log(`Successfully deleted contact ${id}`);
      return res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
      console.error("Error deleting contact:", error);
      return res.status(500).json({
        message: "Failed to delete contact",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Get email settings
  apiRouter.get("/email/settings", async (req: Request, res: Response) => {
    try {
      console.log("GET /api/email/settings request received");

      // Use the existing email service function to get settings
      const isEnabled = await isWaitlistEmailEnabled();
      const template = await getWaitlistEmailTemplate();

      const settings = {
        isEnabled,
        template,
      };

      console.log("Successfully retrieved email settings");
      return res.status(200).json(settings);
    } catch (error) {
      console.error("Error retrieving email settings:", error);
      return res.status(500).json({
        message: "Failed to retrieve email settings",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Update email settings
  apiRouter.patch("/email/settings", async (req: Request, res: Response) => {
    try {
      console.log("PATCH /api/email/settings request received");
      console.log("Request body:", JSON.stringify(req.body));

      const { isEnabled } = req.body;

      // Validate the request
      if (typeof isEnabled !== "boolean") {
        console.error(
          "Invalid email settings data: isEnabled must be a boolean",
        );
        return res.status(400).json({ message: "isEnabled must be a boolean" });
      }

      // Update the email enabled setting
      await setWaitlistEmailEnabled(isEnabled);

      // Return the updated settings
      const updatedIsEnabled = await isWaitlistEmailEnabled();
      const template = await getWaitlistEmailTemplate();

      const settings = {
        isEnabled: updatedIsEnabled,
        template,
      };

      console.log(
        `Successfully updated email settings, isEnabled=${isEnabled}`,
      );
      return res.status(200).json(settings);
    } catch (error) {
      console.error("Error updating email settings:", error);
      return res.status(500).json({
        message: "Failed to update email settings",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Update email template
  apiRouter.patch("/email/template", async (req: Request, res: Response) => {
    try {
      console.log("PATCH /api/email/template request received");
      console.log("Request body:", JSON.stringify(req.body));

      const { subject, textContent } = req.body;

      // Validate the request
      if (typeof subject !== "string" || typeof textContent !== "string") {
        console.error(
          "Invalid email template data: subject and textContent must be strings",
        );
        return res.status(400).json({
          message: "subject and textContent must be strings",
        });
      }

      // Update the email template - we'll use a pre tag to preserve
      // formatting for plain text emails when viewed in HTML context
      const success = await updateWaitlistEmailTemplate({
        subject,
        textContent,
      });

      if (!success) {
        console.error("Failed to update email template");
        return res.status(500).json({
          message: "Failed to update email template",
        });
      }

      // Return the updated settings
      const isEnabled = await isWaitlistEmailEnabled();
      const template = await getWaitlistEmailTemplate();

      const settings = {
        isEnabled,
        template,
      };

      console.log("Successfully updated email template");
      return res.status(200).json(settings);
    } catch (error) {
      console.error("Error updating email template:", error);
      return res.status(500).json({
        message: "Failed to update email template",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Send email to a specific contact
  apiRouter.post("/contacts/:id/email", async (req: Request, res: Response) => {
    try {
      console.log(`POST /api/contacts/${req.params.id}/email request received`);

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        console.error(`Invalid contact ID: ${req.params.id}`);
        return res.status(400).json({ message: "Invalid contact ID" });
      }

      console.log(`Looking up contact with ID ${id}`);
      const contact = await storage.getContact(id);
      if (!contact) {
        console.error(`Contact not found with ID ${id}`);
        return res.status(404).json({ message: "Contact not found" });
      }

      // Check if contact is already contacted
      if (contact.contacted) {
        console.error(`Contact ${id} has already been contacted`);
        return res.status(400).json({
          message: "Contact has already been contacted",
        });
      }

      // Send the waitlist welcome email
      console.log(`Sending waitlist welcome email to ${contact.email}`);
      const emailSent = await sendWaitlistWelcomeEmail(
        contact.email,
        contact.name,
        true, // Skip enabled check for manual sending
      );

      if (!emailSent) {
        console.error(
          `Failed to send waitlist welcome email to ${contact.email}`,
        );
        return res.status(500).json({
          message: "Failed to send welcome email",
        });
      }

      console.log(
        `Successfully sent waitlist welcome email to ${contact.email}`,
      );
      // Update contact with email sent timestamp
      await storage.updateContact(id, {
        contacted: true,
        emailSentAt: new Date(),
      });

      console.log(`Successfully updated contact ${id} to contacted=true`);
      return res.status(200).json(await storage.getContact(id)); //return updated contact
    } catch (error) {
      console.error("Error sending email to contact:", error);
      return res.status(500).json({
        message: "Failed to send email to contact",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Debug endpoint to monitor rate limiting status
  apiRouter.get("/rate-limit-status", (req: Request, res: Response) => {
    try {
      const status = getRateLimitStatus();
      const now = Date.now();
      
      const formattedStatus = status.map(({ ip, entry }) => ({
        ip,
        failureCount: entry.failureCount,
        firstFailure: new Date(entry.firstFailure).toISOString(),
        isBlocked: entry.blockedUntil ? now < entry.blockedUntil : false,
        blockedUntil: entry.blockedUntil ? new Date(entry.blockedUntil).toISOString() : null,
        remainingBlockMinutes: entry.blockedUntil && now < entry.blockedUntil 
          ? Math.ceil((entry.blockedUntil - now) / 1000 / 60) 
          : null
      }));

      return res.json({
        totalTrackedIPs: formattedStatus.length,
        blockedIPs: formattedStatus.filter(s => s.isBlocked).length,
        entries: formattedStatus
      });
    } catch (error) {
      console.error("Error getting rate limit status:", error);
      return res.status(500).json({
        message: "Failed to get rate limit status",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Register all API routes with /api prefix
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
