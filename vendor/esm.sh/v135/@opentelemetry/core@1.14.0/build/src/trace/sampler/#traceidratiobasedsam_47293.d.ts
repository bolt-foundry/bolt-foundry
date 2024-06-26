import { Sampler, SamplingResult } from 'https://esm.sh/v135/@opentelemetry/api@1.4.1/build/src/index.d.ts';
/**
 * @deprecated Use the one defined in @opentelemetry/sdk-trace-base instead.
 * Sampler that samples a given fraction of traces based of trace id deterministically.
 */
export declare class TraceIdRatioBasedSampler implements Sampler {
    private readonly _ratio;
    private _upperBound;
    constructor(_ratio?: number);
    shouldSample(context: unknown, traceId: string): SamplingResult;
    toString(): string;
    private _normalize;
    private _accumulate;
}
//# sourceMappingURL=TraceIdRatioBasedSampler.d.ts.map
