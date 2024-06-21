/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/tensor_format) denonext production */
import{computeStrides as $,isString as k,rightPad as z,sizeFromShape as N}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";var I=20,p=3,j=7;function w(n,e,t,i){let f=$(e),g=O(n,e,t,f),S=e.length,r=A(n,e,t,f,g),c=["Tensor"];return i&&(c.push(`  dtype: ${t}`),c.push(`  rank: ${S}`),c.push(`  shape: [${e}]`),c.push("  values:")),c.push(r.map(a=>"    "+a).join(`
`)),c.join(`
`)}function O(n,e,t,i){let f=N(e),g=i[i.length-1],S=new Array(g).fill(0),r=e.length,c=t==="complex64"?x(n):n;if(r>1)for(let a=0;a<f/g;a++){let h=a*g;for(let l=0;l<g;l++)S[l]=Math.max(S[l],T(c[h+l],0,t).length)}return S}function T(n,e,t){let i;return Array.isArray(n)?i=`${parseFloat(n[0].toFixed(j))} + ${parseFloat(n[1].toFixed(j))}j`:k(n)?i=`'${n}'`:t==="bool"?i=L(n):i=parseFloat(n.toFixed(j)).toString(),z(i,e)}function L(n){return n===0?"false":"true"}function A(n,e,t,i,f,g=!0){let S=t==="complex64"?2:1,r=e[0],c=e.length;if(c===0){if(t==="complex64"){let o=x(n);return[T(o[0],0,t)]}return t==="bool"?[L(n[0])]:[n[0].toString()]}if(c===1){if(r>I){let u=p*S,m=Array.from(n.slice(0,u)),F=Array.from(n.slice((r-p)*S,r*S));return t==="complex64"&&(m=x(m),F=x(F)),["["+m.map((_,M)=>T(_,f[M],t)).join(", ")+", ..., "+F.map((_,M)=>T(_,f[r-p+M],t)).join(", ")+"]"]}return["["+(t==="complex64"?x(n):Array.from(n)).map((u,m)=>T(u,f[m],t)).join(", ")+"]"]}let a=e.slice(1),h=i.slice(1),l=i[0]*S,s=[];if(r>I){for(let o=0;o<p;o++){let u=o*l,m=u+l;s.push(...A(n.slice(u,m),a,t,h,f,!1))}s.push("...");for(let o=r-p;o<r;o++){let u=o*l,m=u+l;s.push(...A(n.slice(u,m),a,t,h,f,o===r-1))}}else for(let o=0;o<r;o++){let u=o*l,m=u+l;s.push(...A(n.slice(u,m),a,t,h,f,o===r-1))}let V=c===2?",":"";s[0]="["+(r>0?s[0]+V:"");for(let o=1;o<s.length-1;o++)s[o]=" "+s[o]+V;let b=`,
`;for(let o=2;o<c;o++)b+=`
`;return s[s.length-1]=" "+s[s.length-1]+"]"+(g?"":b),s}function x(n){let e=[];for(let t=0;t<n.length;t+=2)e.push([n[t],n[t+1]]);return e}export{w as tensorToString};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/tensor_format.js:
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
//# sourceMappingURL=tensor_format.js.map