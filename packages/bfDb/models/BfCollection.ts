import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfGoogleDriveResource } from "packages/bfDb/models/BfGoogleDriveResource.ts";
import { BfMedia } from "packages/bfDb/models/BfMedia.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { BfGid, toBfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
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

  addToVectorSearchIndex(transcripts: Array<BfMediaNodeTranscript>) {
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

  async createSavedSearch(query: string) {
    const savedSearch = await this.createTargetNode(BfSavedSearch, { query });
    const vectorStore = await this.getVectorStore();
    const searchResults = await vectorStore.similaritySearch(query, 15);
    await BfJob.createJobForNode(this, "__JOB_ONLY__createSearchResults", [searchResults, query, savedSearch.metadata.bfGid]);
    // await this.createSearchResults(searchResults, query, savedSearch);
    return savedSearch;
  }

  async __JOB_ONLY__createSearchResults(
    searchResults,
    query: string,
    savedSearchId: BfGid,
  ) {
    const savedSearch = await BfSavedSearch.findX(
      this.currentViewer,
      savedSearchId,
    );
    return this.createSearchResults(searchResults, query, savedSearch);
  }

  private createSearchResults(
    searchResults,
    query: string,
    savedSearch: BfSavedSearch,
  ) {
    const clipCreationPromises = searchResults.map(async (result) => {
      const transcriptId = toBfGid(result.metadata.bfGid);
      const transcript = await BfMediaNodeTranscript.findX(
        this.currentViewer,
        transcriptId,
      );

      const clipsPropsPromises = await transcript.findClips(query);

      return Promise.all(
        clipsPropsPromises.map(
          async (clipsPromise) => {
            const clipsProps = (await clipsPromise) ?? [];
            return clipsProps.map(async (clipProps) =>
              savedSearch.createResult(await clipProps)
            );
          },
        ),
      );
    });
    return Promise.all(clipCreationPromises);
  }
}
