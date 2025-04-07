import express from "express";
import passport from "passport";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);
const app = express();
const port = Number(Deno.env.get("PORT") ?? 5000);

app.use(express.json());
app.use(passport.initialize());

app.get("/api/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.listen(port, "0.0.0.0", () => {
  logger.info(`Contact manager server listening on port ${port}`);
});
