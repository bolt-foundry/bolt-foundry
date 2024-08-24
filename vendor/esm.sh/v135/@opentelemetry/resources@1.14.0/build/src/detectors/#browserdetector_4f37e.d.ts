import { Detector, IResource, ResourceDetectionConfig } from '../index.d.ts';
/**
 * BrowserDetector will be used to detect the resources related to browser.
 */
declare class BrowserDetector implements Detector {
    detect(config?: ResourceDetectionConfig): Promise<IResource>;
}
export declare const browserDetector: BrowserDetector;
export {};
//# sourceMappingURL=BrowserDetector.d.ts.map
