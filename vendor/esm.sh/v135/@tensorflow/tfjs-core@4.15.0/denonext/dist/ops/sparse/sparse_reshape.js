/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/sparse/sparse_reshape) denonext production */
import{ENGINE as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{SparseReshape as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as r}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{op as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function d(t,o,a){let e=r(t,"inputIndices","sparseReshape","int32"),s=r(o,"inputShape","sparseReshape","int32"),p=r(a,"newShape","sparseReshape","int32");if(e.rank!==2)throw new Error(`Input indices should be Tensor2D but received shape
        ${e.shape}`);if(s.rank!==1)throw new Error(`Input shape should be Tensor1D but received shape ${s.shape}`);if(p.rank!==1)throw new Error(`New shape should be Tensor1D but received shape ${p.shape}`);let h={inputIndices:e,inputShape:s,newShape:p},n=i.runKernel(u,h);return{outputIndices:n[0],outputShape:n[1]}}var I=c({sparseReshape_:d});export{I as sparseReshape};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/sparse/sparse_reshape.js:
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
//# sourceMappingURL=sparse_reshape.js.map