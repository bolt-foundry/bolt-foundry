import { TracerProvider, MeterProvider } from 'https://esm.sh/v135/@opentelemetry/api@1.7.0/build/src/index.d.ts';
import { InstrumentationBase } from './platform/index.d.ts';
import { Instrumentation } from './types.d.ts';
export declare type InstrumentationOption = typeof InstrumentationBase | typeof InstrumentationBase[] | Instrumentation | Instrumentation[];
export interface AutoLoaderResult {
    instrumentations: Instrumentation[];
}
export interface AutoLoaderOptions {
    instrumentations?: InstrumentationOption[];
    tracerProvider?: TracerProvider;
    meterProvider?: MeterProvider;
}
//# sourceMappingURL=types_internal.d.ts.map
