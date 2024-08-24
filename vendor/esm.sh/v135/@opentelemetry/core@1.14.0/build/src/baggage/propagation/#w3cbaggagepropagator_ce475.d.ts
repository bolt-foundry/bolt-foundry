import { Context, TextMapGetter, TextMapPropagator, TextMapSetter } from 'https://esm.sh/v135/@opentelemetry/api@1.4.1/build/src/index.d.ts';
/**
 * Propagates {@link Baggage} through Context format propagation.
 *
 * Based on the Baggage specification:
 * https://w3c.github.io/baggage/
 */
export declare class W3CBaggagePropagator implements TextMapPropagator {
    inject(context: Context, carrier: unknown, setter: TextMapSetter): void;
    extract(context: Context, carrier: unknown, getter: TextMapGetter): Context;
    fields(): string[];
}
//# sourceMappingURL=W3CBaggagePropagator.d.ts.map
