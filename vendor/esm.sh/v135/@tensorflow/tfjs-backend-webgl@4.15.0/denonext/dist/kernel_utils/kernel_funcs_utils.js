/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernel_utils/kernel_funcs_utils) denonext production */
import{backend_util as U,env as R,upcastType as A}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{BinaryOpProgram as b}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/binaryop_gpu.js";import{BinaryOpPackedProgram as k}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/binaryop_packed_gpu.js";import{complex as B}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Complex.js";import{LEAKYRELU as N,LEAKYRELU_PACKED as w}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/LeakyRelu.js";import{PRELU as C,PRELU_PACKED as G}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Prelu.js";import*as o from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/unaryop_gpu.js";import{UnaryOpProgram as K}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/unaryop_gpu.js";import*as s from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/unaryop_packed_gpu.js";import{UnaryOpPackedProgram as S}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/unaryop_packed_gpu.js";var q="if (isnan(x)) return x;";function v({opSnippet:t,packedOpSnippet:a,cpuKernelImpl:c,dtype:I}){return({inputs:y,backend:P})=>{let{x:u}=y,p=P,e=I||u.dtype;if(p.shouldExecuteOnCPU([u])&&c!=null){let l=p.texData.get(u.dataId),E=c(l.values,e);return p.makeTensorInfo(u.shape,e,E)}let n=R().getBool("WEBGL_PACK_UNARY_OPERATIONS")&&a!=null,r;return n?r=new S(u.shape,a):r=new K(u.shape,t),p.runWebGLProgram(r,[u],e)}}function z({opSnippet:t,packedOpSnippet:a,checkOutOfBounds:c=!1,supportsComplex:I=!1,cpuKernelImpl:y,dtype:P}){return({inputs:u,backend:p})=>{let{a:e,b:n}=u,r=p;if(I&&e.dtype==="complex64"){let m=r.texData.get(e.dataId),f=r.texData.get(n.dataId),[g,_]=[[m.complexTensorInfos.real,f.complexTensorInfos.real],[m.complexTensorInfos.imag,f.complexTensorInfos.imag]].map(L=>{let[d,i]=L,T={dataId:d.dataId,dtype:d.dtype,shape:e.shape},D={dataId:i.dataId,dtype:i.dtype,shape:n.shape},O=new b(t,e.shape,n.shape);return r.runWebGLProgram(O,[T,D],A(d.dtype,i.dtype))}),x=B({inputs:{real:g,imag:_},backend:r});return r.disposeIntermediateTensorInfo(g),r.disposeIntermediateTensorInfo(_),x}let l=P||A(e.dtype,n.dtype);if((e.dtype==="string"||n.dtype==="string"||r.shouldExecuteOnCPU([e,n]))&&y!=null){let m=r.texData.get(e.dataId).values,f=r.texData.get(n.dataId).values,g=e.dtype==="string"?U.fromUint8ToStringArray(m):m,_=e.dtype==="string"?U.fromUint8ToStringArray(f):f,[x,L]=y(e.shape,n.shape,g,_,l),d=r.makeTensorInfo(L,l),i=r.texData.get(d.dataId);return i.values=x,d}let E=R().getBool("WEBGL_PACK_BINARY_OPERATIONS")&&a!=null,h;return E?h=new k(a,e.shape,n.shape,c):h=new b(t,e.shape,n.shape),r.runWebGLProgram(h,[e,n],l)}}function J(t,a=!1){if(t==="linear")return a?s.LINEAR:o.LINEAR;if(t==="relu")return a?s.RELU:o.RELU;if(t==="elu")return a?s.ELU:o.ELU;if(t==="relu6")return a?s.RELU6:o.RELU6;if(t==="prelu")return a?G:C;if(t==="leakyrelu")return a?w:N;if(t==="sigmoid")return a?s.SIGMOID:o.SIGMOID;throw new Error(`Activation ${t} has not been implemented for the WebGL backend.`)}export{q as CHECK_NAN_SNIPPET_UNARY,z as binaryKernelFunc,J as mapActivationToShaderProgram,v as unaryKernelFunc};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernel_utils/kernel_funcs_utils.js:
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
//# sourceMappingURL=kernel_funcs_utils.js.map