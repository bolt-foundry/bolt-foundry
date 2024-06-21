/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/pool) denonext production */
import{convertToTensor as _}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as P from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{avgPool as S}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/avg_pool.js";import{batchToSpaceND as O}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/batch_to_space_nd.js";import*as f from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/conv_util.js";import{maxPool as B}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/max_pool.js";import{op as H}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{reshape as g}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reshape.js";import{spaceToBatchND as I}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/space_to_batch_nd.js";function W(s,p,l,n,e,i,o){e==null&&(e=[1,1]),i==null&&(i=1),n===0&&(n="valid");let a=_(s,"x","maxPool"),c=a,d=!1;a.rank===3&&(d=!0,c=g(a,[1,a.shape[0],a.shape[1],a.shape[2]])),P.assert(f.eitherStridesOrDilationsAreOne(i,e),()=>`Error in pool: Either strides or dilations must be 1. Got strides ${i} and dilations '${e}'`);let t=f.computePool2DInfo(c.shape,p,i,e,n),r=[t.dilationHeight,t.dilationWidth],h;n==="same"?h=j([t.filterHeight,t.filterWidth],r):h=[[0,0],[0,0]];let u=r[0]===1&&r[1]===1,[D,T]=$([t.inHeight,t.inWidth],r,h),v=u?n:"valid",x=u?c:I(c,r,D),E=(l==="avg"?()=>S(x,p,i,v,o):()=>B(x,p,i,v,o))(),m=u?E:O(E,r,T);return d?g(m,[m.shape[1],m.shape[2],m.shape[3]]):m}function $(s,p,l){let n=l.map(t=>t[0]),e=l.map(t=>t[1]),i=s.concat(n,e),o=p.map((t,r)=>(t-i[r]%t)%t),a=e.map((t,r)=>t+o[r]),c=p.map((t,r)=>[n[r],a[r]]),d=p.map((t,r)=>[0,o[r]]);return[c,d]}function j(s,p){let n=s.map((o,a)=>o+(o-1)*(p[a]-1)).map(o=>o-1),e=n.map(o=>Math.floor(o/2)),i=n.map((o,a)=>o-e[a]);return n.map((o,a)=>[e[a],i[a]])}var z=H({pool_:W});export{z as pool};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/pool.js:
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
//# sourceMappingURL=pool.js.map