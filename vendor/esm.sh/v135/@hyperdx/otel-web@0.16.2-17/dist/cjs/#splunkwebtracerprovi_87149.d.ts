import { WebTracerProvider as BaseWebTracerProvider } from 'https://esm.sh/v135/@opentelemetry/sdk-trace-web@1.14.0/build/src/index.d.ts';
export declare class SplunkWebTracerProvider extends BaseWebTracerProvider {
    shutdown(): Promise<void>;
}
