/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/depthwise_conv2d_native_backprop_input) denonext production */
import{ENGINE as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{DepthwiseConv2dNativeBackpropInput as v}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{op as N}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{reshape as o}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reshape.js";function k(n,e,s,a,i,h=[1,1],u){let t=e,r=!1;e.rank===3&&(r=!0,t=o(e,[1,e.shape[0],e.shape[1],e.shape[2]]));let c={dy:t,filter:s},f={strides:a,pad:i,dimRoundingMode:u,dilations:h,inputShape:n},p=m.runKernel(v,c,f);return r?o(p,[p.shape[1],p.shape[2],p.shape[3]]):p}var B=N({depthwiseConv2dNativeBackpropInput_:k});export{B as depthwiseConv2dNativeBackpropInput};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/depthwise_conv2d_native_backprop_input.js:
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
//# sourceMappingURL=depthwise_conv2d_native_backprop_input.js.map