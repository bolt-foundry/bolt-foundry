/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/dilation2d) denonext production */
import{ENGINE as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{Dilation2D as $}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import*as o from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{op as E}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{reshape as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/reshape.js";function b(l,u,d,f,m=[1,1],n="NHWC"){let r=s(l,"x","dilation2d"),t=s(u,"filter","dilation2d");o.assert(r.rank===3||r.rank===4,()=>`Error in dilation2d: input must be rank 3 or 4, but got rank ${r.rank}.`),o.assert(t.rank===3,()=>`Error in dilation2d: filter must be rank 3, but got rank ${t.rank}.`),o.assert(n==="NHWC",()=>`Error in dilation2d: Only NHWC is currently supported, but got dataFormat of ${n}`);let e=r,a=!1;r.rank===3&&(e=p(r,[1,r.shape[0],r.shape[1],r.shape[2]]),a=!0),o.assert(e.shape[3]===t.shape[2],()=>`Error in dilation2d:  input and filter must have the same depth: ${e.shape[3]} vs ${t.shape[2]}`);let h={x:e,filter:t},k={strides:d,pad:f,dilations:m},i=c.runKernel($,h,k);return a?p(i,[i.shape[1],i.shape[2],i.shape[3]]):i}var C=E({dilation2d_:b});export{C as dilation2d};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/dilation2d.js:
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
//# sourceMappingURL=dilation2d.js.map