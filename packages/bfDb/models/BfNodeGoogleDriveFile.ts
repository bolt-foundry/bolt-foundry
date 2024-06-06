import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";

type BfNodeGoogleDriveFileRequiredProps = {
  googleDriveFileId: string,
}

export class BfNodeGoogleDriveFile extends BfNode<BfNodeGoogleDriveFileRequiredProps> {
  __typename = "BfNodeGoogleDriveFile" as const;
}