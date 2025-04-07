import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon database to use WebSockets
neonConfig.webSocketConstructor = ws;

console.log("Initializing database connection...");

// Verify DATABASE_URL_CONTACTS is set
if (!process.env.DATABASE_URL_CONTACTS) {
  const error =
    "DATABASE_URL_CONTACTS environment variable is not set. Database connections will fail.";
  console.error(error);
  throw new Error(error);
}

// Create connection pool with more detailed configuration
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL_CONTACTS,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 5000, // How long to wait for a connection to become available
});

// Set up error handling for the pool
pool.on("error", (err) => {
  console.error("Unexpected error on idle database client", err);
  process.exit(-1);
});

// Verify database connection on startup
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

// Initialize connection test (don't await, let it run in background)
testDatabaseConnection().then((success) => {
  if (!success) {
    console.warn("Application started with database connection issues");
  }
});

// Initialize Drizzle ORM with the connection pool
export const db = drizzle({ client: pool, schema });
console.log("Database initialization complete");
