/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/max_pool_3d) denonext production */
import{ENGINE as h}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{MaxPool3D as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as P}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as s from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{checkPadOnDimRoundingMode as D}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/conv_util.js";import{op as d}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{reshape as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reshape.js";function k(i,l=[1,1,1],u,a,n,e="NDHWC"){let o=P(i,"x","maxPool3d"),t=o,p=!1;o.rank===4&&(p=!0,t=m(o,[1,o.shape[0],o.shape[1],o.shape[2],o.shape[3]])),s.assert(t.rank===5,()=>`Error in maxPool3d: x must be rank 5 but got rank ${t.rank}.`),s.assert(e==="NDHWC",()=>`Error in maxPool3d: Only NDHWC is currently supported, but got dataFormat of ${e}`),D("maxPool3d",a,n);let x={x:t},f={filterSize:l,strides:u,pad:a,dimRoundingMode:n,dataFormat:e},r=h.runKernel(c,x,f);return p?m(r,[r.shape[1],r.shape[2],r.shape[3],r.shape[4]]):r}var W=d({maxPool3d_:k});export{W as maxPool3d};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/max_pool_3d.js:
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
//# sourceMappingURL=max_pool_3d.js.map