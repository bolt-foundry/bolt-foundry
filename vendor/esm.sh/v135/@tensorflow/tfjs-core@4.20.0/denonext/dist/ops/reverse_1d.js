/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/reverse_1d) denonext production */
import{convertToTensor as t}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import*as e from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{op as n}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{reverse as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/reverse.js";function m(o){let r=t(o,"x","reverse");return e.assert(r.rank===1,()=>`Error in reverse1D: x must be rank 1 but got rank ${r.rank}.`),s(r,0)}var u=n({reverse1d_:m});export{u as reverse1d};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/reverse_1d.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=reverse_1d.js.map