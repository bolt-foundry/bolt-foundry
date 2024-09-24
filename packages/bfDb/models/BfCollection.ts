import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfGoogleDriveResource } from "packages/bfDb/models/BfGoogleDriveResource.ts";
import { BfMedia } from "packages/bfDb/models/BfMedia.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { toBfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfJob } from "packages/bfDb/models/BfJob.ts";
import { getLogger } from "deps.ts";
import { BfMediaNodeTranscript } from "packages/bfDb/models/BfMediaNodeTranscript.ts";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";

import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import type { Document } from "@langchain/core/documents";
import { BfSavedSearch } from "packages/bfDb/models/BfSavedSearch.ts";

const logger = getLogger(import.meta);

export enum CollectionToGoogleDriveResourceEdgeRoles {
  WATCHED_FOLDER = "WATCHED_FOLDER",
}

type BfCollectionProps = {
  name: string;
};

export class BfCollection extends BfNode<BfCollectionProps> {
  async addWatchedFolder(googleDriveResourceFolderId: string) {
    logger.info(
      `Adding watch folder ${googleDriveResourceFolderId} to ${this}`,
    );
    const bfGoogleDriveResource = (await BfGoogleDriveResource.find(
      this.currentViewer,
      toBfGid(googleDriveResourceFolderId),
    )) ?? await this.createTargetNode(BfGoogleDriveResource, {
      resourceId: googleDriveResourceFolderId,
    }, CollectionToGoogleDriveResourceEdgeRoles.WATCHED_FOLDER);
    const children = await bfGoogleDriveResource.getChildren();
    logger.debug(children);
    for (const child of children) {
      if (child.mimeType.startsWith("video")) {
        await BfJob.createJobForNode(
          this,
          "ingestGoogleDriveVideoByResourceId",
          [child.resourceId],
        );
      }
    }
  }

  async ingestGoogleDriveVideoByResourceId(googleResourceId: string) {
    const bfGoogleDriveResource = (await BfGoogleDriveResource.find(
      this.currentViewer,
      toBfGid(googleResourceId),
    )) ?? await this.createTargetNode(BfGoogleDriveResource, {
      resourceId: googleResourceId,
    });
    const bfMedia = await BfMedia.createFromGoogleDriveResource(
      bfGoogleDriveResource,
    );
    await BfEdge.createBetweenNodes(this.currentViewer, this, bfMedia);
    const transcripts = await bfMedia.createTranscripts();
    await this.addToVectorSearchIndex(transcripts);
  }

  private async getVectorStore() {
    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
    });

    const pinecone = new PineconeClient();
    const pineconeIndexName = Deno.env.get("PINECONE_INDEX_NAME") ?? "test";
    const pineconeIndex = pinecone.Index(pineconeIndexName);

    logger.debug("pinecone index", pineconeIndex);
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
      maxConcurrency: 5,
      namespace: this.metadata.bfGid,
    });
    return vectorStore;
  }

  async addToVectorSearchIndex(transcripts: Array<BfMediaNodeTranscript>) {
    const promises = transcripts.map(async (transcript) => {
      const vectorStore = await this.getVectorStore();

      const documents: Array<Document> = transcript.getTokenSafeText().map(
        (text) => {
          return {
            id: transcript.metadata.bfGid,
            metadata: transcript.metadata,
            pageContent: text,
          };
        },
      );
      logger.debug("langchainDocument to send", documents);
      try {
        const results = await vectorStore.addDocuments(documents);
        logger.info("Sent", results);
      } catch (e) {
        logger.error(e);
        throw e;
      }
      logger.info(`Sent to vector store for ${transcript}`);
      return transcript;
    });

    return Promise.all(promises);
  }

  async search(query: string) {
    const savedSearch = await this.createTargetNode(BfSavedSearch, { query });
    const vectorStore = await this.getVectorStore();
    const results = await vectorStore.similaritySearch(query, 15);
    const clipsPromise = results.map((result) => toBfGid(result.metadata.bfGid))
      .map(async (id) =>
        await BfMediaNodeTranscript.find(this.currentViewer, id)
      )
      .filter(Boolean)
      .map(async (transcript) => await transcript.findClips(query))
      .map(async (clipProps) => await savedSearch.createResult(clipProps));
    return savedSearch;
  }
}
