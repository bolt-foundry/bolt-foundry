import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { objectStorageClient, Readable } from "packages/bfDb/deps.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

type BfClipReviewProps = {
  title: string;
};

type BfClipReviewInternalProps = {
  progress: number;
  fileSize: number;
  mimetype: string;
}

export class BfClipReview extends BfNode<BfClipReviewProps, BfClipReviewInternalProps> {
  addFile(file: File) {
    logger.debug("Writing file", file)
    const stream = file.stream();
    logger.debug("Opened stream", stream)
    objectStorageClient?.uploadFromStream(this.metadata.bfGid, Readable.from(stream));
    
    return;
  }

}
