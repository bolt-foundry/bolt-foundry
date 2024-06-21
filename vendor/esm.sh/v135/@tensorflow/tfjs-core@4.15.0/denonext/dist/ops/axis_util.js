/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/axis_util) denonext production */
import*as i from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";function p(n,t){for(let e=0;e<n.length;++e)if(n[n.length-e-1]!==t-1-e)return!1;return!0}function c(n,t,e){let r=n.length+t.length,u=[],o=0,f=0;for(let s=0;s<r;s++)e.indexOf(s)===-1?u.push(n[o++]):u.push(t[f++]);return u}function l(n,t){let e=[],r=n.length;for(let o=0;o<r;o++)t.indexOf(o)===-1&&e.push(n[o]);let u=t.map(o=>n[o]);return[e,u]}function m(n,t){let e=t.map(r=>1);return c(n,e,t)}function h(n,t,e){i.assert(p(t,e),()=>`${n} supports only inner-most axes for now. Got axes ${t} and rank-${e} input.`)}function x(n,t){if(p(n,t))return null;let e=[];for(let r=0;r<t;++r)n.indexOf(r)===-1&&e.push(r);return n.forEach(r=>e.push(r)),e}function d(n){return n.map((t,e)=>[e,t]).sort((t,e)=>t[1]-e[1]).map(t=>t[0])}function a(n,t){let e=[];for(let r=t-n;r<t;++r)e.push(r);return e}export{h as assertAxesAreInnerMostDims,p as axesAreInnerMostDims,c as combineLocations,l as computeOutAndReduceShapes,m as expandShapeToKeepDim,x as getAxesPermutation,a as getInnerMostAxes,d as getUndoAxesPermutation};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/axis_util.js:
  (**
   * @license
   * Copyright 2017 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=axis_util.js.map