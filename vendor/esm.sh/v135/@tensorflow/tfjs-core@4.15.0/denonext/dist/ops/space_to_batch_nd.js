/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/space_to_batch_nd) denonext production */
import{ENGINE as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{SpaceToBatchND as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as s from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{op as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function $(u,t,r){let e=c(u,"x","spaceToBatchND");s.assert(e.rank>=1+t.length,()=>`input rank ${e.rank} should be > than [blockShape] ${t.length}`),s.assert(r.length===t.length,()=>`paddings.shape[0] ${r.length} must be equal to [blockShape] ${t.length}`),s.assert(e.shape.reduce((o,h,n)=>n>0&&n<=t.length?o&&(h+r[n-1][0]+r[n-1][1])%t[n-1]===0:o,!0),()=>`input spatial dimensions ${e.shape.slice(1)} with paddings ${r.toString()} must be divisible by blockShapes ${t.toString()}`);let i={x:e},a={blockShape:t,paddings:r};return l.runKernel(m,i,a)}var x=p({spaceToBatchND_:$});export{x as spaceToBatchND};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/space_to_batch_nd.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=space_to_batch_nd.js.map