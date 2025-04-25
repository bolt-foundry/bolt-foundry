import { BfError } from "infra/BfError.ts";

/**
 * Error thrown when an invalid email is provided for login
 */
export class BfErrorInvalidEmail extends BfError {
  constructor(email: string) {
    super(`Invalid email format: "${email}"`);
    this.name = "BfErrorInvalidEmail";
  }
}
