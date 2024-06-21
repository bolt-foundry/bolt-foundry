/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Conv2DBackpropInput) denonext production */
import{backend_util as c,Conv2DBackpropInput as D,env as v}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{Conv2DDerInputProgram as k}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/conv_backprop_gpu.js";import{Conv2DDerInputPackedProgram as C}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/conv_backprop_packed_gpu.js";function I(p){let{inputs:s,backend:r,attrs:m}=p,{dy:e,filter:n}=s,{inputShape:u,strides:i,pad:d,dataFormat:f,dimRoundingMode:l}=m,a=c.convertConv2DDataFormat(f),o=c.computeConv2DInfo(u,n.shape,i,1,d,l,!1,a);if(v().getBool("WEBGL_PACK_CONV2DTRANSPOSE")&&a==="channelsLast"){let t=[[o.strideHeight,o.strideWidth]],g=new C(o);return r.runWebGLProgram(g,[e,n],"float32",t)}else{let t=new k(o);return r.runWebGLProgram(t,[e,n],"float32")}}var B={kernelName:D,backendName:"webgl",kernelFunc:I};export{I as conv2DBackpropInput,B as conv2DBackpropInputConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Conv2DBackpropInput.js:
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
//# sourceMappingURL=Conv2DBackpropInput.js.map