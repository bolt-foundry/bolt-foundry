/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
export { BlazePoseMediaPipeEstimationConfig, BlazePoseMediaPipeModelConfig, BlazePoseModelType } from './blazepose_mediapipe/types.d.ts';
export { BlazePoseTfjsEstimationConfig, BlazePoseTfjsModelConfig } from './blazepose_tfjs/types.d.ts';
export { createDetector } from './create_detector.d.ts';
export { MoveNetEstimationConfig, MoveNetModelConfig } from './movenet/types.d.ts';
export { PoseDetector } from './pose_detector.d.ts';
export { PoseNetEstimationConfig, PosenetModelConfig } from './posenet/types.d.ts';
export * from './types.d.ts';
export { TrackerType } from './calculators/types.d.ts';
import * as util from './util.d.ts';
export { util };
import { keypointsToNormalizedKeypoints } from './shared/calculators/keypoints_to_normalized_keypoints.d.ts';
declare const calculators: {
    keypointsToNormalizedKeypoints: typeof keypointsToNormalizedKeypoints;
};
export { calculators };
declare const movenet: {
    modelType: {
        SINGLEPOSE_LIGHTNING: string;
        SINGLEPOSE_THUNDER: string;
        MULTIPOSE_LIGHTNING: string;
    };
};
export { movenet };
