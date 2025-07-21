var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express3 from "express";

// server/routes.ts
import express2 from "express";
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  contacts: () => contacts,
  emailSettings: () => emailSettings,
  emailSettingsSchema: () => emailSettingsSchema,
  insertContactSchema: () => insertContactSchema,
  insertUserSchema: () => insertUserSchema,
  loginUserSchema: () => loginUserSchema,
  updateContactSchema: () => updateContactSchema,
  updateEmailSettingsSchema: () => updateEmailSettingsSchema,
  users: () => users
});
import {
  boolean,
  pgTable,
  serial,
  text,
  timestamp
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  isVerified: boolean("is_verified").notNull().default(false),
  verificationToken: text("verification_token"),
  verificationTokenExpiry: timestamp("verification_token_expiry"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  name: true
}).extend({
  email: z.string().email().refine(
    (email) => email.endsWith("@boltfoundry.com"),
    { message: "Only boltfoundry.com email addresses are allowed" }
  ),
  password: z.string().min(8, "Password must be at least 8 characters long")
});
var loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string()
});
var contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  contacted: boolean("contacted").notNull().default(false),
  emailSentAt: timestamp("email_sent_at"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  company: true
}).extend({
  name: z.string().min(1).max(100).refine(
    (name) => {
      const sqlPatterns = [
        /select\s*\(/i,
        /union\s+select/i,
        /insert\s+into/i,
        /update\s+set/i,
        /delete\s+from/i,
        /drop\s+table/i,
        /sleep\s*\(/i,
        /waitfor\s+delay/i,
        /benchmark\s*\(/i
      ];
      return !sqlPatterns.some((pattern) => pattern.test(name));
    },
    { message: "Name contains invalid characters" }
  ).refine(
    (name) => {
      const xssPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /<object/i,
        /<embed/i
      ];
      return !xssPatterns.some((pattern) => pattern.test(name));
    },
    { message: "Name contains invalid characters" }
  ),
  email: z.string().min(1).max(100).refine(
    (email) => {
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
        /<embed/i
      ];
      return !maliciousPatterns.some((pattern) => pattern.test(email));
    },
    { message: "Email contains invalid characters" }
  ),
  company: z.string().min(1).max(100).refine(
    (company) => {
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
        /<embed/i
      ];
      return !maliciousPatterns.some((pattern) => pattern.test(company));
    },
    { message: "Company contains invalid characters" }
  )
});
var updateContactSchema = z.object({
  contacted: z.boolean()
});
var emailSettings = pgTable("email_settings", {
  id: serial("id").primaryKey(),
  enabled: boolean("enabled").notNull().default(true),
  subject: text("subject").notNull(),
  textContent: text("text_content").notNull(),
  htmlContent: text("html_content").notNull(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow()
});
var emailSettingsSchema = createInsertSchema(emailSettings).pick({
  enabled: true,
  subject: true,
  textContent: true,
  htmlContent: true
});
var updateEmailSettingsSchema = z.object({
  enabled: z.boolean().optional(),
  subject: z.string().optional(),
  textContent: z.string().optional(),
  htmlContent: z.string().optional()
});

// server/db.ts
import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
console.log("Initializing database connection...");
if (!process.env.DATABASE_URL_CONTACTS) {
  const error = "DATABASE_URL_CONTACTS environment variable is not set. Database connections will fail.";
  console.error(error);
  throw new Error(error);
}
var pool = new Pool({
  connectionString: process.env.DATABASE_URL_CONTACTS,
  max: 20,
  // Maximum number of clients in the pool
  idleTimeoutMillis: 3e4,
  // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 5e3
  // How long to wait for a connection to become available
});
pool.on("error", (err) => {
  console.error("Unexpected error on idle database client", err);
  process.exit(-1);
});
async function testDatabaseConnection() {
  let client;
  try {
    console.log("Testing database connection...");
    client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log(`Database connection successful at ${result.rows[0].now}`);
    return true;
  } catch (err) {
    console.error("Database connection error:", err);
    return false;
  } finally {
    if (client) client.release();
  }
}
testDatabaseConnection().then((success) => {
  if (!success) {
    console.warn("Application started with database connection issues");
  }
});
var db = drizzle({ client: pool, schema: schema_exports });
console.log("Database initialization complete");

// server/storage.ts
import { desc, eq } from "drizzle-orm";
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  // This method is kept for backward compatibility
  async getUserByUsername(username) {
    if (username.includes("@")) {
      return this.getUserByEmail(username);
    }
    return void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async updateUser(id, data) {
    const [updatedUser] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return updatedUser;
  }
  async verifyUser(id) {
    const [verifiedUser] = await db.update(users).set({
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null
    }).where(eq(users.id, id)).returning();
    return verifiedUser;
  }
  async setVerificationToken(userId, token, expiry) {
    await db.update(users).set({
      verificationToken: token,
      verificationTokenExpiry: expiry
    }).where(eq(users.id, userId));
  }
  async getUserByVerificationToken(token) {
    const [user] = await db.select().from(users).where(eq(users.verificationToken, token));
    if (user && user.verificationTokenExpiry && user.verificationTokenExpiry < /* @__PURE__ */ new Date()) {
      return void 0;
    }
    return user;
  }
  // Contact implementation methods
  async createContact(insertContact) {
    const [contact] = await db.insert(contacts).values({
      ...insertContact,
      contacted: false
    }).returning();
    return contact;
  }
  async getAllContacts() {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }
  async getContact(id) {
    const [contact] = await db.select().from(contacts).where(
      eq(contacts.id, id)
    );
    return contact;
  }
  async updateContact(id, data) {
    const [updatedContact] = await db.update(contacts).set(data).where(eq(contacts.id, id)).returning();
    return updatedContact;
  }
  async deleteContact(id) {
    const deleted = await db.delete(contacts).where(eq(contacts.id, id)).returning();
    return deleted.length > 0;
  }
  // Email settings implementation methods
  async getEmailSettings() {
    const [settings] = await db.select().from(emailSettings).limit(1);
    return settings;
  }
  async createOrUpdateEmailSettings(data) {
    const existing = await this.getEmailSettings();
    if (existing) {
      const [updated] = await db.update(emailSettings).set({
        ...data,
        lastUpdated: /* @__PURE__ */ new Date()
      }).where(eq(emailSettings.id, existing.id)).returning();
      return updated;
    } else {
      const defaultSubject = "\u26A1\uFE0F Welcome to Bolt Foundry \u26A1\uFE0F";
      const defaultHtmlContent = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="padding: 20px;">
    <p>Hey {{name}} \u{1F44B}</p>
    <p>Thanks for joining the Bolt Foundry waitlist! We're excited to bring you on this fine-tuning adventure with us.</p>
    <p>We'll let you know as soon as we open the platform. In the meantime, reach out anytime if you have questions or want to talk.</p>
    <p>You can reply to this email and I'll respond.</p>
    <p>Thanks!</p>
    <p>Dan Sisco<br>Co-Founder, Bolt Foundry</p>
  </div>
</div>`;
      const defaultTextContent = `
Hey {{name}} \u{1F44B} 

Thanks for joining the Bolt Foundry waitlist! We're excited to bring you on this fine-tuning adventure with us. 

We'll let you know as soon as we open the platform. In the meantime, reach out anytime if you have questions or want to talk. 

You can reply to this email and I'll respond. 

Thanks! 

Dan Sisco
Co-Founder, Bolt Foundry`;
      const [created] = await db.insert(emailSettings).values({
        enabled: data.enabled !== void 0 ? data.enabled : true,
        subject: data.subject || defaultSubject,
        htmlContent: data.htmlContent || defaultHtmlContent,
        textContent: data.textContent || defaultTextContent
      }).returning();
      return created;
    }
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { ZodError } from "zod";
import { fromZodError as fromZodError2 } from "zod-validation-error";

// server/middleware/auth.ts
var apiKeyAuth = (req, res, next) => {
  console.log(`Authenticating request to ${req.method} ${req.path}`);
  const apiKey = req.header("x-api-key");
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable is not set");
    return res.status(500).json({
      success: false,
      message: "Server configuration error: API_KEY not configured"
    });
  }
  if (!apiKey) {
    console.error("API key missing in request");
    return res.status(401).json({
      success: false,
      message: "API key is missing"
    });
  }
  if (apiKey !== process.env.API_KEY) {
    console.error("Invalid API key provided");
    console.error(
      `API key length: ${apiKey.length}, Expected length: ${process.env.API_KEY.length}`
    );
    console.error(
      `API key first 5 chars: ${apiKey.substring(0, 5)}, Expected first 5: ${process.env.API_KEY.substring(0, 5)}`
    );
    console.error(
      `API key last 5 chars: ${apiKey.substring(apiKey.length - 5)}, Expected last 5: ${process.env.API_KEY.substring(process.env.API_KEY.length - 5)}`
    );
    return res.status(403).json({
      success: false,
      message: "Invalid API key"
    });
  }
  console.log("API key authentication successful");
  next();
};

// server/middleware/rateLimiter.ts
var rateLimitStore = /* @__PURE__ */ new Map();
var RATE_LIMIT_CONFIG = {
  // Block after 3 failed validation attempts
  maxFailures: 3,
  // Within a 15-minute window
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  // Block for 1 hour
  blockDurationMs: 60 * 60 * 1e3,
  // 1 hour
  // Clean up old entries every 30 minutes
  cleanupIntervalMs: 30 * 60 * 1e3
  // 30 minutes
};
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of Array.from(rateLimitStore.entries())) {
    if (now - entry.firstFailure > RATE_LIMIT_CONFIG.windowMs && (!entry.blockedUntil || now > entry.blockedUntil)) {
      rateLimitStore.delete(ip);
    }
  }
}, RATE_LIMIT_CONFIG.cleanupIntervalMs);
function getClientIP(req) {
  return req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.connection.remoteAddress || req.socket.remoteAddress || "unknown";
}
function rateLimitMiddleware(req, res, next) {
  const clientIP = getClientIP(req);
  const now = Date.now();
  const entry = rateLimitStore.get(clientIP);
  if (entry?.blockedUntil && now < entry.blockedUntil) {
    const remainingTime = Math.ceil((entry.blockedUntil - now) / 1e3 / 60);
    console.log(`Rate limit: Blocked IP ${clientIP} for ${remainingTime} more minutes`);
    return res.status(429).json({
      message: "Too many failed attempts. Please try again later.",
      retryAfter: remainingTime
    });
  }
  next();
}
function recordValidationFailure(req) {
  const clientIP = getClientIP(req);
  const now = Date.now();
  const entry = rateLimitStore.get(clientIP);
  if (!entry) {
    rateLimitStore.set(clientIP, {
      failureCount: 1,
      firstFailure: now
    });
    console.log(`Rate limit: First validation failure recorded for IP ${clientIP}`);
  } else {
    if (now - entry.firstFailure <= RATE_LIMIT_CONFIG.windowMs) {
      entry.failureCount++;
      console.log(`Rate limit: Validation failure ${entry.failureCount} for IP ${clientIP}`);
      if (entry.failureCount >= RATE_LIMIT_CONFIG.maxFailures) {
        entry.blockedUntil = now + RATE_LIMIT_CONFIG.blockDurationMs;
        const blockDurationMinutes = RATE_LIMIT_CONFIG.blockDurationMs / 1e3 / 60;
        console.log(`Rate limit: IP ${clientIP} blocked for ${blockDurationMinutes} minutes after ${entry.failureCount} failures`);
      }
    } else {
      rateLimitStore.set(clientIP, {
        failureCount: 1,
        firstFailure: now
      });
      console.log(`Rate limit: Reset failure count for IP ${clientIP} (window expired)`);
    }
  }
}
function getRateLimitStatus() {
  return Array.from(rateLimitStore.entries()).map(([ip, entry]) => ({ ip, entry }));
}

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import connectPg from "connect-pg-simple";
import { z as z2 } from "zod";
import { fromZodError } from "zod-validation-error";
import { nanoid as nanoid2 } from "nanoid";

// server/services/email.ts
import nodemailer from "nodemailer";

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createLogger, createServer as createViteServer } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/services/email.ts
import sgMail from "@sendgrid/mail";
function getEmailConfig() {
  if (process.env.SENDGRID_API_KEY) {
    log("Using SendGrid for email delivery", "email");
    return {
      serviceType: "sendgrid",
      from: process.env.EMAIL_FROM || "no-reply@contactmanager.boltfoundry.com"
    };
  }
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    log("Using SMTP for email delivery", "email");
    return {
      serviceType: "smtp",
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587,
      secure: process.env.EMAIL_SECURE === "true",
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
      from: process.env.EMAIL_FROM || "no-reply@contactmanager.boltfoundry.com"
    };
  }
  log(
    "Using test email account - emails will be logged to console only",
    "email"
  );
  return {
    serviceType: "test",
    from: '"Contact Manager" <no-reply@contactmanager.boltfoundry.com>'
  };
}
var transporter = null;
var emailServiceType = "test";
var fromEmail = '"Bolt Foundry CMS" <no-reply@cms.boltfoundry.com>';
async function initEmailService() {
  console.log("============= INITIALIZING EMAIL SERVICE =============");
  console.log("EMAIL_HOST:", process.env.EMAIL_HOST || "not set");
  console.log("EMAIL_PORT:", process.env.EMAIL_PORT || "not set");
  console.log(
    "EMAIL_USER:",
    process.env.EMAIL_USER ? "****set****" : "not set"
  );
  console.log(
    "EMAIL_PASS:",
    process.env.EMAIL_PASS ? "****set****" : "not set"
  );
  console.log("EMAIL_FROM:", process.env.EMAIL_FROM || "not set");
  console.log(
    "SENDGRID_API_KEY:",
    process.env.SENDGRID_API_KEY ? "****set****" : "not set"
  );
  console.log("NODE_ENV:", process.env.NODE_ENV || "not set");
  console.log("REPLIT_DOMAINS:", process.env.REPLIT_DOMAINS || "not set");
  const emailConfig = getEmailConfig();
  emailServiceType = emailConfig.serviceType;
  fromEmail = emailConfig.from;
  console.log(`Selected email service type: ${emailServiceType}`);
  console.log(`From email address: ${fromEmail}`);
  try {
    if (emailConfig.serviceType === "sendgrid") {
      console.log("Initializing SendGrid email service...");
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      console.log("SendGrid API key configured successfully");
      log("SendGrid email service initialized", "email");
      return;
    }
    if (emailConfig.serviceType === "smtp") {
      console.log("Initializing SMTP email service...");
      const isGmail = emailConfig.host?.includes("gmail.com");
      if (isGmail) {
        console.log("Gmail SMTP detected, configuring with special settings");
      }
      const config = {
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.port === 465,
        // true for 465, false for other ports like 587
        auth: {
          user: emailConfig.user,
          pass: emailConfig.pass
        },
        // Special settings for Gmail
        ...isGmail && {
          tls: {
            rejectUnauthorized: false
          }
        }
      };
      console.log("SMTP Configuration:", {
        host: config.host,
        port: config.port,
        secure: config.secure,
        user: config.auth.user?.substring(0, 3) + "***",
        tls: config.tls ? "configured" : "not configured"
      });
      transporter = nodemailer.createTransport(config);
      transporter.verify((error, success) => {
        if (error) {
          console.error("SMTP connection verification error:", error.message);
          log(`SMTP connection error: ${error.message}`, "email");
        } else {
          console.log("SMTP connection verified successfully");
          log("SMTP server is ready to take our messages", "email");
        }
      });
      log(
        `SMTP email service initialized (${isGmail ? "Gmail" : "Generic SMTP"})`,
        "email"
      );
      return;
    }
    console.log(
      "No production email service configured, creating test account..."
    );
    const testAccount = await nodemailer.createTestAccount();
    console.log("Test account created:", testAccount.user);
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    log(`Test email account created: ${testAccount.user}`, "email");
  } catch (error) {
    console.error("Failed to initialize email service:", error);
    log(`Failed to initialize email service: ${error}`, "email");
    emailServiceType = "test";
    transporter = null;
    try {
      console.log("Attempting to create fallback test email account...");
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log("Fallback test email account created successfully");
    } catch (testError) {
      console.error("Failed to create fallback test account:", testError);
    }
  }
  console.log(
    "============= EMAIL SERVICE INITIALIZATION COMPLETE ============="
  );
}
async function sendEmail(options) {
  console.log(
    `[EMAIL] Sending email to ${options.to} with subject: ${options.subject}`
  );
  if (!transporter || emailServiceType === "test") {
    console.log(
      "[EMAIL] Email service not initialized or using test mode, initializing..."
    );
    await initEmailService();
    if (!transporter) {
      console.error("[EMAIL] Failed to initialize email service");
      logEmailContent("SERVICE UNAVAILABLE", options);
      return false;
    }
  }
  console.log(`[EMAIL] Using email service type: ${emailServiceType}`);
  console.log(`[EMAIL] From email address: ${fromEmail}`);
  try {
    if (emailServiceType === "sendgrid") {
      console.log("[EMAIL] Attempting to send via SendGrid...");
      await sgMail.send({
        to: options.to,
        from: fromEmail,
        subject: options.subject,
        text: options.text || "",
        html: options.html
      });
      console.log(
        `[EMAIL] Successfully sent email to ${options.to} via SendGrid`
      );
      log(`Email sent to ${options.to} via SendGrid`, "email");
      return true;
    }
    if (emailServiceType === "smtp" && transporter) {
      console.log(`[EMAIL] Attempting to send via SMTP to ${options.to}...`);
      const mailOptions = {
        from: fromEmail,
        to: options.to,
        subject: options.subject,
        text: options.text || "",
        html: options.html
      };
      console.log(`[EMAIL] Mail options: ${JSON.stringify({
        from: fromEmail,
        to: options.to,
        subject: options.subject
      })}`);
      const info = await transporter.sendMail(mailOptions);
      console.log(
        `[EMAIL] Email sent successfully. MessageId: ${info.messageId}`
      );
      console.log(`[EMAIL] SMTP response: ${JSON.stringify(info.response)}`);
      log(`Email sent to ${options.to}: ${info.messageId}`, "email");
      log(`SMTP response: ${JSON.stringify(info.response)}`, "email");
      logEmailSuccess(options, info);
      return true;
    }
    if (transporter) {
      console.log("[EMAIL] Attempting to send via test account...");
      const info = await transporter.sendMail({
        from: fromEmail,
        to: options.to,
        subject: options.subject,
        text: options.text || "",
        html: options.html
      });
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`[EMAIL] Test email sent. Preview URL: ${previewUrl}`);
      log(`Email preview URL: ${previewUrl}`, "email");
      logEmailSuccess(options, info);
      return true;
    }
    console.error("[EMAIL] No valid email transport configuration found");
    logEmailContent("SERVICE UNAVAILABLE", options);
    return false;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error && error.stack ? error.stack : "No stack trace";
    console.error(`[EMAIL] Failed to send email to ${options.to}`);
    console.error(`[EMAIL] Error message: ${errorMessage}`);
    console.error(`[EMAIL] Error stack: ${errorStack}`);
    log(`Failed to send email to ${options.to}: ${errorMessage}`, "email");
    log(`Error details: ${errorStack}`, "email");
    logEmailFailure(options, errorMessage);
    if (emailServiceType === "smtp" && typeof errorMessage === "string") {
      if (errorMessage.includes("Invalid login") || errorMessage.includes("Username and Password not accepted")) {
        console.error(
          "[EMAIL] Gmail authentication failed. Check your EMAIL_USER and EMAIL_PASS credentials."
        );
        console.error(
          "[EMAIL] For Gmail, you may need to use an App Password if 2FA is enabled."
        );
        log(
          "Gmail authentication failed. Check your EMAIL_USER and EMAIL_PASS credentials.",
          "email"
        );
        log(
          "For Gmail, you may need to use an App Password if 2FA is enabled.",
          "email"
        );
      } else if (errorMessage.includes("security") || errorMessage.includes("less secure")) {
        console.error(
          "[EMAIL] Gmail security settings may be blocking the connection."
        );
        console.error(
          '[EMAIL] Enable "Less secure app access" or use an App Password.'
        );
        log("Gmail security settings may be blocking the connection.", "email");
        log('Enable "Less secure app access" or use an App Password.', "email");
      }
    }
    return false;
  }
}
function logEmailContent(status, options) {
  console.log(`
  ============= EMAIL ${status} =============
  To: ${options.to}
  Subject: ${options.subject}
  
  ${options.text || options.html}
  ============================================================
  `);
}
function logEmailSuccess(options, info) {
  console.log(`
  ============= EMAIL SENT SUCCESSFULLY =============
  To: ${options.to}
  Subject: ${options.subject}
  Message ID: ${info.messageId}
  Preview URL: ${nodemailer.getTestMessageUrl?.(info) || "N/A"}
  ============================================================
  `);
}
function logEmailFailure(options, error) {
  console.log(`
  ============= EMAIL FAILED TO SEND =============
  To: ${options.to}
  Subject: ${options.subject}
  Error: ${error}
  
  ${options.text || options.html}
  ============================================================
  `);
}
async function sendVerificationEmail(email, name, token) {
  let baseUrl = "http://localhost:9999";
  if (process.env.REPLIT_DOMAINS) {
    baseUrl = `https://${process.env.REPLIT_DOMAINS}`;
    log(`Using Replit domain for verification emails: ${baseUrl}`, "email");
  } else if (process.env.PUBLIC_URL) {
    baseUrl = process.env.PUBLIC_URL;
    log(`Using custom domain for verification emails: ${baseUrl}`, "email");
  }
  log(`Environment details:`, "email");
  log(`- NODE_ENV: ${process.env.NODE_ENV || "not set"}`, "email");
  log(`- REPLIT_DOMAINS: ${process.env.REPLIT_DOMAINS || "not set"}`, "email");
  log(`- PUBLIC_URL: ${process.env.PUBLIC_URL || "not set"}`, "email");
  log(`- Using base URL: ${baseUrl}`, "email");
  const verificationUrl = `${baseUrl}/api/verify?token=${token}`;
  const subject = "Verify your Bolt Foundry CMS account";
  const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #4F46E5; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0;">Bolt Foundry CMS</h1>
    </div>
    <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
      <h2>Verify Your Email</h2>
      <p>Hello ${name},</p>
      <p>Thank you for registering for a Bolt Foundry CMS account. Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email Address</a>
      </div>
      <p>Or copy and paste this URL into your browser:</p>
      <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not create an account, you can safely ignore this email.</p>
      <p>Best regards,<br>Bolt Foundry CMS Team</p>
    </div>
    <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
      &copy; ${(/* @__PURE__ */ new Date()).getFullYear()} BoltFoundry. All rights reserved.
    </div>
  </div>
  `;
  const textContent = `
  Hello ${name},
  
  Thank you for registering for a Bolt Foundry CMS account. Please verify your email address by clicking the link below:
  
  ${verificationUrl}
  
  This link will expire in 24 hours.
  
  If you did not create an account, you can safely ignore this email.
  
  Best regards,
  Bolt Foundry CMS Team
  `;
  return sendEmail({
    to: email,
    subject,
    html: htmlContent,
    text: textContent
  });
}
async function setWaitlistEmailEnabled(enabled) {
  try {
    const settings = await storage.getEmailSettings();
    if (settings) {
      await storage.createOrUpdateEmailSettings({ enabled });
    } else {
      await storage.createOrUpdateEmailSettings({ enabled });
    }
    log(`Waitlist welcome emails ${enabled ? "enabled" : "disabled"}`, "email");
  } catch (error) {
    console.error("Failed to update email enabled status:", error);
    log(`Failed to update email enabled status: ${error}`, "email");
  }
}
async function isWaitlistEmailEnabled() {
  try {
    const settings = await storage.getEmailSettings();
    return settings?.enabled ?? true;
  } catch (error) {
    console.error("Failed to check if emails are enabled:", error);
    log(`Failed to check if emails are enabled: ${error}`, "email");
    return true;
  }
}
async function updateWaitlistEmailTemplate(options) {
  try {
    const settings = await storage.getEmailSettings();
    const htmlContent = options.textContent ? `<pre style="font-family: monospace;">${options.textContent}</pre>` : void 0;
    if (settings) {
      await storage.createOrUpdateEmailSettings({
        subject: options.subject,
        textContent: options.textContent,
        htmlContent
      });
    } else {
      const defaultSubject = "\u26A1\uFE0F Welcome to Bolt Foundry \u26A1\uFE0F";
      const defaultTextContent = `Hey {{name}} \u{1F44B} 

Thanks for joining the Bolt Foundry waitlist! We're excited to bring you on this fine-tuning adventure with us. 

We'll let you know as soon as we open the platform. In the meantime, reach out anytime if you have questions or want to talk. 

You can reply to this email and I'll respond. 

Thanks! 

Dan Sisco
Co-Founder, Bolt Foundry`;
      await storage.createOrUpdateEmailSettings({
        subject: options.subject || defaultSubject,
        textContent: options.textContent || defaultTextContent,
        htmlContent: htmlContent || `<pre style="font-family: monospace;">${defaultTextContent}</pre>`
      });
    }
    log("Waitlist email template updated successfully", "email");
    return true;
  } catch (error) {
    console.error("Failed to update waitlist email template:", error);
    log(`Failed to update waitlist email template: ${error}`, "email");
    return false;
  }
}
async function getWaitlistEmailTemplate() {
  try {
    let settings = await storage.getEmailSettings();
    if (!settings) {
      const defaultSubject = "\u26A1\uFE0F Welcome to Bolt Foundry \u26A1\uFE0F";
      const defaultTextContent = `Hey {{name}} \u{1F44B} 

Thanks for joining the Bolt Foundry waitlist! We're excited to bring you on this fine-tuning adventure with us. 

We'll let you know as soon as we open the platform. In the meantime, reach out anytime if you have questions or want to talk. 

You can reply to this email and I'll respond. 

Thanks! 

Dan Sisco
Co-Founder, Bolt Foundry`;
      const defaultHtmlContent = `<pre style="font-family: monospace;">${defaultTextContent}</pre>`;
      settings = await storage.createOrUpdateEmailSettings({
        enabled: true,
        subject: defaultSubject,
        textContent: defaultTextContent,
        htmlContent: defaultHtmlContent
      });
    }
    return {
      subject: settings.subject,
      htmlContent: settings.htmlContent,
      textContent: settings.textContent,
      isEnabled: settings.enabled
    };
  } catch (error) {
    console.error("Failed to get email template:", error);
    log(`Failed to get email template: ${error}`, "email");
    return {
      subject: "\u26A1\uFE0F Welcome to Bolt Foundry \u26A1\uFE0F",
      htmlContent: '<pre style="font-family: monospace;">Default email content</pre>',
      textContent: "Default email content",
      isEnabled: true
    };
  }
}
async function sendWaitlistWelcomeEmail(email, name, skipEnabledCheck = false) {
  try {
    const isEnabled = skipEnabledCheck || await isWaitlistEmailEnabled();
    if (!isEnabled) {
      log(
        `Waitlist welcome email to ${email} skipped (emails disabled)`,
        "email"
      );
      return false;
    }
    const template = await getWaitlistEmailTemplate();
    const textContent = template.textContent.replace(/{{name}}/g, name);
    const htmlContent = template.htmlContent.replace(/{{name}}/g, name);
    log(`Sending waitlist welcome email to ${email}`, "email");
    return sendEmail({
      to: email,
      subject: template.subject,
      text: textContent,
      html: htmlContent
    });
  } catch (error) {
    console.error("Failed to send waitlist welcome email:", error);
    log(`Failed to send waitlist welcome email to ${email}: ${error}`, "email");
    return false;
  }
}

// server/auth.ts
var PostgresSessionStore = connectPg(session);
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function generateVerificationToken() {
  return nanoid2(32);
}
async function initializeAuthEmailService() {
  console.log("[AUTH] Initializing email service for authentication...");
  await new Promise((resolve) => setTimeout(resolve, 500));
  await initEmailService();
  if (process.env.NODE_ENV === "development") {
    console.log("[AUTH] Email service initialized for authentication");
  } else {
    console.log(
      "[AUTH] Email service initialized for authentication in production mode"
    );
    console.log(
      "[AUTH] REPLIT_DOMAINS:",
      process.env.REPLIT_DOMAINS || "not set"
    );
  }
}
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Authentication required" });
}
function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(
    session({
      store: new PostgresSessionStore({
        pool,
        tableName: "session",
        createTableIfMissing: true,
        pruneSessionInterval: 60
        // Prune invalid sessions every minute
      }),
      secret: process.env.SESSION_SECRET || "contact-manager-session-secret",
      resave: true,
      // Save session on each request
      saveUninitialized: true,
      // Save new sessions even if not modified
      rolling: true,
      // Reset expiration countdown on every response
      name: "contact_manager_sid",
      // Rename to avoid issues with some browsers
      cookie: {
        httpOnly: true,
        // Prevent client-side access to the cookie
        secure: false,
        // Must be false in development, true in production
        sameSite: "lax",
        // This is important for cross-origin requests
        maxAge: 30 * 24 * 60 * 60 * 1e3,
        // 30 days for maximum persistence
        path: "/"
        // Available on all paths
      },
      unset: "keep"
      // Keep the session in the store after being destroyed
    })
  );
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user) {
            return done(null, false, { message: "Invalid email or password" });
          }
          const isValidPassword = await comparePasswords(
            password,
            user.password
          );
          if (!isValidPassword) {
            return done(null, false, { message: "Invalid email or password" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, null);
      }
      done(null, user);
    } catch (error) {
      console.error("Error deserializing user:", error);
      done(error);
    }
  });
  app2.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      const hashedPassword = await hashPassword(userData.password);
      const verificationToken = generateVerificationToken();
      const tokenExpiry = /* @__PURE__ */ new Date();
      tokenExpiry.setHours(tokenExpiry.getHours() + 24);
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      await storage.setVerificationToken(
        user.id,
        verificationToken,
        tokenExpiry
      );
      await sendVerificationEmail(user.email, user.name, verificationToken);
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error during login" });
        }
        return res.status(201).json({
          id: user.id,
          email: user.email,
          name: user.name,
          isVerified: user.isVerified,
          createdAt: user.createdAt
        });
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Registration failed" });
    }
  });
  app2.post(
    "/api/login",
    (req, res, next) => {
      try {
        loginUserSchema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof z2.ZodError) {
          const validationError = fromZodError(error);
          return res.status(400).json({ message: validationError.message });
        }
        next(error);
      }
    },
    passport.authenticate("local", { failWithError: true }),
    (req, res) => {
      const user = req.user;
      return res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      });
    },
    (err, req, res, next) => {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  );
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
  app2.get("/api/user", (req, res) => {
    console.log("-------- /api/user REQUEST --------");
    console.log("Session ID:", req.sessionID);
    console.log("Is authenticated:", req.isAuthenticated());
    console.log("Session cookie:", req.headers.cookie);
    console.log("Session object:", JSON.stringify(req.session));
    console.log("Parsed cookies:", req.cookies);
    console.log("Headers:", req.headers);
    if (!req.isAuthenticated() || !req.user) {
      console.log("User not authenticated or session invalid");
      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            console.error("Error destroying session:", err);
          }
        });
      }
      return res.status(401).json({ message: "Not authenticated" });
    }
    try {
      const user = req.user;
      console.log("User found:", user.id, user.email);
      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      );
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      return res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      });
    } catch (error) {
      console.error("Error processing user request:", error);
      return res.status(401).json({
        message: "Session invalid",
        success: false
      });
    }
  });
  app2.get("/api/verify", async (req, res) => {
    const token = req.query.token;
    if (!token) {
      return res.status(400).json({
        message: "Verification token is required"
      });
    }
    try {
      const user = await storage.getUserByVerificationToken(token);
      if (!user) {
        return res.status(400).json({
          message: "Invalid or expired verification token"
        });
      }
      await storage.verifyUser(user.id);
      return res.redirect("/verification-success");
    } catch (error) {
      console.error("Verification error:", error);
      return res.status(500).json({ message: "Verification failed" });
    }
  });
  app2.post(
    "/api/resend-verification",
    isAuthenticated,
    async (req, res) => {
      const user = req.user;
      if (user.isVerified) {
        return res.status(400).json({ message: "Email already verified" });
      }
      try {
        const verificationToken = generateVerificationToken();
        const tokenExpiry = /* @__PURE__ */ new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 24);
        await storage.setVerificationToken(
          user.id,
          verificationToken,
          tokenExpiry
        );
        await sendVerificationEmail(user.email, user.name, verificationToken);
        return res.status(200).json({ message: "Verification email sent" });
      } catch (error) {
        console.error("Resend verification error:", error);
        return res.status(500).json({
          message: "Failed to resend verification email"
        });
      }
    }
  );
}

// server/services/discord.ts
async function sendDiscordNotification(contact) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL_CONTACTS;
  if (!webhookUrl) {
    console.log("Discord webhook URL not configured, skipping notification");
    return false;
  }
  try {
    const payload = {
      embeds: [{
        title: "\u{1F389} New Contact Signup",
        description: `A new contact has joined the waitlist!`,
        color: 65280,
        // Green color
        fields: [
          {
            name: "\u{1F464} Name",
            value: contact.name,
            inline: true
          },
          {
            name: "\u{1F4E7} Email",
            value: contact.email,
            inline: true
          },
          {
            name: "\u{1F3E2} Company",
            value: contact.company || "Not specified",
            inline: true
          }
        ],
        timestamp: contact.createdAt.toISOString()
      }]
    };
    if (contact.notes) {
      payload.embeds[0].fields.push({
        name: "\u{1F4DD} Notes",
        value: contact.notes,
        inline: false
      });
    }
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      console.log(
        `Successfully sent Discord notification for contact ${contact.id}`
      );
      return true;
    } else {
      console.error(
        `Failed to send Discord notification: ${response.status} ${response.statusText}`
      );
      return false;
    }
  } catch (error) {
    console.error("Error sending Discord notification:", error);
    return false;
  }
}

// server/routes.ts
async function registerRoutes(app2) {
  setupAuth(app2);
  const apiRouter = express2.Router();
  app2.get("/api/health", (req, res) => {
    res.json({ status: "healthy" });
  });
  app2.get("/api/config", (req, res) => {
    res.json({
      apiKey: process.env.API_KEY
    });
  });
  apiRouter.use((req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.isVerified) {
      return next();
    }
    apiKeyAuth(req, res, next);
  });
  apiRouter.get("/contacts", async (req, res) => {
    try {
      console.log("GET /api/contacts request received");
      console.log("Fetching all contacts from database");
      const contacts2 = await storage.getAllContacts();
      console.log(`Successfully fetched ${contacts2.length} contacts`);
      return res.status(200).json(contacts2);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return res.status(500).json({
        message: "Failed to fetch contacts",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  apiRouter.post("/contacts", rateLimitMiddleware, async (req, res) => {
    try {
      console.log("POST /api/contacts request received");
      console.log("Request body:", JSON.stringify(req.body));
      console.log("Validating contact data");
      const validatedData = insertContactSchema.parse(req.body);
      const isDryRun = validatedData.email && /\.dryrun@example\.com$/.test(validatedData.email);
      if (isDryRun) {
        console.log("Dry run detected - skipping database save");
        return res.status(200).json({
          id: 0,
          name: validatedData.name,
          email: validatedData.email,
          company: validatedData.company || null,
          notes: validatedData.notes || null,
          contacted: false,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date(),
          emailSentAt: null,
          dryRun: true
        });
      }
      console.log(
        "Creating new contact with data:",
        JSON.stringify(validatedData)
      );
      const newContact = await storage.createContact(validatedData);
      if (!newContact) {
        console.error(
          "Failed to create contact - database operation returned no data"
        );
        return res.status(500).json({
          message: "Database operation failed to return created contact"
        });
      }
      if (isWaitlistEmailEnabled()) {
        console.log(`Sending waitlist welcome email to ${newContact.email}`);
        try {
          const emailSent = await sendWaitlistWelcomeEmail(
            newContact.email,
            newContact.name
          );
          if (emailSent) {
            console.log(
              `Successfully sent waitlist welcome email to ${newContact.email}`
            );
            await storage.updateContact(newContact.id, {
              contacted: true,
              emailSentAt: /* @__PURE__ */ new Date()
            });
            console.log(
              `Updated contact ${newContact.id} to contacted=true and set emailSentAt`
            );
            const updatedContact = await storage.getContact(newContact.id);
            if (updatedContact) {
              try {
                await sendDiscordNotification(updatedContact);
              } catch (discordError) {
                console.error("Error sending Discord notification:", discordError);
              }
              console.log(
                `Successfully created contact with ID ${updatedContact.id} and sent welcome email`
              );
              return res.status(201).json(updatedContact);
            }
          } else {
            console.error(
              `Failed to send waitlist welcome email to ${newContact.email}`
            );
          }
        } catch (emailError) {
          console.error("Error sending waitlist welcome email:", emailError);
        }
      }
      try {
        await sendDiscordNotification(newContact);
      } catch (discordError) {
        console.error("Error sending Discord notification:", discordError);
      }
      console.log(`Successfully created contact with ID ${newContact.id}`);
      return res.status(201).json(newContact);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError2(error);
        console.error(
          "Validation error creating contact:",
          validationError.message
        );
        recordValidationFailure(req);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating contact:", error);
      return res.status(500).json({
        message: "Failed to create contact",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  apiRouter.patch("/contacts/:id", async (req, res) => {
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
        JSON.stringify(validatedData)
      );
      const updatedContact = await storage.updateContact(id, validatedData);
      if (!updatedContact) {
        console.error(
          `Failed to update contact ${id} - database operation returned no data`
        );
        return res.status(500).json({
          message: "Database operation failed to return updated contact"
        });
      }
      console.log(`Successfully updated contact ${id}`);
      return res.status(200).json(updatedContact);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError2(error);
        console.error(
          `Validation error updating contact:`,
          validationError.message
        );
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error updating contact:", error);
      return res.status(500).json({
        message: "Failed to update contact",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  apiRouter.delete("/contacts/bulk", rateLimitMiddleware, async (req, res) => {
    try {
      console.log("DELETE /api/contacts/bulk request received");
      console.log("Request body:", JSON.stringify(req.body));
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        console.error("Invalid bulk delete request: ids must be a non-empty array");
        return res.status(400).json({ message: "ids must be a non-empty array" });
      }
      if (ids.some((id) => typeof id !== "number" || isNaN(id))) {
        console.error("Invalid bulk delete request: all ids must be valid numbers");
        return res.status(400).json({ message: "All ids must be valid numbers" });
      }
      console.log(`Bulk deleting ${ids.length} contacts: [${ids.join(", ")}]`);
      const deletePromises = ids.map(async (id) => {
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
      const successful = results.filter((r) => r.success);
      const failed = results.filter((r) => !r.success);
      console.log(`Bulk delete completed: ${successful.length} successful, ${failed.length} failed`);
      return res.status(200).json({
        message: `Bulk delete completed: ${successful.length} successful, ${failed.length} failed`,
        successful: successful.length,
        failed: failed.length,
        results
      });
    } catch (error) {
      console.error("Error in bulk delete:", error);
      return res.status(500).json({
        message: "Failed to bulk delete contacts",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  apiRouter.delete("/contacts/:id", async (req, res) => {
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
          `Failed to delete contact ${id} - database operation did not affect any rows`
        );
        return res.status(500).json({
          message: "Database operation failed to delete contact"
        });
      }
      console.log(`Successfully deleted contact ${id}`);
      return res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
      console.error("Error deleting contact:", error);
      return res.status(500).json({
        message: "Failed to delete contact",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  apiRouter.get("/email/settings", async (req, res) => {
    try {
      console.log("GET /api/email/settings request received");
      const isEnabled = await isWaitlistEmailEnabled();
      const template = await getWaitlistEmailTemplate();
      const settings = {
        isEnabled,
        template
      };
      console.log("Successfully retrieved email settings");
      return res.status(200).json(settings);
    } catch (error) {
      console.error("Error retrieving email settings:", error);
      return res.status(500).json({
        message: "Failed to retrieve email settings",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  apiRouter.patch("/email/settings", async (req, res) => {
    try {
      console.log("PATCH /api/email/settings request received");
      console.log("Request body:", JSON.stringify(req.body));
      const { isEnabled } = req.body;
      if (typeof isEnabled !== "boolean") {
        console.error(
          "Invalid email settings data: isEnabled must be a boolean"
        );
        return res.status(400).json({ message: "isEnabled must be a boolean" });
      }
      await setWaitlistEmailEnabled(isEnabled);
      const updatedIsEnabled = await isWaitlistEmailEnabled();
      const template = await getWaitlistEmailTemplate();
      const settings = {
        isEnabled: updatedIsEnabled,
        template
      };
      console.log(
        `Successfully updated email settings, isEnabled=${isEnabled}`
      );
      return res.status(200).json(settings);
    } catch (error) {
      console.error("Error updating email settings:", error);
      return res.status(500).json({
        message: "Failed to update email settings",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  apiRouter.patch("/email/template", async (req, res) => {
    try {
      console.log("PATCH /api/email/template request received");
      console.log("Request body:", JSON.stringify(req.body));
      const { subject, textContent } = req.body;
      if (typeof subject !== "string" || typeof textContent !== "string") {
        console.error(
          "Invalid email template data: subject and textContent must be strings"
        );
        return res.status(400).json({
          message: "subject and textContent must be strings"
        });
      }
      const success = await updateWaitlistEmailTemplate({
        subject,
        textContent
      });
      if (!success) {
        console.error("Failed to update email template");
        return res.status(500).json({
          message: "Failed to update email template"
        });
      }
      const isEnabled = await isWaitlistEmailEnabled();
      const template = await getWaitlistEmailTemplate();
      const settings = {
        isEnabled,
        template
      };
      console.log("Successfully updated email template");
      return res.status(200).json(settings);
    } catch (error) {
      console.error("Error updating email template:", error);
      return res.status(500).json({
        message: "Failed to update email template",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  apiRouter.post("/contacts/:id/email", async (req, res) => {
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
      if (contact.contacted) {
        console.error(`Contact ${id} has already been contacted`);
        return res.status(400).json({
          message: "Contact has already been contacted"
        });
      }
      console.log(`Sending waitlist welcome email to ${contact.email}`);
      const emailSent = await sendWaitlistWelcomeEmail(
        contact.email,
        contact.name,
        true
        // Skip enabled check for manual sending
      );
      if (!emailSent) {
        console.error(
          `Failed to send waitlist welcome email to ${contact.email}`
        );
        return res.status(500).json({
          message: "Failed to send welcome email"
        });
      }
      console.log(
        `Successfully sent waitlist welcome email to ${contact.email}`
      );
      await storage.updateContact(id, {
        contacted: true,
        emailSentAt: /* @__PURE__ */ new Date()
      });
      console.log(`Successfully updated contact ${id} to contacted=true`);
      return res.status(200).json(await storage.getContact(id));
    } catch (error) {
      console.error("Error sending email to contact:", error);
      return res.status(500).json({
        message: "Failed to send email to contact",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  apiRouter.get("/rate-limit-status", (req, res) => {
    try {
      const status = getRateLimitStatus();
      const now = Date.now();
      const formattedStatus = status.map(({ ip, entry }) => ({
        ip,
        failureCount: entry.failureCount,
        firstFailure: new Date(entry.firstFailure).toISOString(),
        isBlocked: entry.blockedUntil ? now < entry.blockedUntil : false,
        blockedUntil: entry.blockedUntil ? new Date(entry.blockedUntil).toISOString() : null,
        remainingBlockMinutes: entry.blockedUntil && now < entry.blockedUntil ? Math.ceil((entry.blockedUntil - now) / 1e3 / 60) : null
      }));
      return res.json({
        totalTrackedIPs: formattedStatus.length,
        blockedIPs: formattedStatus.filter((s) => s.isBlocked).length,
        entries: formattedStatus
      });
    } catch (error) {
      console.error("Error getting rate limit status:", error);
      return res.status(500).json({
        message: "Failed to get rate limit status",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.use("/api", apiRouter);
  const httpServer = createServer(app2);
  return httpServer;
}

// server/index.ts
import os from "os";
import cors from "cors";
import cookieParser from "cookie-parser";
console.log("======================================");
console.log("\u{1F680} Starting Bolt Foundry CMS Server...");
console.log(`\u{1F4C5} Server time: ${(/* @__PURE__ */ new Date()).toISOString()}`);
console.log(`\u{1F4BB} Hostname: ${os.hostname()}`);
console.log(`\u{1F50C} Platform: ${os.platform()} ${os.release()}`);
console.log(
  `\u{1F4BE} Memory: ${Math.round(os.freemem() / 1024 / 1024)}MB free of ${Math.round(os.totalmem() / 1024 / 1024)}MB`
);
console.log(`\u{1F9F5} CPUs: ${os.cpus().length}`);
console.log("======================================");
var app = express3();
app.use(cors({
  origin: function(origin, callback) {
    callback(null, true);
  },
  credentials: true,
  // Critical for cookies & auth sessions
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-api-key",
    "Cookie",
    "Set-Cookie"
  ],
  exposedHeaders: ["Content-Type", "Authorization", "Set-Cookie"],
  maxAge: 86400
  // Cache preflight requests for 24 hours
}));
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use(
  cookieParser(process.env.SESSION_SECRET || "contact-manager-session-secret")
);
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    console.log("Initializing email service...");
    await initializeAuthEmailService();
    console.log("Email service initialized");
  } catch (error) {
    console.error("Failed to initialize email service:", error);
  }
  const server = await registerRoutes(app);
  app.use((err, req, res, _next) => {
    if (err.message && (err.message.includes("Failed to deserialize user") || err.message.includes("session"))) {
      console.error("Session error detected, clearing session");
      if (req.session) {
        req.session.destroy(() => {
          console.log("Session destroyed due to deserialization error");
        });
      }
      return res.status(401).json({
        success: false,
        message: "Session invalid, please log in again",
        path: req.path,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error(`Error in ${req.method} ${req.path}:`);
    console.error(`Status: ${status}`);
    console.error(`Message: ${message}`);
    console.error("Error details:", err);
    if (res.headersSent) {
      console.error("Headers already sent, cannot send error response");
      return;
    }
    res.status(status).json({
      success: false,
      message,
      path: req.path,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 9999;
  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `\u274C Port ${port} is already in use. Another application might be running on this port.`
      );
    } else {
      console.error(`\u274C Server error:`, error);
    }
    process.exit(1);
  });
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    console.log("======================================");
    console.log(`\u2705 Server is running at http://0.0.0.0:${port}`);
    console.log(`\u{1F310} API is available at http://0.0.0.0:${port}/api`);
    console.log(
      `\u{1F511} API authentication is ${process.env.API_KEY ? "ENABLED" : "MISSING KEY"}`
    );
    if (process.env.API_KEY) {
      console.log(
        `API_KEY: "${process.env.API_KEY}" (length: ${process.env.API_KEY.length})`
      );
    }
    console.log(
      `\u{1F5C4}\uFE0F Database connection is ${process.env.DATABASE_URL_CONTACTS ? "CONFIGURED" : "MISSING"}`
    );
    console.log(
      `\u{1F510} Session secret is ${process.env.SESSION_SECRET ? "CONFIGURED" : "MISSING"}`
    );
    if (process.env.SENDGRID_API_KEY) {
      console.log(`\u{1F4E7} Email: Using SendGrid`);
    } else if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log(`\u{1F4E7} Email: Using SMTP (${process.env.EMAIL_HOST})`);
    } else {
      console.log(
        `\u{1F4E7} Email: Using test account (emails logged to console only)`
      );
    }
    console.log(`\u{1F512} Environment: ${app.get("env")}`);
    console.log("======================================");
    log(`serving on port ${port}`);
  });
  const shutdown = async (signal) => {
    console.log(`
${signal} signal received. Starting graceful shutdown...`);
    server.close(() => {
      console.log("HTTP server closed. No longer accepting connections.");
      try {
        console.log("Closing database connections...");
        pool.end(() => {
          console.log("Database connections closed.");
          console.log("Shutdown complete. Exiting process.");
          process.exit(0);
        });
      } catch (err) {
        console.error("Error during database connection closure:", err);
        process.exit(1);
      }
    });
    setTimeout(() => {
      console.error(
        "Graceful shutdown timed out after 10 seconds. Forcing exit."
      );
      process.exit(1);
    }, 1e4);
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    shutdown("UNCAUGHT EXCEPTION");
  });
  process.on("unhandledRejection", (reason, promise) => {
    console.error(
      "Unhandled Promise Rejection at:",
      promise,
      "reason:",
      reason
    );
  });
})();
