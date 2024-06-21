/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Neg) denonext production */
import{env as l,Neg as N}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{negImplCPU as p}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";import{CHECK_NAN_SNIPPET as g,UnaryOpProgram as m}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/unaryop_gpu.js";import{UnaryOpPackedProgram as c}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/unaryop_packed_gpu.js";var i=g+`
  return -x;
`,x=`
  vec4 result = -x;
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`;function P(n){let{inputs:a,backend:r}=n,{x:e}=a;if(r.shouldExecuteOnCPU([e])){let s=r.texData.get(e.dataId),[o,u]=p(s.values,e.shape,e.dtype);return r.makeTensorInfo(u,e.dtype,o)}let t;return l().getBool("WEBGL_PACK_UNARY_OPERATIONS")?t=new c(e.shape,x):t=new m(e.shape,i),r.runWebGLProgram(t,[e],e.dtype)}var C={kernelName:N,backendName:"webgl",kernelFunc:P};export{P as neg,C as negConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Neg.js:
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
//# sourceMappingURL=Neg.js.map