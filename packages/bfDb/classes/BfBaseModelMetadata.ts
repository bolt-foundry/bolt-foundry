import {
  BfGid,
  BfOid,
  BfPid,
  BfSortValue,
  BfTid,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";

export type CreationMetadata<SortValueClass extends string = string> = {
  bfGid?: BfGid;
  bfOid?: BfOid; // optional because items can be self owned.
  bfPid?: BfPid;
  sortValue?: BfSortValue<SortValueClass>;
};

export type BfBaseModelMetadata<TCreationMetadata = CreationMetadata> =
  & TCreationMetadata
  & {
    lastUpdated: Date;
    createdAt: Date;
    createdBy: BfGid;
    className: string;
    bfOid: BfOid; // not optional because self owned items will now have a defined bfOid, even if it's the same as bfGid
    bfGid: BfGid; // not optional because all items will have a defined bfGid
    bfTid?: BfTid;
  };

// this is actually a valid usecase for any
// deno-lint-ignore no-explicit-any
export type Constructor<T> = new (...args: any[]) => T;
