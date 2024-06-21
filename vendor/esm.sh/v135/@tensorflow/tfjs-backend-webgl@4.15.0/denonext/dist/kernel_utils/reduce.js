/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernel_utils/reduce) denonext production */
import{backend_util as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{MeanProgram as S}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/mean_gpu.js";import{ReduceProgram as g}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/reduce_gpu.js";function p(t){let e=[];for(;e.length===0||e[e.length-1].outSize!==1;){let i=e.length?e[e.length-1].outSize:t[1],o=m.computeOptimalWindowSize(i);e.push({inSize:i,windowSize:o,outSize:Math.ceil(i/o)})}return e}function w(t,e,i,o){let h=p(t.shape),n=t;for(let r=0;r<h.length;r++){let{inSize:a,windowSize:s,outSize:u}=h[r],l,c;i==="mean"?l=r===0?new S({windowSize:s,inSize:a,batchSize:t.shape[0],outSize:u},a):new S({windowSize:s,inSize:a,batchSize:t.shape[0],outSize:u}):l=new g({windowSize:s,inSize:a,batchSize:t.shape[0],outSize:u},i),c=n,n=o.runWebGLProgram(l,[n],e),c.dataId!==t.dataId&&o.disposeIntermediateTensorInfo(c)}return n}export{w as reduce};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernel_utils/reduce.js:
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
//# sourceMappingURL=reduce.js.map