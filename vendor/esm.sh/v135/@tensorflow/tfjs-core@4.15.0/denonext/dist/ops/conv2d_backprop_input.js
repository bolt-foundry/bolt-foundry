/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/conv2d_backprop_input) denonext production */
import{ENGINE as g}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{Conv2DBackpropInput as I}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import*as r from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import*as k from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/conv_util.js";import{op as $}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{reshape as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reshape.js";function E(e,t,n,D,a,u="NHWC",h){r.assert(e.length===t.rank,()=>`Length of inShape (${e.length}) and rank of dy (${t.rank}) must match`);let o=e,p=t,i=!1;t.rank===3&&(i=!0,p=l(t,[1,t.shape[0],t.shape[1],t.shape[2]]),o=[1,e[0],e[1],e[2]]),r.assert(o.length===4,()=>`Error in conv2dDerInput: inShape must be length 4, but got length ${o.length}.`),r.assert(p.rank===4,()=>`Error in conv2dDerInput: dy must be rank 4, but got rank ${p.rank}`),r.assert(n.rank===4,()=>`Error in conv2dDerInput: filter must be rank 4, but got rank ${n.rank}`);let c=u==="NHWC"?o[3]:o[1],m=u==="NHWC"?p.shape[3]:p.shape[1];r.assert(c===n.shape[2],()=>`Error in conv2dDerInput: depth of input (${c}) must match input depth for filter ${n.shape[2]}.`),r.assert(m===n.shape[3],()=>`Error in conv2dDerInput: depth of output (${m}) must match output depth for filter ${n.shape[3]}.`),k.checkPadOnDimRoundingMode("conv2dDerInput",a,h);let f={dy:p,filter:n},v={strides:D,pad:a,dataFormat:u,dimRoundingMode:h,inputShape:o},s=g.runKernel(I,f,v);return i?l(s,[s.shape[1],s.shape[2],s.shape[3]]):s}var B=$({conv2DBackpropInput_:E});export{B as conv2DBackpropInput};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/conv2d_backprop_input.js:
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
//# sourceMappingURL=conv2d_backprop_input.js.map