/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/signal/frame) denonext production */
import{concat as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/concat.js";import{fill as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/fill.js";import{op as n}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{reshape as d}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/reshape.js";import{slice as m}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/slice.js";import{tensor2d as z}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/tensor2d.js";function h(r,t,i,e=!1,f=0){let o=0,p=[];for(;o+t<=r.size;)p.push(m(r,o,t)),o+=i;if(e)for(;o<r.size;){let s=o+t-r.size,u=c([m(r,o,t-s),l([s],f)]);p.push(u),o+=i}return p.length===0?z([],[0,t]):d(c(p),[p.length,t])}var q=n({frame_:h});export{q as frame};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/signal/frame.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=frame.js.map