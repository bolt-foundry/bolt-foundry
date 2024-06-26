import { Resource } from '../../Resource.d.ts';
import { DetectorSync } from '../../types.d.ts';
import { ResourceDetectionConfig } from '../../config.d.ts';
/**
 * OSDetectorSync detects the resources related to the operating system (OS) on
 * which the process represented by this resource is running.
 */
declare class OSDetectorSync implements DetectorSync {
    detect(_config?: ResourceDetectionConfig): Resource;
}
export declare const osDetectorSync: OSDetectorSync;
export {};
//# sourceMappingURL=OSDetectorSync.d.ts.map
