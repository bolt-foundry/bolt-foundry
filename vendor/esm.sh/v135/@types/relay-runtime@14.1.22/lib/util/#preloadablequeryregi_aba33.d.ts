import type { ConcreteRequest } from "../util/RelayConcreteNode.d.ts";
import type { Disposable } from "../util/RelayRuntimeTypes.d.ts";

export default class PreloadableQueryRegistry {
    set(key: string, value: ConcreteRequest): void;
    get(key: string): ConcreteRequest | null | undefined;
    onLoad(key: string, callback: (concreteRequest: ConcreteRequest) => void): Disposable;
    clear(): void;
}
