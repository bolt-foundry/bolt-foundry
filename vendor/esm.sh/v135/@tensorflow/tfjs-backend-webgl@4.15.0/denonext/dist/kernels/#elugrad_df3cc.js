/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/EluGrad) denonext production */
import{EluGrad as c,env as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{BinaryOpProgram as m}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/binaryop_gpu.js";import{BinaryOpPackedProgram as s}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/binaryop_packed_gpu.js";var E="return (b >= 0.0) ? a : a * (b + 1.0);",b=`
  vec4 bGTEZero = vec4(greaterThanEqual(b, vec4(0.)));
  return (bGTEZero * a) + ((vec4(1.0) - bGTEZero) * (a * (b + vec4(1.0))));
`,u=a=>{let{inputs:o,backend:n}=a,{dy:e,y:r}=o,t=p().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new s(b,e.shape,r.shape):new m(E,e.shape,r.shape);return n.runWebGLProgram(t,[e,r],e.dtype)},G={kernelName:c,backendName:"webgl",kernelFunc:u};export{u as eluGrad,G as eluGradConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/EluGrad.js:
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
//# sourceMappingURL=EluGrad.js.map