/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/MaxPool) denonext production */
import{backend_util as n,MaxPool as f,util as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{Pool2DProgram as x}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/pool_gpu.js";import{assertNotComplex as P}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/webgl_util.js";import{identity as g}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Identity.js";function h(s){let{inputs:l,backend:i,attrs:m}=s,{x:o}=l;P(o,"maxPool");let{filterSize:d,strides:r,pad:p,dimRoundingMode:c}=m,e=1;a.assert(n.eitherStridesOrDilationsAreOne(r,e),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${r} and dilations '${e}'`);let t=n.computePool2DInfo(o.shape,d,r,e,p,c);if(t.filterWidth===1&&t.filterHeight===1&&a.arraysEqual(t.inShape,t.outShape))return g({inputs:{x:o},backend:i});let u=new x(t,"max",!1);return i.runWebGLProgram(u,[o],o.dtype)}var D={kernelName:f,backendName:"webgl",kernelFunc:h};export{h as maxPool,D as maxPoolConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/MaxPool.js:
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
//# sourceMappingURL=MaxPool.js.map