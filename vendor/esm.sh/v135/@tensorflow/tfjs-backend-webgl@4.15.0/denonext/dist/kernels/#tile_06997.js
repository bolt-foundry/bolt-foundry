/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Tile) denonext production */
import{buffer as d,Tile as l,util as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{tileImplCPU as g}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";import{TileProgram as b}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/tile_gpu.js";function y(a){let{inputs:p,backend:e,attrs:s}=a,{x:t}=p,{reps:o}=s;if(t.dtype==="string"||t.shape.length>5){let r=e.readSync(t.dataId),c=t.dtype==="string"?r.map(m=>f.decodeString(m)):r,i=d(t.shape,t.dtype,c),n=g(i,o);return e.makeTensorInfo(n.shape,n.dtype,n.values)}let u=new b(t.shape,o);return e.runWebGLProgram(u,[t],t.dtype)}var P={kernelName:l,backendName:"webgl",kernelFunc:y};export{y as tile,P as tileConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Tile.js:
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
//# sourceMappingURL=Tile.js.map