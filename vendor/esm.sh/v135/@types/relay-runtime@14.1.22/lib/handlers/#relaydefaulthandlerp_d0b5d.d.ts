import { Handler } from "../store/RelayStoreTypes.d.ts";

export type HandlerProvider = (handle: string) => any;

export function RelayDefaultHandlerProvider(handle: string): Handler;
