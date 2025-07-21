import { Request, Response, NextFunction } from "express";

interface RateLimitEntry {
  failureCount: number;
  firstFailure: number;
  blockedUntil?: number;
}

// In-memory store for rate limiting (consider Redis for production)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const RATE_LIMIT_CONFIG = {
  // Block after 3 failed validation attempts
  maxFailures: 3,
  // Within a 15-minute window
  windowMs: 15 * 60 * 1000, // 15 minutes
  // Block for 1 hour
  blockDurationMs: 60 * 60 * 1000, // 1 hour
  // Clean up old entries every 30 minutes
  cleanupIntervalMs: 30 * 60 * 1000, // 30 minutes
};

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of Array.from(rateLimitStore.entries())) {
    // Remove entries older than the window and not currently blocked
    if (
      now - entry.firstFailure > RATE_LIMIT_CONFIG.windowMs &&
      (!entry.blockedUntil || now > entry.blockedUntil)
    ) {
      rateLimitStore.delete(ip);
    }
  }
}, RATE_LIMIT_CONFIG.cleanupIntervalMs);

/**
 * Get client IP address with proper proxy support
 */
function getClientIP(req: Request): string {
  return (
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    "unknown"
  );
}

/**
 * Rate limiting middleware for contact form submissions
 */
export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const clientIP = getClientIP(req);
  const now = Date.now();
  const entry = rateLimitStore.get(clientIP);

  // Check if IP is currently blocked
  if (entry?.blockedUntil && now < entry.blockedUntil) {
    const remainingTime = Math.ceil((entry.blockedUntil - now) / 1000 / 60); // minutes
    console.log(`Rate limit: Blocked IP ${clientIP} for ${remainingTime} more minutes`);
    
    return res.status(429).json({
      message: "Too many failed attempts. Please try again later.",
      retryAfter: remainingTime,
    });
  }

  // If not blocked, allow request to proceed
  next();
}

/**
 * Record a validation failure for an IP
 */
export function recordValidationFailure(req: Request) {
  const clientIP = getClientIP(req);
  const now = Date.now();
  const entry = rateLimitStore.get(clientIP);

  if (!entry) {
    // First failure
    rateLimitStore.set(clientIP, {
      failureCount: 1,
      firstFailure: now,
    });
    console.log(`Rate limit: First validation failure recorded for IP ${clientIP}`);
  } else {
    // Check if we're still within the window
    if (now - entry.firstFailure <= RATE_LIMIT_CONFIG.windowMs) {
      // Within window, increment failure count
      entry.failureCount++;
      console.log(`Rate limit: Validation failure ${entry.failureCount} for IP ${clientIP}`);

      // Check if we should block this IP
      if (entry.failureCount >= RATE_LIMIT_CONFIG.maxFailures) {
        entry.blockedUntil = now + RATE_LIMIT_CONFIG.blockDurationMs;
        const blockDurationMinutes = RATE_LIMIT_CONFIG.blockDurationMs / 1000 / 60;
        console.log(`Rate limit: IP ${clientIP} blocked for ${blockDurationMinutes} minutes after ${entry.failureCount} failures`);
      }
    } else {
      // Outside window, reset counter
      rateLimitStore.set(clientIP, {
        failureCount: 1,
        firstFailure: now,
      });
      console.log(`Rate limit: Reset failure count for IP ${clientIP} (window expired)`);
    }
  }
}

/**
 * Get rate limit status for monitoring/debugging
 */
export function getRateLimitStatus(): Array<{ ip: string; entry: RateLimitEntry }> {
  return Array.from(rateLimitStore.entries()).map(([ip, entry]) => ({ ip, entry }));
}