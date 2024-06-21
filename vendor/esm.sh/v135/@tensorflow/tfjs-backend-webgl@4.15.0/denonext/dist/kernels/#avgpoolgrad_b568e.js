/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/AvgPoolGrad) denonext production */
import{AvgPoolGrad as g,backend_util as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{AvgPool2DBackpropProgram as P}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/avg_pool_backprop_gpu.js";import{assertNotComplex as f}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/webgl_util.js";function u(n){let{inputs:e,backend:a,attrs:c}=n,{dy:o,input:r}=e,t=r;f([o,r],"avgPoolGrad");let{filterSize:p,strides:s,pad:l}=c,m=i.computePool2DInfo(t.shape,p,s,1,l),d=new P(m);return a.runWebGLProgram(d,[o],t.dtype)}var G={kernelName:g,backendName:"webgl",kernelFunc:u};export{u as avgPoolGrad,G as avgPoolGradConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/AvgPoolGrad.js:
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
//# sourceMappingURL=AvgPoolGrad.js.map