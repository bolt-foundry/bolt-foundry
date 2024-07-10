import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";

type BfClipProps = {
  title: string;
};

export class BfClip extends BfNode<BfClipProps> {
  afterCreate(): void | Promise<void> {
    this.createNewClipReview();
  }
  async createNewClipReview() {
    
  }
}
