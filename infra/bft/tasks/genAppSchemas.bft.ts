import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { makeSchema } from "nexus";
import { printSchema } from "graphql";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";
import { exists } from "@std/fs";

const logger = getLogger(import.meta);

/**
 * Apps that have selective GraphQL schemas to generate
 */
const APPS_WITH_SELECTIVE_SCHEMAS = [
  "boltfoundry-com",
];

/**
 * Generate selective GraphQL schema for a specific app
 */
export async function generateAppSchema(appName: string): Promise<boolean> {
  const schemaFile = `apps/${appName}/graphql/schema.ts`;
  const outputFile = `apps/${appName}/graphql/__generated__/schema.graphql`;

  try {
    // Check if the app has a selective schema file
    if (!(await exists(schemaFile))) {
      logger.debug(`No selective schema found for ${appName}, skipping`);
      return true;
    }

    logger.info(`Generating selective schema for ${appName}...`);

    // Dynamically import the app's schema configuration
    const schemaModule = await import(`../../../${schemaFile}`);
    const schemaConfig = schemaModule.schema;

    if (!schemaConfig) {
      logger.error(`No schema export found in ${schemaFile}`);
      return false;
    }

    // Generate the Nexus schema
    const nexusSchema = makeSchema({
      ...schemaConfig,
      formatTypegen: (content, type) => {
        if (type === "schema") {
          return `### @generated \n${content}`;
        } else {
          return `/* @generated */\n// deno-lint-ignore-file\n${
            content.replace(/(["'])(\.+\/[^"']+)\1/g, "$1$2.ts$1")
          }`;
        }
      },
      outputs: {
        schema: false, // We'll handle schema output manually
        typegen: false, // Skip typegen for selective schemas
      },
    });

    // Convert GraphQL schema to string
    const schemaString = printSchema(nexusSchema);

    // Write the schema file
    await Deno.writeTextFile(outputFile, `### @generated \n${schemaString}`);

    logger.info(`✅ Generated selective schema for ${appName}: ${outputFile}`);
    return true;
  } catch (error) {
    logger.error(`Failed to generate schema for ${appName}:`, error);
    return false;
  }
}

/**
 * Generate schemas for all apps with selective GraphQL configurations
 */
export async function generateAllAppSchemas(): Promise<boolean> {
  logger.info("Generating selective GraphQL schemas for apps...");

  let allSucceeded = true;

  for (const appName of APPS_WITH_SELECTIVE_SCHEMAS) {
    const success = await generateAppSchema(appName);
    if (!success) {
      allSucceeded = false;
    }
  }

  return allSucceeded;
}

export async function genAppSchemasCommand(_: Array<string>): Promise<number> {
  try {
    const success = await generateAllAppSchemas();

    if (success) {
      logger.info("✅ All app schemas generated successfully");
      return 0;
    } else {
      logger.error("❌ Some app schemas failed to generate");
      return 1;
    }
  } catch (err) {
    logger.error("App schema generation failed", err);
    return 1;
  }
}

export const bftDefinition = {
  description: "Generate selective GraphQL schemas for apps",
  fn: genAppSchemasCommand,
  aiSafe: true,
} satisfies TaskDefinition;
