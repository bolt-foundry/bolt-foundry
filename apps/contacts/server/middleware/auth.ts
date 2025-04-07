import { NextFunction, Request, Response } from "express";

/**
 * Middleware to authenticate API requests using an API key
 * The API key should be provided in the 'x-api-key' header
 */
export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  console.log(`Authenticating request to ${req.method} ${req.path}`);

  const apiKey = req.header("x-api-key");

  // Check if API_KEY environment variable is set
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable is not set");
    return res.status(500).json({
      success: false,
      message: "Server configuration error: API_KEY not configured",
    });
  }

  // Check if API key is provided
  if (!apiKey) {
    console.error("API key missing in request");
    return res.status(401).json({
      success: false,
      message: "API key is missing",
    });
  }

  // Check if API key is valid
  if (apiKey !== process.env.API_KEY) {
    console.error("Invalid API key provided");
    console.error(
      `API key length: ${apiKey.length}, Expected length: ${
        process.env.API_KEY!.length
      }`,
    );
    console.error(
      `API key first 5 chars: ${apiKey.substring(0, 5)}, Expected first 5: ${
        process.env.API_KEY!.substring(0, 5)
      }`,
    );
    console.error(
      `API key last 5 chars: ${
        apiKey.substring(apiKey.length - 5)
      }, Expected last 5: ${
        process.env.API_KEY!.substring(process.env.API_KEY!.length - 5)
      }`,
    );

    return res.status(403).json({
      success: false,
      message: "Invalid API key",
    });
  }

  // If API key is valid, proceed to the next middleware/route handler
  console.log("API key authentication successful");
  next();
};
