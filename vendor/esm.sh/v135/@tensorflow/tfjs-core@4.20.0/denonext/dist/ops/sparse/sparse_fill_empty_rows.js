/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/sparse/sparse_fill_empty_rows) denonext production */
import{ENGINE as d}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{SparseFillEmptyRows as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as r}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{op as h}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function m(n,p,l,i){let o=r(n,"indices","sparseFillEmptyRows","int32"),e=r(p,"values","sparseFillEmptyRows"),t=r(l,"denseShape","sparseFillEmptyRows","int32"),a=r(i,"defaultValue","sparseFillEmptyRows",e.dtype);if(o.rank!==2)throw new Error(`Indices should be Tensor2D but received shape
        ${o.shape}`);if(e.rank!==1)throw new Error(`Values should be Tensor1D but received shape ${e.shape}`);if(t.rank!==1)throw new Error(`Dense shape should be Tensor1D but received shape ${t.shape}`);if(a.rank!==0)throw new Error(`Default value should be a scalar but received shape ${a.shape}`);let u={indices:o,values:e,denseShape:t,defaultValue:a},s=d.runKernel(c,u);return{outputIndices:s[0],outputValues:s[1],emptyRowIndicator:s[2],reverseIndexMap:s[3]}}var y=h({sparseFillEmptyRows_:m});export{y as sparseFillEmptyRows};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/sparse/sparse_fill_empty_rows.js:
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
//# sourceMappingURL=sparse_fill_empty_rows.js.map