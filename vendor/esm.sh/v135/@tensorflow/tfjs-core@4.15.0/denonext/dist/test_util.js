/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/test_util) denonext production */
import{ENGINE as A}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{inferShape as y}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{arraysEqual as E,encodeString as x,flatten as h,isString as l,isTypedArray as s}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";var g=.001,$=.1;function T(r,e,t){return t==null&&(t=d()),c(r,e,(n,o)=>u(n,o,t))}function d(){return A.backend.floatPrecision()===32?g:$}function c(r,e,t){let n=!0;if((s(r)||s(e))&&(n=!1),s(r)&&s(e)&&(n=!0),n){let i=r.constructor.name,f=e.constructor.name;if(i!==f)throw new Error(`Arrays are of different type. Actual: ${i}. Expected: ${f}`)}if(Array.isArray(r)&&Array.isArray(e)){let i=y(r),f=y(e);if(!E(i,f))throw new Error(`Arrays have different shapes. Actual: [${i}]. Expected: [${f}]`)}let o=s(r)?r:h(r),a=s(e)?e:h(e);if(o.length!==a.length)throw new Error(`Arrays have different lengths actual: ${o.length} vs expected: ${a.length}.
Actual:   ${o}.
Expected: ${a}.`);for(let i=0;i<a.length;++i){let f=o[i],p=a[i];if(!t(f,p))throw new Error(`Arrays differ: actual[${i}] = ${f}, expected[${i}] = ${p}.
Actual:   ${o}.
Expected: ${a}.`)}typeof expect<"u"&&expect().nothing()}function N(r,e){r().then(()=>e.fail(),()=>e()),typeof expect<"u"&&expect().nothing()}function S(r,e){let t=typeof e=="string"||typeof e=="number"||typeof e=="boolean"?[e]:e;return l(r)||l(r[0])||l(e)||l(e[0])?c(r,t,(n,o)=>n==o):c(r,e,(n,o)=>u(n,o,0))}function C(r,e,t){if(t==null&&(t=d()),!u(r,e,t))throw new Error(`Numbers differ: actual === ${r}, expected === ${e}`);typeof expect<"u"&&expect().nothing()}function u(r,e,t){return!isFinite(r)&&!isFinite(e)?!0:!(isNaN(r)||isNaN(e)||Math.abs(r-e)>t)}function P(r,e,t){for(let n=0;n<r.length;n++)if(r[n]<e||r[n]>t)throw new Error(`Value out of range:${r[n]} low: ${e}, high: ${t}`)}function v(r,e){let t=new Float32Array(r),n=new Float32Array(e);if(t.length!==n.length)throw new Error(`Expected ArrayBuffer to be of length ${n.length}, but it was ${t.length}`);for(let o=0;o<n.length;o++)if(t[o]!==n[o])throw new Error(`Expected ArrayBuffer value at ${o} to be ${n[o]} but got ${t[o]} instead`)}function w(r){for(let e=0;e<r.length;e++){let t=r[e];Array.isArray(t)?w(t):r[e]=x(t)}return r}function I(r){let e=document.createElement("video");return"playsInline"in e&&(e.playsInline=!0),e.muted=!0,e.loop=!0,e.style.position="fixed",e.style.left="0px",e.style.top="0px",e.preload="auto",e.appendChild(r),new Promise(t=>{e.addEventListener("loadeddata",n=>t(e)),e.load()})}async function q(r){await r.play(),"requestVideoFrameCallback"in r&&await new Promise(e=>{r.requestVideoFrameCallback(e)})}export{$ as TEST_EPSILON_FLOAT16,I as createVideoElement,w as encodeStrings,v as expectArrayBuffersEqual,T as expectArraysClose,S as expectArraysEqual,C as expectNumbersClose,N as expectPromiseToFail,P as expectValuesInRange,q as play,d as testEpsilon};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/test_util.js:
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
//# sourceMappingURL=test_util.js.map