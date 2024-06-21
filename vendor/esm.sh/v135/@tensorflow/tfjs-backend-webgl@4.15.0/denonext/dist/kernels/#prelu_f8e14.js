/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Prelu) denonext production */
import{env as s,Prelu as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{BinaryOpProgram as c}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/binaryop_gpu.js";import{BinaryOpPackedProgram as m}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/binaryop_packed_gpu.js";var l="return (a < 0.) ? b * a : a;",u=`
  vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));
  return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);
`;function P(a){let{inputs:n,backend:o}=a,{x:e,alpha:r}=n,t=s().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new m(u,e.shape,r.shape):new c(l,e.shape,r.shape);return o.runWebGLProgram(t,[e,r],"float32")}var L={kernelName:p,backendName:"webgl",kernelFunc:P};export{l as PRELU,u as PRELU_PACKED,P as prelu,L as preluConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Prelu.js:
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
//# sourceMappingURL=Prelu.js.map