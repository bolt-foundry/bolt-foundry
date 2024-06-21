/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/DepthwiseConv2dNativeBackpropInput) denonext production */
import{backend_util as v,DepthwiseConv2dNativeBackpropInput as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{DepthwiseConv2DDerInputProgram as k}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/conv_backprop_gpu_depthwise.js";function l(e){let{inputs:t,backend:o,attrs:p}=e,{dy:r,filter:n}=t,{strides:a,dilations:i,pad:c,dimRoundingMode:s,inputShape:d}=p,u=v.computeConv2DInfo(d,n.shape,a,i,c,s,!0),m=new k(u);return o.runWebGLProgram(m,[r,n],"float32")}var w={kernelName:f,backendName:"webgl",kernelFunc:l};export{l as depthwiseConv2dNativeBackpropInput,w as depthwiseConv2dNativeBackpropInputConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/DepthwiseConv2dNativeBackpropInput.js:
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
//# sourceMappingURL=DepthwiseConv2dNativeBackpropInput.js.map