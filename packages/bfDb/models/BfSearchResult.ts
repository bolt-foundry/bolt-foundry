import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { getLogger } from "deps.ts";
const logger = getLogger(import.meta);
/**
 * hacky
 */
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { BfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfMediaNodeTranscript } from "packages/bfDb/models/BfMediaNodeTranscript.ts";

async function hackyVersionOfSearch(query: string, namespace: string) {
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });

  const pinecone = new PineconeClient();
  // Will automatically read the PINECONE_API_KEY and PINECONE_ENVIRONMENT env vars
  const pineconeIndexName = Deno.env.get("PINECONE_INDEX_NAME") ?? "test";
  const pineconeIndex = pinecone.Index(pineconeIndexName);

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
    maxConcurrency: 5,
    namespace,
  });

  const similaritySearchWithScoreResults = await vectorStore
    .similaritySearchWithScore(
      query,
      10,
    );
  return similaritySearchWithScoreResults;
}

/**
 * end hacky
 */

type BfSearchResultProps = {
  query: string;
};
export class BfSearchResult extends BfNode<BfSearchResultProps> {
  protected async afterCreate() {
    await this.search()
  }
  async search() {
    const vectorSearchResults = await hackyVersionOfSearch(
      this.props.query,
      this.metadata.bfOid,
    );
    logger.info("Got vector search results", vectorSearchResults.length);
    const bestTranscriptIDs = vectorSearchResults.map((result) =>
      result[0].metadata.bfGid
    );
    logger.info(`Found ${ searchResultItems.length } search result items`);
    throw new BfError(`Not doing anything with search yet for ${this}`)
  }

  async getCollectionLength() {
    return 1337;
  }
}
