/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/FusedDepthwiseConv2D) denonext production */
import{backend_util as D,env as H,FusedDepthwiseConv2D as S,util as C}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{DepthwiseConv2DProgram as T}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/conv_gpu_depthwise.js";import{DepthwiseConvPacked2DProgram as $}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/conv_packed_gpu_depthwise.js";import{mapActivationToShaderProgram as x}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/kernel_funcs_utils.js";function B(k){let{inputs:w,backend:i,attrs:A}=k,{x:h,filter:p,bias:c,preluActivationWeights:f}=w,{strides:s,pad:I,dilations:P,dimRoundingMode:W,activation:a,leakyreluAlpha:b}=A,m=[],t=P;t==null&&(t=[1,1]),C.assert(D.eitherStridesOrDilationsAreOne(s,t),()=>`Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides ${s} and dilations '${t}'`);let e=D.computeConv2DInfo(h.shape,p.shape,s,t,I,W,!0),g=H().getBool("WEBGL_PACK_DEPTHWISECONV")&&e.strideWidth<=2&&e.outChannels/e.inChannels===1,v=a?x(a,g):null,o=[h,p],r=c!=null,l=f!=null,d=a==="leakyrelu";if(r&&o.push(c),l&&o.push(f),d){let n=i.makeTensorInfo([],"float32",C.createScalarValue(b,"float32"));o.push(n),m.push(n)}let u;g?u=new $(e,r,v,l,d):u=new T(e,r,v,l,d);let E=[[e.padInfo.top,e.padInfo.left],[e.strideHeight,e.strideWidth],[e.dilationHeight,e.dilationWidth],[e.inHeight,e.inWidth]],y=i.runWebGLProgram(u,o,"float32",E);return m.forEach(n=>i.disposeIntermediateTensorInfo(n)),y}var V={kernelName:S,backendName:"webgl",kernelFunc:B};export{B as fusedDepthwiseConv2D,V as fusedDepthwiseConv2DConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/FusedDepthwiseConv2D.js:
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
//# sourceMappingURL=FusedDepthwiseConv2D.js.map