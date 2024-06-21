/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/StaticRegexReplace) denonext production */
import{backend_util as i,StaticRegexReplace as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{staticRegexReplaceImplCPU as g}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";function m(n){let{inputs:r,backend:e,attrs:a}=n,{x:t}=r;if(t.dtype!=="string")throw new Error("Input must be of datatype string");let o=e.readSync(t.dataId),c=i.fromUint8ToStringArray(o),s=g(c,"string",a);return e.makeTensorInfo(t.shape,"string",s)}var d={kernelName:p,backendName:"webgl",kernelFunc:m};export{m as staticRegexReplace,d as staticRegexReplaceConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/StaticRegexReplace.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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
//# sourceMappingURL=StaticRegexReplace.js.map