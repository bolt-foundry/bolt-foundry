/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/in_top_k) denonext production */
import{convertToTensor as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{assert as p,assertShapesMatch as T,getTypedArrayFromDType as y}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{tensor as $}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/tensor.js";async function v(c,h,o=1){let t=u(c,"predictions","inTopK"),s=u(h,"targets","inTopK");p(t.rank>1,()=>`inTopK() expects the predictions to be of rank 2 or higher, but got ${t.rank}`),p(t.rank-1===s.rank,()=>`predictions rank should be 1 larger than targets rank, but got predictions rank ${t.rank} and targets rank ${s.rank}`),T(t.shape.slice(0,t.shape.length-1),s.shape,"predictions's shape should be align with the targets' shape, except the last dimension.");let a=t.shape[t.shape.length-1];p(o>0&&o<=a,()=>`'k' passed to inTopK() must be > 0 && <= the predictions last dimension (${a}), but got ${o}`);let l=await t.data(),m=await s.data(),[d,g]=[l.length/a,a],r=y("bool",d);for(let n=0;n<d;n++){let b=n*g,f=l.subarray(b,b+g),i=[];for(let e=0;e<f.length;e++)i.push({value:f[e],index:e});i.sort((e,k)=>k.value-e.value),r[n]=0;for(let e=0;e<o;e++)if(i[e].index===m[n]){r[n]=1;break}}return c!==t&&t.dispose(),h!==s&&s.dispose(),$(r,s.shape,"bool")}var w=v;export{w as inTopKAsync};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/in_top_k.js:
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
//# sourceMappingURL=in_top_k.js.map