/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/where) denonext production */
import{ENGINE as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{Select as $}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as t}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{broadcastTo as r}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/broadcast_to.js";import{assertAndGetBroadcastShape as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/broadcast_util.js";import{op as w}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function u(a,i,d){let e=t(i,"a","where"),n=t(d,"b","where"),s=t(a,"condition","where","bool"),o=c(c(s.shape,e.shape),n.shape),p=r(s,o),m=r(e,o),h=r(n,o),b={condition:p,t:m,e:h};return f.runKernel($,b)}var G=w({where_:u});export{G as where};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/where.js:
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
//# sourceMappingURL=where.js.map