export declare function assert(truthyValue: any, message: string): void;
export declare function removeTrailingSlash(url: string): string;
export interface RetriableOptions {
    retryCount: number;
    retryDelay: number;
    retryCheck: (err: any) => boolean;
}
export declare function retriable<T>(fn: () => Promise<T>, props: RetriableOptions): Promise<T>;
export declare function currentTimestamp(): number;
export declare function currentISOTime(): string;
export declare function safeSetTimeout(fn: () => void, timeout: number): any;
export declare const isPromise: (obj: any) => obj is Promise<any>;
