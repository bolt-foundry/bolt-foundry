/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/strided_slice) denonext production */
import{ENGINE as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{StridedSlice as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{op as x}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function S(r,t,o,i,e=0,n=0,c=0,s=0,m=0){let d={x:u(r,"x","stridedSlice","string_or_numeric")},p={begin:t,end:o,strides:i,beginMask:e,endMask:n,ellipsisMask:c,newAxisMask:s,shrinkAxisMask:m};return f.runKernel(l,d,p)}var a=x({stridedSlice_:S});export{a as stridedSlice};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/strided_slice.js:
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
//# sourceMappingURL=strided_slice.js.map