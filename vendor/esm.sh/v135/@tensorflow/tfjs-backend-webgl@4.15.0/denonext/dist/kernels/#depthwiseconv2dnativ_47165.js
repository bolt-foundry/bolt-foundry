/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/DepthwiseConv2dNativeBackpropFilter) denonext production */
import{backend_util as u,DepthwiseConv2dNativeBackpropFilter as v}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{DepthwiseConv2DDerFilterProgram as f}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/conv_backprop_gpu_depthwise.js";function k(o){let{inputs:t,backend:n,attrs:r}=o,{x:e,dy:i}=t,{strides:a,dilations:p,pad:c,dimRoundingMode:s,filterShape:d}=r,l=u.computeConv2DInfo(e.shape,d,a,p,c,s,!0),m=new f(l);return n.runWebGLProgram(m,[e,i],"float32")}var w={kernelName:v,backendName:"webgl",kernelFunc:k};export{k as depthwiseConv2dNativeBackpropFilter,w as depthwiseConv2dNativeBackpropFilterConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/DepthwiseConv2dNativeBackpropFilter.js:
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
//# sourceMappingURL=DepthwiseConv2dNativeBackpropFilter.js.map