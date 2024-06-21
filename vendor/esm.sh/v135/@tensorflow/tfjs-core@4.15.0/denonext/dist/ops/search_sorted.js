/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/search_sorted) denonext production */
import{ENGINE as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{SearchSorted as S}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as n}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{sizeFromShape as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util_base.js";import{op as w}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{reshape as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reshape.js";var r=2147483648;function v(i,h,u="left"){let t=n(i,"sortedSequence","searchSorted"),s=n(h,"values","searchSorted"),c=t.shape[t.shape.length-1],p=s.shape[s.shape.length-1],e=a(t,[-1,c]),o=a(s,[-1,p]);if(e.rank<2)throw new Error("Sorted input argument must be at least 2-dimensional");if(e.shape[0]!==o.shape[0])throw new Error("Leading dimension of 'sortedSequence' and 'values' must match.");if(f(o.shape)>=r)throw new Error(`values tensor size must less than ${r}`);if(e.shape[1]>=r)throw new Error(`trailing dim_size must less than ${r} for int32 output type, was ${e.shape[1]}`);let m={sortedSequence:e,values:o},d={side:u};return l.runKernel(S,m,d)}var T=w({searchSorted_:v});export{T as searchSorted};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/search_sorted.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=search_sorted.js.map