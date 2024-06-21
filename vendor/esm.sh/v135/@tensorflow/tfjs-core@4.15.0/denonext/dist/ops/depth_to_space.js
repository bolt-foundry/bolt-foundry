/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/depth_to_space) denonext production */
import{ENGINE as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{DepthToSpace as d}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as p from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{op as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function $(h,e,s="NHWC"){let t=f(h,"x","depthToSpace","float32"),n=s==="NHWC"?t.shape[1]:t.shape[2],i=s==="NHWC"?t.shape[2]:t.shape[3],o=s==="NHWC"?t.shape[3]:t.shape[1];p.assert(e>1,()=>`blockSize should be > 1 for depthToSpace, but was: ${e}`),p.assert(n*e>=0,()=>`Negative dimension size caused by overflow when multiplying
    ${n} and ${e}  for depthToSpace with input shape
    ${t.shape}`),p.assert(i*e>=0,()=>`Negative dimension size caused by overflow when multiplying
    ${i} and ${e} for depthToSpace with input shape
        ${t.shape}`),p.assert(o%(e*e)===0,()=>`Dimension size must be evenly divisible by ${e*e} but is ${o} for depthToSpace with input shape ${t.shape}`);let a={x:t},r={blockSize:e,dataFormat:s};return u.runKernel(d,a,r)}var l=m({depthToSpace_:$});export{l as depthToSpace};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/depth_to_space.js:
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
//# sourceMappingURL=depth_to_space.js.map