/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/conv3d) denonext production */
import{ENGINE as D}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{Conv3D as E}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as r from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{eitherStridesOrDilationsAreOne as k,stridesOrDilationsArePositive as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/conv_util.js";import{op as $}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{reshape as h}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reshape.js";function b(c,f,s,m,a="NDHWC",i=[1,1,1]){let t=u(c,"x","conv3d"),n=u(f,"filter","conv3d"),e=t,p=!1;t.rank===4&&(p=!0,e=h(t,[1,t.shape[0],t.shape[1],t.shape[2],t.shape[3]])),r.assert(e.rank===5,()=>`Error in conv3d: input must be rank 5, but got rank ${e.rank}.`),r.assert(n.rank===5,()=>`Error in conv3d: filter must be rank 5, but got rank ${n.rank}.`),r.assert(e.shape[4]===n.shape[3],()=>`Error in conv3d: depth of input (${e.shape[4]}) must match input depth for filter ${n.shape[3]}.`),r.assert(k(s,i),()=>`Error in conv3D: Either strides or dilations must be 1. Got strides ${s} and dilations '${i}'`),r.assert(a==="NDHWC",()=>`Error in conv3d: got dataFormat of ${a} but only NDHWC is currently supported.`),r.assert(l(i),()=>"Error in conv3D: Dilated rates should be larger than 0."),r.assert(l(s),()=>"Error in conv3D: Strides should be larger than 0.");let d={x:e,filter:n},v={strides:s,pad:m,dataFormat:a,dilations:i},o=D.runKernel(E,d,v);return p?h(o,[o.shape[1],o.shape[2],o.shape[3],o.shape[4]]):o}var T=$({conv3d_:b});export{T as conv3d};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/conv3d.js:
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
//# sourceMappingURL=conv3d.js.map