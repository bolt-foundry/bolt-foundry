#! /usr/bin/env -S deno run --allow-net --allow-env

import { getLogger } from "packages/logger/logger.ts";
import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";

const logger = getLogger(import.meta);

// Get port from environment variable or use 5000 as default
const port = Number(Deno.env.get("PORT") ?? 5000);

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
    const client = new discord.Client({ intents });

    client.once("ready", () => {
      logger.info(`We have logged in as ${client.user?.tag}`);
    });

    client.on("messageCreate", async (message) => {
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
          await message.channel.send(usageMessage);
          return;
        }

        const thankedUserId = match[1];
        const reason = match[2].trim();
        logger.info(`Thanked user ID: ${thankedUserId}`);
        logger.info(`Reason: ${reason}`);

        try {
          // fetch the user from the guild to get their name
          const thankedUser = await client.users.fetch(thankedUserId);

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
                    content: thankedUser.username,
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
  return new Response("Hello World", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
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
