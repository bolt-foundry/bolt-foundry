/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/string/string_split) denonext production */
import{ENGINE as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{StringSplit as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as e}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{op as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function m(n,o,s=!0){let r=e(n,"input","stringSplit","string"),t=e(o,"delimiter","stringSplit","string");if(r.rank!==1)throw new Error(`Input should be Tensor1D but received shape ${r.shape}`);if(t.rank!==0)throw new Error(`Delimiter should be a scalar but received shape ${t.shape}`);let p={skipEmpty:s},l={input:r,delimiter:t},i=u.runKernel(a,l,p);return{indices:i[0],values:i[1],shape:i[2]}}var S=c({stringSplit_:m});export{S as stringSplit};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/string/string_split.js:
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
//# sourceMappingURL=string_split.js.map