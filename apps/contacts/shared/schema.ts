import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  isVerified: boolean("is_verified").notNull().default(false),
  verificationToken: text("verification_token"),
  verificationTokenExpiry: timestamp("verification_token_expiry"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User registration input validation
export const insertUserSchema = createInsertSchema(users)
  .pick({
    email: true,
    password: true,
    name: true,
  })
  .extend({
    email: z.string().email().refine(
      (email) => email.endsWith("@boltfoundry.com"),
      { message: "Only boltfoundry.com email addresses are allowed" },
    ),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  });

// User login input validation
export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type User = typeof users.$inferSelect;

// Contact table schema
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  contacted: boolean("contacted").notNull().default(false),
  emailSentAt: timestamp("email_sent_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  company: true,
}).extend({
  name: z.string().min(1).max(100).refine(
    (name) => {
      // Block SQL injection patterns
      const sqlPatterns = [
        /select\s*\(/i,
        /union\s+select/i,
        /insert\s+into/i,
        /update\s+set/i,
        /delete\s+from/i,
        /drop\s+table/i,
        /sleep\s*\(/i,
        /waitfor\s+delay/i,
        /benchmark\s*\(/i,
      ];

      return !sqlPatterns.some((pattern) => pattern.test(name));
    },
    { message: "Name contains invalid characters" },
  ).refine(
    (name) => {
      // Block XSS patterns
      const xssPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /<object/i,
        /<embed/i,
      ];

      return !xssPatterns.some((pattern) => pattern.test(name));
    },
    { message: "Name contains invalid characters" },
  ),
  email: z.string().min(1).max(100).refine(
    (email) => {
      // Apply same validation to email field
      const maliciousPatterns = [
        /select\s*\(/i,
        /union\s+select/i,
        /insert\s+into/i,
        /update\s+set/i,
        /delete\s+from/i,
        /drop\s+table/i,
        /sleep\s*\(/i,
        /waitfor\s+delay/i,
        /benchmark\s*\(/i,
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /<object/i,
        /<embed/i,
      ];

      return !maliciousPatterns.some((pattern) => pattern.test(email));
    },
    { message: "Email contains invalid characters" },
  ),
  company: z.string().min(1).max(100).refine(
    (company) => {
      // Apply same validation to company field
      const maliciousPatterns = [
        /select\s*\(/i,
        /union\s+select/i,
        /insert\s+into/i,
        /update\s+set/i,
        /delete\s+from/i,
        /drop\s+table/i,
        /sleep\s*\(/i,
        /waitfor\s+delay/i,
        /benchmark\s*\(/i,
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /<object/i,
        /<embed/i,
      ];

      return !maliciousPatterns.some((pattern) => pattern.test(company));
    },
    { message: "Company contains invalid characters" },
  ),
});

export const updateContactSchema = z.object({
  contacted: z.boolean(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type UpdateContact = z.infer<typeof updateContactSchema>;

// Email settings table schema
export const emailSettings = pgTable("email_settings", {
  id: serial("id").primaryKey(),
  enabled: boolean("enabled").notNull().default(true),
  subject: text("subject").notNull(),
  textContent: text("text_content").notNull(),
  htmlContent: text("html_content").notNull(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const emailSettingsSchema = createInsertSchema(emailSettings).pick({
  enabled: true,
  subject: true,
  textContent: true,
  htmlContent: true,
});

export const updateEmailSettingsSchema = z.object({
  enabled: z.boolean().optional(),
  subject: z.string().optional(),
  textContent: z.string().optional(),
  htmlContent: z.string().optional(),
});

export type EmailSettings = typeof emailSettings.$inferSelect;
export type InsertEmailSettings = z.infer<typeof emailSettingsSchema>;
export type UpdateEmailSettings = z.infer<typeof updateEmailSettingsSchema>;
