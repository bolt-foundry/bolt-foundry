import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { printSchema } from "graphql";
import { createPothosSchema } from "@bfmono/apps/bfDb/graphql/schemaConfigPothosSimple.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";

const logger = getLogger(import.meta);

export async function generateGqlTypes() {
  // Create Pothos schema
  const schema = await createPothosSchema();

  // Generate GraphQL schema SDL
  const schemaString = `### @generated \n${printSchema(schema)}`;

  // Write schema to file
  const schemaPath = new URL(
    import.meta.resolve(`apps/bfDb/graphql/__generated__/schema.graphql`),
  ).pathname;

  // Ensure directory exists
  await Deno.mkdir(
    new URL(import.meta.resolve(`apps/bfDb/graphql/__generated__/`)).pathname,
    { recursive: true },
  );

  // Write schema file
  await Deno.writeTextFile(schemaPath, schemaString);
}

export async function genGqlTypesCommand(_: Array<string>): Promise<number> {
  try {
    logger.info("Generating GraphQL schema and types...");
    await generateGqlTypes();
    logger.info("✅ GraphQL types generated");
    return 0;
  } catch (err) {
    logger.error("GraphQL type generation failed", err);
    return 1;
  }
}

export const bftDefinition = {
  description: "Generate GraphQL schema using Pothos",
  fn: genGqlTypesCommand,
  aiSafe: true,
} satisfies TaskDefinition;
