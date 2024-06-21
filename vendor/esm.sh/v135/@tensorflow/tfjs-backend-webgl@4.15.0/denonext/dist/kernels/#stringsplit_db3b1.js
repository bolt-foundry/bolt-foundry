/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/StringSplit) denonext production */
import{StringSplit as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{stringSplitImplCPU as d}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";function h(o){let{inputs:s,backend:t,attrs:a}=o,{skipEmpty:p}=a,{input:e,delimiter:n}=s;if(e.dtype!=="string")throw new Error("Input must be of datatype string");if(e.shape.length!==1)throw new Error(`Input must be a vector, got shape: ${e.shape}`);if(n.shape.length!==0)throw new Error(`Delimiter must be a scalar, got shape: ${n.shape}`);let c=t.readSync(e.dataId),m=t.readSync(n.dataId)[0],[l,r,g]=d(c,m,p),i=r.length;return[t.makeTensorInfo([i,2],"int32",l),t.makeTensorInfo([i],"string",r),t.makeTensorInfo([2],"int32",new Int32Array(g))]}var k={kernelName:u,backendName:"webgl",kernelFunc:h};export{h as stringSplit,k as stringSplitConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/StringSplit.js:
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
//# sourceMappingURL=StringSplit.js.map