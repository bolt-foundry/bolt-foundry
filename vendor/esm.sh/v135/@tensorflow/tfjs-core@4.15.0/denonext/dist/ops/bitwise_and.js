/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/bitwise_and) denonext production */
import{ENGINE as s}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{BitwiseAnd as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as n}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{arraysEqual as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util_base.js";import{op as d}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function m(o,r){let t=n(o,"x","bitwiseAnd"),e=n(r,"y","bitwiseAnd");if(!a(t.shape,e.shape))throw new Error(`BitwiseAnd: Tensors must have the same shape. x: ${t.shape}, y: ${e.shape}`);if(t.dtype!=="int32"||e.dtype!=="int32")throw new Error(`BitwiseAnd: Only supports 'int32' values in tensor, found type of x: ${t.dtype} and type of y: ${e.dtype}`);let i={a:t,b:e};return s.runKernel(p,i)}var A=d({bitwiseAnd_:m});export{A as bitwiseAnd};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/bitwise_and.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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
//# sourceMappingURL=bitwise_and.js.map