import {
  BfCid,
  BfGid,
  BfOid,
  BfPid,
  BfSortValue,
  BfTid,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";

export type CreationMetadata<SortValueClass extends string = string> = {
  bfGid?: BfGid; // bfGids don't have to come from our system, they can be significant from other systems.
  bfOid?: BfOid; // optional because items can be self owned.
  bfPid?: BfPid;
  bfTid?: BfTid;
  sortValue?: BfSortValue<SortValueClass>;
};

export type BfBaseModelMetadata<TCreationMetadata = CreationMetadata> =
  & TCreationMetadata
  & {
    lastUpdated: Date;
    createdAt: Date;
    className: string;
    bfOid: BfOid; // not optional because self owned items will now have a defined bfOid, even if it's the same as bfGid
    bfCid: BfCid;
    bfGid: BfGid; // not optional because all items will have a defined bfGid
    bfTid?: BfTid;
  };

// this is actually a valid usecase for any
// deno-lint-ignore no-explicit-any
export type Constructor<T> = new (...args: any[]) => T;
