/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/sparse_to_dense) denonext production */
import{ENGINE as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{SparseToDense as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import*as t from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/sparse_to_dense_util.js";import{convertToTensor as r}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{assertNonNegativeIntegerDimensions as d}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util_base.js";import{op as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function T(a,p,s,i=0){d(s);let n=r(a,"sparseIndices","sparseToDense","int32"),e=r(p,"sparseValues","sparseToDense","string_or_numeric"),o=r(i,"defaultValue","sparseToDense",e.dtype);t.validateInput(n,e,s,o);let m={sparseIndices:n,sparseValues:e,defaultValue:o},c={outputShape:s};return l.runKernel(u,m,c)}var g=f({sparseToDense_:T});export{g as sparseToDense};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/sparse_to_dense.js:
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
//# sourceMappingURL=sparse_to_dense.js.map