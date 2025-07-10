#! /usr/bin/env -S bff

import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { PostHog } from "posthog-node";

const logger = getLogger(import.meta);

let posthogClient: PostHog | null = null;

/**
 * Initialize the PostHog client if not already initialized
 */
export function initPosthog(): PostHog | null {
  if (posthogClient) {
    return posthogClient;
  }

  const posthogApiKey = getConfigurationVariable(
    "APPS_INTERNALBF_POSTHOG_API_KEY",
  );

  if (!posthogApiKey) {
    logger.debug("PostHog API key not found, analytics disabled");
    return null;
  }

  try {
    posthogClient = new PostHog(posthogApiKey, {
      host: "https://us.i.posthog.com",
    });
    logger.debug("PostHog client initialized successfully");
    return posthogClient;
  } catch (error) {
    logger.error("Failed to initialize PostHog client", error);
    return null;
  }
}

/**
 * Track a BFF command execution
 * @param command The name of the command
 * @param options Command options/arguments
 * @param success Whether the command executed successfully
 * @param duration Duration in milliseconds
 */
export async function trackBffCommand(
  command: string,
  options: Array<string> = [],
  success = true,
  duration = 0,
): Promise<void> {
  try {
    const client = initPosthog();
    if (!client) {
      return;
    }

    let userLogin = "unknown";
    const userFilePath = "tmp/user.json";

    // Check if user.json exists
    try {
      let userJson: { login?: string } = {};
      try {
        // Try to read the user file if it exists
        const userFileContent = await Deno.readTextFile(userFilePath);
        userJson = JSON.parse(userFileContent);
      } catch (_fileError) {
        // File doesn't exist or couldn't be read, fetch from GitHub API
        logger.debug("User file not found, fetching from GitHub API");
        const command = new Deno.Command("gh", {
          args: ["api", "user"],
          stdout: "piped",
        });

        const process = command.spawn();
        const { stdout, code } = await process.output();

        if (!code) {
          const decoder = new TextDecoder();
          const userData = decoder.decode(stdout);

          // Save the user data to file
          await Deno.writeTextFile(userFilePath, userData);

          // Parse the user data
          userJson = JSON.parse(userData);
        }
      }

      // Extract login from user data
      if (userJson && userJson.login) {
        userLogin = userJson.login;
        logger.debug(`Using GitHub login for tracking: ${userLogin}`);
      }
    } catch (userError) {
      logger.debug("Error getting GitHub user info", userError);
    }

    const distinctId = userLogin;

    client.capture({
      distinctId,
      event: `bff ${command} executed`,
      properties: {
        command,
        options: options.join(" "),
        arguments_count: options.length,
        success,
        duration_ms: duration,
        os: Deno.build.os,
        hostname: Deno.hostname(),
        github_user: userLogin,
      },
    });

    await client.flush();
    await client.shutdown();
    logger.debug(`Tracked BFF command: ${command}`);
  } catch (error) {
    // Don't let analytics errors affect BFF functionality
    logger.debug("Error tracking BFF command", error);
  }
}
