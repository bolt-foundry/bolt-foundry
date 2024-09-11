import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { getLogger } from "deps.ts";

const _logger = getLogger(import.meta);

enum BfMediaNodeTranscriptStatus {
  CREATED = "CREATED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
}
export type BfMediaNodeTranscriptProps = {
  id: string;
  words: string;
  filename: string;
  status: BfMediaNodeTranscriptStatus;
};

export class BfMediaNodeTranscript extends BfNode<BfMediaNodeTranscriptProps> {
}
