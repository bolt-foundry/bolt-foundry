import { BfError } from "infra/BfError.ts";

export class BfErrorNode extends BfError {}

export class BfErrorNodeNotFound extends BfErrorNode {
  constructor(message = "Node not found") {
    super(message);
  }
}
