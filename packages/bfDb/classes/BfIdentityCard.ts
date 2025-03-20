
import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import type { BfSection } from "packages/bfDb/classes/BfSection.ts";
import type { BfNodeBaseProps } from "packages/bfDb/classes/BfNodeBase.ts";

export interface BfIdentityCardProps extends BfNodeBaseProps {
  title: string;
  content: string;
}

export class BfIdentityCard extends BfNode<BfIdentityCardProps> {
  async breakIntoSections(): Promise<void> {
    throw new Error("Not implemented");
  }

  async getSections(): Promise<BfSection[]> {
    throw new Error("Not implemented");
  }
}
