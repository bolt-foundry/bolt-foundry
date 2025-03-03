import {
  type BfMetadataBase,
  BfNodeBase,
  type BfNodeBaseProps,
} from "packages/bfDb/classes/BfNodeBase.ts";
import { getLogger } from "packages/logger.ts";

const _logger = getLogger(import.meta);

/**
 * BfNodeOnDisk - A node implementation that persists data to disk
 */
export class BfNodeOnDisk<
  TProps extends BfNodeBaseProps = BfNodeBaseProps,
  TMetadata extends BfMetadataBase = BfMetadataBase,
> extends BfNodeBase<TProps, TMetadata> {
  // Implementation will be added as we make the tests pass
}
