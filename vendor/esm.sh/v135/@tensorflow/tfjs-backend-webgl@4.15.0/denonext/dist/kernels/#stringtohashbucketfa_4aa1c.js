/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/StringToHashBucketFast) denonext production */
import{StringToHashBucketFast as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{stringToHashBucketFastImplCPU as i}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";function p(r){let{inputs:s,backend:n,attrs:o}=r,{numBuckets:e}=o,{input:t}=s;if(t.dtype!=="string")throw new Error("Input must be of datatype string");if(e<=0)throw new Error("Number of buckets must be at least 1");let a=n.readSync(t.dataId),u=i(a,e);return n.makeTensorInfo(t.shape,"int32",u)}var f={kernelName:c,backendName:"webgl",kernelFunc:p};export{p as stringToHashBucketFast,f as stringToHashBucketFastConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/StringToHashBucketFast.js:
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
//# sourceMappingURL=StringToHashBucketFast.js.map