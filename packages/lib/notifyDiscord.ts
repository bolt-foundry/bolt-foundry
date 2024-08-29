import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

export function notifyDiscord(content: string) {
  logger.info("notifying discord");
  const discordWebhookUrl = Deno.env.get("BF_DISCORD_WEBHOOK_CONTACT_URL");
  if (!discordWebhookUrl) {
    logger.error("Discord webhook URL not found");
    return;
  }

  const payload = {
    content,
  };

  return fetch(discordWebhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        logger.error("Error sending Discord webhook:", response.statusText);
      } else {
        logger.info("Discord webhook sent successfully");
      }
    })
    .catch((error) => {
      logger.error("Error sending Discord webhook:", error);
    });
}
