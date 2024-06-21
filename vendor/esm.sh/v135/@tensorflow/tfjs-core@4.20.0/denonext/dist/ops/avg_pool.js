/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/avg_pool) denonext production */
import{ENGINE as v}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{AvgPool as g}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as P}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import*as s from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{cast as d}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/cast.js";import*as e from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/conv_util.js";import{op as k}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{reshape as m}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/reshape.js";function x(u,c,a,i,n){let o=P(u,"x","avgPool","float32"),l=1;s.assert(e.eitherStridesOrDilationsAreOne(a,l),()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${a} and dilations '${l}'`);let t=o,p=!1;o.rank===3&&(p=!0,t=m(o,[1,o.shape[0],o.shape[1],o.shape[2]])),s.assert(t.rank===4,()=>`Error in avgPool: x must be rank 4 but got rank ${t.rank}.`),e.checkPadOnDimRoundingMode("avgPool",i,n);let f={x:t},h={filterSize:c,strides:a,pad:i,dimRoundingMode:n},r=v.runKernel(g,f,h);return r=d(r,o.dtype),p?m(r,[r.shape[1],r.shape[2],r.shape[3]]):r}var T=k({avgPool_:x});export{T as avgPool};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/avg_pool.js:
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
//# sourceMappingURL=avg_pool.js.map