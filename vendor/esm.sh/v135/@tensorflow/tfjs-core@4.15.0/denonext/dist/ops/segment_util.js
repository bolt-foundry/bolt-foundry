/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/segment_util) denonext production */
import{nearestDivisor as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{PARALLELIZE_THRESHOLD as w}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reduce_util.js";function g(o,p){let r=!1,t;for(o<=w?(t=o,r=!0):t=a(o,Math.floor(Math.sqrt(o)));!r;)t>p||t===o?r=!0:t=a(o,t+1);return t}function O(o,p,r){let t=[],h=o.length;for(let s=0;s<h;s++)s!==p?t.push(o[s]):t.push(r);return t}function c(o,p,r,t){let h=p.shape.length,s=o.shape.length;if(t!==0&&(t<-h||t>h))throw new Error(`Expect batchDims in the range of [-${h}, ${h}], but got ${t}`);if(t<0&&(t+=h),t>s)throw new Error(`batchDims (${t}) must be less than rank(x) (
    ${s}).`);if(r<t)throw new Error(`batchDims (${t}) must be less than or equal to axis (${r}).`);for(let e=0;e<t;++e)if(o.shape[e]!==p.shape[e])throw new Error(`x.shape[${e}]: ${o.shape[e]} should be equal to indices.shape[${e}]: ${p.shape[e]}.`);let $=o.shape[r],l=[],n=1,u=1,f=1;for(let e=0;e<t;++e)l.push(o.shape[e]),n*=o.shape[e];for(let e=t;e<r;e++)l.push(o.shape[e]),u*=o.shape[e];for(let e=t;e<h;e++)l.push(p.shape[e]);for(let e=r+1;e<s;e++)l.push(o.shape[e]),f*=o.shape[e];return{batchSize:n,sliceSize:f,outerSize:u,dimSize:$,outputShape:l}}export{c as collectGatherOpShapeInfo,O as computeOutShape,g as segOpComputeOptimalWindowSize};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/segment_util.js:
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
//# sourceMappingURL=segment_util.js.map