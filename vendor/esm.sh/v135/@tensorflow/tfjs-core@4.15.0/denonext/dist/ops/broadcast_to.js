/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/broadcast_to) denonext production */
import{ENGINE as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{Tile as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{assertNonNegativeIntegerDimensions as h}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util_base.js";import{clone as g}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/clone.js";import{op as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{reshape as T}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reshape.js";function b(e,o){let t=p(e,"broadcastTo","x"),i=t.shape;if(h(o),o.length<t.rank)throw new Error(`broadcastTo(): shape.length=${o.length} < input.rank=${t.rank}.`);if(o.length>t.rank){let r=t.shape.slice();for(;r.length<o.length;)r.unshift(1);t=T(t,r)}let a=t.shape,n=Array.from(o);for(let r=o.length-1;r>=0;r--)if(a[r]===o[r])n[r]=1;else if(t.shape[r]!==1)throw new Error(`broadcastTo(): [${i}] cannot be broadcast to [${o}].`);if(n.map((r,f)=>r>1?f:-1).filter(r=>r>=0).length===0)return g(t);let s={x:t},c={reps:n};return l.runKernel(m,s,c)}var v=u({broadcastTo_:b});export{v as broadcastTo};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/broadcast_to.js:
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
//# sourceMappingURL=broadcast_to.js.map