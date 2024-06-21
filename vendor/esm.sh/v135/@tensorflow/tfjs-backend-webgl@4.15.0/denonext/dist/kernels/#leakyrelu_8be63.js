/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/LeakyRelu) denonext production */
import{env as p,LeakyRelu as m,util as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{BinaryOpProgram as i}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/binaryop_gpu.js";import{BinaryOpPackedProgram as f}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/binaryop_packed_gpu.js";var h="return (a < 0.) ? b * a : a;",L=`
  vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));
  return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);
`;function k(o){let{inputs:n,backend:a,attrs:t}=o,{x:r}=n,{alpha:s}=t,e=a.makeTensorInfo([],"float32",u.createScalarValue(s,"float32")),c=p().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new f(L,r.shape,e.shape):new i(h,r.shape,e.shape),l=a.runWebGLProgram(c,[r,e],"float32");return a.disposeIntermediateTensorInfo(e),l}var R={kernelName:m,backendName:"webgl",kernelFunc:k};export{h as LEAKYRELU,L as LEAKYRELU_PACKED,k as leakyRelu,R as leakyReluConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/LeakyRelu.js:
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
//# sourceMappingURL=LeakyRelu.js.map