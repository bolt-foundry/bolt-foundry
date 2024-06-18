import { BfError } from "lib/BfError.ts";

export class BfDbError extends BfError {
  constructor(message = "A database error occured") {
    super(message);
  }
}
export class BfDbErrorNotImplemented extends BfDbError {
  constructor(message = "Not implemented") {
    super(message);
  }
}
