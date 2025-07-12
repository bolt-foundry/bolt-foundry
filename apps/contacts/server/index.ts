import express, { NextFunction, type Request, Response } from "express";
import { registerRoutes } from "./routes";
import { log, serveStatic, setupVite } from "./vite";
import { pool } from "./db";
// Note: OS info functions will be replaced with Deno equivalents
const os = {
  hostname: () => Deno.hostname(),
  platform: () => Deno.build.os,
  release: () => "unknown", // Deno doesn't expose OS release info
  freemem: () => 0, // Not available in Deno
  totalmem: () => 0, // Not available in Deno
  cpus: () => [] as Array<any>, // Not available in Deno
};
import cors from "cors";
import cookieParser from "cookie-parser";
import { initializeAuthEmailService } from "./auth";

console.log("======================================");
console.log("🚀 Starting Bolt Foundry CMS Server...");
console.log(`📅 Server time: ${new Date().toISOString()}`);
console.log(`💻 Hostname: ${os.hostname()}`);
console.log(`🔌 Platform: ${os.platform()} ${os.release()}`);
console.log(`💾 Memory: Not available in Deno`);
console.log(`🧵 CPUs: Not available in Deno`);
console.log("======================================");

const app = express();

// Enhanced CORS configuration with additional cookie handling for better cross-origin support
app.use(cors({
  origin: function (origin, callback) {
    // Allow any origin
    callback(null, true);
  },
  credentials: true, // Critical for cookies & auth sessions
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-api-key",
    "Cookie",
    "Set-Cookie",
  ],
  exposedHeaders: ["Content-Type", "Authorization", "Set-Cookie"],
  maxAge: 86400, // Cache preflight requests for 24 hours
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cookieParser(process.env.SESSION_SECRET || "contact-manager-session-secret"),
);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Initialize the email service
    console.log("Initializing email service...");
    await initializeAuthEmailService();
    console.log("Email service initialized");
  } catch (error) {
    console.error("Failed to initialize email service:", error);
  }

  const server = await registerRoutes(app);

  // Global error handler middleware
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    // Special handling for passport user deserialization errors
    if (
      err.message && (
        err.message.includes("Failed to deserialize user") ||
        err.message.includes("session")
      )
    ) {
      console.error("Session error detected, clearing session");

      // Clear the session
      if (req.session) {
        req.session.destroy(() => {
          console.log("Session destroyed due to deserialization error");
        });
      }

      // Return a 401 to make the client redirect to login
      return res.status(401).json({
        success: false,
        message: "Session invalid, please log in again",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }

    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log detailed error information to help with debugging
    console.error(`Error in ${req.method} ${req.path}:`);
    console.error(`Status: ${status}`);
    console.error(`Message: ${message}`);

    // Log the full error object including stack trace
    console.error("Error details:", err);

    // If headers are already sent, just let the error bubble up
    if (res.headersSent) {
      console.error("Headers already sent, cannot send error response");
      return;
    }

    // Send an appropriate error response
    res.status(status).json({
      success: false,
      message,
      path: req.path,
      timestamp: new Date().toISOString(),
    });

    // Don't throw the error as that would crash the server process
    // Instead, just log it and let the request end normally
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 9999
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 9999;

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `❌ Port ${port} is already in use. Another application might be running on this port.`,
      );
    } else {
      console.error(`❌ Server error:`, error);
    }
    process.exit(1);
  });

  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    console.log("======================================");
    console.log(`✅ Server is running at http://0.0.0.0:${port}`);
    console.log(`🌐 API is available at http://0.0.0.0:${port}/api`);
    console.log(
      `🔑 API authentication is ${
        process.env.API_KEY ? "ENABLED" : "MISSING KEY"
      }`,
    );
    if (process.env.API_KEY) {
      console.log(
        `API_KEY: "${process.env.API_KEY}" (length: ${process.env.API_KEY.length})`,
      );
    }
    console.log(
      `🗄️ Database connection is ${
        process.env.DATABASE_URL_CONTACTS ? "CONFIGURED" : "MISSING"
      }`,
    );
    console.log(
      `🔐 Session secret is ${
        process.env.SESSION_SECRET ? "CONFIGURED" : "MISSING"
      }`,
    );

    // Check email configuration
    if (process.env.SENDGRID_API_KEY) {
      console.log(`📧 Email: Using SendGrid`);
    } else if (
      process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS
    ) {
      console.log(`📧 Email: Using SMTP (${process.env.EMAIL_HOST})`);
    } else {
      console.log(
        `📧 Email: Using test account (emails logged to console only)`,
      );
    }

    console.log(`🔒 Environment: ${app.get("env")}`);
    console.log("======================================");
    log(`serving on port ${port}`);
  });

  // Handle application shutdown gracefully
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} signal received. Starting graceful shutdown...`);

    // Close the HTTP server first to stop accepting new connections
    server.close(() => {
      console.log("HTTP server closed. No longer accepting connections.");

      // Close database pool connections
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

    // Force exit if graceful shutdown fails after 10 seconds
    setTimeout(() => {
      console.error(
        "Graceful shutdown timed out after 10 seconds. Forcing exit.",
      );
      process.exit(1);
    }, 10000);
  };

  // Listen for termination signals
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Handle uncaught exceptions
  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    shutdown("UNCAUGHT EXCEPTION");
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (reason, promise) => {
    console.error(
      "Unhandled Promise Rejection at:",
      promise,
      "reason:",
      reason,
    );
    // Don't exit the process, just log it
  });
})();
