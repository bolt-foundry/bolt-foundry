declare module 'https://esm.sh/v135/loglevel-plugin-prefix@0.8.4/index.d.ts' {
    import { Logger } from 'https://esm.sh/v135/loglevel@1.9.1/index.d.ts';

    interface LoglevelPluginPrefixOptions {
        template?: string;
        levelFormatter?: (level: string) => string;
        nameFormatter?: (name: string | undefined) => string;
        timestampFormatter?: (date: Date) => string;
        format?: (level: string, name: string | undefined, timestamp: Date) => string | undefined;
    }

    function reg(loglevel: Logger): void;
    function apply(logger: Logger, options?: LoglevelPluginPrefixOptions): Logger;
}

// added by esm.sh
declare module "https://esm.sh/v135/loglevel-plugin-prefix@0.8.4" {
  export * from "https://esm.sh/v135/loglevel-plugin-prefix@0.8.4/index.d.ts";
}
declare module "https://esm.sh/v135/loglevel-plugin-prefix@0.8.4?*" {
  export * from "https://esm.sh/v135/loglevel-plugin-prefix@0.8.4/index.d.ts";
}
declare module "https://esm.sh/loglevel-plugin-prefix@0.8.4" {
  export * from "https://esm.sh/v135/loglevel-plugin-prefix@0.8.4/index.d.ts";
}
declare module "https://esm.sh/loglevel-plugin-prefix@0.8.4?*" {
  export * from "https://esm.sh/v135/loglevel-plugin-prefix@0.8.4/index.d.ts";
}
