import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import type { BfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { BfMediaNodeTranscript } from "packages/bfDb/models/BfMediaNodeTranscript.ts";
import { callAPI } from "packages/lib/langchain.ts";
import { BfSearchResult } from "packages/bfDb/models/BfSearchResult.ts";
import { getLogger } from "deps.ts";
import { BfJob } from "packages/bfDb/models/BfJob.ts";
const logger = getLogger(import.meta)
type BfSearchResultItemProps = {
  bfMediaNodeTranscriptId: BfGid;
}

export class BfSearchResultItem extends BfNode<BfSearchResultItemProps> {
  async afterCreate() {
    const bfmnTranscript = await BfMediaNodeTranscript.findX(this.currentViewer, this.props.bfMediaNodeTranscriptId);
    await BfEdge.createEdgeBetweenNodes(this.currentViewer, bfmnTranscript, this);
    await BfJob.createJobForNode(this, "createBfSearchResultNodeClips", [])
  }

  async createBfSearchResultNodeClips() {
    const sourceSearches = await this.querySourceInstances(BfSearchResult);
    const sourceSearch = sourceSearches[0];
    logger.debug("Got source search", sourceSearch);
    const bfmnTranscript = await BfMediaNodeTranscript.findX(this.currentViewer, this.props.bfMediaNodeTranscriptId);
    
    // call gpt with our transcript
    const lol = await callAPI(sourceSearch.props.query, bfmnTranscript.text);
    logger.info("did we find clips?", lol);
  }
}