import { CurrentViewer } from "@bfmono/apps/bfDb/classes/CurrentViewer.ts";
import { BfDeck } from "@bfmono/apps/bfDb/nodeTypes/rlhf/BfDeck.ts";
import { BfSample } from "@bfmono/apps/bfDb/nodeTypes/rlhf/BfSample.ts";
import { BfOrganization } from "@bfmono/apps/bfDb/nodeTypes/BfOrganization.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { generateDeckSlug } from "@bfmono/apps/bfDb/utils/slugUtils.ts";

const logger = getLogger(import.meta);

interface TelemetryData {
  timestamp: string;
  duration: number;
  provider: string;
  providerApiVersion: string;
  sessionId?: string;
  userId?: string;
  request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: unknown;
  };
  response: {
    status: number;
    headers: Record<string, string>;
    body: unknown;
  };
  bfMetadata?: {
    deckName: string;
    deckContent: string;
    contextVariables: Record<string, unknown>;
  };
}

export async function handleTelemetryRequest(
  request: Request,
): Promise<Response> {
  // Only allow POST requests
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    // Authenticate via API key header
    const apiKey = request.headers.get("x-bf-api-key");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // For MVP, use simple API key format: "bf+{orgId}"
    if (!apiKey.startsWith("bf+")) {
      return new Response(
        JSON.stringify({ error: "Invalid API key" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const orgId = apiKey.replace("bf+", "");

    // Create a CurrentViewer for this organization
    const currentViewer = CurrentViewer
      .__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
        import.meta,
        "telemetry@boltfoundry.com",
        orgId,
      );

    // Parse the telemetry data
    let telemetryData: TelemetryData;
    try {
      telemetryData = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // If no bfMetadata, just acknowledge the telemetry
    if (!telemetryData.bfMetadata) {
      logger.info("Telemetry received without deck metadata");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Telemetry processed without deck metadata",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const { deckName, deckContent, contextVariables } = telemetryData
      .bfMetadata;

    // Get the organization node
    const org = await BfOrganization.findX(
      currentViewer,
      currentViewer.orgBfOid,
    );

    // Generate slug and query for existing deck by slug to avoid duplicates
    const slug = generateDeckSlug(deckName, currentViewer.orgBfOid);

    const existingDecks = await BfDeck.query(
      currentViewer,
      {}, // Metadata - bfOid and className auto-injected
      { slug }, // Match by slug
      [], // No specific bfGids
    );

    let deck: BfDeck;
    if (existingDecks.length > 0) {
      // Found existing deck, use it
      deck = existingDecks[0] as BfDeck;
      logger.info(`Found existing deck: ${deckName} (slug: ${slug})`);
    } else {
      // Create new deck
      deck = await org.createTargetNode(BfDeck, {
        name: deckName,
        content: deckContent,
        description: `Auto-created from telemetry for ${deckName}`,
        slug,
      }) as BfDeck;
      logger.info(`Created new deck: ${deckName} (slug: ${slug})`);
    }

    // Create the sample
    const completionData = {
      request: telemetryData.request,
      response: telemetryData.response,
      provider: telemetryData.provider,
      duration: telemetryData.duration,
      contextVariables,
    };

    const sample = await deck.createTargetNode(BfSample, {
      name: `Telemetry Sample ${Date.now()}`,
      completionData: JSON.stringify(completionData),
      collectionMethod: "telemetry",
    });

    logger.info(
      `Created sample ${sample.metadata.bfGid} for deck ${deck.props.name}`,
    );

    return new Response(
      JSON.stringify({
        success: true,
        deckId: deck.metadata.bfGid,
        sampleId: sample.metadata.bfGid,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    logger.error("Error processing telemetry:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
