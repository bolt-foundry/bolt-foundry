/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/backends/complex_util) denonext production */
function l(t,e){if(t.length!==e.length)throw new Error(`Cannot merge real and imag arrays of different lengths. real:${t.length}, imag: ${e.length}.`);let r=new Float32Array(t.length*2);for(let n=0;n<r.length;n+=2)r[n]=t[n/2],r[n+1]=e[n/2];return r}function h(t){let e=new Float32Array(t.length/2),r=new Float32Array(t.length/2);for(let n=0;n<t.length;n+=2)e[n/2]=t[n],r[n/2]=t[n+1];return{real:e,imag:r}}function s(t){let e=Math.ceil(t.length/4),r=new Float32Array(e),n=new Float32Array(e);for(let o=0;o<t.length;o+=4)r[Math.floor(o/4)]=t[o],n[Math.floor(o/4)]=t[o+1];return{real:r,imag:n}}function i(t){let e=Math.floor(t.length/4),r=new Float32Array(e),n=new Float32Array(e);for(let o=2;o<t.length;o+=4)r[Math.floor(o/4)]=t[o],n[Math.floor(o/4)]=t[o+1];return{real:r,imag:n}}function g(t,e){let r=t[e*2],n=t[e*2+1];return{real:r,imag:n}}function f(t,e,r,n){t[n*2]=e,t[n*2+1]=r}function c(t,e){let r=new Float32Array(t/2),n=new Float32Array(t/2);for(let o=0;o<Math.ceil(t/2);o++){let a=(e?2:-2)*Math.PI*(o/t);r[o]=Math.cos(a),n[o]=Math.sin(a)}return{real:r,imag:n}}function u(t,e,r){let n=(r?2:-2)*Math.PI*(t/e),o=Math.cos(n),a=Math.sin(n);return{real:o,imag:a}}export{f as assignToTypedArray,s as complexWithEvenIndex,i as complexWithOddIndex,u as exponent,c as exponents,g as getComplexWithIndex,l as mergeRealAndImagArrays,h as splitRealAndImagArrays};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/backends/complex_util.js:
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
//# sourceMappingURL=complex_util.js.map