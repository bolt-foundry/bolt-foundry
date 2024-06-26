import { Detector } from '../../types.d.ts';
import { ResourceDetectionConfig } from '../../config.d.ts';
import { IResource } from '../../IResource.d.ts';
/**
 * ProcessDetector will be used to detect the resources related current process running
 * and being instrumented from the NodeJS Process module.
 */
declare class ProcessDetector implements Detector {
    detect(config?: ResourceDetectionConfig): Promise<IResource>;
}
export declare const processDetector: ProcessDetector;
export {};
//# sourceMappingURL=ProcessDetector.d.ts.map
