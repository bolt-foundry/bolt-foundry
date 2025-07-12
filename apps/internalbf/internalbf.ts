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

  // Type guard function to check if a channel is text-based
  function isTextBasedChannel(
    channel: unknown,
  ): channel is TextChannel | DMChannel | NewsChannel {
    return channel instanceof TextChannel || channel instanceof DMChannel ||
      channel instanceof NewsChannel;
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

// Simple request handler
function handleRequest(req: Request): Response {
  logger.info(`[${new Date().toISOString()}] [${req.method}] ${req.url}`);

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
          <h3>ThanksBot Status</h3>
          <div class="status ${client?.isReady() ? "online" : "offline"}">
            ${client?.isReady() ? "Online" : "Offline"}
          </div>
          <p>Discord bot for tracking thanks messages</p>
        </div>
      </body>
    </html>
  `;

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}

// Start the server and ThanksBot
if (import.meta.main) {
  logger.info(`Starting internalbf app on port ${port}`);
  // Start ThanksBot in the background
  setupThanksBot();
  // Start the HTTP server
  Deno.serve({ port, hostname: "0.0.0.0" }, handleRequest);
}
