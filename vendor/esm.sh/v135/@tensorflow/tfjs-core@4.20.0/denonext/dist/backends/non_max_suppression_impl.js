/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/backends/non_max_suppression_impl) denonext production */
import{binaryInsert as C}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/backends/non_max_suppression_util.js";function B(o,e,r,n,t){return y(o,e,r,n,t,0)}function V(o,e,r,n,t,i){return y(o,e,r,n,t,0,!1,i,!0)}function O(o,e,r,n,t,i){return y(o,e,r,n,t,i,!0)}function y(o,e,r,n,t,i,l=!1,f=!1,h=!1){let c=[];for(let s=0;s<e.length;s++)e[s]>t&&c.push({score:e[s],boxIndex:s,suppressBeginIndex:0});c.sort(w);let d=i>0?-.5/i:0,a=[],x=[];for(;a.length<r&&c.length>0;){let s=c.pop(),{score:M,boxIndex:I,suppressBeginIndex:g}=s;if(M<t)break;let J=!1;for(let b=a.length-1;b>=g;--b){let S=k(o,I,a[b]);if(S>=n){J=!0;break}if(s.score=s.score*v(n,d,S),s.score<=t)break}s.suppressBeginIndex=a.length,J||(s.score===M?(a.push(I),x.push(s.score)):s.score>t&&C(c,s,w))}let u=a.length,p=r-u;f&&p>0&&(a.push(...new Array(p).fill(0)),x.push(...new Array(p).fill(0)));let m={selectedIndices:a};return l&&(m.selectedScores=x),h&&(m.validOutputs=u),m}function k(o,e,r){let n=o.subarray(e*4,e*4+4),t=o.subarray(r*4,r*4+4),i=Math.min(n[0],n[2]),l=Math.min(n[1],n[3]),f=Math.max(n[0],n[2]),h=Math.max(n[1],n[3]),c=Math.min(t[0],t[2]),d=Math.min(t[1],t[3]),a=Math.max(t[0],t[2]),x=Math.max(t[1],t[3]),u=(f-i)*(h-l),p=(a-c)*(x-d);if(u<=0||p<=0)return 0;let m=Math.max(i,c),s=Math.max(l,d),M=Math.min(f,a),I=Math.min(h,x),g=Math.max(M-m,0)*Math.max(I-s,0);return g/(u+p-g)}function v(o,e,r){let n=Math.exp(e*r*r);return r<=o?n:0}function w(o,e){return o.score-e.score||o.score===e.score&&e.boxIndex-o.boxIndex}export{B as nonMaxSuppressionV3Impl,V as nonMaxSuppressionV4Impl,O as nonMaxSuppressionV5Impl};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/backends/non_max_suppression_impl.js:
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
//# sourceMappingURL=non_max_suppression_impl.js.map