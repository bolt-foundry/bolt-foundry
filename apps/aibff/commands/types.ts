export interface Command {
  name: string;
  description: string;
  run: (args: Array<string>) => Promise<void>;
}
