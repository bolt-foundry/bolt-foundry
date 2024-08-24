import { ResourceDetectionConfig } from './config.d.ts';
import { SpanAttributes } from 'https://esm.sh/v135/@opentelemetry/api@1.4.1/build/src/index.d.ts';
import { IResource } from './IResource.d.ts';
/**
 * Interface for Resource attributes.
 * General `Attributes` interface is added in api v1.1.0.
 * To backward support older api (1.0.x), the deprecated `SpanAttributes` is used here.
 */
export declare type ResourceAttributes = SpanAttributes;
/**
 * @deprecated please use {@link DetectorSync}
 */
export interface Detector {
    detect(config?: ResourceDetectionConfig): Promise<IResource>;
}
/**
 * Interface for a synchronous Resource Detector. In order to detect attributes asynchronously, a detector
 * can pass a Promise as the second parameter to the Resource constructor.
 */
export interface DetectorSync {
    detect(config?: ResourceDetectionConfig): IResource;
}
//# sourceMappingURL=types.d.ts.map
