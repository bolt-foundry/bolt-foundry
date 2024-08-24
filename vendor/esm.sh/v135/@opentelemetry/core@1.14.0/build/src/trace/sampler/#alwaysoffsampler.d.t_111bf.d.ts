import { Sampler, SamplingResult } from 'https://esm.sh/v135/@opentelemetry/api@1.4.1/build/src/index.d.ts';
/**
 * @deprecated Use the one defined in @opentelemetry/sdk-trace-base instead.
 * Sampler that samples no traces.
 */
export declare class AlwaysOffSampler implements Sampler {
    shouldSample(): SamplingResult;
    toString(): string;
}
//# sourceMappingURL=AlwaysOffSampler.d.ts.map
