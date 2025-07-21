interface DiscordWebhookPayload {
  content?: string;
  embeds?: Array<{
    title?: string;
    description?: string;
    color?: number;
    fields?: Array<{
      name: string;
      value: string;
      inline?: boolean;
    }>;
    timestamp?: string;
  }>;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  company?: string | null;
  notes?: string | null;
  contacted: boolean;
  createdAt: Date;
  updatedAt: Date;
  emailSentAt: Date | null;
}

export async function sendDiscordNotification(
  contact: Contact,
): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL_CONTACTS;

  if (!webhookUrl) {
    console.log("Discord webhook URL not configured, skipping notification");
    return false;
  }

  try {
    const payload: DiscordWebhookPayload = {
      embeds: [{
        title: "🎉 New Contact Signup",
        description: `A new contact has joined the waitlist!`,
        color: 0x00ff00, // Green color
        fields: [
          {
            name: "👤 Name",
            value: contact.name,
            inline: true,
          },
          {
            name: "📧 Email",
            value: contact.email,
            inline: true,
          },
          {
            name: "🏢 Company",
            value: contact.company || "Not specified",
            inline: true,
          },
        ],
        timestamp: contact.createdAt.toISOString(),
      }],
    };

    if (contact.notes) {
      payload.embeds![0].fields!.push({
        name: "📝 Notes",
        value: contact.notes,
        inline: false,
      });
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log(
        `Successfully sent Discord notification for contact ${contact.id}`,
      );
      return true;
    } else {
      console.error(
        `Failed to send Discord notification: ${response.status} ${response.statusText}`,
      );
      return false;
    }
  } catch (error) {
    console.error("Error sending Discord notification:", error);
    return false;
  }
}
