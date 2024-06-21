/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/gather) denonext production */
import{ENGINE as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{GatherV2 as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as t}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{op as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function h(r,o,n=0,e=0){let i=t(r,"x","gather"),s=t(o,"indices","gather","int32"),c={x:i,indices:s},m={axis:n,batchDims:e};return p.runKernel(a,c,m)}var E=f({gather_:h});export{E as gather};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/gather.js:
  (**
   * @license
   * Copyright 2018 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=gather.js.map