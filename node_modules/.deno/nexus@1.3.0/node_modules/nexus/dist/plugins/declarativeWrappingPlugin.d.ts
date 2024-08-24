export declare type DeclarativeWrappingPluginConfig = {
    /** Whether we should warn, the default when not otherwise specified. */
    shouldWarn?: boolean;
    /** Whether we should completely disable the plugin, not install types, and throw when we encounter any issues. */
    disable?: boolean;
};
export declare const declarativeWrappingPlugin: (config?: DeclarativeWrappingPluginConfig) => import("../plugin").NexusPlugin;
