import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, NextFunction, Request, Response } from "express";
import session from "express-session";
import { timingSafeEqual } from "node:crypto";
import { storage } from "./storage";
import {
  insertUserSchema,
  loginUserSchema,
  User as SchemaUser,
} from "@shared/schema";
import { pool } from "./db";
import connectPg from "connect-pg-simple";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { nanoid } from "nanoid";
import { initEmailService, sendVerificationEmail } from "./services/email";

// Declare global namespace for Express session
declare global {
  namespace Express {
    interface User extends SchemaUser {}
  }
}

// Type for User data we return to the client (excludes sensitive info)
type SafeUser = {
  id: number;
  email: string;
  name: string;
  isVerified: boolean;
  createdAt: Date;
};

// Create a PostgreSQL session store
const PostgresSessionStore = connectPg(session);

/**
 * Hash a password using Web Crypto API
 */
async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  const key = await crypto.subtle.importKey(
    "raw",
    data,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    key,
    256
  );
  
  const hashArray = new Uint8Array(derivedBits);
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const hashHex = Array.from(hashArray).map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `${hashHex}.${saltHex}`;
}

/**
 * Compare a supplied password against a stored hashed password
 */
async function comparePasswords(supplied: string, stored: string) {
  const [hashed, saltHex] = stored.split(".");
  const salt = new Uint8Array(saltHex.match(/.{2}/g)?.map(byte => parseInt(byte, 16)) || []);
  const hashedBytes = new Uint8Array(hashed.match(/.{2}/g)?.map(byte => parseInt(byte, 16)) || []);
  
  const encoder = new TextEncoder();
  const data = encoder.encode(supplied);
  
  const key = await crypto.subtle.importKey(
    "raw",
    data,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    key,
    256
  );
  
  const suppliedBytes = new Uint8Array(derivedBits);
  return timingSafeEqual(hashedBytes, suppliedBytes);
}

/**
 * Generate a verification token
 */
function generateVerificationToken(): string {
  return nanoid(32);
}

/**
 * Initialize email service for the entire application
 */
export async function initializeAuthEmailService() {
  console.log("[AUTH] Initializing email service for authentication...");

  // Add a small delay to ensure any environment variables are properly loaded
  await new Promise((resolve) => setTimeout(resolve, 500));

  await initEmailService();

  // Test the email service by sending a test email
  if (process.env.NODE_ENV === "development") {
    console.log("[AUTH] Email service initialized for authentication");
  } else {
    console.log(
      "[AUTH] Email service initialized for authentication in production mode",
    );
    console.log(
      "[AUTH] REPLIT_DOMAINS:",
      process.env.REPLIT_DOMAINS || "not set",
    );
  }
}

/**
 * Check if a user is authenticated
 */
export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({ message: "Authentication required" });
}

/**
 * Check if a user is verified
 */
export function isVerified(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && req.user.isVerified) {
    return next();
  }

  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }

  return res.status(403).json({ message: "Email verification required" });
}

/**
 * Set up authentication for the app
 */
export function setupAuth(app: Express) {
  // Ensure proper proxy settings for cookies
  app.set("trust proxy", 1);

  // Configure session middleware
  // Configure session middleware with detailed settings
  app.use(
    session({
      store: new PostgresSessionStore({
        pool,
        tableName: "session",
        createTableIfMissing: true,
        pruneSessionInterval: 60, // Prune invalid sessions every minute
      }),
      secret: process.env.SESSION_SECRET || "contact-manager-session-secret",
      resave: true, // Save session on each request
      saveUninitialized: true, // Save new sessions even if not modified
      rolling: true, // Reset expiration countdown on every response
      name: "contact_manager_sid", // Rename to avoid issues with some browsers
      cookie: {
        httpOnly: true, // Prevent client-side access to the cookie
        secure: false, // Must be false in development, true in production
        sameSite: "lax", // This is important for cross-origin requests
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days for maximum persistence
        path: "/", // Available on all paths
      },
      unset: "keep", // Keep the session in the store after being destroyed
    }),
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure Local Strategy for username/password authentication
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
            user.password,
          );

          if (!isValidPassword) {
            return done(null, false, { message: "Invalid email or password" });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  // Serialize user to session
  passport.serializeUser((user: Express.User, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        // If user not found (for example, user was deleted or database was changed),
        // return null without error to let the authentication system handle it cleanly
        return done(null, null);
      }
      done(null, user);
    } catch (error) {
      console.error("Error deserializing user:", error);
      done(error);
    }
  });

  // Register route
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const userData = insertUserSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);

      // Create verification token
      const verificationToken = generateVerificationToken();
      const tokenExpiry = new Date();
      tokenExpiry.setHours(tokenExpiry.getHours() + 24); // 24-hour expiry

      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Set verification token
      await storage.setVerificationToken(
        user.id,
        verificationToken,
        tokenExpiry,
      );

      // Send verification email
      await sendVerificationEmail(user.email, user.name, verificationToken);

      // Log in the user
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error during login" });
        }

        // Return user without sensitive information
        return res.status(201).json({
          id: user.id,
          email: user.email,
          name: user.name,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }

      console.error("Registration error:", error);
      return res.status(500).json({ message: "Registration failed" });
    }
  });

  // Login route
  app.post(
    "/api/login",
    (req: Request, res: Response, next: NextFunction) => {
      try {
        // Validate request body
        loginUserSchema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof z.ZodError) {
          const validationError = fromZodError(error);
          return res.status(400).json({ message: validationError.message });
        }
        next(error);
      }
    },
    passport.authenticate("local", { failWithError: true }),
    (req: Request, res: Response) => {
      // Return user without sensitive information
      const user = req.user as SchemaUser;
      return res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      });
    },
    (err: any, req: Request, res: Response, next: NextFunction) => {
      return res.status(401).json({ message: "Invalid email or password" });
    },
  );

  // Logout route
  app.post("/api/logout", (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Get current user route
  app.get("/api/user", (req: Request, res: Response) => {
    console.log("-------- /api/user REQUEST --------");
    console.log("Session ID:", req.sessionID);
    console.log("Is authenticated:", req.isAuthenticated());
    console.log("Session cookie:", req.headers.cookie);
    console.log("Session object:", JSON.stringify(req.session));
    console.log("Parsed cookies:", req.cookies);
    console.log("Headers:", req.headers);

    if (!req.isAuthenticated() || !req.user) {
      console.log("User not authenticated or session invalid");
      // Clear the session if it exists but has an invalid user reference
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
      const user = req.user as SchemaUser;
      console.log("User found:", user.id, user.email);

      // Set cache control headers to prevent caching
      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      );
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      return res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      });
    } catch (error) {
      console.error("Error processing user request:", error);
      return res.status(401).json({
        message: "Session invalid",
        success: false,
      });
    }
  });

  // Verify email route
  app.get("/api/verify", async (req: Request, res: Response) => {
    const token = req.query.token as string;

    if (!token) {
      return res.status(400).json({
        message: "Verification token is required",
      });
    }

    try {
      const user = await storage.getUserByVerificationToken(token);

      if (!user) {
        return res.status(400).json({
          message: "Invalid or expired verification token",
        });
      }

      // Verify user
      await storage.verifyUser(user.id);

      // Redirect to the verification success page
      return res.redirect("/verification-success");
    } catch (error) {
      console.error("Verification error:", error);
      return res.status(500).json({ message: "Verification failed" });
    }
  });

  // Resend verification email route
  app.post(
    "/api/resend-verification",
    isAuthenticated,
    async (req: Request, res: Response) => {
      const user = req.user as SchemaUser;

      // Check if already verified
      if (user.isVerified) {
        return res.status(400).json({ message: "Email already verified" });
      }

      try {
        // Generate new verification token
        const verificationToken = generateVerificationToken();
        const tokenExpiry = new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 24); // 24-hour expiry

        // Set verification token
        await storage.setVerificationToken(
          user.id,
          verificationToken,
          tokenExpiry,
        );

        // Send verification email
        await sendVerificationEmail(user.email, user.name, verificationToken);

        return res.status(200).json({ message: "Verification email sent" });
      } catch (error) {
        console.error("Resend verification error:", error);
        return res.status(500).json({
          message: "Failed to resend verification email",
        });
      }
    },
  );
}
