/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/boolean_mask) denonext production */
import{convertToTensor as k}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as a from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{gather as y}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/gather.js";import{reshape as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reshape.js";import{squeeze as S}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/squeeze.js";import{whereAsync as T}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/where_async.js";async function g(i,c,p){let e=k(i,"tensor","boolMask"),o=k(c,"mask","boolMask","bool"),s=p??0,t=o.rank,n=e.shape;a.assert(t>0,()=>"mask cannot be scalar"),a.assertShapesMatch(n.slice(s,s+t),o.shape,"mask's shape must match the first K dimensions of tensor's shape,");let m=1;for(let r=s;r<s+t;r++)m*=n[r];let b=n.slice(0,s).concat([m],n.slice(s+t)),l=u(e,b),h=u(o,[-1]),f=await T(h),d=S(f,[1]),M=y(l,d,s);return i!==e&&e.dispose(),c!==o&&o.dispose(),d.dispose(),l.dispose(),h.dispose(),f.dispose(),M}var q=g;export{q as booleanMaskAsync};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/boolean_mask.js:
  (**
   * @license
   * Copyright 2018 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=boolean_mask.js.map