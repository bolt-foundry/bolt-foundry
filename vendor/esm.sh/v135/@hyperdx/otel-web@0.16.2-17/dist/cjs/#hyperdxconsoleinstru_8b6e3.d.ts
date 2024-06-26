import { InstrumentationBase, InstrumentationConfig } from 'https://esm.sh/v135/@opentelemetry/instrumentation@0.40.0/build/src/index.d.ts';
export declare const _parseConsoleArgs: (args: any[]) => any;
export declare class HyperDXConsoleInstrumentation extends InstrumentationBase {
    private _createSpan;
    private readonly _consoleLogHandler;
    private readonly _consoleInfoHandler;
    private readonly _consoleWarnHandler;
    private readonly _consoleDebugHandler;
    constructor(config?: InstrumentationConfig);
    init(): void;
    enable(): void;
    disable(): void;
}
