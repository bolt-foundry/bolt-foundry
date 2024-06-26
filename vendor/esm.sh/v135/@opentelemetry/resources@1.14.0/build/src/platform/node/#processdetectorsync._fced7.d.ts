import { DetectorSync } from '../../types.d.ts';
import { ResourceDetectionConfig } from '../../config.d.ts';
import { IResource } from '../../IResource.d.ts';
/**
 * ProcessDetectorSync will be used to detect the resources related current process running
 * and being instrumented from the NodeJS Process module.
 */
declare class ProcessDetectorSync implements DetectorSync {
    detect(_config?: ResourceDetectionConfig): IResource;
}
export declare const processDetectorSync: ProcessDetectorSync;
export {};
//# sourceMappingURL=ProcessDetectorSync.d.ts.map
