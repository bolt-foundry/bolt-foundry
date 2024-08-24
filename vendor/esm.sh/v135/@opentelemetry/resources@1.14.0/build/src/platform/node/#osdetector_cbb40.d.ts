import { Detector } from '../../types.d.ts';
import { ResourceDetectionConfig } from '../../config.d.ts';
import { IResource } from '../../IResource.d.ts';
/**
 * OSDetector detects the resources related to the operating system (OS) on
 * which the process represented by this resource is running.
 */
declare class OSDetector implements Detector {
    detect(_config?: ResourceDetectionConfig): Promise<IResource>;
}
export declare const osDetector: OSDetector;
export {};
//# sourceMappingURL=OSDetector.d.ts.map
