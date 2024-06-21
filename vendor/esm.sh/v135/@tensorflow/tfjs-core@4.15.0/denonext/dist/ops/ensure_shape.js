/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/ensure_shape) denonext production */
import{convertToTensor as t}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{arraysEqualWithNull as n}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util_base.js";import{op as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function s(e,r){let o=t(e,"x","ensureShape","string_or_numeric");if(!n(o.shape,r))throw new Error(`EnsureShape: Shape of tensor ${o.shape} is not compatible with expected shape ${r}`);return e}var u=p({ensureShape_:s});export{u as ensureShape};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/ensure_shape.js:
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
//# sourceMappingURL=ensure_shape.js.map