/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/eye) denonext production */
import{buffer as g}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/buffer.js";import{expandDims as t}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/expand_dims.js";import{op as D}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{reshape as d}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reshape.js";import{tile as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/tile.js";function p(f,e,r,s="float32"){e==null&&(e=f);let n=g([f,e],s),y=f<=e?f:e;for(let i=0;i<y;++i)n.set(1,i,i);let o=d(n.toTensor(),[f,e]);if(r==null)return o;if(r.length===1)return l(t(o,0),[r[0],1,1]);if(r.length===2)return l(t(t(o,0),0),[r[0],r[1],1,1]);if(r.length===3)return l(t(t(t(o,0),0),0),[r[0],r[1],r[2],1,1]);throw new Error(`eye() currently supports only 1D and 2D batchShapes, but received ${r.length}D.`)}var $=D({eye_:p});export{$ as eye};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/eye.js:
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
//# sourceMappingURL=eye.js.map