import { Resource } from '../../Resource.d.ts';
import { DetectorSync } from '../../types.d.ts';
import { ResourceDetectionConfig } from '../../config.d.ts';
/**
 * HostDetectorSync detects the resources related to the host current process is
 * running on. Currently only non-cloud-based attributes are included.
 */
declare class HostDetectorSync implements DetectorSync {
    detect(_config?: ResourceDetectionConfig): Resource;
    private _getAsyncAttributes;
}
export declare const hostDetectorSync: HostDetectorSync;
export {};
//# sourceMappingURL=HostDetectorSync.d.ts.map
