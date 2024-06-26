import { Sampler, SamplingResult } from 'https://esm.sh/v135/@opentelemetry/api@1.4.1/build/src/index.d.ts';
/**
 * @deprecated Use the one defined in @opentelemetry/sdk-trace-base instead.
 * Sampler that samples all traces.
 */
export declare class AlwaysOnSampler implements Sampler {
    shouldSample(): SamplingResult;
    toString(): string;
}
//# sourceMappingURL=AlwaysOnSampler.d.ts.map
