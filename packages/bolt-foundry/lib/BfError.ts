export class BfError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BfError";
  }
}

export class BfErrorNotImplemented extends BfError {
  constructor(message = "Not implemented") {
    super(message);
    this.name = "BfErrorNotImplemented";
  }
}
