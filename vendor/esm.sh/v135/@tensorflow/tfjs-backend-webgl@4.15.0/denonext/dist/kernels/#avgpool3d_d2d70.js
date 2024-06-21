/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/AvgPool3D) denonext production */
import{AvgPool3D as f,backend_util as P}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{Pool3DProgram as p}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/pool_gpu.js";function u(n){let{inputs:t,backend:e,attrs:a}=n,{x:o}=t,{filterSize:r,strides:c,pad:l,dimRoundingMode:s,dataFormat:i}=a,m=[1,1,1],g=P.computePool3DInfo(o.shape,r,c,m,l,s,i),d=new p(g,"avg",!1);return e.runWebGLProgram(d,[o],"float32")}var k={kernelName:f,backendName:"webgl",kernelFunc:u};export{u as avgPool3D,k as avgPool3DConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/AvgPool3D.js:
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
//# sourceMappingURL=AvgPool3D.js.map