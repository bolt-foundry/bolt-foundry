/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/reverse_4d) denonext production */
import{convertToTensor as n}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as e from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{op as s}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{reverse as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reverse.js";function i(o,t){let r=n(o,"x","reverse");return e.assert(r.rank===4,()=>`Error in reverse4D: x must be rank 4 but got rank ${r.rank}.`),m(r,t)}var v=s({reverse4d_:i});export{v as reverse4d};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/reverse_4d.js:
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
//# sourceMappingURL=reverse_4d.js.map