/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/tensor_util_env) denonext production */
import{ENGINE as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{env as A}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/environment.js";import{getGlobalTensorClass as b}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor.js";import{isWebGLData as g,isWebGPUData as $}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/types.js";import{assert as u,flatten as E,inferDtype as c,isTypedArray as s,toTypedArray as T}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{bytesPerElement as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util_base.js";function w(r,n){let t=r;if(s(r))return n==="string"?[]:[r.length];if(g(r)){let e=r.channels||"RGBA";return[r.height,r.width*e.length]}else if($(r))return[r.buffer.size/(n==null?4:p(n))];if(!Array.isArray(r))return[];let o=[];for(;Array.isArray(t)||s(t)&&n!=="string";)o.push(t.length),t=t[0];return Array.isArray(r)&&A().getBool("TENSORLIKE_CHECK_SHAPE_CONSISTENCY")&&l(r,o,[]),o}function l(r,n,t){if(t=t||[],!Array.isArray(r)&&!s(r)){u(n.length===0,()=>`Element arr[${t.join("][")}] is a primitive, but should be an array/TypedArray of ${n[0]} elements`);return}u(n.length>0,()=>`Element arr[${t.join("][")}] should be a primitive, but is an array of ${r.length} elements`),u(r.length===n[0],()=>`Element arr[${t.join("][")}] should have ${n[0]} elements, but has ${r.length} elements`);let o=n.slice(1);for(let e=0;e<r.length;++e)l(r[e],o,t.concat(e))}function m(r,n,t,o){if(r!=="string_or_numeric"){if(r==null)throw new Error("Expected dtype cannot be null.");if(r!=="numeric"&&r!==n||r==="numeric"&&n==="string")throw new Error(`Argument '${t}' passed to '${o}' must be ${r} tensor, but got ${n} tensor`)}}function S(r,n,t,o="numeric"){if(r instanceof b())return m(o,r.dtype,n,t),r;let e=c(r);if(e!=="string"&&["bool","int32","float32"].indexOf(o)>=0&&(e=o),m(o,e,n,t),r==null||!s(r)&&!Array.isArray(r)&&typeof r!="number"&&typeof r!="boolean"&&typeof r!="string"){let y=r==null?"null":r.constructor.name;throw new Error(`Argument '${n}' passed to '${t}' must be a Tensor or TensorLike, but got '${y}'`)}let i=w(r,e);!s(r)&&!Array.isArray(r)&&(r=[r]);let h=e!=="string"?T(r,e):E(r,[],!0);return a.makeTensor(h,i,e)}function j(r,n,t,o="numeric"){if(!Array.isArray(r))throw new Error(`Argument ${n} passed to ${t} must be a \`Tensor[]\` or \`TensorLike[]\``);return r.map((i,f)=>S(i,`${n}[${f}]`,t,o))}export{S as convertToTensor,j as convertToTensorArray,w as inferShape};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/tensor_util_env.js:
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
//# sourceMappingURL=tensor_util_env.js.map