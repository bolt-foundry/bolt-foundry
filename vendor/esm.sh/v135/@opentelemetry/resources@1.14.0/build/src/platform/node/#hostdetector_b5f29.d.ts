import { Detector } from '../../types.d.ts';
import { ResourceDetectionConfig } from '../../config.d.ts';
import { IResource } from '../../IResource.d.ts';
/**
 * HostDetector detects the resources related to the host current process is
 * running on. Currently only non-cloud-based attributes are included.
 */
declare class HostDetector implements Detector {
    detect(_config?: ResourceDetectionConfig): Promise<IResource>;
}
export declare const hostDetector: HostDetector;
export {};
//# sourceMappingURL=HostDetector.d.ts.map
