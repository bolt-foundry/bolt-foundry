/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/tensor4d) denonext production */
import{inferShape as t}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{assertNonNull as i}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{makeTensor as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/tensor_ops_util.js";function u(o,r,n){if(i(o),r!=null&&r.length!==4)throw new Error("tensor4d() requires shape to have four numbers");let e=t(o,n);if(e.length!==4&&e.length!==1)throw new Error("tensor4d() requires values to be number[][][][] or flat/TypedArray");if(e.length===1&&r==null)throw new Error("tensor4d() requires shape to be provided when `values` are a flat array");return f(o,r,e,n)}export{u as tensor4d};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/tensor4d.js:
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
//# sourceMappingURL=tensor4d.js.map