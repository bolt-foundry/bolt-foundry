import { LangChainTracer } from "./tracer_langchain.d.ts";
import { LangChainTracerV1 } from "./tracer_langchain_v1.d.ts";
export declare function getTracingCallbackHandler(session?: string): Promise<LangChainTracerV1>;
export declare function getTracingV2CallbackHandler(): Promise<LangChainTracer>;
