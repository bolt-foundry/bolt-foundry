/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/image/transform) denonext production */
import{ENGINE as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{Transform as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import*as n from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{op as g}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function h(a,m,e="nearest",f="constant",i=0,t){let o=s(a,"image","transform","float32"),r=s(m,"transforms","transform","float32");n.assert(o.rank===4,()=>`Error in transform: image must be rank 4,but got rank ${o.rank}.`),n.assert(r.rank===2&&(r.shape[0]===o.shape[0]||r.shape[0]===1)&&r.shape[1]===8,()=>"Error in transform: Input transform should be batch x 8 or 1 x 8"),n.assert(t==null||t.length===2,()=>`Error in transform: outputShape must be [height, width] or null, but got ${t}.`);let l={image:o,transforms:r},u={interpolation:e,fillMode:f,fillValue:i,outputShape:t};return c.runKernel(p,l,u)}var x=g({transform_:h});export{x as transform};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/image/transform.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)
*/
//# sourceMappingURL=transform.js.map