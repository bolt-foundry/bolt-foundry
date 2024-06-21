/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/max_pool) denonext production */
import{ENGINE as h}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{MaxPool as P}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as k}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import*as s from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import*as e from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/conv_util.js";import{op as d}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{reshape as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/reshape.js";function E(u,c,n,a,i){let o=k(u,"x","maxPool"),m=1,t=o,l=!1;o.rank===3&&(l=!0,t=p(o,[1,o.shape[0],o.shape[1],o.shape[2]])),s.assert(t.rank===4,()=>`Error in maxPool: input must be rank 4 but got rank ${t.rank}.`),s.assert(e.eitherStridesOrDilationsAreOne(n,m),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${n} and dilations '${m}'`),e.checkPadOnDimRoundingMode("maxPool",a,i);let x={x:t},f={filterSize:c,strides:n,pad:a,dimRoundingMode:i},r=h.runKernel(P,x,f);return l?p(r,[r.shape[1],r.shape[2],r.shape[3]]):r}var O=d({maxPool_:E});export{O as maxPool};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/max_pool.js:
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
//# sourceMappingURL=max_pool.js.map