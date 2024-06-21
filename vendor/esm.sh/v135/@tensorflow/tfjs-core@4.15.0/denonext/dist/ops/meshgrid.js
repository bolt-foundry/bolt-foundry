/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/meshgrid) denonext production */
import{matMul as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/mat_mul.js";import{ones as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/ones.js";import{reshape as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reshape.js";import{Tensor as d}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor.js";import{convertToTensor as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{sizeFromShape as h}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util_base.js";function $(t,o,{indexing:m="xy"}={}){if(m!=="xy"&&m!=="ij")throw new TypeError(`${m} is not a valid third argument to meshgrid`);if(t===void 0)return[];let r=a(t,"x","meshgrid",t instanceof d?t.dtype:"float32");if(o===void 0)return[r];let e=a(o,"y","meshgrid",o instanceof d?o.dtype:"float32"),n=h(r.shape),s=h(e.shape);return m==="xy"?(r=f(r,[1,-1]),e=f(e,[-1,1]),[i(p([s,1],r.dtype),r),i(e,p([1,n],e.dtype))]):(r=f(r,[-1,1]),e=f(e,[1,-1]),[i(r,p([1,s],r.dtype)),i(p([n,1],e.dtype),e)])}export{$ as meshgrid};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/meshgrid.js:
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
//# sourceMappingURL=meshgrid.js.map