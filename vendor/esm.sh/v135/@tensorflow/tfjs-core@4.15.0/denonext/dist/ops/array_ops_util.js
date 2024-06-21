/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/array_ops_util) denonext production */
function o(t,r,f,s=!0){let e=[];if(s)e=e.concat(r.slice(0)),e.push(t[0]/f),e=e.concat(t.slice(1));else{e=e.concat(t[0]);let u=r.length;for(let i=0;i<u;++i)e=e.concat([t[i+1]/r[i],r[i]]);e=e.concat(t.slice(u+1))}return e}function c(t,r,f=!0){let s=[];if(f){s.push(r);for(let e=r+1;e<t;++e)e<=2*r?(s.push(e),s.push(e-(r+1))):s.push(e)}else{let e=[],u=[];for(let i=1;i<t;++i)i>=r*2+1||i%2===1?u.push(i):e.push(i);s.push(...e),s.push(0),s.push(...u)}return s}function n(t,r,f,s=!0){let e=[];s?e.push(t[0]/f):e.push(t[0]*f);for(let u=1;u<t.length;++u)u<=r.length?s?e.push(r[u-1]*t[u]):e.push(t[u]/r[u-1]):e.push(t[u]);return e}function l(t,r){let f=[0];for(let s=0;s<r;++s)f.push(t[s][0]);return f}function g(t,r,f){let s=t.slice(0,1);for(let e=0;e<f;++e)s.push(t[e+1]-r[e][0]-r[e][1]);return s}export{c as getPermuted,o as getReshaped,n as getReshapedPermuted,l as getSliceBeginCoords,g as getSliceSize};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/array_ops_util.js:
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
//# sourceMappingURL=array_ops_util.js.map