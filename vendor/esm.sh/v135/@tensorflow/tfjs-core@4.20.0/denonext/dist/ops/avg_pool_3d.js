/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/avg_pool_3d) denonext production */
import{ENGINE as h}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{AvgPool3D as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as v}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import*as a from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{cast as P}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/cast.js";import{checkPadOnDimRoundingMode as D}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/conv_util.js";import{op as b}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{reshape as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/reshape.js";function k(u,f,o,p,l,n="NDHWC"){let t=v(u,"x","avgPool3d","float32"),e=t,m=!1;t.rank===4&&(m=!0,e=s(t,[1,t.shape[0],t.shape[1],t.shape[2],t.shape[3]])),a.assert(e.rank===5,()=>`Error in avgPool3d: x must be rank 5 but got rank ${e.rank}.`),a.assert(n==="NDHWC",()=>`Error in avgPool3d: Only NDHWC is currently supported, but got dataFormat of ${n}`),a.assert(typeof o=="number"&&o>0||Array.isArray(o)&&o[0]>0&&o[1]>0&&o[2]>0,()=>`Error in avgPool3d: Stride must be > 0, but got '${o}'`),D("avgPool3d",p,l);let i={x:e},g={filterSize:f,strides:o,pad:p,dimRoundingMode:l,dataFormat:n},r=h.runKernel(c,i,g);return r=P(r,e.dtype),m?s(r,[r.shape[1],r.shape[2],r.shape[3],r.shape[4]]):r}var H=b({avgPool3d_:k});export{H as avgPool3d};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/avg_pool_3d.js:
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
//# sourceMappingURL=avg_pool_3d.js.map