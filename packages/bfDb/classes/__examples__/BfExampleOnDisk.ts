import { BfNodeOnDisk } from "../../coreModels/BfNodeOnDisk.ts";
import { BfNodeOnDiskMetadata } from "../../types/BfNodeTypes.ts";
import { getLogger } from "../../../logger.ts";

const logger = getLogger(import.meta);

// Define the props interface for the example class
interface BfExampleOnDiskProps {
  title: string;
  description?: string;
  createdAt: Date;
  tags: string[];
}

class BfExampleOnDisk
  extends BfNodeOnDisk<BfExampleOnDiskProps, BfNodeOnDiskMetadata> {
  // Initialize the data directory for this model
  static {
    this.setDataDirectory("./data/examples");
  }

  get formattedTitle(): string {
    return this.props.title.toUpperCase();
  }

  get tagCount(): number {
    return this.props.tags.length;
  }

  override async beforeCreate(): Promise<void> {
    await super.beforeCreate();

    // Set default createdAt if not provided
    if (!this.props.createdAt) {
      this.props.createdAt = new Date();
    }

    // Ensure tags is an array
    if (!Array.isArray(this.props.tags)) {
      this.props.tags = [];
    }

    logger.debug(`Creating new example: ${this.props.title}`);
  }

  override async afterCreate(): Promise<void> {
    logger.debug(`Example created successfully: ${this.props.title}`);
  }

  override async afterLoad(): Promise<void> {
    // Convert string dates back to Date objects if needed
    if (typeof this.props.createdAt === "string") {
      this.props.createdAt = new Date(this.props.createdAt);
    }

    logger.debug(`Example loaded: ${this.props.title}`);
  }

  addTag(tag: string): void {
    if (!this.props.tags.includes(tag)) {
      this.props.tags.push(tag);
    }
  }

  removeTag(tag: string): void {
    this.props.tags = this.props.tags.filter((t) => t !== tag);
  }
}

export { BfExampleOnDisk, type BfExampleOnDiskProps };
