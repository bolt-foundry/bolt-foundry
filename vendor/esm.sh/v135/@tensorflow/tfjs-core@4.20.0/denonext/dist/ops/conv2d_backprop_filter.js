/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/conv2d_backprop_filter) denonext production */
import{ENGINE as k}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{Conv2DBackpropFilter as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import*as n from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import*as l from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/conv_util.js";import{op as d}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{reshape as h}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/reshape.js";function E(e,s,t,m,p,i="NHWC",u){let o=e;e.rank===3&&(o=h(e,[1,e.shape[0],e.shape[1],e.shape[2]]));let r=s;r.rank===3&&(r=h(s,[1,s.shape[0],s.shape[1],s.shape[2]])),n.assert(o.rank===4,()=>`Error in conv2dDerFilter: input must be rank 4, but got shape ${o.shape}.`),n.assert(r.rank===4,()=>`Error in conv2dDerFilter: dy must be rank 4, but got shape ${r.shape}.`),n.assert(t.length===4,()=>`Error in conv2dDerFilter: filterShape must be length 4, but got ${t}.`);let a=i==="NHWC"?o.shape[3]:o.shape[1],c=i==="NHWC"?r.shape[3]:r.shape[1];n.assert(a===t[2],()=>`Error in conv2dDerFilter: depth of input ${a}) must match input depth in filter (${t[2]}.`),n.assert(c===t[3],()=>`Error in conv2dDerFilter: depth of dy (${c}) must match output depth for filter (${t[3]}).`),l.checkPadOnDimRoundingMode("conv2dDerFilter",p,u);let D={x:o,dy:r},v={strides:m,pad:p,dataFormat:i,dimRoundingMode:u,filterShape:t};return k.runKernel(f,D,v)}var N=d({conv2DBackpropFilter_:E});export{N as conv2DBackpropFilter};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/conv2d_backprop_filter.js:
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
//# sourceMappingURL=conv2d_backprop_filter.js.map