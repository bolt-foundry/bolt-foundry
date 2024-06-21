/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/depthwise_conv2d) denonext production */
import{ENGINE as w}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{DepthwiseConv2dNative as $}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as s from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import*as f from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/conv_util.js";import{op as b}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{reshape as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reshape.js";function x(m,d,c,o,i="NHWC",v=[1,1],a){let e=l(m,"x","depthwiseConv2d","float32"),n=l(d,"filter","depthwiseConv2d","float32"),t=e,p=!1;e.rank===3&&(p=!0,t=u(e,[1,e.shape[0],e.shape[1],e.shape[2]])),s.assert(t.rank===4,()=>`Error in depthwiseConv2d: input must be rank 4, but got rank ${t.rank}.`),s.assert(n.rank===4,()=>`Error in depthwiseConv2d: filter must be rank 4, but got rank ${n.rank}.`);let h=i==="NHWC"?t.shape[3]:t.shape[1];s.assert(h===n.shape[2],()=>`Error in depthwiseConv2d: number of input channels (${h}) must match the inChannels dimension in filter ${n.shape[2]}.`),f.checkPadOnDimRoundingMode("depthwiseConv2d",o,a);let C={x:t,filter:n},k={strides:c,pad:o,dataFormat:i,dilations:v,dimRoundingMode:a},r=w.runKernel($,C,k);return p?u(r,[r.shape[1],r.shape[2],r.shape[3]]):r}var g=b({depthwiseConv2d_:x});export{g as depthwiseConv2d};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/depthwise_conv2d.js:
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
//# sourceMappingURL=depthwise_conv2d.js.map