import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL_CONTACTS) {
  throw new Error("DATABASE_URL_CONTACTS, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL_CONTACTS,
  },
});
