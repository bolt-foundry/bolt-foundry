/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Conv2D) denonext production */
import{backend_util as d,Conv2D as I,env as s}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{Conv2DProgram as C}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/conv_gpu.js";import{Conv2DPackedProgram as D}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/conv_packed_gpu.js";import{conv2dByMatMul as L,conv2dWithIm2Row as b}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Conv2D_impl.js";import{reshape as k}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";function H(p){let{inputs:m,backend:o,attrs:c}=p,{x:n,filter:i}=m,{strides:l,pad:f,dataFormat:h,dilations:g,dimRoundingMode:u}=c,a=d.convertConv2DDataFormat(h),t=d.computeConv2DInfo(n.shape,i.shape,l,g,f,u,!1,a),e;if(t.filterHeight===1&&t.filterWidth===1&&t.dilationHeight===1&&t.dilationWidth===1&&t.strideHeight===1&&t.strideWidth===1&&(t.padInfo.type==="SAME"||t.padInfo.type==="VALID"))e=L({x:n,filter:i,convInfo:t,backend:o});else if(t.strideWidth<=2&&a==="channelsLast"&&s().getBool("WEBGL_EXP_CONV")){let r=new D(t),W=[[t.padInfo.top,t.padInfo.left],[t.strideHeight,t.strideWidth],[t.dilationHeight,t.dilationWidth],[t.inHeight,t.inWidth]];e=o.runWebGLProgram(r,[n,i],"float32",W)}else if(s().getBool("WEBGL_CONV_IM2COL"))e=b({x:n,filter:i,convInfo:t,backend:o});else{let r=new C(t);e=o.runWebGLProgram(r,[n,i],"float32")}let v=k({inputs:{x:e},backend:o,attrs:{shape:t.outShape}});return o.disposeIntermediateTensorInfo(e),v}var x={kernelName:I,backendName:"webgl",kernelFunc:H};export{x as conv2DConfig,H as conv2d};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Conv2D.js:
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
//# sourceMappingURL=Conv2D.js.map