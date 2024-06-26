import { Context, ContextManager } from 'https://esm.sh/v135/@opentelemetry/api@1.4.1/build/src/index.d.ts';
export interface ContextManagerConfig {
    /** Enable async tracking of span parents */
    async?: boolean;
    onBeforeContextStart?: () => void;
    onBeforeContextEnd?: () => void;
}
/**
 * Extends otel-web stack context manager.
 * Due to privates being unaccessible in subclasses (_enabled) need to copy-paste everything
 */
export declare class SplunkContextManager implements ContextManager {
    protected _config: ContextManagerConfig;
    /**
     * whether the context manager is enabled or not
     */
    protected _enabled: boolean;
    /**
     * Keeps the reference to current context
     */
    _currentContext: Context;
    protected _hashChangeContext: Context;
    constructor(_config?: ContextManagerConfig);
    /**
     *
     * @param target Function to be executed within the context
     * @param context
     */
    protected _bindFunction<T extends (...args: unknown[]) => unknown>(target: T, context?: Context): T;
    /**
     * Returns the active context
     */
    active(): Context;
    /**
     * Binds a the certain context or the active one to the target function and then returns the target
     * @param context A context (span) to be bind to target
     * @param target a function or event emitter. When target or one of its callbacks is called,
     *  the provided context will be used as the active context for the duration of the call.
     */
    bind<T>(context: Context, target: T): T;
    /**
     * Disable the context manager (clears the current context)
     */
    disable(): this;
    /**
     * Enables the context manager and creates a default(root) context
     */
    enable(): this;
    /**
     * Bind current zone to function given in arguments
     *
     * @param args Arguments array
     * @param index Argument index to patch
     */
    protected bindActiveToArgument(args: unknown[], index: number): void;
    protected _patchTimeouts(): void;
    protected _unpatchTimeouts(): void;
    protected _patchPromise(): void;
    protected _unpatchPromise(): void;
    protected _patchMutationObserver(): void;
    protected _unpatchMutationObserver(): void;
    /**
     * Event listeners wrapped to resume context from event registration
     *
     * _contextResumingListeners.get(Target).get(EventType).get(origListener)
     */
    protected _contextResumingListeners: WeakMap<EventTarget, Map<string, WeakMap<EventListener, EventListener>>>;
    protected _getListenersMap(target: EventTarget, type: string): WeakMap<EventListener, EventListener>;
    protected _patchEvents(): void;
    protected _unpatchEvents(): void;
    protected _messagePorts: WeakMap<MessagePort, MessagePort>;
    protected _patchMessageChannel(): void;
    protected _getWrappedEventListener<E extends EventListener>(orig: E, contextGetter: () => Context | void): E;
    protected _unpatchMessageChannel(): void;
    /**
     * Calls the callback function [fn] with the provided [context]. If [context] is undefined then it will use the window.
     * The context will be set as active
     * @param context
     * @param fn Callback function
     * @param thisArg optional receiver to be used for calling fn
     * @param args optional arguments forwarded to fn
     */
    with<A extends unknown[], F extends (...args: A) => ReturnType<F>>(context: Context | null, fn: F, thisArg?: ThisParameterType<F>, ...args: A): ReturnType<F>;
}
