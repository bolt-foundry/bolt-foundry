/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernel_utils/reshape) denonext production */
import{ReshapePackedProgram as g}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/reshape_packed_gpu.js";import{getBatchDim as p,getRowsCols as s}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/webgl_util.js";function D(t,e,r){let a=[p(t.shape),...s(t.shape)],d={dtype:t.dtype,shape:a,dataId:t.dataId},c=[p(e),...s(e)],n=new g(c,a),m=!0,u=[a],o=r.runWebGLProgram(n,[d],t.dtype,u,m);return{dataId:o.dataId,shape:e,dtype:o.dtype}}export{D as packedReshape};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernel_utils/reshape.js:
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
//# sourceMappingURL=reshape.js.map