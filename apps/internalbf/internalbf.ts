#! /usr/bin/env -S deno run --allow-net --allow-env

import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import type discord from "discord.js";
import { DMChannel, type Message, NewsChannel, TextChannel } from "discord.js";

const logger = getLogger(import.meta);

// Get port from environment variable or use 9999 as default
const port = Number(getConfigurationVariable("PORT") ?? 9999);

// Discord client instance
let client: discord.Client | null = null;

// GitHub webhook payload types
interface GitHubRepository {
  full_name: string;
  name: string;
  owner: {
    login: string;
  };
}

interface GitHubUser {
  login: string;
}

interface WorkflowRunPayload {
  workflow_run: {
    status: string;
    conclusion: string | null;
    name: string;
    head_branch: string;
    head_sha: string;
    html_url: string;
  };
  repository: GitHubRepository;
}

interface PullRequestPayload {
  action: string;
  pull_request: {
    title: string;
    merged: boolean;
    user: GitHubUser;
    merged_by: GitHubUser;
    html_url: string;
  };
  repository: GitHubRepository;
}

interface PullRequestReviewPayload {
  action: string;
  pull_request: {
    title: string;
    user: GitHubUser;
    html_url: string;
  };
  requested_reviewer?: GitHubUser;
  repository: GitHubRepository;
}

// Route definitions
const routes = [
  {
    pattern: new URLPattern({ pathname: "/webhooks/github" }),
    method: "POST",
    handler: handleGitHubWebhook,
  },
  {
    pattern: new URLPattern({ pathname: "/" }),
    method: "GET",
    handler: handleHomePage,
  },
];

// GitHub webhook handler
async function handleGitHubWebhook(req: Request): Promise<Response> {
  try {
    const payload = await req.json();
    const eventType = req.headers.get("x-github-event");

    logger.info(`Received GitHub webhook: ${eventType}`);

    if (!client?.isReady()) {
      logger.warn("Discord client not ready, skipping notification");
      return new Response("Discord client not ready", { status: 200 });
    }

    switch (eventType) {
      case "workflow_run":
        return await handleWorkflowRun(payload);
      case "pull_request":
        return await handlePullRequest(payload);
      case "pull_request_review":
        return await handlePullRequestReview(payload);
      default:
        logger.info(`Unhandled GitHub event type: ${eventType}`);
        return new Response("Event type not handled", { status: 200 });
    }
  } catch (error) {
    logger.error("Error handling GitHub webhook:", error);
    return new Response("Webhook processed", { status: 200 });
  }
}

// Handle deployment notifications
async function handleWorkflowRun(
  payload: WorkflowRunPayload,
): Promise<Response> {
  const { workflow_run, repository } = payload;

  // Only process events from bolt-foundry/bolt-foundry repository
  if (repository.full_name !== "bolt-foundry/bolt-foundry") {
    return new Response("Repository not monitored", { status: 200 });
  }

  // Only handle completed deployment workflows
  if (workflow_run.status !== "completed") {
    return new Response("Workflow not completed", { status: 200 });
  }

  const success = workflow_run.conclusion === "success";
  const emoji = success ? "✅" : "❌";
  const status = success ? "succeeded" : "failed";

  const message = `${emoji} **Deployment ${status}**\n` +
    `**Workflow:** ${workflow_run.name}\n` +
    `**Repository:** ${repository.full_name}\n` +
    `**Branch:** ${workflow_run.head_branch}\n` +
    `**Commit:** ${workflow_run.head_sha.substring(0, 7)}\n` +
    `**URL:** ${workflow_run.html_url}`;

  await sendDiscordMessage(message);
  return new Response("Deployment notification sent", { status: 200 });
}

// Handle pull request events
async function handlePullRequest(
  payload: PullRequestPayload,
): Promise<Response> {
  const { action, pull_request, repository } = payload;

  // Only process events from bolt-foundry/bolt-foundry repository
  if (repository.full_name !== "bolt-foundry/bolt-foundry") {
    return new Response("Repository not monitored", { status: 200 });
  }

  // Only handle merged PRs
  if (action !== "closed" || !pull_request.merged) {
    return new Response("PR not merged", { status: 200 });
  }

  const message = `🎉 **Pull Request Merged**\n` +
    `**Title:** ${pull_request.title}\n` +
    `**Repository:** ${repository.full_name}\n` +
    `**Author:** ${pull_request.user.login}\n` +
    `**Merged by:** ${pull_request.merged_by.login}\n` +
    `**URL:** ${pull_request.html_url}`;

  await sendDiscordMessage(message);
  return new Response("PR notification sent", { status: 200 });
}

// Handle pull request review requests
async function handlePullRequestReview(
  payload: PullRequestReviewPayload,
): Promise<Response> {
  const { action, pull_request, requested_reviewer, repository } = payload;

  // Only process events from bolt-foundry/bolt-foundry repository
  if (repository.full_name !== "bolt-foundry/bolt-foundry") {
    return new Response("Repository not monitored", { status: 200 });
  }

  // Only handle review_requested actions
  if (action !== "review_requested") {
    return new Response("Not a review request", { status: 200 });
  }

  const message = `👀 **Review Requested**\n` +
    `**Title:** ${pull_request.title}\n` +
    `**Repository:** ${repository.full_name}\n` +
    `**Author:** ${pull_request.user.login}\n` +
    `**Reviewer:** ${requested_reviewer?.login || "Unknown"}\n` +
    `**URL:** ${pull_request.html_url}`;

  await sendDiscordMessage(message);
  return new Response("Review request notification sent", { status: 200 });
}

// Send message to Discord
async function sendDiscordMessage(message: string): Promise<void> {
  if (!client?.isReady()) {
    logger.warn("Discord client not ready");
    return;
  }

  try {
    const channelId = getConfigurationVariable(
      "DISCORD_NOTIFICATIONS_CHANNEL_ID",
    );
    if (!channelId) {
      logger.error("DISCORD_NOTIFICATIONS_CHANNEL_ID not set");
      return;
    }

    const channel = await client.channels.fetch(channelId);
    if (isTextBasedChannel(channel)) {
      await channel.send(message);
      logger.info("Discord notification sent successfully");
    } else {
      logger.error("Channel is not text-based or not found");
    }
  } catch (error) {
    logger.error("Error sending Discord message:", error);
  }
}

// Type guard function to check if a channel is text-based
function isTextBasedChannel(
  channel: unknown,
): channel is TextChannel | DMChannel | NewsChannel {
  return channel instanceof TextChannel || channel instanceof DMChannel ||
    channel instanceof NewsChannel;
}

// Handle home page
async function handleHomePage(_req: Request): Promise<Response> {
  // Check Contacts CMS API status
  let contactsApiStatus = "offline";
  try {
    const response = await fetch("https://bf-contacts.replit.app/api/health", {
      method: "GET",
    });
    if (response.ok) {
      contactsApiStatus = "online";
    }
  } catch (error) {
    logger.error("Error checking Contacts CMS API status:", error);
  }

  const html = `
    <!DOCTYPE html>
    <meta charset="utf-8">
    <html>
      <head>
        <title>Internal BF Pages</title>
        <style>
          body { font-family: system-ui; max-width: 800px; margin: 40px auto; padding: 0 20px; }
          .card { border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .status { display: inline-block; padding: 4px 8px; border-radius: 4px; }
          .status.online { background: #e2f5e6; color: #0a5921; }
          .status.offline { background: #fee2e2; color: #991b1b; }
        </style>
      </head>
      <body>
        <h1>Internal BF Pages</h1>
        
        <div class="card">
          <h3>Contacts CMS</h3>
          <div class="status ${contactsApiStatus}">
            API ${contactsApiStatus}
          </div>
          <p>Internal CMS for managing contacts and communications</p>
          <a href="https://bf-contacts.replit.app" target="_blank">Visit Contacts CMS →</a>
        </div>

        <div class="card">
          <h3>ThanksBot Status</h3>
          <div class="status ${client?.isReady() ? "online" : "offline"}">
            ${client?.isReady() ? "Online" : "Offline"}
          </div>
          <p>Discord bot for tracking thanks messages</p>
        </div>
        
        <div class="card">
          <h3>GitHub Webhook Endpoint</h3>
          <p>POST /webhooks/github</p>
          <p>Receives deployment, PR, and review notifications</p>
        </div>
      </body>
    </html>
  `;

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}

// Main request handler with routing
async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  logger.info(`[${new Date().toISOString()}] [${req.method}] ${url.pathname}`);

  // Find matching route
  for (const route of routes) {
    const match = route.pattern.exec(url);
    if (match && req.method === route.method) {
      return await route.handler(req);
    }
  }

  // No matching route
  return new Response("Not Found", { status: 404 });
}

// ThanksBot specific dependencies
async function setupThanksBot() {
  const THANKSBOT_NOTION_TOKEN = getConfigurationVariable(
    "THANKSBOT_NOTION_TOKEN",
  );
  const THANKSBOT_NOTION_DATABASE_ID = getConfigurationVariable(
    "THANKSBOT_NOTION_DATABASE_ID",
  );
  const THANKSBOT_TOKEN = getConfigurationVariable("THANKSBOT_TOKEN");

  if (!THANKSBOT_TOKEN) {
    logger.error("THANKSBOT_TOKEN environment variable not set.");
    return;
  }
  if (!THANKSBOT_NOTION_TOKEN) {
    logger.error("THANKSBOT_NOTION_TOKEN environment variable not set.");
    return;
  }
  if (!THANKSBOT_NOTION_DATABASE_ID) {
    logger.error("THANKSBOT_NOTION_DATABASE_ID environment variable not set.");
    return;
  }

  try {
    // Dynamic import for Discord.js
    const { default: discord } = await import("discord.js");
    // Dynamic import for Notion client
    const { Client } = await import("@notionhq/client");

    // Initialize the Notion client
    const notion = new Client({ auth: THANKSBOT_NOTION_TOKEN });

    // Set up Discord intents for reading message content
    const intents = new discord.IntentsBitField();
    intents.add(
      discord.IntentsBitField.Flags.Guilds,
      discord.IntentsBitField.Flags.GuildMessages,
      discord.IntentsBitField.Flags.MessageContent,
    );

    // Create Discord client
    client = new discord.Client({ intents });

    client.once("ready", () => {
      logger.info(`We have logged in as ${client?.user?.tag}`);
    });

    client.on("messageCreate", async (message: Message) => {
      // Ignore messages from the bot itself
      if (message.author.bot) return;

      // Regex pattern to match: #thanks @someone (or <@UserID>) for reason...
      if (message.content.toLowerCase().startsWith("#thanks")) {
        const pattern = /#thanks\s*<@!?(\d+)>\s*for\s*(.*)/i;
        const match = message.content.match(pattern);

        if (!match) {
          // User typed "#thanks" but didn't follow the format
          const usageMessage = "To thank someone, please use the format:\n" +
            "`#thanks @someone for your reason`\n\n" +
            "Example:\n" +
            "`#thanks @User for being awesome!`";
          if (isTextBasedChannel(message.channel)) {
            await message.channel.send(usageMessage);
          } else {
            logger.error("Channel is not a text-based channel.");
          }
          return;
        }

        const thankedUserId = match[1];
        const reason = match[2].trim();
        logger.info(`Thanked user ID: ${thankedUserId}`);
        logger.info(`Reason: ${reason}`);

        try {
          // fetch the user from the guild to get their name
          const thankedUser = await client?.users.fetch(thankedUserId);

          // Create an entry in Notion
          await notion.pages.create({
            parent: { database_id: THANKSBOT_NOTION_DATABASE_ID },
            properties: {
              "From (discord)": {
                rich_text: [{
                  text: {
                    content: message.author.username,
                  },
                }],
              },
              "To (discord)": {
                rich_text: [{
                  text: {
                    content: thankedUser?.username ?? "unknown",
                  },
                }],
              },
              "Message": {
                title: [{
                  text: {
                    content: reason,
                  },
                }],
              },
            },
          });

          // Reply with a witty message
          const wittyResponse =
            `Thanks for the thanks, <@${message.author.id}>!\n\n` +
            `I've recorded that you thanked <@${thankedUserId}> ` +
            `for '${reason}'. We're spreading good vibes here!`;
          await message.reply(wittyResponse);
        } catch (e) {
          logger.error(`Error processing thanks: ${e}`);
          await message.reply(
            "Oops! I had trouble recording that in Notion. Please try again later.",
          );
        }
      }
    });

    // Login to Discord
    await client.login(THANKSBOT_TOKEN);
    logger.info("ThanksBot initialized and connected to Discord");
  } catch (error) {
    logger.error(`Failed to initialize ThanksBot: ${error}`);
  }
}

// Start the server and ThanksBot
if (import.meta.main) {
  logger.info(`Starting internalbf app on port ${port}`);
  // Start ThanksBot in the background
  setupThanksBot();
  // Start the HTTP server
  Deno.serve({ port, hostname: "0.0.0.0" }, handleRequest);
}
