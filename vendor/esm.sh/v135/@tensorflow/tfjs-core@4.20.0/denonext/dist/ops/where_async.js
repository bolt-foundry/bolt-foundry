/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/where_async) denonext production */
import{whereImpl as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/backends/where_impl.js";import{convertToTensor as t}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";async function c(e){let o=t(e,"condition","whereAsync","bool"),n=await o.data(),r=s(o.shape,n);return e!==o&&o.dispose(),r}var p=c;export{p as whereAsync};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/where_async.js:
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
//# sourceMappingURL=where_async.js.map