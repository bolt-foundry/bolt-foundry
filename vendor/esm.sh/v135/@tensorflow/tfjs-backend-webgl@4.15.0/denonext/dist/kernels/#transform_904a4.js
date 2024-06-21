/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Transform) denonext production */
import{Transform as k}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{TransformProgram as W}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/transform_gpu.js";function w(e){let{inputs:a,backend:m,attrs:s}=e,{image:t,transforms:i}=a,{interpolation:c,fillMode:l,fillValue:u,outputShape:o}=s,[f,n,r,p]=t.shape,[g,h]=o??[n,r],b=[f,g,h,p],d=new W(n,r,c,l,u,b);return m.runWebGLProgram(d,[t,i],"float32")}var H={kernelName:k,backendName:"webgl",kernelFunc:w};export{w as transform,H as transformConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Transform.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=Transform.js.map