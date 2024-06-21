/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/sparse/sparse_reshape_util) denonext production */
import{sizeFromShape as s}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";function p(e,t){return`only one output dimension may be -1, not both ${e} and ${t}`}function o(e,t){return`size ${e} must be non-negative, not ${t}`}function i(){return"reshape cannot infer the missing input size for an empty tensor unless all specified input sizes are non-zero"}function a(e,t){let r=s(e),n=s(t);return`Input to reshape is a SparseTensor with ${r}
  dense values, but the requested shape requires a multiple of ${n}. inputShape=${e} outputShape= ${t}`}function h(e,t){let r=s(e),n=s(t);return`Input to reshape is a tensor with ${r} dense values, but the requested shape has ${n}. inputShape=${e} outputShape=${t}`}export{i as getSparseReshapeEmptyTensorZeroOutputDimErrorMessage,h as getSparseReshapeInputOutputMismatchErrorMessage,a as getSparseReshapeInputOutputMultipleErrorMessage,p as getSparseReshapeMultipleNegativeOneOutputDimErrorMessage,o as getSparseReshapeNegativeOutputDimErrorMessage};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/sparse/sparse_reshape_util.js:
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
//# sourceMappingURL=sparse_reshape_util.js.map