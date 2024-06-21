/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/conv3d_backprop_input) denonext production */
import{ENGINE as D}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{Conv3DBackpropInputV2 as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import*as e from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{op as g}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{reshape as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reshape.js";function I(r,t,n,c,m){e.assert(r.length===t.rank,()=>`Length of inShape (${r.length}) and rank of dy (${t.rank}) must match`);let p=r,s=t,a=!1;t.rank===4&&(a=!0,s=i(t,[1,t.shape[0],t.shape[1],t.shape[2],t.shape[3]]),p=[1,r[0],r[1],r[2],r[3]]);let u=p[4],h=s.shape[4];e.assert(p.length===5,()=>`Error in conv3dDerInput: inShape must be length 5, but got length ${p.length}.`),e.assert(s.rank===5,()=>`Error in conv3dDerInput: dy must be rank 5, but got rank ${s.rank}`),e.assert(n.rank===5,()=>`Error in conv3dDerInput: filter must be rank 5, but got rank ${n.rank}`),e.assert(u===n.shape[3],()=>`Error in conv3dDerInput: depth of input (${u}) must match input depth for filter ${n.shape[3]}.`),e.assert(h===n.shape[4],()=>`Error in conv3dDerInput: depth of output (${h}) must match output depth for filter ${n.shape[4]}.`);let k={dy:s,filter:n},l={pad:m,strides:c,inputShape:p},o=D.runKernel(f,k,l);return a?i(o,[o.shape[1],o.shape[2],o.shape[3],o.shape[4]]):o}var b=g({conv3DBackpropInput_:I});export{b as conv3DBackpropInput};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/conv3d_backprop_input.js:
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
//# sourceMappingURL=conv3d_backprop_input.js.map