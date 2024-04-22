export class BfDbError extends Error {
  constructor(message = "An error occurred", ...args: unknown[]) {
    super(message, ...args);
  }
}
export class BfDbErrorNotImplemented extends BfDbError {
  constructor(message = "Not implemented", ...args: unknown[]) {
    super(message, ...args);
  }
}
