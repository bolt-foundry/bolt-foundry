import { getLogger } from "packages/logger/logger.ts";
import { type BfGid, toBfGid } from "apps/bfDb/classes/BfNodeIds.ts";
import {
  CurrentViewer,
  type CurrentViewerTypenames,
} from "apps/bfDb/classes/CurrentViewer.ts";
import type {
  BfNodeBase,
  BfNodeBaseProps,
} from "apps/bfDb/classes/BfNodeBase.ts";
import type { BfMetadataNode, BfNode } from "apps/bfDb/coreModels/BfNode.ts";

const logger = getLogger(import.meta);

export type BfGraphqlContext = {
  [Symbol.dispose]: () => void;
  getCvForGraphql(): {
    __typename: CurrentViewerTypenames;
    id: string;
  };
  createTargetNode<
    TProps extends BfNodeBaseProps,
    TBfClass extends typeof BfNode<TProps>,
  >(
    sourceNode: BfNode,
    BfClass: TBfClass,
    props: TProps,
    metadata?: BfMetadataNode,
  ): Promise<InstanceType<TBfClass>>;
  find<
    TProps extends BfNodeBaseProps,
    TClass extends typeof BfNodeBase<TProps>,
  >(
    BfClass: TClass,
    id: BfGid | string | null | undefined,
  ): Promise<InstanceType<TClass> | null>;
  findX<
    TProps extends BfNodeBaseProps,
    TClass extends typeof BfNodeBase<TProps>,
  >(
    BfClass: TClass,
    id: BfGid,
  ): Promise<InstanceType<TClass>>;
  getRequestHeader(name: string): string | null;
  getResponseHeaders(): Headers;
};

export async function createContext(
  request: Request,
): Promise<BfGraphqlContext> {
  logger.debug("Creating new context");
  const cache = new Map<string, Map<BfGid, BfNodeBase>>();
  const responseHeaders = new Headers();
  const currentViewer = CurrentViewer.createFromRequest(
    import.meta,
    request,
    responseHeaders,
  );
  logger.debug("Current viewer created");

  const ctx: BfGraphqlContext = {
    [Symbol.dispose]() {
      logger.debug("Starting context disposal");
      cache.clear();
      logger.debug("Cache cleared");
      // CurrentViewer has no explicit clear, but keep symmetry
      logger.debug("Context disposed successfully");
    },

    getResponseHeaders() {
      return new Headers(responseHeaders);
    },

    getRequestHeader(name: string) {
      return request.headers.get(name);
    },

    getCvForGraphql() {
      return currentViewer.toGraphql();
    },

    async createTargetNode<
      TProps extends BfNodeBaseProps = BfNodeBaseProps,
      TBfClass extends typeof BfNode<TProps> = typeof BfNode<TProps>,
    >(
      sourceNode: BfNode,
      TargetBfClass: TBfClass,
      props: TProps,
      metadata?: BfMetadataNode,
    ) {
      let innerCache = cache.get(TargetBfClass.name);
      if (!innerCache) {
        innerCache = new Map<BfGid, BfNodeBase>();
        cache.set(TargetBfClass.name, innerCache);
      }

      const newItem = await sourceNode.createTargetNode(
        TargetBfClass,
        props,
        metadata,
      );
      return newItem as InstanceType<TBfClass>;
    },

    async find(BfClass, idOrString) {
      if (idOrString == null) {
        return null;
      }
      const id = toBfGid(idOrString);
      const item = await BfClass.find(
        currentViewer,
        id,
        cache.get(BfClass.name),
      );
      return item as InstanceType<typeof BfClass>;
    },

    async findX(BfClass, id) {
      const item = await BfClass.findX(
        currentViewer,
        id,
        cache.get(BfClass.name),
      );
      return item as InstanceType<typeof BfClass>;
    },
  };

  return await Promise.resolve(ctx);
}
