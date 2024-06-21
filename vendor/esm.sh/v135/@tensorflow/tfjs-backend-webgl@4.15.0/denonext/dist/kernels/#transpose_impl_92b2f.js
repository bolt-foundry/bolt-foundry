/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Transpose_impl) denonext production */
import{env as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{transposeImplCPU as P}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";import{TransposeProgram as t}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/transpose_gpu.js";import{TransposePackedProgram as n}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/transpose_packed_gpu.js";function i(r,o,e){let p=m().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new n(r.shape,o):new t(r.shape,o);return e.runWebGLProgram(p,[r],r.dtype)}export{i as transposeImpl,P as transposeImplCPU};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Transpose_impl.js:
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
//# sourceMappingURL=Transpose_impl.js.map