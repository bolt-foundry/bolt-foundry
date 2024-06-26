import { Context, Link, Sampler, SamplingResult, SpanAttributes, SpanKind } from 'https://esm.sh/v135/@opentelemetry/api@1.4.1/build/src/index.d.ts';
export interface SessionBasedSamplerConfig {
    /**
     * Ratio of sessions that get sampled (0.0 - 1.0, where 1 is all sessions)
     */
    ratio?: number;
    /**
     * Sampler called when session is being sampled
     * default: AlwaysOnSampler
     */
    sampled?: Sampler;
    /**
     * Sampler called when session isn't being sampled
     * default: AlwaysOffSampler
     */
    notSampled?: Sampler;
}
export declare class SessionBasedSampler implements Sampler {
    protected _ratio: number;
    protected _upperBound: number;
    protected _sampled: Sampler;
    protected _notSampled: Sampler;
    protected _currentSession: string;
    protected _currentSessionSampled: boolean;
    constructor({ ratio, sampled, notSampled, }?: SessionBasedSamplerConfig);
    shouldSample(context: Context, traceId: string, spanName: string, spanKind: SpanKind, attributes: SpanAttributes, links: Link[]): SamplingResult;
    toString(): string;
    private _normalize;
    private _accumulate;
}
