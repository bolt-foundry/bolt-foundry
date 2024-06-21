/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/AvgPool) denonext production */
import{AvgPool as p,backend_util as n,util as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{Pool2DProgram as u}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/pool_gpu.js";import{assertNotComplex as P}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/webgl_util.js";import{identity as v}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Identity.js";function h(s){let{inputs:l,backend:i,attrs:d}=s,{x:t}=l;P(t,"avgPool");let{filterSize:m,strides:r,pad:c,dimRoundingMode:f}=d,e=1;a.assert(n.eitherStridesOrDilationsAreOne(r,e),()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${r} and dilations '${e}'`);let o=n.computePool2DInfo(t.shape,m,r,e,c,f);if(o.filterWidth===1&&o.filterHeight===1&&a.arraysEqual(o.inShape,o.outShape))return v({inputs:{x:t},backend:i});let g=new u(o,"avg",!1);return i.runWebGLProgram(g,[t],"float32")}var D={kernelName:p,backendName:"webgl",kernelFunc:h};export{h as avgPool,D as avgPoolConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/AvgPool.js:
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
//# sourceMappingURL=AvgPool.js.map