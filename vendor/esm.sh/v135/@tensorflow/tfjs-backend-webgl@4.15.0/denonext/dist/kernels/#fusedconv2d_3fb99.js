/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/FusedConv2D) denonext production */
import{backend_util as k,env as A,FusedConv2D as M,util as N}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{Conv2DProgram as V}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/conv_gpu.js";import{Conv2DPackedProgram as _}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/conv_packed_gpu.js";import{mapActivationToShaderProgram as D}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/kernel_funcs_utils.js";import{conv2dByMatMul as w,conv2dWithIm2Row as G}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Conv2D_impl.js";import{reshape as L}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";function S(P){let{inputs:b,backend:n,attrs:y}=P,{x:r,filter:l,bias:p,preluActivationWeights:d}=b,{strides:H,pad:B,dataFormat:c,dilations:F,dimRoundingMode:x,activation:a,leakyreluAlpha:h}=y,W=k.convertConv2DDataFormat(c),t=k.computeConv2DInfo(r.shape,l.shape,H,F,B,x,!1,W),s,u=[],f=p!=null,m=d!=null,g=a==="leakyrelu",I=()=>{let o=[r,l],i=(e,v)=>{if(v==="NCHW"&&e.shape.length===1&&e.shape[0]!==1){let C=L({inputs:{x:e},backend:n,attrs:{shape:[e.shape[0],1,1]}});return u.push(C),C}return e};if(f&&o.push(i(p,c)),m&&o.push(i(d,c)),g){let e=n.makeTensorInfo([],"float32",N.createScalarValue(h,"float32"));o.push(e),u.push(e)}return o};if(t.filterHeight===1&&t.filterWidth===1&&t.dilationHeight===1&&t.dilationWidth===1&&t.strideHeight===1&&t.strideWidth===1&&(t.padInfo.type==="SAME"||t.padInfo.type==="VALID"))s=w({x:r,filter:l,convInfo:t,backend:n,bias:p,activation:a,preluActivationWeights:d,leakyreluAlpha:h});else if(t.strideWidth<=2&&W==="channelsLast"&&A().getBool("WEBGL_EXP_CONV")){let o=a?D(a,!0):null,i=new _(t,f,o,m,g),e=[[t.padInfo.top,t.padInfo.left],[t.strideHeight,t.strideWidth],[t.dilationHeight,t.dilationWidth],[t.inHeight,t.inWidth]],v=I();s=n.runWebGLProgram(i,v,"float32",e)}else if(A().getBool("WEBGL_CONV_IM2COL"))s=G({x:r,filter:l,convInfo:t,backend:n,bias:p,activation:a,preluActivationWeights:d,leakyreluAlpha:h});else{let o=a?D(a,!1):null,i=new V(t,f,o,m,g),e=I();s=n.runWebGLProgram(i,e,"float32")}let E=L({inputs:{x:s},backend:n,attrs:{shape:t.outShape}});return u.push(s),u.forEach(o=>n.disposeIntermediateTensorInfo(o)),E}var q={kernelName:M,backendName:"webgl",kernelFunc:S};export{q as fusedConv2DConfig,S as fusedConv2d};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/FusedConv2D.js:
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
//# sourceMappingURL=FusedConv2D.js.map