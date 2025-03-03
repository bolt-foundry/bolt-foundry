import {
  type BfMetadataBase,
  BfNodeBase,
  type BfNodeBaseProps,
} from "packages/bfDb/classes/BfNodeBase.ts";
import type { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import type { BfGid } from "packages/bfDb/classes/BfNodeIds.ts";
import type { BfNodeCache } from "packages/bfDb/classes/BfNodeBase.ts";
import { BfErrorNodeNotFound } from "packages/bfDb/classes/BfErrorNode.ts";
import { getLogger } from "packages/logger.ts";
import { exists } from "@std/fs";
import { join } from "@std/path";

const logger = getLogger(import.meta);

export type BfNodeOnDiskMetadata = BfMetadataBase & {
  filePath: string;
  lastModified: Date;
};

/**
 * BfNodeOnDisk - Node implementation that persists to disk
 * Provides file system based persistence for node data
 */
export class BfNodeOnDisk<
  TProps extends BfNodeBaseProps = BfNodeBaseProps,
  TMetadata extends BfMetadataBase = BfNodeOnDiskMetadata,
> extends BfNodeBase<TProps, TMetadata> {
  private static dataDir = "./data";

  static setDataDirectory(dir: string): void {
    this.dataDir = dir;
  }

  static getNodePath(id: BfGid): string {
    return join(this.dataDir, `${id.toString()}.json`);
  }

  static override generateMetadata<
    TProps extends BfNodeBaseProps,
    TMetadata extends BfMetadataBase,
    TThis extends typeof BfNodeBase<TProps, TMetadata>,
  >(
    this: TThis,
    cv: BfCurrentViewer,
    metadata?: Partial<TMetadata>,
  ): TMetadata {
    const baseMetadata = super.generateMetadata(cv, metadata);
    const filePath = this.getNodePath(baseMetadata.bfGid);

    return {
      ...baseMetadata,
      filePath,
      lastModified: new Date(),
    } as TMetadata;
  }

  static override async findX<
    TProps extends BfNodeBaseProps,
    TThis extends typeof BfNodeOnDisk<TProps>,
  >(
    this: TThis,
    cv: BfCurrentViewer,
    id: BfGid,
    cache?: BfNodeCache,
  ): Promise<InstanceType<TThis>> {
    logger.debug(`Finding node with ID: ${id}`);

    // Check cache first if provided
    const cachedItem = cache?.get(id);
    if (cachedItem) {
      return cachedItem as InstanceType<TThis>;
    }

    const filePath = this.getNodePath(id);
    if (!await exists(filePath)) {
      logger.debug(`Node not found at path: ${filePath}`);
      throw new BfErrorNodeNotFound(`Node with ID ${id} not found on disk`);
    }

    try {
      const fileContent = await Deno.readTextFile(filePath);
      const data = JSON.parse(fileContent);

      const node = new this(cv, data.props, data.metadata) as InstanceType<
        TThis
      >;
      await node.afterLoad();

      if (cache) {
        cache.set(id, node);
      }

      return node;
    } catch (error) {
      logger.error(`Error loading node from disk: ${error.message}`, {
        error,
        id,
        filePath,
      });
      throw new BfErrorNodeNotFound(
        `Error loading node with ID ${id}: ${error.message}`,
      );
    }
  }

  static override async query<
    TProps extends BfNodeBaseProps,
    TThis extends typeof BfNodeOnDisk<TProps>,
  >(
    this: TThis,
    cv: BfCurrentViewer,
    metadata: Partial<BfMetadataBase>,
    props: Partial<TProps>,
    bfGids: Array<BfGid>,
    cache?: BfNodeCache,
  ): Promise<Array<InstanceType<TThis>>> {
    logger.debug("Querying nodes on disk", {
      metadata,
      props,
      bfGidsCount: bfGids.length,
    });

    const results: Array<InstanceType<TThis>> = [];

    // If bfGids is provided, just find those nodes
    if (bfGids.length > 0) {
      for (const id of bfGids) {
        try {
          const node = await this.find(cv, id, cache);
          if (node) {
            results.push(node);
          }
        } catch (error) {
          // Skip nodes that aren't found
          if (!(error instanceof BfErrorNodeNotFound)) {
            throw error;
          }
        }
      }
      return results;
    }

    // If no specific ids were provided, scan the data directory
    try {
      const dataDir = this.dataDir;
      for await (const entry of Deno.readDir(dataDir)) {
        if (!entry.isFile || !entry.name.endsWith(".json")) {
          continue;
        }

        try {
          const fileContent = await Deno.readTextFile(
            join(dataDir, entry.name),
          );
          const data = JSON.parse(fileContent);

          // Check if it's an instance of this class
          if (data.metadata?.className !== this.name) {
            continue;
          }

          // Check if metadata matches the query
          if (metadata && Object.keys(metadata).length > 0) {
            let matches = true;
            for (const [key, value] of Object.entries(metadata)) {
              if (data.metadata[key] !== value) {
                matches = false;
                break;
              }
            }
            if (!matches) continue;
          }

          // Check if props match the query
          if (props && Object.keys(props).length > 0) {
            let matches = true;
            for (const [key, value] of Object.entries(props)) {
              if (data.props[key] !== value) {
                matches = false;
                break;
              }
            }
            if (!matches) continue;
          }

          // If we get here, the node matches our query
          const node = new this(cv, data.props, data.metadata) as InstanceType<
            TThis
          >;
          await node.afterLoad();

          if (cache) {
            cache.set(node.metadata.bfGid, node);
          }

          results.push(node);
        } catch (error) {
          logger.warn(
            `Error processing node file ${entry.name}: ${error.message}`,
          );
          // Continue processing other files
        }
      }
    } catch (error) {
      logger.error(`Error querying nodes: ${error.message}`, { error });
      throw error;
    }

    return results;
  }

  private ensureDataDirExists = async (): Promise<void> => {
    try {
      const dataDir = (this.constructor as typeof BfNodeOnDisk).dataDir;
      if (!await exists(dataDir)) {
        await Deno.mkdir(dataDir, { recursive: true });
        logger.debug(`Created data directory: ${dataDir}`);
      }
    } catch (error) {
      logger.error(`Error ensuring data directory exists: ${error.message}`, {
        error,
      });
      throw error;
    }
  };

  override async save(): Promise<this> {
    logger.debug(`Saving node to disk: ${this.metadata.bfGid}`);

    await this.ensureDataDirExists();

    const metadata = {
      ...this.metadata,
      lastModified: new Date(),
    };

    const data = {
      props: this.props,
      metadata,
    };

    try {
      const filePath = (this.metadata as BfNodeOnDiskMetadata).filePath;
      await Deno.writeTextFile(filePath, JSON.stringify(data, null, 2));
      logger.debug(`Node saved successfully to ${filePath}`);
    } catch (error) {
      logger.error(`Error saving node to disk: ${error.message}`, {
        error,
        id: this.metadata.bfGid,
      });
      throw error;
    }

    return this;
  }

  override async delete(): Promise<boolean> {
    logger.debug(`Deleting node from disk: ${this.metadata.bfGid}`);

    try {
      const filePath = (this.metadata as BfNodeOnDiskMetadata).filePath;
      await Deno.remove(filePath);
      logger.debug(`Node deleted successfully from ${filePath}`);
      return true;
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        logger.warn(`Node file already deleted: ${this.metadata.bfGid}`);
        return false;
      }

      logger.error(`Error deleting node from disk: ${error.message}`, {
        error,
        id: this.metadata.bfGid,
      });
      throw error;
    }
  }

  override async load(): Promise<this> {
    logger.debug(`Loading node from disk: ${this.metadata.bfGid}`);

    try {
      const filePath = (this.metadata as BfNodeOnDiskMetadata).filePath;
      const fileContent = await Deno.readTextFile(filePath);
      const data = JSON.parse(fileContent);

      this._props = data.props;
      this._metadata = data.metadata;

      await this.afterLoad();

      return this;
    } catch (error) {
      logger.error(`Error loading node from disk: ${error.message}`, {
        error,
        id: this.metadata.bfGid,
      });
      throw error;
    }
  }

  override isDirty(): boolean {
    // For disk-based nodes, we consider them dirty if they've been modified
    // since the last save (not implemented here, would require tracking
    // the original props and comparing)
    return true;
  }

  // Lifecycle hooks
  async afterLoad(): Promise<void> {
    // Override this in subclasses if needed
  }

  override async beforeCreate(): Promise<void> {
    await this.ensureDataDirExists();
  }
}
