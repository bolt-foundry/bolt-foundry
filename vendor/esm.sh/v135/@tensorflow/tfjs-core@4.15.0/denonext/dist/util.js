/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/util) denonext production */
import{env as e}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/environment.js";import{isTypedArrayBrowser as s}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/platforms/is_typed_array_browser.js";import*as i from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util_base.js";export*from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util_base.js";export*from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/hash_util.js";function A(r,o){return o==="string"?m(r):a([r],o)}function c(r,o){return r instanceof Float32Array&&o==="float32"||r instanceof Int32Array&&o==="int32"||r instanceof Uint8Array&&o==="bool"}function a(r,o){if(o==="string")throw new Error("Cannot convert a string[] to a TypedArray");if(Array.isArray(r)&&(r=l(r)),e().getBool("DEBUG")&&i.checkConversionForErrors(r,o),c(r,o))return r;if(o==null||o==="float32"||o==="complex64")return new Float32Array(r);if(o==="int32")return new Int32Array(r);if(o==="bool"){let n=new Uint8Array(r.length);for(let t=0;t<n.length;++t)Math.round(r[t])!==0&&(n[t]=1);return n}else throw new Error(`Unknown data type ${o}`)}function y(){return e().platform.now()}function h(r,o){return e().platform.fetch(r,o)}function m(r,o="utf-8"){return o=o||"utf-8",e().platform.encode(r,o)}function w(r,o="utf-8"){return o=o||"utf-8",e().platform.decode(r,o)}function u(r){return e().platform.isTypedArray!=null?e().platform.isTypedArray(r):s(r)}function l(r,o=[],n=!1){if(o==null&&(o=[]),typeof r=="boolean"||typeof r=="number"||typeof r=="string"||i.isPromise(r)||r==null||u(r)&&n)o.push(r);else if(Array.isArray(r)||u(r))for(let t=0;t<r.length;++t)l(r[t],o,n);else{let t=-1;for(let f of Object.keys(r))/^([1-9]+[0-9]*|0)$/.test(f)&&(t=Math.max(t,Number(f)));for(let f=0;f<=t;f++)l(r[f],o,n)}return o}export{A as createScalarValue,w as decodeString,m as encodeString,h as fetch,l as flatten,u as isTypedArray,y as now,a as toTypedArray};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/util.js:
  (**
   * @license
   * Copyright 2017 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=util.js.map