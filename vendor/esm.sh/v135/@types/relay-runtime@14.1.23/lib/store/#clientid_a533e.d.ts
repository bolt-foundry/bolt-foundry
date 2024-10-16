import { DataID } from "../util/RelayRuntimeTypes.d.ts";

export function generateClientID(id: DataID, storageKey: string, index?: number): DataID;

export function isClientID(id: DataID): boolean;

export function generateUniqueClientID(): DataID;
