/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/DepthToSpace) denonext production */
import{DepthToSpace as W}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{DepthToSpaceProgram as b}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/depth_to_space_gpu.js";function H(s){let{inputs:h,backend:r,attrs:u}=s,{x:t}=h,{blockSize:e,dataFormat:o}=u,p=t.shape[0],i=o==="NHWC"?t.shape[1]:t.shape[2],m=o==="NHWC"?t.shape[2]:t.shape[3],d=o==="NHWC"?t.shape[3]:t.shape[1],n=i*e,a=m*e,c=d/(e*e),g=o==="NHWC"?[p,n,a,c]:[p,c,n,a],S=new b(g,e,o);return r.runWebGLProgram(S,[t],t.dtype)}var C={kernelName:W,backendName:"webgl",kernelFunc:H};export{H as depthToSpace,C as depthToSpaceConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/DepthToSpace.js:
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
//# sourceMappingURL=DepthToSpace.js.map