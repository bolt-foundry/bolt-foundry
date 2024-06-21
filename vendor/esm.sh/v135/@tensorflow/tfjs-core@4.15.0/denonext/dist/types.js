/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/types) denonext production */
var i;(function(o){o.R0="R0",o.R1="R1",o.R2="R2",o.R3="R3",o.R4="R4",o.R5="R5",o.R6="R6"})(i||(i={}));var n;(function(o){o.float32="float32",o.int32="int32",o.bool="int32",o.complex64="complex64"})(n||(n={}));var r;(function(o){o.float32="float32",o.int32="int32",o.bool="bool",o.complex64="complex64"})(r||(r={}));var f;(function(o){o.float32="float32",o.int32="float32",o.bool="float32",o.complex64="complex64"})(f||(f={}));var e;(function(o){o.float32="complex64",o.int32="complex64",o.bool="complex64",o.complex64="complex64"})(e||(e={}));var u={float32:f,int32:n,bool:r,complex64:e};function c(o,t){if(o==="string"||t==="string"){if(o==="string"&&t==="string")return"string";throw new Error(`Can not upcast ${o} with ${t}`)}return u[o][t]}function l(o){return c(o,"int32")}function x(o){return o!=null&&typeof o=="object"&&"texture"in o&&o.texture instanceof WebGLTexture}function b(o){return typeof GPUBuffer<"u"&&o!=null&&typeof o=="object"&&"buffer"in o&&o.buffer instanceof GPUBuffer}export{i as Rank,x as isWebGLData,b as isWebGPUData,l as sumOutType,c as upcastType};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/types.js:
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
//# sourceMappingURL=types.js.map