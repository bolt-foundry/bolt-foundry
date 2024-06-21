/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/OneHot) denonext production */
import{OneHot as g,util as b}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{OneHotProgram as k}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/onehot_gpu.js";import{reshape as a}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";var x=p=>{let{inputs:i,backend:e,attrs:c}=p,{indices:o}=i,{dtype:m,depth:t,onValue:u,offValue:d}=c,n=b.sizeFromShape(o.shape),h=new k(n,t,u,d),s=a({inputs:{x:o},backend:e,attrs:{shape:[n]}}),r=e.runWebGLProgram(h,[s],m);e.disposeIntermediateTensorInfo(s);let f=[...o.shape,t],l=a({inputs:{x:r},backend:e,attrs:{shape:f}});return e.disposeIntermediateTensorInfo(r),l},w={kernelName:g,backendName:"webgl",kernelFunc:x};export{x as oneHot,w as oneHotConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/OneHot.js:
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
//# sourceMappingURL=OneHot.js.map