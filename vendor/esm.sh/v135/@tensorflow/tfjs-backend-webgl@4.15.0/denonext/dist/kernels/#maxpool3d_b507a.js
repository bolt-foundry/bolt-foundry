/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/MaxPool3D) denonext production */
import{backend_util as P,MaxPool3D as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{Pool3DProgram as u}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/pool_gpu.js";function x(n){let{inputs:t,backend:e,attrs:a}=n,{x:o}=t,{filterSize:r,strides:m,pad:c,dataFormat:s,dimRoundingMode:i}=a,l=[1,1,1],d=P.computePool3DInfo(o.shape,r,m,l,c,i,s),p=new u(d,"max",!1);return e.runWebGLProgram(p,[o],o.dtype)}var k={kernelName:f,backendName:"webgl",kernelFunc:x};export{k as maxPool3DConfig,x as maxPool3d};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/MaxPool3D.js:
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
//# sourceMappingURL=MaxPool3D.js.map