import { Attributes } from 'https://esm.sh/v135/@opentelemetry/api@1.7.0/build/src/index.d.ts';
import type { RumOtelWebConfig } from 'https://esm.sh/v135/@hyperdx/otel-web@0.16.2-17/dist/cjs/index.d.ts';
type Instrumentations = RumOtelWebConfig['instrumentations'];
type BrowserSDKConfig = {
    advancedNetworkCapture?: boolean;
    apiKey: string;
    blockClass?: string;
    captureConsole?: boolean;
    consoleCapture?: boolean;
    debug?: boolean;
    disableIntercom?: boolean;
    disableReplay?: boolean;
    ignoreClass?: string;
    instrumentations?: Instrumentations;
    maskAllInputs?: boolean;
    maskAllText?: boolean;
    maskClass?: string;
    service: string;
    tracePropagationTargets?: (string | RegExp)[];
    url?: string;
};
declare class Browser {
    private _advancedNetworkCapture;
    init({ advancedNetworkCapture, apiKey, blockClass, captureConsole, // deprecated
    consoleCapture, debug, disableIntercom, disableReplay, ignoreClass, instrumentations, maskAllInputs, maskAllText, maskClass, service, tracePropagationTargets, url, }: BrowserSDKConfig): void;
    addAction(name: string, attributes?: Attributes): void;
    enableAdvancedNetworkCapture(): void;
    disableAdvancedNetworkCapture(): void;
    setGlobalAttributes(attributes: Record<'userId' | 'userEmail' | 'userName' | 'teamName' | 'teamId' | string, string>): void;
    getSessionUrl(): string | undefined;
}
declare const _default: Browser;
export default _default;
