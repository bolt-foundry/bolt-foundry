import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

export type BfMediaProps = {
  filename: string;
};

export class BfMedia extends BfNode<BfMediaProps> {
  static async findMediaByViewer(bfCurrentViewer: BfCurrentViewer) {
    const media = await this.query(bfCurrentViewer, {
      bfOid: bfCurrentViewer.organizationBfGid,
    });
    return media;
  }

  example() {
    logger.info("this is an example job", this.currentViewer);
  }
}
