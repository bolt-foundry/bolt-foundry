/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/MaxPoolWithArgmax) denonext production */
import{MaxPoolWithArgmax as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as n,util as r}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{maxPoolWithArgmaxImpl as g}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/MaxPoolWithArgmax_impl.js";var P={kernelName:u,backendName:"webgl",kernelFunc:({inputs:i,attrs:s,backend:a})=>{let{x:t}=i,{filterSize:l,strides:o,pad:m,includeBatchInIndex:c}=s,d=a;r.assert(t.shape.length===4,()=>`Error in maxPool: input must be rank 4 but got rank ${t.shape.length}.`);let e=[1,1];r.assert(n.eitherStridesOrDilationsAreOne(o,e),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${o} and dilations '${e}'`);let x=n.computePool2DInfo(t.shape,l,o,e,m),[h,p]=g(t,c,x,d);return[h,p]}};export{P as maxPoolWithArgmaxConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/MaxPoolWithArgmax.js:
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
//# sourceMappingURL=MaxPoolWithArgmax.js.map