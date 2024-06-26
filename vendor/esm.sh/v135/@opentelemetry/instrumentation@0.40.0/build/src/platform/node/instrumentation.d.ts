import * as types from '../../types.d.ts';
import { wrap, unwrap, massWrap, massUnwrap } from 'https://esm.sh/v135/@types/shimmer@1.0.5/index.d.ts';
import { InstrumentationAbstract } from '../../instrumentation.d.ts';
/**
 * Base abstract class for instrumenting node plugins
 */
export declare abstract class InstrumentationBase<T = any> extends InstrumentationAbstract implements types.Instrumentation {
    private _modules;
    private _hooks;
    private _requireInTheMiddleSingleton;
    private _enabled;
    constructor(instrumentationName: string, instrumentationVersion: string, config?: types.InstrumentationConfig);
    protected _wrap: typeof wrap;
    protected _unwrap: typeof unwrap;
    protected _massWrap: typeof massWrap;
    protected _massUnwrap: typeof massUnwrap;
    private _warnOnPreloadedModules;
    private _extractPackageVersion;
    private _onRequire;
    enable(): void;
    disable(): void;
    isEnabled(): boolean;
}
//# sourceMappingURL=instrumentation.d.ts.map
