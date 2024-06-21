/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/tensor1d) denonext production */
import{inferShape as n}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{assertNonNull as t}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{makeTensor as s}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/tensor_ops_util.js";function m(r,e){t(r);let o=n(r,e);if(o.length!==1)throw new Error("tensor1d() requires values to be a flat/TypedArray");return s(r,null,o,e)}export{m as tensor1d};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/tensor1d.js:
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
//# sourceMappingURL=tensor1d.js.map