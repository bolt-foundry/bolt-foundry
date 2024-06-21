/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernel_utils/arg_min_max) denonext production */
import{backend_util as h,env as M,util as d}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{ArgMinMaxProgram as D}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/argminmax_gpu.js";import{ArgMinMaxPackedProgram as R}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/argminmax_packed_gpu.js";import{reshape as g}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";function S(o,t,u,n=null){let r=t.shape[0],e=t.shape[1];n!=null&&(r=n.shape[0],e=n.shape[1]);let p=h.computeOptimalWindowSize(e),l={windowSize:p,inSize:e,batchSize:r,outSize:Math.ceil(e/p)},a=new D(l,u,n==null),s=[t];n!=null&&s.push(n);let i=o.runWebGLProgram(a,s,"int32");if(i.shape[1]===1)return i;let m=S(o,t,u,i);return o.disposeIntermediateTensorInfo(i),m}function z(o,t,u,n=null){let r=n!=null?n.shape:t.shape,e=r[r.length-1],p=h.computeOptimalWindowSize(e),l=new R(r,p,u,n==null),a=n==null?[t]:[t,n],s=o.runWebGLProgram(l,a,"int32");if(s.shape.length===t.shape.length){let i=z(o,t,u,s);return o.disposeIntermediateTensorInfo(s),i}return s}function L(o,t,u,n){let r=[u];if(h.assertAxesAreInnerMostDims("arg"+n.charAt(0).toUpperCase()+n.slice(1),r,t.shape.length),!M().getBool("WEBGL_PACK_REDUCE")||t.shape.length<=2){let e=[],p=o.texData.get(t.dataId),l=p!==null&&p.isPacked,a=t;l&&(a=o.unpackTensor(t),e.push(a));let[s,i]=h.computeOutAndReduceShapes(a.shape,r),m=d.sizeFromShape(i),c=g({inputs:{x:a},backend:o,attrs:{shape:[-1,m]}});e.push(c);let f=S(o,c,n);e.push(f);let P=g({inputs:{x:f},backend:o,attrs:{shape:s}});return e.forEach(w=>o.disposeIntermediateTensorInfo(w)),P}return z(o,t,n)}export{L as argMinMaxReduce};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernel_utils/arg_min_max.js:
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
//# sourceMappingURL=arg_min_max.js.map