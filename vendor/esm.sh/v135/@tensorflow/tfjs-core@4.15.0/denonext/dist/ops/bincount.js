/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/bincount) denonext production */
import{ENGINE as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{Bincount as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as e}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as o from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{op as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function h(s,r,i){let t=e(s,"x","bincount"),n=e(r,"weights","bincount");o.assert(t.dtype==="int32",()=>`Error in bincount: input dtype must be int32, but got ${t.dtype}`),o.assert(i>=0,()=>`size must be non-negative, but got ${i}.`),o.assert(n.size===t.size||n.size===0,()=>`Error in bincount: weights must have the same size as input or0-length, but got input shape: ${t.shape}, weights shape: ${n.shape}.`);let u={x:t,weights:n},p={size:i};return c.runKernel(m,u,p)}var $=a({bincount_:h});export{$ as bincount};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/bincount.js:
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
//# sourceMappingURL=bincount.js.map