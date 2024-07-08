/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/tensor_util) denonext production */
import{Tensor as i}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor.js";import{upcastType as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/types.js";import{assert as u}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";function m(t,e){if(t.dtype===e.dtype)return[t,e];let r=f(t.dtype,e.dtype);return[t.cast(r),e.cast(r)]}function T(t,e){u(t.dtype===e.dtype,()=>`The dtypes of the first(${t.dtype}) and second(${e.dtype}) input must match`)}function h(t,e){return e.some(r=>r.id===t.id)}function l(t){let e=[];return o(t,e,new Set),e}function o(t,e,r){if(t==null)return;if(t instanceof i){e.push(t);return}if(!c(t))return;let s=t;for(let p in s){let n=s[p];r.has(n)||(r.add(n),o(n,e,r))}}function c(t){return Array.isArray(t)||typeof t=="object"}export{T as assertTypesMatch,l as getTensorsInContainer,h as isTensorInList,m as makeTypesMatch};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/tensor_util.js:
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
//# sourceMappingURL=tensor_util.js.map