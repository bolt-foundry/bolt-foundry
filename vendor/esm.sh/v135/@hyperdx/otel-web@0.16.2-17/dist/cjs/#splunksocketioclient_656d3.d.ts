import { InstrumentationBase, InstrumentationConfig } from 'https://esm.sh/v135/@opentelemetry/instrumentation@0.40.0/build/src/index.d.ts';
interface SocketIOSocket {
    (...args: unknown[]): unknown;
    prototype: {
        emit(ev: string, ...args: unknown[]): ThisParameterType<SocketIOSocket>;
        on(ev: string, listener: (...args: unknown[]) => void): ThisParameterType<SocketIOSocket>;
        addEventListener(ev: string, listener: (...args: unknown[]) => void): ThisParameterType<SocketIOSocket>;
        off(ev?: string, listener?: (...args: unknown[]) => void): ThisParameterType<SocketIOSocket>;
        removeListener(ev?: string, listener?: (...args: unknown[]) => void): ThisParameterType<SocketIOSocket>;
        removeAllListeners(ev?: string): ThisParameterType<SocketIOSocket>;
        removeEventListener(ev?: string, listener?: (...args: unknown[]) => void): ThisParameterType<SocketIOSocket>;
    };
}
interface SocketIOClient {
    (...args: unknown[]): unknown;
    Manager: Function;
    Socket: SocketIOSocket;
}
export interface SocketIoClientInstrumentationConfig extends InstrumentationConfig {
    /**
     * Target object or the key it will be set on on window.
     *
     * Not explicitly typed to avoid dependency on socket-io client
     */
    target?: string | SocketIOClient;
}
export declare class SplunkSocketIoClientInstrumentation extends InstrumentationBase {
    protected listeners: WeakMap<(...args: unknown[]) => void, (...args: unknown[]) => void>;
    constructor(config?: SocketIoClientInstrumentationConfig);
    _onDisable?: () => void;
    protected init(): void;
    getConfig(): SocketIoClientInstrumentationConfig;
    protected patchSocketIo(io: unknown | SocketIOClient): void;
    enable(): void;
    disable(): void;
}
export {};
