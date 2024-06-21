/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/setdiff1d_async) denonext production */
import{TensorBuffer as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor.js";import{convertToTensor as y}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as n from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";async function h(l,c){let e=y(l,"x","setdiff1d"),s=y(c,"y","setdiff1d");n.assert(e.dtype===s.dtype,()=>`x and y should have the same dtype, but got x (${e.dtype}) and y (${s.dtype}).`),n.assert(e.rank===1,()=>`x should be 1D tensor, but got x (${e.shape}).`),n.assert(s.rank===1,()=>`y should be 1D tensor, but got y (${s.shape}).`);let o=await e.data(),p=await s.data(),d=new Set(p),a=0;for(let t=0;t<o.length;t++)d.has(o[t])||a++;let i=new u([a],e.dtype),f=new u([a],"int32");for(let t=0,r=0;t<o.length;t++)d.has(o[t])||(i.values[r]=o[t],f.values[r]=t,r++);return[i.toTensor(),f.toTensor()]}var b=h;export{b as setdiff1dAsync};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/setdiff1d_async.js:
  (**
   * @license
   * Copyright 2020 Google Inc. All Rights Reserved.
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
//# sourceMappingURL=setdiff1d_async.js.map