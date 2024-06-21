/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/io/weights_loader) denonext production */
import{env as B}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/environment.js";import*as P from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{CompositeArrayBuffer as v}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/io/composite_array_buffer.js";import{decodeWeights as S}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/io/io_utils.js";import{monitorPromisesProgress as W}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/io/progress.js";import{DTYPE_VALUE_SIZE_MAP as q}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/io/types.js";async function T(f,e){e==null&&(e={});let o=e.fetchFunc==null?B().platform.fetch:e.fetchFunc,r=f.map(l=>o(l,e.requestInit,{isBinary:!0})),u=(e.onProgress==null?await Promise.all(r):await W(r,e.onProgress,0,.5)).map(l=>l.arrayBuffer());return e.onProgress==null?await Promise.all(u):await W(u,e.onProgress,.5,1)}function x(f,e){var o;let r=e.fetchFunc==null?B().platform.fetch:e.fetchFunc,a=0,s;return(o=e.onProgress)===null||o===void 0||o.call(e,0),new ReadableStream({pull:async i=>{for(var u;a<f.length;){s||(s=(await r(f[a],e.requestInit,{isBinary:!0})).body.getReader());let{done:g,value:F}=await s.read();if(g){a++,s=void 0,(u=e.onProgress)===null||u===void 0||u.call(e,a/f.length);continue}i.enqueue(F);return}i.close()}})}async function C(f,e="",o,r){return M(i=>T(i,{requestInit:r}))(f,e,o)}function M(f){return async(e,o="",r)=>{let a=e.map(()=>!1),s={},i=r!=null?r.map(()=>!1):[],u=[];if(e.forEach((t,n)=>{let c=0;t.weights.forEach(h=>{let m="quantization"in h?h.quantization.dtype:h.dtype,d=q[m]*P.sizeFromShape(h.shape),p=()=>{a[n]=!0,s[n]==null&&(s[n]=[]),s[n].push({manifestEntry:h,groupOffset:c,sizeBytes:d})};r!=null?r.forEach((b,E)=>{b===h.name&&(p(),i[E]=!0)}):p(),u.push(h.name),c+=d})}),!i.every(t=>t)){let t=r.filter((n,c)=>!i[c]);throw new Error(`Could not find weights in manifest with names: ${t.join(", ")}. 
Manifest JSON has weights with names: ${u.join(", ")}.`)}let g=a.reduce((t,n,c)=>(n&&t.push(c),t),[]),F=[];g.forEach(t=>{e[t].paths.forEach(n=>{let c=o+(o.endsWith("/")?"":"/")+n;F.push(c)})});let y=await f(F),l={},w=0;return g.forEach(t=>{let n=e[t].paths.length,c=new v(y.slice(w,w+n));s[t].forEach(m=>{let d=c.slice(m.groupOffset,m.groupOffset+m.sizeBytes),p=S(d,[m.manifestEntry]);for(let b in p)l[b]=p[b]}),w+=n}),l}}export{C as loadWeights,T as loadWeightsAsArrayBuffer,x as streamWeights,M as weightsLoaderFactory};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/io/weights_loader.js:
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
//# sourceMappingURL=weights_loader.js.map