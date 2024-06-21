/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/depthwise_conv2d_native_backprop_filter) denonext production */
import{ENGINE as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{DepthwiseConv2dNativeBackpropFilter as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{op as v}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{reshape as o}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reshape.js";function k(e,t,i,a,s,n=[1,1],h){let r=e;e.rank===3&&(r=o(e,[1,e.shape[0],e.shape[1],e.shape[2]]));let p=t;p.rank===3&&(p=o(t,[1,t.shape[0],t.shape[1],t.shape[2]]));let m={x:r,dy:p},c={strides:a,pad:s,dimRoundingMode:h,dilations:n,filterShape:i};return f.runKernel(l,m,c)}var B=v({depthwiseConv2dNativeBackpropFilter_:k});export{B as depthwiseConv2dNativeBackpropFilter};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/depthwise_conv2d_native_backprop_filter.js:
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
//# sourceMappingURL=depthwise_conv2d_native_backprop_filter.js.map