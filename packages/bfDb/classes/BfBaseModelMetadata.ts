import {
  BfCid,
  BfGid,
  BfOid,
  BfSid,
  BfTid,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";

export type CreationMetadata = {
  bfOid: BfOid; // bfOids also don't have to come from our system, but it would be kind of weird.
  bfGid?: BfGid; // bfGids don't have to come from our system, they can be significant from other systems.
};

export type BfBaseModelMetadata<TCreationMetadata = CreationMetadata> =
  & {
    lastUpdated: Date;
    createdAt: Date;
    className: string;
    bfOid: BfOid; 
    bfCid: BfCid; // gets defined from current viewer.
    bfGid: BfGid; // no longer optional because all items will have a defined bfGid
    bfSClassName?: string;
    bfSid?: BfSid;
    bfTClassName?: string;
    bfTid?: BfTid;
  }
  & TCreationMetadata

// this is actually a valid usecase for any
// deno-lint-ignore no-explicit-any
export type Constructor<T> = new (...args: any[]) => T;
