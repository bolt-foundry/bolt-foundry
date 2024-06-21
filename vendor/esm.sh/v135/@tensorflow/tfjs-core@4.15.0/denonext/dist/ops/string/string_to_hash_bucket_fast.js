/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/string/string_to_hash_bucket_fast) denonext production */
import{ENGINE as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{StringToHashBucketFast as e}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{op as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function c(r,t){let o=u(r,"input","stringToHashBucketFast","string"),s={numBuckets:t};if(t<=0)throw new Error("Number of buckets must be at least 1");let n={input:o};return i.runKernel(e,n,s)}var g=a({stringToHashBucketFast_:c});export{g as stringToHashBucketFast};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/string/string_to_hash_bucket_fast.js:
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
//# sourceMappingURL=string_to_hash_bucket_fast.js.map