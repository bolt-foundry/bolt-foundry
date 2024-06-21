/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/backends/einsum_util) denonext production */
import{assert as g}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util_base.js";var h="->",E=/->/g,m=",",d="...";function y(i,s){i=i.replace(/\s/g,"");let n=(i.length-i.replace(E,"").length)/h.length;if(n<1)throw new Error("Equations without an arrow are not supported.");if(n>1)throw new Error(`Equation must contain exactly one arrow ("${h}").`);let[o,t]=i.split(h);g(o.indexOf(d)===-1,()=>`The ellipsis notation ("${d}") is not supported yet.`);let p=o.split(m),e=p.length;if(s!==e)throw new Error(`Expected ${e} input tensors, received ${s}`);if(e>2)throw new Error("Support for more than 2 input tensors is not implemented yet.");let l=[];for(let r=0;r<t.length;++r){let u=t[r];if(!p.some(x=>x.indexOf(u)!==-1))throw new Error(`Output subscripts contain the label ${u} not present in the input subscripts.`);l.indexOf(u)===-1&&l.push(u)}for(let r=0;r<o.length;++r){let u=o[r];l.indexOf(u)===-1&&u!==m&&l.push(u)}let c=new Array(p.length);for(let r=0;r<e;++r){if(new Set(p[r].split("")).size!==p[r].length)throw new Error(`Found duplicate axes in input component ${p[r]}. Support for duplicate axes in input is not implemented yet.`);c[r]=[];for(let u=0;u<p[r].length;++u)c[r].push(l.indexOf(p[r][u]))}let f=l.length,w=t.length,a=[];for(let r=w;r<f;++r)a.push(r);return{allDims:l,summedDims:a,idDims:c}}function $(i,s){let n=new Array(i);n.fill(-1);for(let t=0;t<s.length;++t)n[s[t]]=t;let o=[];for(let t=0;t<i;++t)n[t]===-1&&o.push(t);return n=n.filter(t=>t!==-1),{permutationIndices:n,expandDims:o}}function I(i,s,n){let o=new Array(i);for(let t=0;t<n.length;++t){let p=n[t].shape;for(let e=0;e<s[t].length;++e)o[s[t][e]]===void 0?o[s[t][e]]=p[e]:g(o[s[t][e]]===p[e],()=>`Expected dimension ${o[s[t][e]]} at axis ${e} of input shaped ${JSON.stringify(p)}, but got dimension ${p[e]}`)}}function A(i,s){let n=i,o=[],t=0;i.length===0&&n.push(-1),t=i.length+1;for(let e=0;e<t;++e)o.push([]);let p=[];for(let e=0;e<n.length;++e){let l=n[e],c=O(s,l);for(let f of c)p.indexOf(f)===-1&&(o[e].push(f),p.push(f))}return{path:n,steps:o}}function R(i){return i.every((s,n)=>s===n)}function O(i,s){let n=[];for(let o=0;o<i.length;++o)(i[o].length===0||i[o].indexOf(s)!==-1||s===-1)&&n.push(o);return n}export{I as checkEinsumDimSizes,y as decodeEinsumEquation,A as getEinsumComputePath,$ as getEinsumPermutation,R as isIdentityPermutation};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/backends/einsum_util.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=einsum_util.js.map