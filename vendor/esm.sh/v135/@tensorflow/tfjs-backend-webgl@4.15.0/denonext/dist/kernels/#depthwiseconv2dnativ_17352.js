/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/DepthwiseConv2dNative) denonext production */
import{backend_util as s,DepthwiseConv2dNative as f,env as v,util as C}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{DepthwiseConv2DProgram as g}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/conv_gpu_depthwise.js";import{DepthwiseConvPacked2DProgram as w}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/conv_packed_gpu_depthwise.js";function D(d){let{inputs:a,backend:l,attrs:p}=d,{x:o,filter:r}=a,{strides:i,pad:h,dilations:m,dimRoundingMode:c}=p,t=m;t==null&&(t=[1,1]),C.assert(s.eitherStridesOrDilationsAreOne(i,t),()=>`Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides ${i} and dilations '${t}'`);let e=s.computeConv2DInfo(o.shape,r.shape,i,t,h,c,!0),n;v().getBool("WEBGL_PACK_DEPTHWISECONV")&&e.strideWidth<=2&&e.outChannels/e.inChannels===1?n=new w(e):n=new g(e);let u=[[e.padInfo.top,e.padInfo.left],[e.strideHeight,e.strideWidth],[e.dilationHeight,e.dilationWidth],[e.inHeight,e.inWidth]];return l.runWebGLProgram(n,[o,r],"float32",u)}var N={kernelName:f,backendName:"webgl",kernelFunc:D};export{D as depthwiseConv2dNative,N as depthwiseConv2dNativeConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/DepthwiseConv2dNative.js:
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
//# sourceMappingURL=DepthwiseConv2dNative.js.map