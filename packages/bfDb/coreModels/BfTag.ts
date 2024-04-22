import { BfModel } from "packages/bfDb/classes/BfModel.ts";

type BfTagProps = {
  name: string;
};

export class BfTag extends BfModel<BfTagProps> {
  __typename = "BfTag" as const;
}
